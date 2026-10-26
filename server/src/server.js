import app from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import { logger } from './utils/logger.js';

/**
 * Boots the HTTP server and establishes database connectivity.
 * Separated from app.js to facilitate isolated unit testing of Express routes.
 */
const startServer = async () => {
  try {
    await connectDB();
  } catch (dbError) {
    logger.warn('Initial MongoDB connection failed. Server will continue running in degraded mode.', {
      error: dbError.message,
    });
  }

  const server = app.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    logger.info(`Health check available at http://localhost:${env.PORT}/api/health`);
  });

  const handleShutdown = (signal) => {
    logger.info(`${signal} received. Initiating graceful server shutdown...`);
    server.close(() => {
      logger.info('HTTP server closed cleanly.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  process.on('SIGINT', () => handleShutdown('SIGINT'));

  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Promise Rejection detected', {
      reason: reason instanceof Error ? reason.message : reason,
      stack: reason instanceof Error ? reason.stack : undefined,
    });
  });
};

startServer();
