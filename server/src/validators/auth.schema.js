import { z } from 'zod';

/**
 * Validation schema for user authentication.
 * Validates request payload before reaching auth controller.
 */
export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .email('Invalid email address')
      .trim()
      .toLowerCase(),
    password: z
      .string({ required_error: 'Password is required' })
      .min(1, 'Password cannot be empty'),
  }),
});
