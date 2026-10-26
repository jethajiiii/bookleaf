import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

let isIntentionalDisconnect = false;

/**
 * Initializes and manages connection to MongoDB using Mongoose.
 * Logs connection lifecycle events to assist diagnostics in development and production.
 *
 * @returns {Promise<typeof mongoose>} Resolved Mongoose instance
 */
export const connectDB = async () => {
  isIntentionalDisconnect = false;
  try {
    const conn = await mongoose.connect(env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    logger.info(`MongoDB connected successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    logger.error('Failed to connect to MongoDB', { error: error.message });
    throw error;
  }
};

/**
 * Gracefully closes MongoDB connection without logging an unexpected disconnection warning.
 */
export const disconnectDB = async () => {
  isIntentionalDisconnect = true;
  await mongoose.disconnect();
  logger.info('MongoDB disconnected cleanly.');
};

mongoose.connection.on('disconnected', () => {
  if (!isIntentionalDisconnect) {
    logger.warn('MongoDB connection lost. Attempting reconnection...');
  }
});

mongoose.connection.on('error', (err) => {
  logger.error('MongoDB runtime connection error', { error: err.message });
});
