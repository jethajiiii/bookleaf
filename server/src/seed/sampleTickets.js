import { ROLES } from '../constants/roles.js';
import { TICKET_STATUS } from '../constants/ticketStatus.js';
import { CATEGORIES } from '../constants/categories.js';
import { PRIORITIES } from '../constants/priorities.js';
import { AI_STATUS } from '../constants/aiStatus.js';

/**
 * Builds the 6 realistic tickets specified in prompt:
 * 1. Ananya Reddy, BK005: CRITICAL royalty, "no royalty since publication in July 2024", status open.
 * 2. Kavita Deshmukh, BK016: MEDIUM royalty, "pending royalty seems unpaid", status in_progress with one admin reply.
 * 3. Priya Sharma, BK001: HIGH ISBN, "different ISBN on Amazon than the physical copy", with an internal note.
 * 4. Sneha Kulkarni, BK013: MEDIUM production, "when will Midnight in Mysore be done", open.
 * 5. Rohit Kapoor, BK003: MEDIUM printing, blurry images / misaligned pages, status resolved with admin reply.
 * 6. Meera Nair, General (no book): LOW general, "can I update my book description on Amazon", open.
 */
export const buildSampleTickets = ({ authorsMap, booksMap, adminUser, opsUser }) => {
  const ananya = authorsMap['AUTH003'];
  const kavita = authorsMap['AUTH009'];
  const priya = authorsMap['AUTH001'];
  const sneha = authorsMap['AUTH007'];
  const rohit = authorsMap['AUTH002'];
  const meera = authorsMap['AUTH005'];

  return [
    // 1. Ananya Reddy, BK005: CRITICAL royalty, status open
    {
      author: ananya._id,
      book: booksMap['BK005']._id,
      subject: 'no royalty since publication in July 2024',
      description:
        'My book Between Two Temples was published in July 2024 with 67 copies sold and pending royalty of ₹2,546. I have received zero royalty since publication. Please look into this urgently.',
      status: TICKET_STATUS.OPEN,
      category: CATEGORIES.ROYALTY,
      priority: PRIORITIES.CRITICAL,
      assignedTo: adminUser._id,
      messages: [
        {
          sender: ROLES.AUTHOR,
          senderName: ananya.name,
          body: 'My book was published in July 2024 with 67 copies sold and pending royalty of ₹2,546. I have received zero royalty since publication.',
        },
      ],
      ai: {
        category: CATEGORIES.ROYALTY,
        priority: PRIORITIES.CRITICAL,
        reason: 'Zero royalty payout recorded since publication over 6 months ago despite earned balance.',
        status: AI_STATUS.DONE,
        draft:
          'Dear Ananya, We apologize for the delay. We are escalating your account to our finance team to release the accrued royalty of ₹2,546 for Between Two Temples.',
        draftGeneratedAt: new Date(),
      },
    },

    // 2. Kavita Deshmukh, BK016: MEDIUM royalty, status in_progress with one admin reply
    {
      author: kavita._id,
      book: booksMap['BK016']._id,
      subject: 'pending royalty seems unpaid',
      description:
        'The portal shows pending royalty of ₹450 for The Nagpur Notebooks, but no payout was transferred this cycle.',
      status: TICKET_STATUS.IN_PROGRESS,
      category: CATEGORIES.ROYALTY,
      priority: PRIORITIES.MEDIUM,
      assignedTo: opsUser._id,
      messages: [
        {
          sender: ROLES.AUTHOR,
          senderName: kavita.name,
          body: 'The portal shows pending royalty of ₹450 for The Nagpur Notebooks, but no payout was transferred this cycle.',
          createdAt: new Date(Date.now() - 3600000 * 24),
        },
        {
          sender: ROLES.ADMIN,
          senderName: opsUser.name,
          body: 'Hello Kavita, Payouts are triggered once accrued earnings reach the minimum threshold of ₹1,000. Your current balance of ₹450 will roll over to the next cycle.',
          createdAt: new Date(Date.now() - 3600000 * 4),
        },
      ],
      ai: {
        category: CATEGORIES.ROYALTY,
        priority: PRIORITIES.MEDIUM,
        reason: 'Inquiry regarding unpaid royalty balance below the ₹1,000 threshold.',
        status: AI_STATUS.DONE,
        draft:
          'Dear Kavita, Royalties are disbursed quarterly once the accumulated balance crosses the ₹1,000 threshold. Your balance of ₹450 remains safe and will roll forward.',
        draftGeneratedAt: new Date(Date.now() - 3600000 * 20),
      },
    },

    // 3. Priya Sharma, BK001: HIGH ISBN, with an internal note
    {
      author: priya._id,
      book: booksMap['BK001']._id,
      subject: 'different ISBN on Amazon than the physical copy',
      description:
        'I noticed the ISBN listed on the Amazon product page does not match the ISBN printed on the physical copy of Whispers of the Ganges.',
      status: TICKET_STATUS.OPEN,
      category: CATEGORIES.ISBN,
      priority: PRIORITIES.HIGH,
      assignedTo: adminUser._id,
      messages: [
        {
          sender: ROLES.AUTHOR,
          senderName: priya.name,
          body: 'I noticed the ISBN listed on the Amazon product page does not match the ISBN printed on the physical copy of Whispers of the Ganges.',
        },
      ],
      internalNotes: [
        {
          admin: adminUser._id,
          adminName: adminUser.name,
          body: 'Cataloging team confirmed Amazon ASIN was mapped to an older paperback draft ISBN. Ticket raised with Amazon catalog support.',
          createdAt: new Date(),
        },
      ],
      ai: {
        category: CATEGORIES.ISBN,
        priority: PRIORITIES.HIGH,
        reason: 'Listing metadata mismatch on external sales channel can impede fulfillment.',
        status: AI_STATUS.DONE,
        draft:
          'Dear Priya, Thank you for flagging this discrepancy. We are requesting an ASIN-to-ISBN metadata update on Amazon Seller Central.',
        draftGeneratedAt: new Date(),
      },
    },

    // 4. Sneha Kulkarni, BK013: MEDIUM production, open
    {
      author: sneha._id,
      book: booksMap['BK013']._id,
      subject: 'when will Midnight in Mysore be done',
      description:
        'My book Midnight in Mysore has been in Cover Design status for 3 weeks. Could you provide an estimated completion date?',
      status: TICKET_STATUS.OPEN,
      category: CATEGORIES.PRODUCTION,
      priority: PRIORITIES.MEDIUM,
      assignedTo: null,
      messages: [
        {
          sender: ROLES.AUTHOR,
          senderName: sneha.name,
          body: 'My book Midnight in Mysore has been in Cover Design status for 3 weeks. Could you provide an estimated completion date?',
        },
      ],
      ai: {
        category: CATEGORIES.PRODUCTION,
        priority: PRIORITIES.MEDIUM,
        reason: 'Timeline inquiry for title actively progressing in the cover design phase.',
        status: AI_STATUS.DONE,
        draft:
          'Dear Sneha, Midnight in Mysore is scheduled to complete cover proofing by Friday, after which proofing files will be sent to you for sign-off.',
        draftGeneratedAt: new Date(),
      },
    },

    // 5. Rohit Kapoor, BK003: MEDIUM printing, status resolved with admin reply
    {
      author: rohit._id,
      book: booksMap['BK003']._id,
      subject: 'blurry images / misaligned pages',
      description:
        'In the latest author copies of Code & Karma, the architectural diagram images appear blurry and margins are misaligned.',
      status: TICKET_STATUS.RESOLVED,
      category: CATEGORIES.PRINTING,
      priority: PRIORITIES.MEDIUM,
      assignedTo: opsUser._id,
      messages: [
        {
          sender: ROLES.AUTHOR,
          senderName: rohit.name,
          body: 'In the latest author copies of Code & Karma, the architectural diagram images appear blurry and margins are misaligned.',
        },
        {
          sender: ROLES.ADMIN,
          senderName: opsUser.name,
          body: 'Hi Rohit, Our printer recalibrated DPI settings and reprinted 5 replacement copies, which have been couriered to your address.',
        },
      ],
      ai: {
        category: CATEGORIES.PRINTING,
        priority: PRIORITIES.MEDIUM,
        reason: 'Print quality defect reporting DPI resolution and margin alignment issue.',
        status: AI_STATUS.DONE,
        draft:
          'Dear Rohit, We have raised a print defect inquiry with our production facility to reprint your proof copies at 300+ DPI.',
        draftGeneratedAt: new Date(Date.now() - 3600000 * 48),
      },
    },

    // 6. Meera Nair, General (no book): LOW general, open
    {
      author: meera._id,
      book: null,
      subject: 'can I update my book description on Amazon',
      description:
        'I would like to update the promotional blurb and editorial reviews shown on the Amazon listing page.',
      status: TICKET_STATUS.OPEN,
      category: CATEGORIES.GENERAL,
      priority: PRIORITIES.LOW,
      assignedTo: null,
      messages: [
        {
          sender: ROLES.AUTHOR,
          senderName: meera.name,
          body: 'can I update my book description on Amazon?',
        },
      ],
      ai: {
        category: CATEGORIES.GENERAL,
        priority: PRIORITIES.LOW,
        reason: 'General inquiry regarding channel listing description update procedures.',
        status: AI_STATUS.DONE,
        draft:
          'Dear Meera, Yes, you can submit an updated blurb to our support team and we will push the revisions to Amazon within 48 hours.',
        draftGeneratedAt: new Date(),
      },
    },
  ];
};
