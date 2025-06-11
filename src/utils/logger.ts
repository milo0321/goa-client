// src/utils/logger.ts

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const prefix = '[OrderSystem]';

function formatMessage(level: LogLevel, message: string) {
  const time = new Date().toISOString();
  return `${time} ${prefix} [${level.toUpperCase()}] ${message}`;
}

export const logger = {
  debug: (message: string, data?: unknown) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(formatMessage('debug', message), data);
    }
  },
  info: (message: string, data?: unknown) => {
    console.info(formatMessage('info', message), data);
  },
  warn: (message: string, data?: unknown) => {
    console.warn(formatMessage('warn', message), data);
  },
  error: (message: string, data?: unknown) => {
    console.error(formatMessage('error', message), data);
  },
};
