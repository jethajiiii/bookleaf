import { generate, AiUnavailableError } from './client.js';
import { DRAFT_SYSTEM, buildDraftInput } from './prompts.js';
import { FEW_SHOT } from './kb.js';
import { getBookFacts, pickFactsForCategory } from './bookFacts.js';
import { ROLES } from '../../constants/roles.js';
import { logger } from '../../utils/logger.js';

/**
 * Returns an existing draft if valid, or regenerates a new one using LLM.
 * Cached draft is valid ONLY if:
 * 1. !force
 * 2. ticket.ai?.draft is non-empty
 * 3. ticket.ai?.draftCategory === ticket.category
 * 4. ticket.ai?.draftForAuthorMessages === current count of author messages
 *
 * @param {object} ticket - Mongoose Ticket document
 * @param {object|null} book - Book document, plain object, or null
 * @param {object|null} author - User record or populated author object
 * @param {{ force?: boolean }} [options={}]
 * @returns {Promise<{ draft: string|null, aiAvailable: boolean, cached?: boolean }>}
 */
export const getOrCreateDraft = async (ticket, book, author, { force = false } = {}) => {
  const currentAuthorMessages = (ticket.messages || []).filter((m) => m.sender === ROLES.AUTHOR).length;

  const isCacheValid =
    !force &&
    Boolean(ticket.ai?.draft) &&
    ticket.ai?.draftCategory === ticket.category &&
    ticket.ai?.draftForAuthorMessages === currentAuthorMessages;

  if (isCacheValid) {
    return { draft: ticket.ai.draft, aiAvailable: true, cached: true };
  }

  const category = ticket.category || 'general';
  const authorName =
    author?.name || (typeof ticket.author === 'object' ? ticket.author?.name : null) || 'Author';
  const authorFirstName = authorName.trim().split(/\s+/)[0];

  const rawFacts = book ? getBookFacts(book) : null;
  const picked = rawFacts ? pickFactsForCategory(rawFacts, category) : null;

  const factsText = picked
    ? Object.entries(picked)
        .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : (v ?? 'none')}`)
        .join('\n')
    : 'No book associated with this general ticket.';

  const fewShot = FEW_SHOT[category] || FEW_SHOT.general;
  const recentMessages = (ticket.messages || []).slice(-3);

  const userPrompt = buildDraftInput({
    authorFirstName,
    category,
    facts: factsText,
    fewShot,
    ticketSubject: ticket.subject,
    ticketDescription: ticket.description,
    recentMessages,
  });

  try {
    const draft = await generate({
      system: DRAFT_SYSTEM,
      user: userPrompt,
      json: false,
      temperature: 0.4,
      callType: 'draft',
    });

    ticket.ai = ticket.ai || {};
    ticket.ai.draft = draft;
    ticket.ai.draftGeneratedAt = new Date();
    ticket.ai.draftCategory = ticket.category;
    ticket.ai.draftForAuthorMessages = currentAuthorMessages;

    await ticket.save();

    return { draft, aiAvailable: true, cached: false };
  } catch (err) {
    if (err instanceof AiUnavailableError) {
      logger.warn('AI unavailable for draft generation', {
        ticketId: ticket._id,
        category: ticket.category,
        error: err.message,
      });
      return { draft: null, aiAvailable: false };
    }
    throw err;
  }
};
