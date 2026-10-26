import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
  {
    bookCode: {
      type: String,
      required: [true, 'Book code is required'],
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Book title is required'],
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author user reference is required'],
      index: true,
    },
    authorCode: {
      type: String,
      required: [true, 'Author code is required'],
      index: true,
    },
    isbn: {
      type: String,
      default: null,
      trim: true, // Store plain string without ISBN format checks per requirements
    },
    genre: {
      type: String,
      default: null,
      trim: true,
    },
    publicationDate: {
      type: Date,
      default: null, // Preserved explicitly as null for books in production
    },
    status: {
      type: String,
      required: [true, 'Book status is required'],
      trim: true,
    },
    mrp: {
      type: Number,
      default: null, // Null-safe: must never coerce null to 0
    },
    royaltyPerCopy: {
      type: Number,
      default: null,
    },
    totalCopiesSold: {
      type: Number,
      default: 0,
    },
    totalRoyaltyEarned: {
      type: Number,
      default: 0,
    },
    royaltyPaid: {
      type: Number,
      default: 0,
    },
    royaltyPending: {
      type: Number,
      default: 0,
    },
    lastPayoutDate: {
      type: Date,
      default: null,
    },
    printPartner: {
      type: String,
      default: null,
    },
    availableOn: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Book = mongoose.model('Book', bookSchema);
