/**
 * Validates author ticket input mirroring server Zod validation limits.
 * Subject: 5-150 characters.
 * Description: 20-5000 characters.
 *
 * @param {Object} input
 * @param {string} [input.subject]
 * @param {string} [input.description]
 * @returns {Object} Field error dictionary (empty if valid)
 */
export function validateTicketInput({ subject = '', description = '' }) {
  const errors = {};
  const sub = subject.trim();
  const desc = description.trim();

  if (!sub) {
    errors.subject = 'Subject is required';
  } else if (sub.length < 5 || sub.length > 150) {
    errors.subject = 'Subject must be between 5 and 150 characters';
  }

  if (!desc) {
    errors.description = 'Description is required';
  } else if (desc.length < 20 || desc.length > 5000) {
    errors.description = 'Description must be between 20 and 5000 characters';
  }

  return errors;
}
