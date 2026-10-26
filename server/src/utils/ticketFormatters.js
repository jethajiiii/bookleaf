/**
 * Pure formatting and serialization helpers for ticket views.
 */

export const calculateAgeInHours = (date) =>
  Math.floor(Math.max(0, (Date.now() - new Date(date).getTime()) / (1000 * 60 * 60)));

export const buildBookSnapshot = (book) => {
  if (!book) return null;
  return {
    _id: book._id,
    bookCode: book.bookCode,
    title: book.title,
    isbn: book.isbn ?? null,
    genre: book.genre ?? null,
    publicationDate: book.publicationDate ?? null,
    status: book.status ?? null,
    mrp: book.mrp ?? null,
    royaltyPerCopy: book.royaltyPerCopy ?? null,
    totalCopiesSold: book.totalCopiesSold ?? 0,
    totalRoyaltyEarned: book.totalRoyaltyEarned ?? 0,
    royaltyPaid: book.royaltyPaid ?? 0,
    royaltyPending: book.royaltyPending ?? 0,
    lastPayoutDate: book.lastPayoutDate ?? null,
    printPartner: book.printPartner ?? null,
    availableOn: book.availableOn ?? [],
  };
};
