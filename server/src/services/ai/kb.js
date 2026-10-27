/**
 * BookLeaf Knowledge Base — structured per support category.
 * Text sourced ONLY from the assignment KB. No invented policies, numbers, or dates.
 */

export const COMPANY_OVERVIEW = `BookLeaf Publishing is a self-publishing company operating in India and the US.
We offer two publishing packages:
- Standard Free: no upfront cost.
- Bestseller Breakthrough: premium paid package with marketing and distribution add-ons.
We handle cover design, typesetting, ISBN assignment, printing, distribution, and royalty management for authors.
Our in-house printing facility and warehouse are located in Delhi. Print partners include Repro India and Epitome Books.`;

export const TONE_GUIDELINES = `Communication guidelines:
- Always empathetic and professional. Authors are our partners, not customers to be managed.
- Acknowledge the author's concern before jumping to solutions.
- Be specific: include actual numbers, dates, and statuses wherever possible rather than vague reassurances.
- If something is BookLeaf's fault (delayed royalties, ISBN error), own it directly. No corporate deflection.
- If the issue requires escalation or investigation, give a clear timeline ("Our team will look into this and get back to you within 48 hours") rather than open-ended promises.
- Always end with a clear next step for the author and/or the BookLeaf team.`;

/**
 * Per-category knowledge base sections.
 * Keys match CATEGORIES constant values.
 */
export const KB = Object.freeze({
  royalty: `Royalty Policy:
- BookLeaf follows an 80/20 royalty split: 80% of the net profit per book goes to the author, 20% to BookLeaf.
- Net profit = MRP minus printing cost, platform commission (Amazon/Flipkart), and shipping charges.
- Royalties are calculated quarterly and paid within 45 days of the quarter ending.
- Minimum payout threshold: ₹1,000. If accumulated royalties are below this, they roll over to the next quarter.
- Payouts are made via bank transfer to the account linked in the author's dashboard.
- Authors can view a detailed royalty breakdown in their dashboard, showing sales figures per platform.`,

  isbn: `ISBN Policy:
- Every book published through BookLeaf receives a unique ISBN assigned by BookLeaf.
- ISBNs are registered under BookLeaf's publisher imprint.
- If an author wants an ISBN under their own imprint, they need to obtain it independently.
- If an author reports an ISBN error (duplicate, wrong book linked), it is treated as a high-priority issue and escalated to the production team.`,

  printing: `Printing & Quality Policy:
- In-house printing handles most orders. Overflow or specific format requirements go to Repro India or Epitome Books.
- Standard print turnaround: 5-7 business days from order confirmation.
- If an author reports a quality issue (misprints, binding defects, color inconsistency), BookLeaf arranges a free reprint after verification.
- The author may need to share photos of the defective copy for verification.`,

  distribution: `Distribution & Availability Policy:
- Books are listed on Amazon India, Flipkart, Amazon US, Amazon UK, and the BookLeaf Store.
- New listings typically go live within 7-10 business days after publication is complete.
- If a book is showing as unavailable on a platform, it usually indicates a stock sync issue.
- BookLeaf's team can trigger a re-sync within 24-48 hours.`,

  production: `Production Stages:
Manuscript Received -> Editing (if opted) -> Cover Design -> Typesetting -> Proofreading -> ISBN Assignment -> Printing -> Distribution Setup -> Published & Live.
- Authors are updated at each stage via email.
- Delays typically happen at Cover Design (waiting for author approval) and Proofreading (revision rounds).
- For in-production books: state the current stage from the facts, mention typical delay causes collaboratively without blaming the author, and promise a follow-up within 48 hours. Never invent completion dates.`,

  general: `General Inquiries:
- BookLeaf offers Standard Free and Bestseller Breakthrough publishing packages.
- Metadata updates (book description, editorial reviews) can be submitted through the author dashboard or by emailing the BookLeaf team.
- Metadata changes typically reflect on platforms (Amazon, Flipkart, etc.) within 3-5 business days.
- For ISBN assignment, cover design, typesetting, printing, and distribution, refer to the relevant policy sections.`,
});

/**
 * One-shot few-shot examples per category, derived strictly from the Sample Query -> Response table.
 * Placeholders like {authorFirstName} and {nextPayoutDate} are filled at runtime by buildDraftInput.
 */
export const FEW_SHOT = Object.freeze({
  royalty: {
    query: `I published my book 4 months ago and still haven't received any royalty. What's going on?`,
    reply: `Dear {authorFirstName},

Thank you for reaching out. I completely understand your concern — waiting on royalties you've earned is frustrating, and I want to give you a clear picture.

BookLeaf calculates royalties quarterly and releases payments within 45 days of the quarter ending. Your next scheduled payout date is {nextPayoutDate}. Please also confirm that your bank account details are correctly linked in your dashboard, as payments are processed via bank transfer.

If the payment is genuinely overdue beyond that date, our finance team will investigate and resolve it within 48 hours. Please reply here if you do not see the transfer by {nextPayoutDate} and we will escalate immediately.

Team BookLeaf`,
  },

  isbn: {
    query: `My book is showing a different ISBN on Amazon than what's on the physical copy.`,
    reply: `Dear {authorFirstName},

Thank you for flagging this — an ISBN mismatch between your physical copy and the Amazon listing is a serious data issue, and I want to assure you we are treating it with urgency.

I have escalated this to our production team immediately. They will investigate the root cause (whether it stems from a catalogue mapping error or a metadata sync issue with Amazon) and resolve it. You can expect an update from us within 48 hours.

We apologise for the disruption this may have caused. We will keep you informed every step of the way.

Team BookLeaf`,
  },

  printing: {
    query: `I received my author copies and the print quality is terrible. The images are blurry and pages are misaligned.`,
    reply: `Dear {authorFirstName},

I am truly sorry to hear that your author copies arrived with print quality issues. This is not the standard we hold ourselves to, and I sincerely apologise.

Could you please share photos of the defective copies (showing the blurry images and misaligned pages)? Once we verify the defect, BookLeaf will arrange a free reprint at no cost to you. The reprinted copies typically ship within 5-7 business days of verification.

Please send the photos in your next reply and we will get this moving right away.

Team BookLeaf`,
  },

  distribution: {
    query: `My book is published but it's showing as 'Currently Unavailable' on Amazon.`,
    reply: `Dear {authorFirstName},

Thank you for letting us know. A "Currently Unavailable" status on Amazon is almost always caused by a stock sync issue between our distribution system and the platform — it does not mean your book has been delisted.

I have already flagged this with our distribution team to trigger a re-sync. The listing should reflect the correct availability status within 24-48 hours. If it is still unavailable after that window, please reply here and we will escalate directly with Amazon.

Team BookLeaf`,
  },

  production: {
    query: `It's been 3 weeks and my book is still in typesetting. When will it be done?`,
    reply: `Dear {authorFirstName},

Thank you for checking in. Your book is currently at the {currentStage} stage. I want to be transparent with you about where things stand.

Delays at this stage can sometimes occur due to revision rounds or approval steps — we want to make sure everything meets your expectations before moving forward. Rather than give you a date I am not certain of, I would like our production team to give you a confirmed updated timeline.

Our team will review your file and get back to you with a specific update within 48 hours. We appreciate your patience and are committed to keeping you informed.

Team BookLeaf`,
  },

  general: {
    query: `Can I update the description of my book on Amazon after it's already live?`,
    reply: `Dear {authorFirstName},

Yes, absolutely — you can update your book's description and metadata even after it is live on Amazon and other platforms.

To request an update, simply submit the revised description through your author dashboard or email it to our support team. Metadata changes typically reflect on platforms like Amazon and Flipkart within 3-5 business days.

Please send over the updated description whenever you're ready and we will process it right away.

Team BookLeaf`,
  },
});
