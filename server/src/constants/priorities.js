/**
 * Priority levels and ranks for author support tickets.
 * Lower numerical rank indicates higher urgency (CRITICAL=1, HIGH=2, MEDIUM=3, LOW=4).
 */
export const PRIORITIES = Object.freeze({
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
});

export const PRIORITY_VALUES = Object.freeze(Object.values(PRIORITIES));

export const PRIORITY_RANKS = Object.freeze({
  [PRIORITIES.CRITICAL]: 1,
  [PRIORITIES.HIGH]: 2,
  [PRIORITIES.MEDIUM]: 3,
  [PRIORITIES.LOW]: 4,
});

export const PRIORITY_LABELS = Object.freeze({
  [PRIORITIES.CRITICAL]: 'Critical',
  [PRIORITIES.HIGH]: 'High',
  [PRIORITIES.MEDIUM]: 'Medium',
  [PRIORITIES.LOW]: 'Low',
});

export const PRIORITY_DEFINITIONS = Object.freeze(
  PRIORITY_VALUES.map((value) => ({
    value,
    rank: PRIORITY_RANKS[value],
    label: PRIORITY_LABELS[value],
  }))
);
