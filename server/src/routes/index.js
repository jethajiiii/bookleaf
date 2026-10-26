import { Router } from 'express';
import authRoutes from './auth.routes.js';
import bookRoutes from './book.routes.js';
import ticketRoutes from './ticket.routes.js';
import adminRoutes from './admin.routes.js';
import { authenticate } from '../middleware/authenticate.js';
import { requireRole } from '../middleware/requireRole.js';
import { ROLES } from '../constants/roles.js';

const router = Router();

// Public authentication endpoints
router.use('/auth', authRoutes);

// Protected resources requiring authenticated session
router.use('/books', authenticate, bookRoutes);
router.use('/tickets', authenticate, ticketRoutes);

// Admin portal endpoints restricted to admin role
router.use('/admin', authenticate, requireRole(ROLES.ADMIN), adminRoutes);

export default router;
