import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { connectDB, disconnectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Book } from '../models/Book.js';
import { Ticket } from '../models/Ticket.js';
import { Counter } from '../models/Counter.js';
import { ROLES } from '../constants/roles.js';
import { logger } from '../utils/logger.js';
import { buildSampleTickets } from './sampleTickets.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const parseDate = (val) => (val ? new Date(val) : null);
const parseNullableNum = (val) => (val === null || val === undefined ? null : Number(val));
const parseNullableStr = (val) => (val === null || val === undefined || val === '' ? null : String(val).trim());

/**
 * Seeds authors, books, and tickets from disk in an idempotent manner.
 */
export const runSeed = async () => {
  const jsonPath = path.join(__dirname, 'bookleaf_sample_data.json');
  if (!fs.existsSync(jsonPath)) throw new Error(`Seed source not found: ${jsonPath}`);
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  await connectDB();
  logger.warn('WARNING: Running seed script will wipe existing database collections (users, books, tickets, counters)...');
  await Promise.all([
    User.deleteMany({}),
    Book.deleteMany({}),
    Ticket.deleteMany({}),
    Counter.deleteMany({}),
  ]);
  await Promise.all([User.syncIndexes(), Book.syncIndexes(), Ticket.syncIndexes()]);

  const [authorPasswordHash, adminPasswordHash] = await Promise.all([
    bcrypt.hash('password123', 10),
    bcrypt.hash('admin123', 10),
  ]);

  // 1. Seed 2 Admin users with exact requested names
  const [adminUser, opsUser] = await Promise.all([
    User.create({
      name: 'Admin',
      email: 'admin@bookleaf.com',
      passwordHash: adminPasswordHash,
      role: ROLES.ADMIN,
    }),
    User.create({
      name: 'Ops Team',
      email: 'ops@bookleaf.com',
      passwordHash: adminPasswordHash,
      role: ROLES.ADMIN,
    }),
  ]);

  // 2. Seed 10 Authors
  const authorsMap = {};
  for (const a of data.authors) {
    authorsMap[a.author_id] = await User.create({
      name: a.name.trim(),
      email: a.email.toLowerCase().trim(),
      passwordHash: authorPasswordHash,
      phone: parseNullableStr(a.phone),
      city: parseNullableStr(a.city),
      authorCode: a.author_id,
      joinedDate: parseDate(a.joined_date),
      role: ROLES.AUTHOR,
    });
  }

  // 3. Seed 18 Books
  const booksMap = {};
  for (const a of data.authors) {
    const authorUser = authorsMap[a.author_id];
    for (const b of a.books) {
      booksMap[b.book_id] = await Book.create({
        bookCode: b.book_id,
        title: b.title.trim(),
        author: authorUser._id,
        authorCode: authorUser.authorCode,
        isbn: parseNullableStr(b.isbn),
        genre: parseNullableStr(b.genre),
        publicationDate: parseDate(b.publication_date),
        status: b.status.trim(),
        mrp: parseNullableNum(b.mrp),
        royaltyPerCopy: parseNullableNum(b.author_royalty_per_copy),
        totalCopiesSold: b.total_copies_sold ?? 0,
        totalRoyaltyEarned: b.total_royalty_earned ?? 0,
        royaltyPaid: b.royalty_paid ?? 0,
        royaltyPending: b.royalty_pending ?? 0,
        lastPayoutDate: parseDate(b.last_royalty_payout_date),
        printPartner: parseNullableStr(b.print_partner),
        availableOn: Array.isArray(b.available_on) ? b.available_on : [],
      });
    }
  }

  // 4. Seed 6 Tickets
  const sampleTickets = buildSampleTickets({ authorsMap, booksMap, adminUser, opsUser });
  await Ticket.create(sampleTickets);

  // 5. Query counts and verify null-safety
  const [userCount, bookCount, ticketCount] = await Promise.all([
    User.countDocuments(),
    Book.countDocuments(),
    Ticket.countDocuments(),
  ]);

  const nullMrp = await Book.find({ bookCode: { $in: ['BK013', 'BK015'] } }).select('bookCode mrp publicationDate').lean();
  const nullPayout = await Book.find({ bookCode: { $in: ['BK005', 'BK010', 'BK016', 'BK018'] } }).select('bookCode lastPayoutDate').lean();

  logger.info('=== Seed Summary ===');
  logger.info(`Users seeded: ${userCount} (10 authors + 2 admins)`);
  logger.info(`Books seeded: ${bookCount}`);
  logger.info(`Tickets seeded: ${ticketCount}`);
  logger.info('=== Null Safety Verification ===');
  nullMrp.forEach((b) => logger.info(`Book ${b.bookCode}: mrp=${b.mrp}, publicationDate=${b.publicationDate}`));
  nullPayout.forEach((b) => logger.info(`Book ${b.bookCode}: lastPayoutDate=${b.lastPayoutDate}`));
  logger.info('====================');

  await disconnectDB();
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runSeed().catch((err) => {
    logger.error('Database seeding failed', { error: err.message, stack: err.stack });
    process.exit(1);
  });
}
