import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  seq: {
    type: Number,
    default: 0,
  },
});

/**
 * Atomically increments and returns the next sequence number.
 * Utilizes findByIdAndUpdate to guarantee race-condition-free unique sequential numbering.
 *
 * @param {string} sequenceName - Identifier for the counter sequence
 * @returns {Promise<number>} Next sequence number
 */
counterSchema.statics.getNextSequence = async function (sequenceName) {
  const counter = await this.findByIdAndUpdate(
    sequenceName,
    { $inc: { seq: 1 } },
    { returnDocument: 'after', upsert: true }
  );
  return counter.seq;
};

export const Counter = mongoose.model('Counter', counterSchema);
