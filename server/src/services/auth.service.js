import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * Authenticates user credentials and issues a signed JSON Web Token.
 * Throws identical 401 errors for non-existent emails or incorrect passwords
 * to mitigate user enumeration vulnerabilities.
 *
 * @param {Object} credentials
 * @param {string} credentials.email
 * @param {string} credentials.password
 * @returns {Promise<{token: string, user: Object}>}
 */
export const login = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+passwordHash');

  if (!user) {
    throw ApiError.unauthorized('Invalid email or password', 'INVALID_CREDENTIALS');
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw ApiError.unauthorized('Invalid email or password', 'INVALID_CREDENTIALS');
  }

  const payload = {
    id: user._id.toString(),
    role: user.role,
    name: user.name,
  };

  const token = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      authorCode: user.authorCode,
      phone: user.phone,
      city: user.city,
      joinedDate: user.joinedDate,
    },
  };
};

/**
 * Retrieves the profile information for an authenticated user.
 *
 * @param {string} userId - User identifier
 * @returns {Promise<Object>} Safe user profile without credentials
 */
export const getProfile = async (userId) => {
  const user = await User.findById(userId).select('-passwordHash').lean();

  if (!user) {
    throw ApiError.notFound('User profile not found');
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    authorCode: user.authorCode,
    phone: user.phone,
    city: user.city,
    joinedDate: user.joinedDate,
    createdAt: user.createdAt,
  };
};
