import { ApiError } from '../utils/ApiError.js';

/**
 * Role-based authorization guard.
 * Ensures the authenticated user possesses one of the designated permitted roles.
 *
 * @param {...string} allowedRoles - Permitted roles (e.g. ROLES.ADMIN)
 * @returns {import('express').RequestHandler}
 */
export const requireRole = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return next(ApiError.unauthorized('Authentication required'));
  }

  const flatRoles = allowedRoles.flat();

  if (!flatRoles.includes(req.user.role)) {
    return next(ApiError.forbidden('You do not have permission to access this resource'));
  }

  next();
};
