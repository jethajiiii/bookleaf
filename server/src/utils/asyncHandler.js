/**
 * Wraps async route handlers/controllers to forward any unhandled rejections
 * directly to Express next() middleware, eliminating boilerplate try/catch blocks.
 *
 * @param {Function} fn - Async controller function (req, res, next)
 * @returns {Function} Express middleware handler
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
