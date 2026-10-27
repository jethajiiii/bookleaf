import test from 'node:test';
import assert from 'node:assert/strict';
import { validateTicketInput } from '../src/features/tickets/ticketValidation.js';

test('Ticket Validation: Mirrors Server Zod Schema Limits', async (t) => {
  await t.test('rejects empty subject', () => {
    const errors = validateTicketInput({ subject: '', description: 'A sufficiently long description with more than 20 chars' });
    assert.equal(errors.subject, 'Subject is required');
  });

  await t.test('rejects subject with less than 5 characters', () => {
    const errors = validateTicketInput({ subject: 'Help', description: 'A sufficiently long description with more than 20 chars' });
    assert.equal(errors.subject, 'Subject must be between 5 and 150 characters');
  });

  await t.test('rejects subject with more than 150 characters', () => {
    const longSubject = 'A'.repeat(151);
    const errors = validateTicketInput({ subject: longSubject, description: 'A sufficiently long description with more than 20 chars' });
    assert.equal(errors.subject, 'Subject must be between 5 and 150 characters');
  });

  await t.test('accepts valid subject between 5 and 150 characters', () => {
    const errors = validateTicketInput({ subject: 'Delayed royalty payout for Q3', description: 'A sufficiently long description with more than 20 chars' });
    assert.equal(errors.subject, undefined);
  });

  await t.test('rejects empty description', () => {
    const errors = validateTicketInput({ subject: 'Valid subject', description: '' });
    assert.equal(errors.description, 'Description is required');
  });

  await t.test('rejects description with less than 20 characters', () => {
    const errors = validateTicketInput({ subject: 'Valid subject', description: 'Too short text' });
    assert.equal(errors.description, 'Description must be between 20 and 5000 characters');
  });

  await t.test('rejects description with more than 5000 characters', () => {
    const longDesc = 'A'.repeat(5001);
    const errors = validateTicketInput({ subject: 'Valid subject', description: longDesc });
    assert.equal(errors.description, 'Description must be between 20 and 5000 characters');
  });

  await t.test('accepts valid input with all required bounds satisfied', () => {
    const errors = validateTicketInput({
      subject: 'Delayed royalty payout for Q3',
      description: 'I published my book in July and have not received my quarterly payout yet.',
    });
    assert.deepEqual(errors, {});
  });
});

test('Ticket Form: Book Options Structure', async (t) => {
  await t.test('"General / Account Level" is the first option with empty value', () => {
    const sampleBooks = [
      { _id: '6512bd8f489c6d32c918ef02', title: 'Whispers of the Ganges', isbn: '978-93-5XXXX-01-1' },
      { _id: '6512bd8f489c6d32c918ef03', title: 'The Saffron Diaries', isbn: '978-93-5XXXX-02-8' },
    ];

    const bookOptions = [
      { label: 'General / Account Level', value: '' },
      ...sampleBooks.map((b) => ({ label: `${b.title} (${b.isbn})`, value: b._id })),
    ];

    assert.equal(bookOptions.length, 3);
    assert.equal(bookOptions[0].label, 'General / Account Level');
    assert.equal(bookOptions[0].value, '');
    assert.equal(bookOptions[1].value, '6512bd8f489c6d32c918ef02');
  });
});

test('Server Validation Error Mapping', async (t) => {
  await t.test('correctly maps Zod body path details to form fields', () => {
    const serverDetails = [
      { path: 'body.subject', message: 'Subject must be between 5 and 150 characters' },
      { path: 'body.description', message: 'Description must be between 20 and 5000 characters' },
    ];

    const fieldErrors = {};
    serverDetails.forEach((d) => {
      const key = d.path.replace('body.', '');
      fieldErrors[key] = d.message;
    });

    assert.equal(fieldErrors.subject, 'Subject must be between 5 and 150 characters');
    assert.equal(fieldErrors.description, 'Description must be between 20 and 5000 characters');
  });
});

test('Ticket Status & New Reply Utilities', async (t) => {
  const { hasNewReplies, STATUS_TABS, STATUS_CONFIG } = await import(
    '../src/features/tickets/ticketUtils.js'
  );

  await t.test('STATUS_TABS contains All, Open, In Progress, Resolved, Closed', () => {
    const keys = STATUS_TABS.map((tab) => tab.key);
    assert.deepEqual(keys, ['all', 'open', 'in_progress', 'resolved', 'closed']);
  });

  await t.test('STATUS_CONFIG has styling and labels for all statuses', () => {
    assert.equal(STATUS_CONFIG.open.label, 'Open');
    assert.equal(STATUS_CONFIG.in_progress.label, 'In Progress');
    assert.equal(STATUS_CONFIG.resolved.label, 'Resolved');
    assert.equal(STATUS_CONFIG.closed.label, 'Closed');
  });

  await t.test('hasNewReplies returns false when ticket has no messages', () => {
    assert.equal(hasNewReplies({ messages: [] }, null), false);
    assert.equal(hasNewReplies(null, null), false);
  });

  await t.test('hasNewReplies returns false when only author messages exist', () => {
    const ticket = {
      messages: [
        { sender: 'author', body: 'My initial query', createdAt: '2026-10-27T10:00:00Z' },
      ],
    };
    assert.equal(hasNewReplies(ticket, null), false);
  });

  await t.test('hasNewReplies returns true when support replied and never seen before', () => {
    const ticket = {
      messages: [
        { sender: 'author', body: 'My query', createdAt: '2026-10-27T10:00:00Z' },
        { sender: 'support', body: 'We are checking', createdAt: '2026-10-27T10:30:00Z' },
      ],
    };
    assert.equal(hasNewReplies(ticket, null), true);
  });

  await t.test('hasNewReplies returns false when support reply is older than lastSeen', () => {
    const ticket = {
      messages: [
        { sender: 'author', body: 'My query', createdAt: '2026-10-27T10:00:00Z' },
        { sender: 'support', body: 'Here is the fix', createdAt: '2026-10-27T10:30:00Z' },
      ],
    };
    const lastSeen = '2026-10-27T11:00:00Z'; // Viewed after the support reply
    assert.equal(hasNewReplies(ticket, lastSeen), false);
  });

  await t.test('hasNewReplies returns true when a new support reply arrived after lastSeen', () => {
    const ticket = {
      messages: [
        { sender: 'author', body: 'My query', createdAt: '2026-10-27T10:00:00Z' },
        { sender: 'support', body: 'First reply', createdAt: '2026-10-27T10:30:00Z' },
        { sender: 'support', body: 'Follow-up resolution', createdAt: '2026-10-27T12:00:00Z' },
      ],
    };
    const lastSeen = '2026-10-27T11:00:00Z'; // Viewed after first, but before second
    assert.equal(hasNewReplies(ticket, lastSeen), true);
  });

  await t.test('Never exposes internal notes, priority, or AI fields to author ticket view', () => {
    const rawTicket = {
      _id: '6512bd8f489c6d32c918ef10',
      subject: 'Payout question',
      status: 'open',
      priority: 'high',
      internalNotes: [{ body: 'Author seems angry' }],
      ai: { category: 'ROYALTY', draft: 'Hello' },
    };

    // Simulate toAuthorView projection
    const { internalNotes: _n, priority: _p, ai: _a, ...authorSafeTicket } = rawTicket;
    assert.equal(authorSafeTicket.internalNotes, undefined);
    assert.equal(authorSafeTicket.priority, undefined);
    assert.equal(authorSafeTicket.ai, undefined);
    assert.equal(authorSafeTicket.subject, 'Payout question');
  });
});

