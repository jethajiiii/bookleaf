import { Ticket, setPriority } from '../models/Ticket.js';
import { ApiError } from '../utils/ApiError.js';
import { TICKET_STATUS } from '../constants/ticketStatus.js';
import { PRIORITIES } from '../constants/priorities.js';
import { ROLES } from '../constants/roles.js';
import { calculateAgeInHours, buildBookSnapshot } from '../utils/ticketFormatters.js';

/**
 * Builds MongoDB filter query from admin list params.
 * Default view without status filter restricts to active tickets (open, in_progress).
 */
export const buildAdminTicketQuery = (filters = {}, adminUserId) => {
  const query = {};
  if (filters.status) {
    if (filters.status !== 'all') query.status = filters.status;
  } else {
    query.status = { $in: [TICKET_STATUS.OPEN, TICKET_STATUS.IN_PROGRESS] };
  }
  if (filters.category) query.category = filters.category;
  if (filters.priority) query.priority = filters.priority;
  if (filters.from || filters.to) {
    query.createdAt = {};
    if (filters.from) query.createdAt.$gte = new Date(filters.from);
    if (filters.to) query.createdAt.$lte = new Date(filters.to);
  }
  if (filters.assigned === 'me') query.assignedTo = adminUserId;
  else if (filters.assigned === 'unassigned') query.assignedTo = null;
  if (filters.search && filters.search.trim()) {
    const escaped = filters.search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    query.subject = { $regex: escaped, $options: 'i' };
  }
  return query;
};

/**
 * Queries paginated tickets for admin queue sorted by urgency (priorityRank asc, createdAt asc).
 */
export const getAdminTickets = async (filters, adminUserId) => {
  const query = buildAdminTicketQuery(filters, adminUserId);
  const page = Math.max(1, parseInt(filters.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(filters.limit, 10) || 20));
  const skip = (page - 1) * limit;

  const [tickets, total] = await Promise.all([
    Ticket.find(query)
      .sort({ priorityRank: 1, createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'name email authorCode')
      .populate('book', 'title bookCode')
      .populate('assignedTo', 'name email')
      .lean(),
    Ticket.countDocuments(query),
  ]);

  const formattedTickets = tickets.map((t) => ({
    ...t,
    authorName: t.author?.name || 'Unknown',
    bookTitle: t.book?.title || 'General',
    assignedToName: t.assignedTo?.name || null,
    ageInHours: calculateAgeInHours(t.createdAt),
  }));

  return { tickets: formattedTickets, total, page, limit, totalPages: Math.ceil(total / limit) || 1 };
};

/**
 * Fetches a single ticket with full details, internal notes, AI fields, and null-safe book snapshot.
 */
export const getAdminTicketById = async (ticketId) => {
  const ticket = await Ticket.findById(ticketId)
    .populate('author', 'name email phone city authorCode')
    .populate('assignedTo', 'name email')
    .populate('book')
    .lean();

  if (!ticket) throw ApiError.notFound('Ticket not found');

  return {
    ...ticket,
    authorName: ticket.author?.name || 'Unknown',
    bookTitle: ticket.book?.title || 'General',
    assignedToName: ticket.assignedTo?.name || null,
    bookSnapshot: buildBookSnapshot(ticket.book),
    ageInHours: calculateAgeInHours(ticket.createdAt),
  };
};

/**
 * Modifies ticket top-level properties. Ensures ai.* fields remain untouched and priorityRank syncs.
 */
export const updateTicket = async (ticketId, adminUser, updates) => {
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) throw ApiError.notFound('Ticket not found');

  if (updates.status !== undefined) ticket.status = updates.status;
  if (updates.category !== undefined) ticket.category = updates.category;
  if (updates.priority !== undefined) setPriority(ticket, updates.priority);

  if (updates.assignedTo !== undefined) {
    ticket.assignedTo = updates.assignedTo === 'me' ? adminUser.id : null;
  }
  await ticket.save();
  return getAdminTicketById(ticket._id);
};

/**
 * Records admin response in thread and advances open ticket to in_progress.
 */
export const addAdminReply = async (ticketId, adminUser, replyBody) => {
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) throw ApiError.notFound('Ticket not found');
  if (ticket.status === TICKET_STATUS.OPEN) {
    ticket.status = TICKET_STATUS.IN_PROGRESS;
  }
  ticket.messages.push({ sender: ROLES.ADMIN, senderName: adminUser.name, body: replyBody });
  await ticket.save();
  return getAdminTicketById(ticket._id);
};

/**
 * Adds an internal admin-only discussion note without notifying the author.
 */
export const addInternalNote = async (ticketId, adminUser, noteBody) => {
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) throw ApiError.notFound('Ticket not found');
  ticket.internalNotes.push({ admin: adminUser.id, adminName: adminUser.name, body: noteBody });
  await ticket.save();
  return getAdminTicketById(ticket._id);
};

/**
 * Aggregates operational queue stats for admin dashboard header.
 */
export const getStats = async () => {
  const active = { $in: [TICKET_STATUS.OPEN, TICKET_STATUS.IN_PROGRESS] };
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
  const [open, inProgress, criticalUnresolved, unassigned, overdue] = await Promise.all([
    Ticket.countDocuments({ status: TICKET_STATUS.OPEN }),
    Ticket.countDocuments({ status: TICKET_STATUS.IN_PROGRESS }),
    Ticket.countDocuments({ status: active, priority: PRIORITIES.CRITICAL }),
    Ticket.countDocuments({ status: active, assignedTo: null }),
    Ticket.countDocuments({ status: active, createdAt: { $lt: threeDaysAgo } }),
  ]);
  return { open, in_progress: inProgress, inProgress, criticalUnresolved, unassigned, overdue };
};
