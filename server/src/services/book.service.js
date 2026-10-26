import { Book } from '../models/Book.js';

/**
 * Retrieves all books authored by the authenticated user.
 * Scoped strictly to the author ID to guarantee data isolation.
 *
 * @param {string} authorId - Authenticated author's MongoDB ID
 * @returns {Promise<Array<Object>>} List of books
 */
export const getBooksByAuthor = async (authorId) => {
  return Book.find({ author: authorId })
    .sort({ createdAt: -1 })
    .lean();
};
