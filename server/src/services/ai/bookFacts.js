/**
 * Pure functions for deterministic book facts extraction and financial calculations.
 * No LLM dependencies, no database access.
 */
const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Computes next royalty payout deadline.
 * ASSUMPTION: Quarters are CALENDAR quarters (Q1: Jan-Mar, Q2: Apr-Jun, Q3: Jul-Sep, Q4: Oct-Dec).
 * Royalties are paid within 45 days of quarter end.
 */
const computeNextPayoutDeadline = (nowDate) => {
  const year = nowDate.getUTCFullYear();
  const currentQ = Math.floor(nowDate.getUTCMonth() / 3);

  const qEndMonthDays = [[2, 31], [5, 30], [8, 30], [11, 31]];
  const add45Days = (y, q) => {
    const [m, d] = qEndMonthDays[q];
    const date = new Date(Date.UTC(y, m, d));
    date.setUTCDate(date.getUTCDate() + 45);
    return date;
  };

  const prevYear = currentQ === 0 ? year - 1 : year;
  const prevQ = currentQ === 0 ? 3 : currentQ - 1;
  const prevDeadline = add45Days(prevYear, prevQ);

  if (prevDeadline.getTime() >= nowDate.getTime()) {
    return prevDeadline.toISOString().slice(0, 10);
  }
  return add45Days(year, currentQ).toISOString().slice(0, 10);
};

/**
 * Extracts and computes relevant factual indicators from a book record.
 *
 * @param {object|null} book
 * @param {Date|string} [now=new Date()]
 * @returns {object|null}
 */
export const getBookFacts = (book, now = new Date()) => {
  if (!book) return null;

  const nowDate = new Date(now);
  const status = book.status ?? '';
  const publicationDate = book.publicationDate ?? book.publication_date ?? null;
  const isInProduction = publicationDate === null || /^in production/i.test(status);

  // In-production books return ONLY title, status, currentStage, and note (no mrp, no sales)
  if (isInProduction) {
    const currentStage = status.replace(/^in production\s*[-:]\s*/i, '').trim();
    return {
      title: book.title,
      status,
      currentStage: currentStage || status,
      note: 'No sales or royalty data exists yet (book is in production)',
    };
  }

  const paid = Number(book.royaltyPaid ?? book.royalty_paid ?? book.paid ?? 0);
  const earned = Number(book.totalRoyaltyEarned ?? book.total_royalty_earned ?? book.earned ?? 0);
  const pending = Number(book.royaltyPending ?? book.royalty_pending ?? book.pending ?? 0);
  const lastPayoutDate = book.lastPayoutDate ?? book.last_royalty_payout_date ?? null;

  const pubDateObj = publicationDate ? new Date(publicationDate) : null;
  const lastPayoutObj = lastPayoutDate ? new Date(lastPayoutDate) : null;

  const paidLabel = paid === 0 && !lastPayoutDate ? 'No payout yet' : `₹${paid}`;
  const fullyPaid = pending === 0 && paid > 0;
  const belowPayoutThreshold = pending > 0 && pending < 1000;
  const nextPayoutDeadline = computeNextPayoutDeadline(nowDate);

  const neverPaid = paid === 0 && !lastPayoutDate;
  const isPublishedOver135Days = pubDateObj
    ? (nowDate.getTime() - pubDateObj.getTime()) / MS_PER_DAY > 135
    : false;
  const isLastPayoutOver135Days = lastPayoutObj
    ? (nowDate.getTime() - lastPayoutObj.getTime()) / MS_PER_DAY > 135
    : false;

  const payoutOverdue =
    pending >= 1000 && ((neverPaid && isPublishedOver135Days) || isLastPayoutOver135Days);

  return {
    title: book.title,
    isbn: book.isbn ?? null,
    status,
    currentStage: status,
    publicationDate,
    printPartner: book.printPartner ?? book.print_partner ?? null,
    availableOn: book.availableOn ?? book.available_on ?? [],
    mrp: book.mrp ?? null,
    totalCopiesSold: book.totalCopiesSold ?? book.total_copies_sold ?? 0,
    paid,
    earned,
    pending,
    lastPayoutDate,
    paidLabel,
    fullyPaid,
    belowPayoutThreshold,
    nextPayoutDeadline,
    payoutOverdue,
  };
};

const CATEGORY_PICKERS = {
  royalty: (f) => ({
    title: f.title, earned: f.earned, paid: f.paid, pending: f.pending,
    paidLabel: f.paidLabel, fullyPaid: f.fullyPaid, belowPayoutThreshold: f.belowPayoutThreshold,
    nextPayoutDeadline: f.nextPayoutDeadline, payoutOverdue: f.payoutOverdue, lastPayoutDate: f.lastPayoutDate,
  }),
  isbn: (f) => ({ title: f.title, isbn: f.isbn, status: f.status }),
  printing: (f) => ({ title: f.title, printPartner: f.printPartner, status: f.status }),
  distribution: (f) => ({
    title: f.title, status: f.status, availableOn: f.availableOn, publicationDate: f.publicationDate,
  }),
  production: (f) => ({ title: f.title, status: f.status, currentStage: f.currentStage }),
  general: (f) => ({ title: f.title }),
};

/**
 * Projects only category-relevant fields for prompt injection and snapshot views.
 *
 * @param {object|null} facts
 * @param {string} categoryKey
 * @returns {object|null}
 */
export const pickFactsForCategory = (facts, categoryKey) => {
  if (!facts) return null;
  const cat = categoryKey?.toLowerCase();

  if (facts.currentStage && facts.earned === undefined) {
    if (cat === 'general') return { title: facts.title };
    return {
      title: facts.title, status: facts.status, currentStage: facts.currentStage, note: facts.note,
    };
  }

  const picker = CATEGORY_PICKERS[cat];
  return picker ? picker(facts) : null;
};

