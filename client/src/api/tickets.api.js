import httpClient from './httpClient.js';

/**
 * Submits a new support query ticket for the authenticated author.
 *
 * @param {Object} payload
 * @param {string} payload.subject
 * @param {string} payload.description
 * @param {string|null} [payload.bookId]
 * @param {string[]} [payload.attachments]
 * @returns {Promise<Object>} Created ticket document
 */
export async function createTicket(payload) {
  const response = await httpClient.post('/tickets', payload);
  return response.data?.ticket;
}

/**
 * Retrieves all tickets authored by the current authenticated user.
 *
 * @returns {Promise<Array>} List of author tickets
 */
export async function getMyTickets() {
  const response = await httpClient.get('/tickets');
  return response.data?.tickets || [];
}

/**
 * Retrieves a single author ticket by ID.
 *
 * @param {string} id 24-character hexadecimal ticket ID
 * @returns {Promise<Object>} Author ticket detail
 */
export async function getTicketById(id) {
  const response = await httpClient.get(`/tickets/${id}`);
  return response.data?.ticket;
}

/**
 * Appends an author reply message to the ticket conversation.
 *
 * @param {string} id Ticket ID
 * @param {string} body Message content
 * @returns {Promise<Object>} Updated ticket document
 */
export async function addTicketMessage(id, body) {
  const response = await httpClient.post(`/tickets/${id}/messages`, { body });
  return response.data?.ticket;
}
