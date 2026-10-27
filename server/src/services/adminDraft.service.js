import { Ticket } from '../models/Ticket.js';
import { ApiError } from '../utils/ApiError.js';
import { AI_STATUS } from '../constants/aiStatus.js';
import { runAiTriage } from './aiTriage.service.js';
import { getOrCreateDraft } from './ai/draft.js';
import { getAdminTicketById } from './adminTicket.service.js';

/**
 * Retrieves or creates an AI draft for an admin ticket view.
 * If triage is still pending, classification is run first per requirements.
 *
 * @param {string} ticketId
 * @param {{ force?: boolean }} [options={}]
 * @returns {Promise<{ draft: string|null, aiAvailable: boolean, cached?: boolean }>}
 */
export const getTicketDraft = async (ticketId, { force = false } = {}) => {
  let ticket = await Ticket.findById(ticketId).populate('book').populate('author');
  if (!ticket) throw ApiError.notFound('Ticket not found');

  // Requirement: If a draft is requested while ai.status is "pending", run classification first
  if (ticket.ai?.status === AI_STATUS.PENDING) {
    await runAiTriage(ticket._id);
    ticket = await Ticket.findById(ticketId).populate('book').populate('author');
  }

  return getOrCreateDraft(ticket, ticket.book, ticket.author, { force });
};

/**
 * Retries AI triage/classification on demand and returns the refreshed full admin ticket.
 *
 * @param {string} ticketId
 * @returns {Promise<object>} Refreshed ticket
 */
export const retryClassification = async (ticketId) => {
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) throw ApiError.notFound('Ticket not found');

  await runAiTriage(ticket._id);
  return getAdminTicketById(ticket._id);
};
