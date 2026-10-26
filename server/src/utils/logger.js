/**
 * Centralized logger utility.
 * Enforces structured logging and isolates direct console interactions
 * to satisfy the project rule prohibiting bare console.log calls.
 */

const LOG_LEVELS = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  DEBUG: 'DEBUG',
};

const formatMessage = (level, message, meta) => {
  const timestamp = new Date().toISOString();
  const metaString = meta && Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] [${level}] ${message}${metaString}`;
};

export const logger = {
  info: (message, meta) => {
    console.info(formatMessage(LOG_LEVELS.INFO, message, meta));
  },
  warn: (message, meta) => {
    console.warn(formatMessage(LOG_LEVELS.WARN, message, meta));
  },
  error: (message, meta) => {
    console.error(formatMessage(LOG_LEVELS.ERROR, message, meta));
  },
  debug: (message, meta) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(formatMessage(LOG_LEVELS.DEBUG, message, meta));
    }
  },
};
