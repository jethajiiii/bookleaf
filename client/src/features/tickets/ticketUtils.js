const LAST_SEEN_PREFIX = 'bookleaf_ticket_seen_';

/**
 * Returns the stored ISO timestamp for when a ticket was last expanded by the user.
 *
 * @param {string} ticketId
 * @returns {string|null} ISO date string or null
 */
export function getLastSeen(ticketId) {
  try {
    return localStorage.getItem(`${LAST_SEEN_PREFIX}${ticketId}`) || null;
  } catch {
    return null;
  }
}

/**
 * Records the current time as the lastSeen timestamp for a ticket in localStorage.
 *
 * @param {string} ticketId
 * @param {string} [timestamp] Optional explicit ISO string, defaults to now
 */
export function markSeen(ticketId, timestamp = new Date().toISOString()) {
  try {
    localStorage.setItem(`${LAST_SEEN_PREFIX}${ticketId}`, timestamp);
  } catch {
    // Ignore storage quota/security errors
  }
}

/**
 * Determines whether a ticket has unread replies from support.
 * - If support hasn't replied at all (only author message exists), returns false.
 * - If support replied and author has never expanded the card, returns true.
 * - If author expanded it before, returns true only if a reply came after lastSeen.
 *
 * @param {Object} ticket
 * @param {string|null} lastSeen ISO timestamp
 * @returns {boolean}
 */
export function hasNewReplies(ticket, lastSeen) {
  if (!ticket || !Array.isArray(ticket.messages) || ticket.messages.length === 0) {
    return false;
  }

  const supportReplies = ticket.messages.filter((m) => m.sender !== 'author');
  if (supportReplies.length === 0) {
    return false;
  }

  if (!lastSeen) {
    return true;
  }

  const seenAt = new Date(lastSeen).getTime();
  return supportReplies.some((m) => new Date(m.createdAt).getTime() > seenAt);
}

/** Ticket status display configuration */
export const STATUS_CONFIG = Object.freeze({
  open: { label: 'Open', badgeVariant: 'teal' },
  in_progress: { label: 'In Progress', badgeVariant: 'mustard' },
  resolved: { label: 'Resolved', badgeVariant: 'sage' },
  closed: { label: 'Closed', badgeVariant: 'neutral' },
});

/** Filter tabs for the ticket list */
export const STATUS_TABS = Object.freeze([
  { key: 'all', label: 'All' },
  { key: 'open', label: 'Open' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'resolved', label: 'Resolved' },
  { key: 'closed', label: 'Closed' },
]);
