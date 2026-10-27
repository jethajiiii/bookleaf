import httpClient from './httpClient.js';

/**
 * Retrieves the list of books published or in-production by the authenticated author.
 *
 * @returns {Promise<Array>} List of book documents
 */
export async function getMyBooks() {
  const response = await httpClient.get('/books');
  return response.data?.books || [];
}
