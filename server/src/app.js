import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { env } from './config/env.js';
import apiRouter from './routes/index.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';
import { swaggerServe, swaggerSetup } from './docs/swagger.js';

const app = express();

// Security headers (CSP disabled so Swagger UI can load scripts and styles)
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

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

// Interactive API documentation
app.use('/api/docs', swaggerServe, swaggerSetup);

// Primary API routes
app.use('/api', apiRouter);

// 404 handler for unrecognized endpoints
app.use(notFound);

// Centralized error handler
app.use(errorHandler);

export default app;
