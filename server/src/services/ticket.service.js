import { setImmediate } from 'node:timers';
import { Ticket } from '../models/Ticket.js';
import { Book } from '../models/Book.js';
import { ApiError } from '../utils/ApiError.js';
import { TICKET_STATUS } from '../constants/ticketStatus.js';
import { ROLES } from '../constants/roles.js';
import { AI_STATUS } from '../constants/aiStatus.js';
import { runAiTriage } from './aiTriage.service.js';
import { logger } from '../utils/logger.js';

/**
 * Strips fields that must never be exposed to authors.
 * Applied consistently to every ticket before responding.
 *
 * @param {Object} ticket - Raw ticket document (lean)
 * @returns {Object} Author-safe ticket view
 */
export const toAuthorView = (ticket) => {
  const {
    internalNotes: _n,
    ai: _a,
    assignedTo: _t,
    priority: _p,
    priorityRank: _pr,
    ...safe
  } = ticket;
  return safe;
};

/**
 * Creates a new ticket. Validates bookId ownership when provided.
 *
 * @param {string} authorId
 * @param {string} authorName
 * @param {Object} payload - Validated body
 * @returns {Promise<Object>} Author-safe ticket
 */
export const createTicket = async (authorId, authorName, payload) => {
  const { subject, description, bookId, attachments = [] } = payload;

  let bookRef = null;
  if (bookId) {
    const book = await Book.findOne({ _id: bookId, author: authorId }).lean();
    if (!book) throw ApiError.notFound('Book not found or does not belong to you');
    bookRef = book._id;
  }

  const ticket = await Ticket.create({
    author: authorId,
    book: bookRef,
    subject,
    description,
    attachments,
    messages: [{ sender: ROLES.AUTHOR, senderName: authorName, body: description }],
    ai: { status: AI_STATUS.PENDING },
  });

  setImmediate(() => {
    runAiTriage(ticket._id).catch((err) => {
      logger.error('Background AI triage failed', { ticketId: ticket._id, error: err.message });
    });
  });

  return toAuthorView(ticket.toObject());
};

/**
 * Returns all tickets belonging to the authenticated author, newest first.
 *
 * @param {string} authorId
 * @returns {Promise<Array<Object>>}
 */
export const getMyTickets = async (authorId) => {
  const tickets = await Ticket.find({ author: authorId })
    .sort({ createdAt: -1 })
    .populate('book', 'bookCode title')
    .lean();

  return tickets.map(toAuthorView);
};

/**
 * Returns a single ticket, scoped to the author to prevent cross-author reads.
 *
 * @param {string} ticketId
 * @param {string} authorId
 * @returns {Promise<Object>}
 */
export const getMyTicketById = async (ticketId, authorId) => {
  const ticket = await Ticket.findOne({ _id: ticketId, author: authorId })
    .populate('book', 'bookCode title')
    .lean();

  if (!ticket) throw ApiError.notFound('Ticket not found');
  return toAuthorView(ticket);
};

/**
 * Appends an author reply to a ticket message thread.
 * Closed tickets reject further replies (409).
 * Replying to a resolved ticket reopens it to open.
 *
 * @param {string} ticketId
 * @param {string} authorId
 * @param {string} authorName
 * @param {string} messageBody
 * @returns {Promise<Object>} Updated author-safe ticket
 */
export const addAuthorMessage = async (ticketId, authorId, authorName, messageBody) => {
  const ticket = await Ticket.findOne({ _id: ticketId, author: authorId });
  if (!ticket) throw ApiError.notFound('Ticket not found');

  if (ticket.status === TICKET_STATUS.CLOSED) {
    throw new ApiError(409, 'TICKET_CLOSED', 'Cannot reply to a closed ticket');
  }

  if (ticket.status === TICKET_STATUS.RESOLVED) {
    ticket.status = TICKET_STATUS.OPEN;
  }

  ticket.messages.push({ sender: ROLES.AUTHOR, senderName: authorName, body: messageBody });
  await ticket.save();

  return toAuthorView(ticket.toObject());
};
