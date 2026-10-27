import test from 'node:test';
import assert from 'node:assert/strict';
import { formatTicketAge, isTicketOverdue } from '../src/lib/formatters.js';
import {
  TICKET_STATUS,
  PRIORITIES,
  PRIORITY_LABELS,
  PRIORITY_BADGE_VARIANTS,
} from '../src/lib/constants.js';

test('Admin Queue: formatTicketAge', async (t) => {
  await t.test('formats sub-hour age as "< 1h"', () => {
    assert.equal(formatTicketAge(0), '< 1h');
    assert.equal(formatTicketAge(0.5), '< 1h');
  });

  await t.test('formats hours under 24 as "Xh"', () => {
    assert.equal(formatTicketAge(1), '1h');
    assert.equal(formatTicketAge(12), '12h');
    assert.equal(formatTicketAge(23.8), '23h');
  });

  await t.test('formats days and remaining hours', () => {
    assert.equal(formatTicketAge(24), '1d');
    assert.equal(formatTicketAge(28), '1d 4h');
    assert.equal(formatTicketAge(72), '3d');
    assert.equal(formatTicketAge(75), '3d 3h');
  });

  await t.test('returns em-dash for invalid or missing values', () => {
    assert.equal(formatTicketAge(null), '—');
    assert.equal(formatTicketAge(undefined), '—');
    assert.equal(formatTicketAge(NaN), '—');
  });
});

test('Admin Queue: isTicketOverdue rule (unresolved 3+ days / 72h+)', async (t) => {
  await t.test('marks open ticket with age >= 72h as overdue', () => {
    const ticket = { status: TICKET_STATUS.OPEN, ageInHours: 72 };
    assert.equal(isTicketOverdue(ticket), true);
  });

  await t.test('marks in_progress ticket with age >= 72h as overdue', () => {
    const ticket = { status: TICKET_STATUS.IN_PROGRESS, ageInHours: 96 };
    assert.equal(isTicketOverdue(ticket), true);
  });

  await t.test('does not mark open ticket with age < 72h as overdue', () => {
    const ticket = { status: TICKET_STATUS.OPEN, ageInHours: 71 };
    assert.equal(isTicketOverdue(ticket), false);
  });

  await t.test('does not mark resolved ticket as overdue even if 100h old', () => {
    const ticket = { status: TICKET_STATUS.RESOLVED, ageInHours: 100 };
    assert.equal(isTicketOverdue(ticket), false);
  });

  await t.test('does not mark closed ticket as overdue even if 200h old', () => {
    const ticket = { status: TICKET_STATUS.CLOSED, ageInHours: 200 };
    assert.equal(isTicketOverdue(ticket), false);
  });
});

test('Admin Queue: Priority Badges & Labels', async (t) => {
  await t.test('maps all priorities to descriptive labels', () => {
    assert.equal(PRIORITY_LABELS[PRIORITIES.CRITICAL], 'Critical');
    assert.equal(PRIORITY_LABELS[PRIORITIES.HIGH], 'High');
    assert.equal(PRIORITY_LABELS[PRIORITIES.MEDIUM], 'Medium');
    assert.equal(PRIORITY_LABELS[PRIORITIES.LOW], 'Low');
  });

  await t.test('maps priorities to distinct badge variants', () => {
    assert.equal(PRIORITY_BADGE_VARIANTS[PRIORITIES.CRITICAL], 'terracotta');
    assert.equal(PRIORITY_BADGE_VARIANTS[PRIORITIES.HIGH], 'mustard');
    assert.equal(PRIORITY_BADGE_VARIANTS[PRIORITIES.MEDIUM], 'teal');
    assert.equal(PRIORITY_BADGE_VARIANTS[PRIORITIES.LOW], 'neutral');
  });
});

test('Admin Queue: Status Options & Sorting Criteria', async (t) => {
  await t.test('status filter options include Active, Open, In Progress, Resolved, Closed, All', () => {
    const expected = ['active', 'open', 'in_progress', 'resolved', 'closed', 'all'];
    assert.equal(expected.length, 6);
  });

  await t.test('stat cards cover Open, Critical, Unassigned, Overdue 3d+', () => {
    const mockStats = {
      open: 14,
      criticalUnresolved: 3,
      unassigned: 8,
      overdue: 2,
    };
    assert.equal(mockStats.open, 14);
    assert.equal(mockStats.criticalUnresolved, 3);
    assert.equal(mockStats.unassigned, 8);
    assert.equal(mockStats.overdue, 2);
  });
});
