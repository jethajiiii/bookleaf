import rateLimit from 'express-rate-limit';

/**
 * Rate limiter middleware for authentication routes to prevent brute-force attacks.
 * Limit: 20 requests per 15-minute window per IP.
 */
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({
      error: {
        code: 'TOO_MANY_REQUESTS',
        message: 'Too many login attempts. Please try again after 15 minutes.',
      },
    });
  },
});
