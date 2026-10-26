/**
 * Custom operational error class for consistent API error responses.
 * Encapsulates HTTP status code, standard error code, message, and optional details.
 */
export class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP status code
   * @param {string} code - Machine-readable error code (e.g., 'NOT_FOUND', 'VALIDATION_ERROR')
   * @param {string} message - Human-readable explanation
   * @param {any} [details=null] - Additional validation or context details
   */
  constructor(statusCode, code, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message, details = null, code = 'BAD_REQUEST') {
    return new ApiError(400, code, message, details);
  }

  static unauthorized(message = 'Authentication required', code = 'UNAUTHENTICATED') {
    return new ApiError(401, code, message);
  }

  static forbidden(message = 'Access forbidden', code = 'FORBIDDEN') {
    return new ApiError(403, code, message);
  }

  static notFound(message = 'Resource not found', code = 'NOT_FOUND') {
    return new ApiError(404, code, message);
  }

  static conflict(message = 'Resource conflict', code = 'CONFLICT') {
    return new ApiError(409, code, message);
  }

  static tooManyRequests(message = 'Too many requests, please slow down', code = 'TOO_MANY_REQUESTS') {
    return new ApiError(429, code, message);
  }

  static internal(message = 'An unexpected internal server error occurred', code = 'INTERNAL_ERROR') {
    return new ApiError(500, code, message);
  }
}
