import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatINR,
  formatDate,
  formatNumber,
  parseProductionStage,
} from '../src/lib/formatters.js';
import { PRODUCTION_STAGES } from '../src/lib/constants.js';

test('Formatters: Null-safe formatting per frontend rules', async (t) => {
  await t.test('formatINR: returns em-dash for null, undefined, or NaN', () => {
    assert.equal(formatINR(null), '—');
    assert.equal(formatINR(undefined), '—');
    assert.equal(formatINR('invalid'), '—');
  });

  await t.test('formatINR: formats valid numbers into INR currency', () => {
    const formatted = formatINR(399);
    assert.ok(formatted.includes('399'), `Expected currency output containing 399, got ${formatted}`);
  });

  await t.test('formatDate: returns em-dash for null, undefined, or invalid dates', () => {
    assert.equal(formatDate(null), '—');
    assert.equal(formatDate(undefined), '—');
    assert.equal(formatDate(''), '—');
  });

  await t.test('formatDate: formats valid dates', () => {
    const formatted = formatDate('2023-06-20');
    assert.ok(formatted.includes('2023'), `Expected year 2023 in ${formatted}`);
  });

  await t.test('formatNumber: formats numbers with fallback', () => {
    assert.equal(formatNumber(null), '0');
    assert.equal(formatNumber(1567), '1,567');
  });
});

test('ProductionStage parser: extracts stage from status strings', async (t) => {
  await t.test('parses "In Production - Cover Design" to "Cover Design"', () => {
    const stage = parseProductionStage('In Production - Cover Design');
    assert.equal(stage, 'Cover Design');
    assert.ok(PRODUCTION_STAGES.includes(stage));
  });

  await t.test('parses "In Production - Proofreading" to "Proofreading"', () => {
    const stage = parseProductionStage('In Production - Proofreading');
    assert.equal(stage, 'Proofreading');
  });

  await t.test('parses exact match "Typesetting"', () => {
    const stage = parseProductionStage('Typesetting');
    assert.equal(stage, 'Typesetting');
  });

  await t.test('falls back gracefully to first stage on unparseable string', () => {
    const stage = parseProductionStage('Unknown Status');
    assert.equal(stage, 'Manuscript Received');
  });
});

test('Book Card Business Logic Edge Cases', async (t) => {
  await t.test('In-production book has null publicationDate and in-production status', () => {
    const book = {
      title: 'Midnight in Mysore',
      status: 'In Production - Cover Design',
      publicationDate: null,
      mrp: null,
    };
    const isInProduction = Boolean(book.status.toLowerCase().includes('in production')) || book.publicationDate === null;
    assert.equal(isInProduction, true);
  });

  await t.test('Never paid condition: paid = 0 and no lastPayoutDate', () => {
    const bookNeverPaid = { royaltyPaid: 0, lastPayoutDate: null };
    const isNeverPaid = bookNeverPaid.royaltyPaid === 0 && !bookNeverPaid.lastPayoutDate;
    assert.equal(isNeverPaid, true);

    const bookPaid = { royaltyPaid: 5000, lastPayoutDate: '2025-10-15' };
    assert.equal(bookPaid.royaltyPaid === 0 && !bookPaid.lastPayoutDate, false);
  });

  await t.test('Fully paid condition: pending = 0 and paid > 0', () => {
    const bookFullyPaid = { royaltyPending: 0, royaltyPaid: 7938 };
    const isFullyPaid = bookFullyPaid.royaltyPending === 0 && bookFullyPaid.royaltyPaid > 0;
    assert.equal(isFullyPaid, true);

    const bookPending = { royaltyPending: 3570, royaltyPaid: 8400 };
    assert.equal(bookPending.royaltyPending === 0 && bookPending.royaltyPaid > 0, false);
  });
});
