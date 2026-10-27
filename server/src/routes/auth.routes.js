import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/authenticate.js';
import { loginRateLimiter } from '../middleware/rateLimiter.js';
import { loginSchema } from '../validators/auth.schema.js';

const router = Router();

router.post('/login', loginRateLimiter, validate(loginSchema), authController.login);
router.get('/me', authenticate, authController.getProfile);

export default router;
