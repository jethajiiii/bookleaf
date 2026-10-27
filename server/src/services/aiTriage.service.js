import { Ticket, setPriority } from '../models/Ticket.js';
import { classifyTicket } from './ai/classify.js';
import { logger } from '../utils/logger.js';

/**
 * Runs classification triage on a ticket, updating category, priority, priorityRank,
 * and ai.* subdocument properties. Always uses Mongoose setPriority and document save.
 *
 * @param {string} ticketId - MongoDB Ticket ID
 * @returns {Promise<object|null>} Updated ticket document
 */
export const runAiTriage = async (ticketId) => {
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    logger.warn('runAiTriage skipped: ticket not found', { ticketId });
    return null;
  }

  const result = await classifyTicket({
    subject: ticket.subject,
    description: ticket.description,
  });

  ticket.category = result.category;
  setPriority(ticket, result.priority);

  ticket.ai = ticket.ai || {};
  ticket.ai.category = result.category;
  ticket.ai.priority = result.priority;
  ticket.ai.reason = result.reason;
  ticket.ai.status = result.aiStatus;

  await ticket.save();

  logger.info('AI triage completed', {
    ticketId: ticket._id,
    category: ticket.category,
    priority: ticket.priority,
    status: ticket.ai.status,
  });

  return ticket;
};
