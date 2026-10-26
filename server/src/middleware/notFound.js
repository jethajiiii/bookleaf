import { ApiError } from '../utils/ApiError.js';

/**
 * Catches unmatched routes and delegates a 404 ApiError to the central error handler,
 * guaranteeing all unknown endpoints return a uniform error structure.
 */
export const notFound = (req, res, next) => {
  next(new ApiError(404, 'NOT_FOUND', `Cannot ${req.method} ${req.originalUrl}`));
};
