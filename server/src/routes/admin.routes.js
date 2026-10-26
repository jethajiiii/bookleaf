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

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'admin-ok', user: req.user });
});

export default router;
