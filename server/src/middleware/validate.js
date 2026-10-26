/**
 * Generic Zod validation middleware for Express routes.
 * Validates request body, query, and params against the provided schema.
 * Rejections are passed to the central errorHandler to return standard 400 responses.
 *
 * @param {import('zod').ZodSchema} schema - Zod schema definition
 * @returns {import('express').RequestHandler} Express middleware handler
 */
export const validate = (schema) => (req, res, next) => {
  try {
    // If schema defines body, query, or params wrappers
    if (schema.shape && (schema.shape.body || schema.shape.query || schema.shape.params)) {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      if (parsed.body !== undefined) req.body = parsed.body;
      if (parsed.query !== undefined) {
        Object.defineProperty(req, 'query', {
          value: parsed.query,
          writable: true,
          enumerable: true,
          configurable: true,
        });
      }
      if (parsed.params !== undefined) {
        Object.defineProperty(req, 'params', {
          value: parsed.params,
          writable: true,
          enumerable: true,
          configurable: true,
        });
      }
    } else {
      req.body = schema.parse(req.body);
    }
    next();
  } catch (error) {
    next(error);
  }
};
