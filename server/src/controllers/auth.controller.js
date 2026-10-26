import * as authService from '../services/auth.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Handles user authentication request and returns signed session token.
 */
export const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  res.status(200).json(result);
});

/**
 * Returns current authenticated user profile.
 */
export const getProfile = asyncHandler(async (req, res) => {
  const user = await authService.getProfile(req.user.id);
  res.status(200).json({ user });
});
