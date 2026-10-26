import * as adminTicketService from '../services/adminTicket.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getTickets = asyncHandler(async (req, res) => {
  const result = await adminTicketService.getAdminTickets(req.query, req.user.id);
  res.status(200).json(result);
});

export const getTicketById = asyncHandler(async (req, res) => {
  const ticket = await adminTicketService.getAdminTicketById(req.params.id);
  res.status(200).json({ ticket });
});

export const updateTicket = asyncHandler(async (req, res) => {
  const ticket = await adminTicketService.updateTicket(req.params.id, req.user, req.body);
  res.status(200).json({ ticket });
});

export const addReply = asyncHandler(async (req, res) => {
  const ticket = await adminTicketService.addAdminReply(req.params.id, req.user, req.body.body);
  res.status(200).json({ ticket });
});

export const addInternalNote = asyncHandler(async (req, res) => {
  const ticket = await adminTicketService.addInternalNote(req.params.id, req.user, req.body.body);
  res.status(201).json({ ticket });
});

export const getStats = asyncHandler(async (req, res) => {
  const stats = await adminTicketService.getStats();
  res.status(200).json({ stats });
});
