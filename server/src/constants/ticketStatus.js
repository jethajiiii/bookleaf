/**
 * Lifecycle statuses for author support tickets.
 * Frozen to eliminate magic strings across controllers, services, and queries.
 */
export const TICKET_STATUS = Object.freeze({
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
});

export const TICKET_STATUS_VALUES = Object.freeze(Object.values(TICKET_STATUS));

export const TICKET_STATUS_LABELS = Object.freeze({
  [TICKET_STATUS.OPEN]: 'Open',
  [TICKET_STATUS.IN_PROGRESS]: 'In Progress',
  [TICKET_STATUS.RESOLVED]: 'Resolved',
  [TICKET_STATUS.CLOSED]: 'Closed',
});
