import * as bookService from '../services/book.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Controller retrieving all books belonging to the authenticated author.
 */
export const getMyBooks = asyncHandler(async (req, res) => {
  const books = await bookService.getBooksByAuthor(req.user.id);
  res.status(200).json({ books });
});
