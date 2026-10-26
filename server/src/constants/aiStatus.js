/**
 * Status tracking for asynchronous AI background operations (classification & draft generation).
 */
export const AI_STATUS = Object.freeze({
  PENDING: 'pending',
  DONE: 'done',
  FAILED: 'failed',
});

export const AI_STATUS_VALUES = Object.freeze(Object.values(AI_STATUS));
