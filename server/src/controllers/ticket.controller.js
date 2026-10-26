import * as ticketService from '../services/ticket.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createTicket = asyncHandler(async (req, res) => {
  const ticket = await ticketService.createTicket(req.user.id, req.user.name, req.body);
  res.status(201).json({ ticket });
});

export const getMyTickets = asyncHandler(async (req, res) => {
  const tickets = await ticketService.getMyTickets(req.user.id);
  res.status(200).json({ tickets });
});

export const getMyTicketById = asyncHandler(async (req, res) => {
  const ticket = await ticketService.getMyTicketById(req.params.id, req.user.id);
  res.status(200).json({ ticket });
});

export const addAuthorMessage = asyncHandler(async (req, res) => {
  const ticket = await ticketService.addAuthorMessage(
    req.params.id,
    req.user.id,
    req.user.name,
    req.body.body
  );
  res.status(200).json({ ticket });
});
