import mongoose from 'mongoose';
import { Counter } from './Counter.js';
import { TICKET_STATUS, TICKET_STATUS_VALUES } from '../constants/ticketStatus.js';
import { CATEGORIES, CATEGORY_VALUES } from '../constants/categories.js';
import { PRIORITIES, PRIORITY_VALUES, PRIORITY_RANKS } from '../constants/priorities.js';
import { ROLE_VALUES } from '../constants/roles.js';
import { AI_STATUS, AI_STATUS_VALUES } from '../constants/aiStatus.js';

const messageSchema = new mongoose.Schema(
  {
    sender: { type: String, enum: ROLE_VALUES, required: true },
    senderName: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const internalNoteSchema = new mongoose.Schema(
  {
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    adminName: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const ticketSchema = new mongoose.Schema(
  {
    ticketNo: { type: Number, unique: true, index: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', default: null, index: true },
    subject: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    attachments: { type: [String], default: [] },
    status: { type: String, enum: TICKET_STATUS_VALUES, default: TICKET_STATUS.OPEN },
    category: { type: String, enum: CATEGORY_VALUES, default: CATEGORIES.GENERAL },
    priority: { type: String, enum: PRIORITY_VALUES, default: PRIORITIES.MEDIUM },
    priorityRank: { type: Number, default: PRIORITY_RANKS[PRIORITIES.MEDIUM] },
    ai: {
      category: { type: String, default: null },
      priority: { type: String, default: null },
      reason: { type: String, default: null },
      status: { type: String, enum: AI_STATUS_VALUES, default: AI_STATUS.PENDING },
      draft: { type: String, default: null },
      draftGeneratedAt: { type: Date, default: null },
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    messages: [messageSchema],
    internalNotes: [internalNoteSchema],
  },
  { timestamps: true }
);

ticketSchema.index({ author: 1, createdAt: -1 });
ticketSchema.index({ status: 1, priorityRank: 1, createdAt: 1 });

ticketSchema.pre('validate', async function () {
  if (this.isNew && !this.ticketNo) {
    this.ticketNo = await Counter.getNextSequence('ticketNo');
  }

  if (this.priority && PRIORITY_RANKS[this.priority] !== undefined) {
    this.priorityRank = PRIORITY_RANKS[this.priority];
  }
});

export const Ticket = mongoose.model('Ticket', ticketSchema);

/**
 * Helper that sets both priority and priorityRank synchronously.
 *
 * @param {Object} ticket - Ticket document or object
 * @param {string} priority - Priority value from PRIORITIES enum
 * @returns {Object} The updated ticket object
 */
export const setPriority = (ticket, priority) => {
  ticket.priority = priority;
  if (PRIORITY_RANKS[priority] !== undefined) {
    ticket.priorityRank = PRIORITY_RANKS[priority];
  }
  return ticket;
};

