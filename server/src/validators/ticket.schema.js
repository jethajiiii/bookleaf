import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

/**
 * Validation schema for author ticket creation.
 */
export const createTicketSchema = z.object({
  body: z.object({
    subject: z
      .string({ required_error: 'Subject is required' })
      .trim()
      .min(5, 'Subject must be between 5 and 150 characters')
      .max(150, 'Subject must be between 5 and 150 characters'),
    description: z
      .string({ required_error: 'Description is required' })
      .trim()
      .min(20, 'Description must be between 20 and 5000 characters')
      .max(5000, 'Description must be between 20 and 5000 characters'),
    bookId: z
      .string()
      .trim()
      .regex(objectIdRegex, 'Invalid bookId format. Must be a 24-character hex ID')
      .optional()
      .nullable(),
    attachments: z
      .array(z.string().trim())
      .optional()
      .default([]),
  }),
});

/**
 * Validation schema for ticket ID route parameters.
 */
export const ticketIdParamSchema = z.object({
  params: z.object({
    id: z
      .string({ required_error: 'Ticket ID is required' })
      .trim()
      .regex(objectIdRegex, 'Invalid ticket ID format. Must be a 24-character hex ID'),
  }),
});

/**
 * Validation schema for author reply messages.
 */
export const createMessageSchema = z.object({
  params: z.object({
    id: z
      .string({ required_error: 'Ticket ID is required' })
      .trim()
      .regex(objectIdRegex, 'Invalid ticket ID format. Must be a 24-character hex ID'),
  }),
  body: z.object({
    body: z
      .string({ required_error: 'Message body is required' })
      .trim()
      .min(1, 'Message body cannot be empty')
      .max(5000, 'Message body cannot exceed 5000 characters'),
  }),
});
