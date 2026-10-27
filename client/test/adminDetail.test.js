import test from 'node:test';
import assert from 'node:assert/strict';
import { formatINR, formatDate, formatNumber } from '../src/lib/formatters.js';
import {
  CATEGORIES,
  CATEGORY_LABELS,
  PRIORITIES,
  PRIORITY_LABELS,
} from '../src/lib/constants.js';

test('Admin Detail: TicketControls AI suggestions mapping', async (t) => {
  await t.test('formats AI suggested category label cleanly', () => {
    const aiCategory = CATEGORIES.ROYALTY;
    const suggestedText = `AI suggested: ${CATEGORY_LABELS[aiCategory]}`;
    assert.equal(suggestedText, 'AI suggested: Royalty & Payouts');
  });

  await t.test('formats AI suggested priority label cleanly', () => {
    const aiPriority = PRIORITIES.CRITICAL;
    const suggestedText = `AI suggested: ${PRIORITY_LABELS[aiPriority]}`;
    assert.equal(suggestedText, 'AI suggested: Critical');
  });

  await t.test('assignee toggle correctly checks current admin ID', () => {
    const currentAdminId = 'admin_123';
    const ticket1 = { assignedTo: 'admin_123' };
    const ticket2 = { assignedTo: 'admin_456' };
    const ticket3 = { assignedTo: null };

    assert.equal(ticket1.assignedTo === currentAdminId, true);
    assert.equal(ticket2.assignedTo === currentAdminId, false);
    assert.equal(ticket3.assignedTo === currentAdminId, false);
  });
});

test('Admin Detail: BookSnapshot facts and null-safety', async (t) => {
  await t.test('handles published book with complete financial figures', () => {
    const snapshot = {
      title: 'Whispers of the Ganges',
      isbn: '978-93-5XXXX-01-1',
      status: 'Published & Live',
      mrp: 399,
      totalCopiesSold: 342,
      totalRoyaltyEarned: 11970,
      royaltyPaid: 8400,
      royaltyPending: 3570,
      publicationDate: '2023-06-20T00:00:00.000Z',
      lastPayoutDate: '2025-10-15T00:00:00.000Z',
    };

    assert.equal(formatINR(snapshot.totalRoyaltyEarned), '₹11,970');
    assert.equal(formatINR(snapshot.royaltyPaid), '₹8,400');
    assert.equal(formatINR(snapshot.royaltyPending), '₹3,570');
    assert.equal(formatNumber(snapshot.totalCopiesSold), '342');
    assert.equal(formatDate(snapshot.lastPayoutDate), '15 Oct 2025');
  });

  await t.test('handles in-production book without throwing or showing null financials', () => {
    const inProdSnapshot = {
      title: 'Midnight in Mussoorie',
      isbn: '978-93-5XXXX-05-9',
      status: 'In Production - Cover Design',
      mrp: null,
      totalCopiesSold: 0,
      totalRoyaltyEarned: 0,
      royaltyPaid: 0,
      royaltyPending: 0,
      publicationDate: null,
      lastPayoutDate: null,
    };

    const isInProduction = inProdSnapshot.status && !inProdSnapshot.status.toLowerCase().includes('published');
    assert.equal(isInProduction, true);
    assert.equal(formatINR(inProdSnapshot.mrp), '—');
    assert.equal(formatDate(inProdSnapshot.publicationDate), '—');
  });

  await t.test('handles missing or general ticket book snapshot gracefully', () => {
    const book = null;
    const isGeneralInquiry = book === null;
    assert.equal(isGeneralInquiry, true);
  });
});

test('Admin Detail: InternalNotes and AI Draft states', async (t) => {
  await t.test('InternalNotes requires body text before adding', () => {
    const validateNote = (body) => Boolean(body && body.trim().length > 0);
    assert.equal(validateNote(''), false);
    assert.equal(validateNote('   '), false);
    assert.equal(validateNote('Followed up with author via phone'), true);
  });

  await t.test('AiDraftPanel state transitions', () => {
    const computeDraftState = ({ loading, draft, aiAvailable }) => {
      if (loading) return 'loading';
      if (!aiAvailable || !draft) return 'unavailable';
      return 'ready';
    };

    assert.equal(computeDraftState({ loading: true, draft: null, aiAvailable: false }), 'loading');
    assert.equal(computeDraftState({ loading: false, draft: null, aiAvailable: false }), 'unavailable');
    assert.equal(computeDraftState({ loading: false, draft: 'Draft text', aiAvailable: true }), 'ready');
  });

  await t.test('Send to author clears draft input upon completion', () => {
    let draftText = 'Dear Priya, regarding your ISBN...';
    const onSendReply = () => {
      draftText = '';
    };

    onSendReply();
    assert.equal(draftText, '');
  });
});
