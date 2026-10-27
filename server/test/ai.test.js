import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { getBookFacts, pickFactsForCategory } from '../src/services/ai/bookFacts.js';
import { classifyFallback } from '../src/services/ai/fallback.js';
import { CATEGORIES } from '../src/constants/categories.js';
import { PRIORITIES } from '../src/constants/priorities.js';

describe('bookFacts: nextPayoutDeadline', () => {
  const dummyBook = {
    title: 'Dummy Title',
    status: 'Published & Live',
    publicationDate: new Date('2024-01-01'),
  };

  test('now 2026-10-26: nextPayoutDeadline = 2026-11-14', () => {
    const facts = getBookFacts(dummyBook, new Date('2026-10-26T10:00:00Z'));
    assert.strictEqual(facts.nextPayoutDeadline, '2026-11-14');
  });

  test('now 2026-10-27: nextPayoutDeadline = 2026-11-14', () => {
    const facts = getBookFacts(dummyBook, new Date('2026-10-27T10:00:00Z'));
    assert.strictEqual(facts.nextPayoutDeadline, '2026-11-14');
  });

  test('now 2026-11-20: nextPayoutDeadline = 2027-02-14', () => {
    const facts = getBookFacts(dummyBook, new Date('2026-11-20T10:00:00Z'));
    assert.strictEqual(facts.nextPayoutDeadline, '2027-02-14');
  });
});

describe('bookFacts: sample books calculation', () => {
  const fixedNow = new Date('2026-10-27T10:00:00Z');

  test('BK005 (pending 2546, never paid, published 2024-07-05): payoutOverdue true, paidLabel "No payout yet"', () => {
    const bk005 = {
      title: 'Between Two Temples',
      status: 'Published & Live',
      publicationDate: new Date('2024-07-05'),
      royaltyPending: 2546,
      royaltyPaid: 0,
      lastPayoutDate: null,
      totalRoyaltyEarned: 2546,
    };
    const facts = getBookFacts(bk005, fixedNow);
    assert.strictEqual(facts.payoutOverdue, true);
    assert.strictEqual(facts.paidLabel, 'No payout yet');
    assert.strictEqual(facts.pending, 2546);
  });

  test('BK016 (pending 850, never paid): belowPayoutThreshold true, payoutOverdue false', () => {
    const bk016 = {
      title: 'The Nagpur Notebooks',
      status: 'Published & Live',
      publicationDate: new Date('2024-11-05'),
      royaltyPending: 850,
      royaltyPaid: 0,
      lastPayoutDate: null,
      totalRoyaltyEarned: 850,
    };
    const facts = getBookFacts(bk016, fixedNow);
    assert.strictEqual(facts.belowPayoutThreshold, true);
    assert.strictEqual(facts.payoutOverdue, false);
  });

  test('BK002 (pending 0, paid 7938): fullyPaid true', () => {
    const bk002 = {
      title: 'The Saffron Diaries',
      status: 'Published & Live',
      publicationDate: new Date('2024-01-10'),
      royaltyPending: 0,
      royaltyPaid: 7938,
      lastPayoutDate: new Date('2025-12-01'),
      totalRoyaltyEarned: 7938,
    };
    const facts = getBookFacts(bk002, fixedNow);
    assert.strictEqual(facts.fullyPaid, true);
    assert.strictEqual(facts.payoutOverdue, false);
  });

  test('BK013: output contains no mrp, no sales numbers, currentStage "Cover Design"', () => {
    const bk013 = {
      title: 'Midnight in Mysore',
      status: 'In Production - Cover Design',
      publicationDate: null,
      mrp: null,
      totalCopiesSold: 0,
    };
    const facts = getBookFacts(bk013, fixedNow);
    assert.strictEqual(facts.currentStage, 'Cover Design');
    assert.strictEqual('mrp' in facts, false);
    assert.strictEqual('totalCopiesSold' in facts, false);
    assert.strictEqual('earned' in facts, false);
    assert.strictEqual('paid' in facts, false);
    assert.ok(facts.note.includes('in production'));
  });
});

describe('fallback: keyword classifier rules in order', () => {
  test('1. isbn keyword -> ISBN / HIGH', () => {
    const res = classifyFallback({ subject: 'Mismatch in ISBN', description: 'Amazon shows wrong number' });
    assert.strictEqual(res.category, CATEGORIES.ISBN);
    assert.strictEqual(res.priority, PRIORITIES.HIGH);
  });

  test('2. royalt|payout|payment -> ROYALTY / MEDIUM', () => {
    const res = classifyFallback({ subject: 'Where is my payout?', description: 'Royalty payment pending' });
    assert.strictEqual(res.category, CATEGORIES.ROYALTY);
    assert.strictEqual(res.priority, PRIORITIES.MEDIUM);
  });

  test('3. print|binding|misprint|quality -> PRINTING / MEDIUM', () => {
    const res = classifyFallback({ subject: 'Terrible print quality', description: 'Pages have misprint and binding issue' });
    assert.strictEqual(res.category, CATEGORIES.PRINTING);
    assert.strictEqual(res.priority, PRIORITIES.MEDIUM);
  });

  test('4. unavailable|listing|amazon|flipkart -> DISTRIBUTION / MEDIUM', () => {
    const res = classifyFallback({ subject: 'Listing unavailable', description: 'Book is not found on flipkart store' });
    assert.strictEqual(res.category, CATEGORIES.DISTRIBUTION);
    assert.strictEqual(res.priority, PRIORITIES.MEDIUM);
  });

  test('5. status|typeset|cover|proof|stage -> PRODUCTION / MEDIUM', () => {
    const res = classifyFallback({ subject: 'Typeset stage query', description: 'What is the current proof status?' });
    assert.strictEqual(res.category, CATEGORIES.PRODUCTION);
    assert.strictEqual(res.priority, PRIORITIES.MEDIUM);
  });

  test('6. default rule -> GENERAL / LOW', () => {
    const res = classifyFallback({ subject: 'Hello team', description: 'Just wanted to say thanks' });
    assert.strictEqual(res.category, CATEGORIES.GENERAL);
    assert.strictEqual(res.priority, PRIORITIES.LOW);
  });
});

describe('bookFacts: pickFactsForCategory projection', () => {
  test('null facts returns null', () => {
    assert.strictEqual(pickFactsForCategory(null, 'royalty'), null);
  });

  test('picks only relevant fields for ROYALTY', () => {
    const facts = {
      title: 'T', earned: 10, paid: 5, pending: 5, paidLabel: '₹5',
      fullyPaid: false, belowPayoutThreshold: true, nextPayoutDeadline: '2026-11-14',
      payoutOverdue: false, lastPayoutDate: null, isbn: '123',
    };
    const picked = pickFactsForCategory(facts, 'ROYALTY');
    assert.strictEqual('isbn' in picked, false);
    assert.strictEqual(picked.title, 'T');
    assert.strictEqual(picked.pending, 5);
  });
});
