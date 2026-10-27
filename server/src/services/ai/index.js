/**
 * Public barrel for the AI service layer.
 * Consumers import from here; they never import sdk-specific internals.
 */
export { generate, AiUnavailableError } from './client.js';
export { CLASSIFY_SYSTEM, DRAFT_SYSTEM, buildClassifyInput, buildDraftInput } from './prompts.js';
export { KB, FEW_SHOT, COMPANY_OVERVIEW, TONE_GUIDELINES } from './kb.js';
export { classifyFallback } from './fallback.js';
export { classifyTicket } from './classify.js';
export { getBookFacts, pickFactsForCategory } from './bookFacts.js';
export { getOrCreateDraft } from './draft.js';
