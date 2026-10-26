import { Router } from 'express';

const router = Router();

// Placeholder for subsequent Admin Portal phase
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'admin-ok', user: req.user });
});

export default router;
