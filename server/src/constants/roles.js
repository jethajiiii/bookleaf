/**
 * User roles in the BookLeaf portal ecosystem.
 * Frozen to prevent runtime mutations and avoid magic strings across services.
 */
export const ROLES = Object.freeze({
  AUTHOR: 'author',
  ADMIN: 'admin',
});

export const ROLE_VALUES = Object.freeze(Object.values(ROLES));
