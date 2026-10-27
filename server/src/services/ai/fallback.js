import { CATEGORIES } from '../../constants/categories.js';
import { PRIORITIES } from '../../constants/priorities.js';

/**
 * Keyword-based fallback classifier for tickets when the AI provider is unavailable.
 * Checks keyword patterns strictly in order (case-insensitive):
 * 1. isbn -> ISBN/HIGH
 * 2. royalt|payout|payment -> ROYALTY/MEDIUM
 * 3. print|binding|misprint|quality -> PRINTING/MEDIUM
 * 4. unavailable|listing|amazon|flipkart -> DISTRIBUTION/MEDIUM
 * 5. status|typeset|cover|proof|stage -> PRODUCTION/MEDIUM
 * 6. default -> GENERAL/LOW
 *
 * @param {{ subject?: string, description?: string }} ticket
 * @returns {{ category: string, priority: string, reason: string }}
 */
export const classifyFallback = ({ subject = '', description = '' } = {}) => {
  const text = `${subject} ${description}`.toLowerCase();

  // 1. ISBN: isbn -> ISBN / HIGH
  if (/isbn/i.test(text)) {
    return {
      category: CATEGORIES.ISBN,
      priority: PRIORITIES.HIGH,
      reason: 'Fallback keyword match: isbn',
    };
  }

  // 2. ROYALTY: royalt|payout|payment -> ROYALTY / MEDIUM
  if (/royalt|payout|payment/i.test(text)) {
    return {
      category: CATEGORIES.ROYALTY,
      priority: PRIORITIES.MEDIUM,
      reason: 'Fallback keyword match: royalt|payout|payment',
    };
  }

  // 3. PRINTING: print|binding|misprint|quality -> PRINTING / MEDIUM
  if (/print|binding|misprint|quality/i.test(text)) {
    return {
      category: CATEGORIES.PRINTING,
      priority: PRIORITIES.MEDIUM,
      reason: 'Fallback keyword match: print|binding|misprint|quality',
    };
  }

  // 4. DISTRIBUTION: unavailable|listing|amazon|flipkart -> DISTRIBUTION / MEDIUM
  if (/unavailable|listing|amazon|flipkart/i.test(text)) {
    return {
      category: CATEGORIES.DISTRIBUTION,
      priority: PRIORITIES.MEDIUM,
      reason: 'Fallback keyword match: unavailable|listing|amazon|flipkart',
    };
  }

  // 5. PRODUCTION: status|typeset|cover|proof|stage -> PRODUCTION / MEDIUM
  if (/status|typeset|cover|proof|stage/i.test(text)) {
    return {
      category: CATEGORIES.PRODUCTION,
      priority: PRIORITIES.MEDIUM,
      reason: 'Fallback keyword match: status|typeset|cover|proof|stage',
    };
  }

  // 6. Default: GENERAL / LOW
  return {
    category: CATEGORIES.GENERAL,
    priority: PRIORITIES.LOW,
    reason: 'Fallback default: general query',
  };
};
