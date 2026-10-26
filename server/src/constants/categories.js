/**
 * Support ticket categories with author-facing labels.
 * Used for ticket categorization, routing, and AI classifier knowledge-base segmenting.
 */
export const CATEGORIES = Object.freeze({
  ROYALTY: 'royalty',
  ISBN: 'isbn',
  PRINTING: 'printing',
  DISTRIBUTION: 'distribution',
  PRODUCTION: 'production',
  GENERAL: 'general',
});

export const CATEGORY_VALUES = Object.freeze(Object.values(CATEGORIES));

export const CATEGORY_LABELS = Object.freeze({
  [CATEGORIES.ROYALTY]: 'Royalty & Payouts',
  [CATEGORIES.ISBN]: 'ISBN & Copyright',
  [CATEGORIES.PRINTING]: 'Printing & Quality',
  [CATEGORIES.DISTRIBUTION]: 'Distribution & Availability',
  [CATEGORIES.PRODUCTION]: 'Book Production & Design',
  [CATEGORIES.GENERAL]: 'General Inquiry',
});

export const CATEGORY_DEFINITIONS = Object.freeze(
  CATEGORY_VALUES.map((value) => ({
    value,
    label: CATEGORY_LABELS[value],
  }))
);
