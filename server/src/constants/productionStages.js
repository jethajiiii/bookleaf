/**
 * Production stages in order for BookLeaf book lifecycle tracking.
 * Sourced from the BookLeaf Knowledge Base (Production Stages section).
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

export const PRODUCTION_STAGE_VALUES = PRODUCTION_STAGES;

/**
 * Stages where delays most commonly occur (per KB).
 * Used by AI draft prompts to inform delay-context messaging without blaming the author.
 */
export const DELAY_PRONE_STAGES = Object.freeze(['Cover Design', 'Proofreading']);
