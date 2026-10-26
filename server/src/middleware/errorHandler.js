import { ZodError } from 'zod';
import { ApiError } from '../utils/ApiError.js';
import { logger } from '../utils/logger.js';

/**
 * Centralized error handler converting operational and library errors
 * into a uniform JSON response structure: { error: { code, message, details? } }.
 */
export const errorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let code = 'INTERNAL_ERROR';
  let message = 'An unexpected server error occurred';
  let details = undefined;

  // Custom application operational errors
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    code = err.code;
    message = err.message;
    if (err.details) details = err.details;
  }
  // Zod input validation errors
  else if (err instanceof ZodError) {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
    message = 'Validation failed';
    details = err.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));
  }
  // Mongoose validation errors
  else if (err.name === 'ValidationError') {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
    message = 'Database validation failed';
    details = Object.values(err.errors || {}).map((e) => ({
      path: e.path,
      message: e.message,
    }));
  }
  // Mongoose invalid ObjectId / CastError
  else if (err.name === 'CastError') {
    statusCode = 400;
    code = 'INVALID_IDENTIFIER';
    message = `Invalid ${err.path}: "${err.value}"`;
  }
  // MongoDB duplicate key error (code 11000)
  else if (err.code === 11000) {
    statusCode = 409;
    code = 'CONFLICT';
    const fields = Object.keys(err.keyValue || {});
    message = `A resource with that ${fields.join(', ')} already exists`;
    details = err.keyValue;
  }
  // JSON Web Token errors
  else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    code = 'UNAUTHENTICATED';
    message = 'Invalid authentication token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    code = 'TOKEN_EXPIRED';
    message = 'Authentication token has expired';
  } else {
    // Unhandled exception logging
    logger.error('Unhandled exception encountered', {
      name: err.name,
      message: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
    });

    if (process.env.NODE_ENV !== 'production' && err.message) {
      message = err.message;
    }
  }

  const payload = {
    error: {
      code,
      message,
      ...(details !== undefined && { details }),
    },
  };

  res.status(statusCode).json(payload);
};
