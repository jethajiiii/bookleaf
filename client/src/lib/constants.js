/**
 * Production stages in order for BookLeaf book lifecycle tracking.
 * Sourced from BookLeaf KB.
 */
export const PRODUCTION_STAGES = Object.freeze([
  'Manuscript Received',
  'Editing',
  'Cover Design',
  'Typesetting',
  'Proofreading',
  'ISBN Assignment',
  'Printing',
  'Distribution Setup',
  'Published & Live',
]);

export const ROLES = Object.freeze({
  AUTHOR: 'author',
  ADMIN: 'admin',
});

export const BOOK_STATUS = Object.freeze({
  PUBLISHED: 'Published & Live',
  IN_PRODUCTION: 'In Production',
});

export const TICKET_STATUS = Object.freeze({
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
});

export const TICKET_STATUS_LABELS = Object.freeze({
  [TICKET_STATUS.OPEN]: 'Open',
  [TICKET_STATUS.IN_PROGRESS]: 'In Progress',
  [TICKET_STATUS.RESOLVED]: 'Resolved',
  [TICKET_STATUS.CLOSED]: 'Closed',
});

export const CATEGORIES = Object.freeze({
  ROYALTY: 'royalty',
  ISBN: 'isbn',
  PRINTING: 'printing',
  DISTRIBUTION: 'distribution',
  PRODUCTION: 'production',
  GENERAL: 'general',
});

export const CATEGORY_LABELS = Object.freeze({
  [CATEGORIES.ROYALTY]: 'Royalty & Payouts',
  [CATEGORIES.ISBN]: 'ISBN & Copyright',
  [CATEGORIES.PRINTING]: 'Printing & Quality',
  [CATEGORIES.DISTRIBUTION]: 'Distribution & Availability',
  [CATEGORIES.PRODUCTION]: 'Book Production & Design',
  [CATEGORIES.GENERAL]: 'General Inquiry',
});

export const PRIORITIES = Object.freeze({
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
});

export const PRIORITY_LABELS = Object.freeze({
  [PRIORITIES.CRITICAL]: 'Critical',
  [PRIORITIES.HIGH]: 'High',
  [PRIORITIES.MEDIUM]: 'Medium',
  [PRIORITIES.LOW]: 'Low',
});

export const PRIORITY_BADGE_VARIANTS = Object.freeze({
  [PRIORITIES.CRITICAL]: 'terracotta',
  [PRIORITIES.HIGH]: 'mustard',
  [PRIORITIES.MEDIUM]: 'teal',
  [PRIORITIES.LOW]: 'neutral',
});
