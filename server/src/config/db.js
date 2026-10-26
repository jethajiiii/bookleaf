import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

/**
 * Initializes and manages connection to MongoDB using Mongoose.
 * Logs connection lifecycle events to assist diagnostics in development and production.
 *
 * @returns {Promise<typeof mongoose>} Resolved Mongoose instance
 */
export const connectDB = async () => {
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

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB connection lost. Attempting reconnection...');
});

mongoose.connection.on('error', (err) => {
  logger.error('MongoDB runtime connection error', { error: err.message });
});
