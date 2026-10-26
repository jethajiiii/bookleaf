import { Router } from 'express';
import * as ticketController from '../controllers/ticket.controller.js';
import { validate } from '../middleware/validate.js';
import {
  createTicketSchema,
  ticketIdParamSchema,
  createMessageSchema,
} from '../validators/ticket.schema.js';

const router = Router();

router.post('/', validate(createTicketSchema), ticketController.createTicket);
router.get('/', ticketController.getMyTickets);
router.get('/:id', validate(ticketIdParamSchema), ticketController.getMyTicketById);
router.post('/:id/messages', validate(createMessageSchema), ticketController.addAuthorMessage);

export default router;
