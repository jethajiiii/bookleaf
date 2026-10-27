import { z } from 'zod';
import { CATEGORIES } from '../../constants/categories.js';
import { PRIORITIES } from '../../constants/priorities.js';
import { AI_STATUS } from '../../constants/aiStatus.js';
import { logger } from '../../utils/logger.js';
import { generate } from './client.js';
import { CLASSIFY_SYSTEM, buildClassifyInput } from './prompts.js';
import { classifyFallback } from './fallback.js';

const classificationSchema = z.object({
  category: z.preprocess(
    (val) => (typeof val === 'string' ? val.toLowerCase() : val),
    z.enum(Object.values(CATEGORIES))
  ),
  priority: z.preprocess(
    (val) => (typeof val === 'string' ? val.toLowerCase() : val),
    z.enum(Object.values(PRIORITIES))
  ),
  reason: z.string().optional().default('AI classified'),
});

/**
 * Classifies a ticket using LLM (sends ONLY subject + description, temperature 0, JSON mode).
 * Validates result with Zod against canonical categories and priorities.
 * On any failure or schema mismatch, seamlessly falls back to keyword rules with aiStatus: 'failed'.
 * On success, returns classified result with aiStatus: 'done'.
 *
 * @param {{ subject: string, description: string }} ticket
 * @returns {Promise<{ category: string, priority: string, reason: string, aiStatus: string }>}
 */
export const classifyTicket = async ({ subject, description }) => {
  try {
    const rawOutput = await generate({
      system: CLASSIFY_SYSTEM,
      user: buildClassifyInput({ subject, description }),
      json: true,
      temperature: 0,
      callType: 'classify',
    });

    const parsed = JSON.parse(rawOutput);
    const validated = classificationSchema.parse(parsed);

    return {
      category: validated.category,
      priority: validated.priority,
      reason: validated.reason || 'AI classified',
      aiStatus: AI_STATUS.DONE,
    };
  } catch (err) {
    logger.warn('AI classification failed, falling back to keyword rules', {
      error: err.message,
    });
    const fallback = classifyFallback({ subject, description });
    return {
      category: fallback.category,
      priority: fallback.priority,
      reason: fallback.reason,
      aiStatus: AI_STATUS.FAILED,
    };
  }
};
