import { PRODUCTION_STAGES } from './constants.js';

/**
 * Formats a numeric value into Indian Rupee currency representation.
 * Returns em-dash for null, undefined, or non-numeric values.
 *
 * @param {number|null|undefined} amount
 * @returns {string}
 */
export function formatINR(amount) {
  if (amount === null || amount === undefined || Number.isNaN(Number(amount))) {
    return '—';
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(amount));
}

/**
 * Formats a Date object or ISO string to a human-readable date.
 * Returns em-dash for null, undefined, or invalid dates.
 *
 * @param {string|Date|null|undefined} dateVal
 * @returns {string}
 */
export function formatDate(dateVal) {
  if (!dateVal) return '—';
  const d = new Date(dateVal);
  if (Number.isNaN(d.getTime())) return '—';

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d);
}

/**
 * Formats a number with Indian localization separators.
 *
 * @param {number|null|undefined} count
 * @returns {string}
 */
export function formatNumber(count) {
  if (count === null || count === undefined || Number.isNaN(Number(count))) {
    return '0';
  }
  return Number(count).toLocaleString('en-IN');
}

/**
 * Extracts and normalizes the current production stage from a status string.
 * Example: "In Production - Cover Design" -> "Cover Design".
 *
 * @param {string|null|undefined} status
 * @returns {string|null}
 */
export function parseProductionStage(status) {
  if (!status || typeof status !== 'string') return null;

  // Direct match in stages
  const exact = PRODUCTION_STAGES.find((s) => s.toLowerCase() === status.trim().toLowerCase());
  if (exact) return exact;

  // Split on dash, hyphen, or colon (e.g., "In Production - Cover Design")
  const parts = status.split(/[-–—:]/);
  if (parts.length > 1) {
    const candidate = parts.slice(1).join(' ').trim();
    const match = PRODUCTION_STAGES.find(
      (s) => s.toLowerCase() === candidate.toLowerCase()
    );
    if (match) return match;
  }

  // Fallback search inside status
  const matched = PRODUCTION_STAGES.find((s) =>
    status.toLowerCase().includes(s.toLowerCase())
  );
  return matched || 'Manuscript Received';
}

/**
 * Formats elapsed age in hours into concise readable string (e.g., "4h", "2d 5h", "5d").
 *
 * @param {number|null|undefined} hours
 * @returns {string}
 */
export function formatTicketAge(hours) {
  if (hours === null || hours === undefined || Number.isNaN(Number(hours))) return '—';
  const h = Math.max(0, Math.floor(Number(hours)));
  if (h < 1) return '< 1h';
  if (h < 24) return `${h}h`;
  const days = Math.floor(h / 24);
  const remainingHours = h % 24;
  return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
}

/**
 * Checks if a ticket is overdue (unresolved and >= 72 hours old).
 *
 * @param {Object} ticket
 * @returns {boolean}
 */
export function isTicketOverdue(ticket) {
  if (!ticket) return false;
  const isUnresolved = ticket.status === 'open' || ticket.status === 'in_progress';
  if (!isUnresolved) return false;

  if (typeof ticket.ageInHours === 'number') {
    return ticket.ageInHours >= 72;
  }
  if (ticket.createdAt) {
    const diffMs = Date.now() - new Date(ticket.createdAt).getTime();
    return diffMs >= 72 * 60 * 60 * 1000;
  }
  return false;
}

