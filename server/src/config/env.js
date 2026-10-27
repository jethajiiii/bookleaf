import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables before validation
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  MONGO_URI: z.string().min(1, { message: 'MONGO_URI is required' }),
  JWT_SECRET: z.string().min(8, { message: 'JWT_SECRET must be at least 8 characters long' }),
  JWT_EXPIRES_IN: z.string().default('7d'),
  CLIENT_URL: z.string().url({ message: 'CLIENT_URL must be a valid URL' }).default('http://localhost:5173'),
  LLM_PROVIDER: z.enum(['gemini', 'claude']).default('gemini'),
  GEMINI_API_KEY: z.string().optional(),
  GEMINI_MODEL: z.string().default('gemini-3.5-flash-lite'),
  CLAUDE_MODEL: z.string().default('claude-3-5-sonnet-20241022'),
  ANTHROPIC_API_KEY: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const formattedErrors = parsed.error.issues
    .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
    .join('\n');

  // Direct stderr output here is critical to guarantee immediate fail-fast visibility
  // before any logger subsystem initialization.
  console.error(`\n❌ Fatal: Invalid or missing environment variables:\n${formattedErrors}\n`);
  process.exit(1);
}

export const env = parsed.data;
