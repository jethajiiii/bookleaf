import { env } from '../../config/env.js';
import { logger } from '../../utils/logger.js';

/**
 * Thrown when all retry attempts are exhausted or a non-retriable failure occurs.
 * Keeps raw provider errors internal — callers receive only this typed error.
 */
export class AiUnavailableError extends Error {
  constructor(message = 'AI service temporarily unavailable') {
    super(message);
    this.name = 'AiUnavailableError';
    this.isOperational = true;
  }
}

const TIMEOUT_MS = 10_000;
const RETRY_DELAYS_MS = [1_000, 2_000];

const isRetriable = (err) => {
  if (err?.name === 'TimeoutError') return true;
  const status = err?.status ?? err?.statusCode ?? err?.httpStatusCode;
  return status === 429 || (status >= 500 && status <= 599);
};

const withTimeout = (promise) => {
  const timeout = new Promise((_, reject) => {
    setTimeout(() => {
      const e = new Error('LLM request timed out');
      e.name = 'TimeoutError';
      reject(e);
    }, TIMEOUT_MS);
  });
  return Promise.race([promise, timeout]);
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let _geminiClient = null;
let _cachedKey = null;
const geminiCall = async ({ system, user, json, temperature }) => {
  const currentKey = process.env.GEMINI_API_KEY || env.GEMINI_API_KEY;
  if (!_geminiClient || _cachedKey !== currentKey) {
    const { GoogleGenAI } = await import('@google/genai');
    _geminiClient = new GoogleGenAI({ apiKey: currentKey });
    _cachedKey = currentKey;
  }
  // The v1beta SDK expects model IDs without the 'models/' prefix
  const model = env.GEMINI_MODEL.replace(/^models\//, '');
  const config = {
    temperature,
    systemInstruction: system,
    ...(json && { responseMimeType: 'application/json' }),
  };
  const response = await _geminiClient.models.generateContent({
    model,
    contents: user,
    config,
  });
  return response.text;
};

// --- Claude adapter ---
let _claudeClient = null;
const claudeCall = async ({ system, user, json, temperature }) => {
  if (!_claudeClient) {
    const Anthropic = (await import('@anthropic-ai/sdk')).default;
    _claudeClient = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
  }
  const msg = await _claudeClient.messages.create({
    model: env.CLAUDE_MODEL,
    max_tokens: 1024,
    temperature,
    system: json ? `${system}\nRespond with valid JSON only.` : system,
    messages: [{ role: 'user', content: user }],
  });
  return msg.content[0].text;
};

const providerCall = env.LLM_PROVIDER === 'claude' ? claudeCall : geminiCall;

/**
 * Calls the configured LLM provider with retry logic and timeout protection.
 * Only this file imports any LLM SDK — all callers must go through here.
 *
 * @param {{ system: string, user: string, json?: boolean, temperature?: number }} params
 * @returns {Promise<string>} Raw text response from the model
 * @throws {AiUnavailableError} After exhausting all retries
 */
export const generate = async ({
  system,
  user,
  json = false,
  temperature = 0.4,
  callType = 'ai',
}) => {
  let _lastErr;
  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
    try {
      const text = await withTimeout(providerCall({ system, user, json, temperature }));
      const inputTokens = Math.ceil(((system?.length || 0) + (user?.length || 0)) / 4);
      const outputTokens = Math.ceil((text?.length || 0) / 4);
      logger.info('AI token usage', { callType, inputTokens, outputTokens, provider: env.LLM_PROVIDER });
      return text;
    } catch (err) {
      _lastErr = err;
      const retriable = isRetriable(err);
      logger.warn('AI call failed', {
        attempt: attempt + 1,
        retriable,
        error: err.message,
        provider: env.LLM_PROVIDER,
      });
      if (!retriable || attempt === RETRY_DELAYS_MS.length) break;
      await sleep(RETRY_DELAYS_MS[attempt]);
    }
  }

  // Never expose the raw provider error to callers
  throw new AiUnavailableError(`LLM provider (${env.LLM_PROVIDER}) unavailable after retries`);
};
