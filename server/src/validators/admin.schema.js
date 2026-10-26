import { z } from 'zod';
import { TICKET_STATUS_VALUES } from '../constants/ticketStatus.js';
import { CATEGORY_VALUES } from '../constants/categories.js';
import { PRIORITY_VALUES } from '../constants/priorities.js';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const objectIdSchema = z
  .string({ required_error: 'Ticket ID is required' })
  .trim()
  .regex(objectIdRegex, 'Invalid ticket ID format. Must be a 24-character hex ID');

const dateStringSchema = z
  .string()
  .trim()
  .refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date format' });

export const listTicketsQuerySchema = z.object({
  query: z.object({
    status: z.enum(TICKET_STATUS_VALUES).optional(),
    category: z.enum(CATEGORY_VALUES).optional(),
    priority: z.enum(PRIORITY_VALUES).optional(),
    from: dateStringSchema.optional(),
    to: dateStringSchema.optional(),
    assigned: z.enum(['me', 'unassigned']).optional(),
    search: z.string().trim().optional(),
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  }),
});

export const ticketIdParamSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});

export const updateTicketSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: z
    .object({
      status: z.enum(TICKET_STATUS_VALUES).optional(),
      category: z.enum(CATEGORY_VALUES).optional(),
      priority: z.enum(PRIORITY_VALUES).optional(),
      assignedTo: z.union([z.literal('me'), z.null()]).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided for update',
    }),
});

export const addReplySchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: z.object({
    body: z
      .string({ required_error: 'Reply body is required' })
      .trim()
      .min(1, 'Reply body cannot be empty')
      .max(5000, 'Reply body cannot exceed 5000 characters'),
  }),
});

export const addInternalNoteSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: z.object({
    body: z
      .string({ required_error: 'Note body is required' })
      .trim()
      .min(1, 'Note body cannot be empty')
      .max(5000, 'Note body cannot exceed 5000 characters'),
  }),
});
