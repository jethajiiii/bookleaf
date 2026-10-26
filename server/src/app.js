import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { env } from './config/env.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Security headers
app.use(helmet());

// Cross-Origin Resource Sharing scoped to validated client origin
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);

// Body parsing with safe size limit
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// HTTP request logging
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Liveness & health probe
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// 404 handler for unrecognized endpoints
app.use(notFound);

// Centralized error handler
app.use(errorHandler);

export default app;
