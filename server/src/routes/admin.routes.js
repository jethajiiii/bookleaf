import { Router } from 'express';
import * as adminController from '../controllers/admin.controller.js';
import { validate } from '../middleware/validate.js';
import {
  listTicketsQuerySchema,
  ticketIdParamSchema,
  updateTicketSchema,
  addReplySchema,
  addInternalNoteSchema,
} from '../validators/admin.schema.js';

const router = Router();

router.get('/stats', adminController.getStats);
router.get('/tickets', validate(listTicketsQuerySchema), adminController.getTickets);
router.get('/tickets/:id', validate(ticketIdParamSchema), adminController.getTicketById);
router.patch('/tickets/:id', validate(updateTicketSchema), adminController.updateTicket);
router.post('/tickets/:id/replies', validate(addReplySchema), adminController.addReply);
router.post('/tickets/:id/notes', validate(addInternalNoteSchema), adminController.addInternalNote);

// AI draft and classification endpoints
router.get('/tickets/:id/draft', validate(ticketIdParamSchema), adminController.getDraft);
router.post('/tickets/:id/draft/regenerate', validate(ticketIdParamSchema), adminController.regenerateDraft);
router.post('/tickets/:id/classify/retry', validate(ticketIdParamSchema), adminController.retryClassification);

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'admin-ok', user: req.user });
});

export default router;
