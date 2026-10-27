import httpClient from './httpClient.js';

/**
 * Fetches dashboard operational stats (Open, Critical, Unassigned, Overdue 3d+).
 *
 * @returns {Promise<Object>} Aggregated queue statistics
 */
export async function getAdminStats() {
  const response = await httpClient.get('/admin/stats');
  return response.data?.stats;
}

/**
 * Queries paginated tickets from the admin queue with optional filters.
 *
 * @param {Object} [params]
 * @param {string} [params.status] Active default (omitted), or 'open', 'in_progress', 'resolved', 'closed', 'all'
 * @param {string} [params.category]
 * @param {string} [params.priority]
 * @param {string} [params.from] ISO date
 * @param {string} [params.to] ISO date
 * @param {string} [params.assigned] 'me' or 'unassigned'
 * @param {number} [params.page=1]
 * @param {number} [params.limit=20]
 * @returns {Promise<Object>} { tickets, total, page, limit, totalPages }
 */
export async function getAdminTickets(params = {}) {
  // Clean empty or undefined params
  const cleanParams = {};
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      cleanParams[key] = val;
    }
  });

  const response = await httpClient.get('/admin/tickets', { params: cleanParams });
  return response.data;
}

/**
 * Fetches detailed ticket by ID with full message history and internal notes.
 *
 * @param {string} id Ticket ID
 * @returns {Promise<Object>}
 */
export async function getAdminTicketById(id) {
  const response = await httpClient.get(`/admin/tickets/${id}`);
  return response.data?.ticket;
}

/**
 * Updates top-level ticket metadata (status, category, priority, assignedTo).
 *
 * @param {string} id
 * @param {Object} updates
 * @returns {Promise<Object>} Updated ticket
 */
export async function updateAdminTicket(id, updates) {
  const response = await httpClient.patch(`/admin/tickets/${id}`, updates);
  return response.data?.ticket;
}

/**
 * Posts an admin reply to the author in the ticket conversation.
 *
 * @param {string} id
 * @param {string} body
 * @returns {Promise<Object>}
 */
export async function addAdminReply(id, body) {
  const response = await httpClient.post(`/admin/tickets/${id}/replies`, { body });
  return response.data?.ticket;
}

/**
 * Adds an internal admin note to the ticket.
 *
 * @param {string} id
 * @param {string} body
 * @returns {Promise<Object>}
 */
export async function addInternalNote(id, body) {
  const response = await httpClient.post(`/admin/tickets/${id}/notes`, { body });
  return response.data?.ticket;
}

/**
 * Retrieves AI draft response for a ticket.
 *
 * @param {string} id
 * @returns {Promise<Object>}
 */
export async function getTicketDraft(id) {
  const response = await httpClient.get(`/admin/tickets/${id}/draft`);
  return response.data;
}

/**
 * Forces regeneration of an AI draft response for a ticket.
 *
 * @param {string} id
 * @returns {Promise<Object>}
 */
export async function regenerateTicketDraft(id) {
  const response = await httpClient.post(`/admin/tickets/${id}/draft/regenerate`);
  return response.data;
}

/**
 * Retries AI classification on a ticket.
 *
 * @param {string} id
 * @returns {Promise<Object>}
 */
export async function retryTicketClassification(id) {
  const response = await httpClient.post(`/admin/tickets/${id}/classify/retry`);
  return response.data?.ticket;
}
