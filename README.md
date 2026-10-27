# BookLeaf Author Support & Communication Portal

> **Full-Stack Technical Assignment** | Author Support, Manuscript Proofs & AI-Assisted Operations Portal.

A two-portal web application (Author + Admin) designed for **BookLeaf Publishing** to handle author support inquiries at scale. Features real-time sync, automated AI classification, priority scoring, context-aware reply drafting grounded in BookLeaf's policies, and an editorial atelier UI.

---

## 🚀 Live Demo & Deployed Endpoints

- **Author & Admin Web App (Vercel)**: [https://bookleaf-sable.vercel.app](https://bookleaf-sable.vercel.app)
- **API Server (Render)**: [https://bookleaf-56l4.onrender.com](https://bookleaf-56l4.onrender.com)
- **API Health Check**: [https://bookleaf-56l4.onrender.com/api/health](https://bookleaf-56l4.onrender.com/api/health)
- **Interactive Swagger / OpenAPI Docs**: [https://bookleaf-56l4.onrender.com/api/docs/](https://bookleaf-56l4.onrender.com/api/docs/)

### 🔑 Demo Login Credentials (Pre-Seeded)

The database is pre-seeded with 12 accounts from the official dataset:

| Role | Email | Password | Description |
| :--- | :--- | :--- | :--- |
| **Author (Sample)** | `priya.sharma@email.com` | `password123` | Author with published books & royalty records |
| **Author (Production)** | `vikram.seth@email.com` | `password123` | Author with books in typesetting / proofing |
| **Admin (Curator)** | `admin@bookleaf.com` | `admin123` | Full access to ticket queue, AI drafts & overrides |
| **Admin (Ops)** | `ops@bookleaf.com` | `admin123` | Secondary support operations coordinator |

*(Quick-fill buttons are also available directly on the login screen for instant testing).*

---

## 📋 Features Checklist

### A. Author Portal
- [x] **Authentication**: Secure JWT auth with password hashing via `bcryptjs`. Strict tenant isolation ensures authors only see their own books and tickets.
- [x] **My Books**: Visual bookshelf and grid view displaying title, ISBN, genre, status, MRP, copies sold, total royalties earned, paid, and pending.
- [x] **Submit Support Query**: Form with linked book selection (or *"General / Account Level"*), subject validation, description, and file attachment dropzone UI.
- [x] **My Tickets**: Ticket thread view displaying current status (*Open, In Progress, Resolved, Closed*), full message history, admin replies, and live 10-second polling sync.

### B. Admin Portal
- [x] **Ticket Queue**: Central operational dashboard filterable by Status, Category, Priority, Assignee, and Date Range.
- [x] **Urgency Spotting**: Distinct visual badges for Critical priority and an automatic pulse alert for tickets unresolved after 72 hours (3d+ SLA).
- [x] **AI Auto-Classification**: Incoming tickets are classified into one of 6 official BookLeaf categories:
  - *Royalty & Payments*
  - *ISBN & Metadata Issues*
  - *Printing & Quality*
  - *Distribution & Availability*
  - *Book Status & Production Updates*
  - *General Inquiry*
- [x] **AI Priority Scoring**: Analyzes intent and urgency (e.g. overdue payouts or ISBN errors trigger High/Critical). Admins can manually override classification or priority at any time.
- [x] **AI-Drafted Responses**: Generates contextual, empathetic drafts grounded in the **BookLeaf Knowledge Base** + specific book financials. Admins can edit or regenerate before dispatching.
- [x] **Ticket Controls & Collaboration**: Status transitions, private internal notes (staff-only), and self-assignment / unassignment.

### C. API & Architecture
- [x] **Strict 4-Layer Architecture**: `Routes → Controllers → Services → Models`. Controllers never invoke Mongoose directly.
- [x] **Zod Validation**: Every request body and query parameter is validated before reaching business logic.
- [x] **Centralized Error Handling**: Custom `ApiError` class with consistent JSON envelopes; never exposes raw 500 stack traces.
- [x] **Interactive OpenAPI 3.0 Documentation**: Live Swagger UI at `/api/docs`.

### D. AI Resilience & Cost Consciousness
- [x] **Zero Hardcoded Keys**: API keys loaded exclusively via validated environment variables (`src/config/env.js`).
- [x] **Graceful Degradation**: If the LLM provider times out or fails (after 3 exponential retries), the system falls back to a deterministic rule-based keyword classifier. Tickets are always created safely.
- [x] **Cost & Token Optimization**: Instead of dumping the entire database or conversation history, `pickFactsForCategory` selectively projects only relevant financial and publication fields for each query category.
- [x] **Provider-Agnostic Engine**: Abstracted AI service supporting Google Gemini (`gemini-2.5-flash` / `gemini-1.5-flash`) by default, with optional Anthropic Claude support.

---

## 🛠️ Tech Stack

- **Backend**: Node.js (ESM), Express 5, MongoDB Atlas, Mongoose 9, Zod, JWT, bcryptjs, Helmet, Morgan, Swagger UI.
- **Frontend**: React 19, Vite, Tailwind CSS, React Router v7, Axios, Lucide Icons.
- **AI / LLM**: `@google/genai` (Google Gemini) with custom fallback classifier.
- **Testing**: Native Node.js test runner (`node --test`), 22 comprehensive unit and integration tests.

---

## 🏃 Local Setup & Installation

### Prerequisites
- Node.js >= 20.x
- MongoDB (local instance or free MongoDB Atlas URI)

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/<your-username>/bookleaf.git
cd bookleaf

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Environment Configuration

Create `server/.env` with your credentials:

```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/bookleaf?retryWrites=true&w=majority
JWT_SECRET=super_secret_bookleaf_dev_key_123456
JWT_EXPIRES_IN=7d
LLM_PROVIDER=gemini
GEMINI_API_KEY=your_google_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

Create `client/.env.production` (or `client/.env`):
```env
VITE_API_URL=http://localhost:5000
```

### 3. Seed Database

Populate the database with the official 10 authors and 18 books:
```bash
cd server
npm run seed
```

### 4. Run Locally

In terminal 1 (Server):
```bash
cd server
npm run dev
# Server running at http://localhost:5000
```

In terminal 2 (Client):
```bash
cd client
npm run dev
# Client running at http://localhost:3000
```

### 5. Run Test Suite
```bash
cd server
npm test
# Runs all 22 tests (book facts, classifier fallbacks, OpenAPI spec integrity, etc.)
```

---

## 📐 Architecture & Design Decisions

### 1. Layered Separation of Concerns
```
HTTP Request
     │
     ▼
[routes/]         ── Zod Validation Middleware (`validateBody`, `validateQuery`)
     │
     ▼
[controllers/]    ── Extracts params, calls service, returns consistent JSON
     │
     ▼
[services/]       ── Pure business logic (ticket lifecycle, AI triage, book facts)
     │
     ▼
[models/]         ── Mongoose Schemas (indexes, constraints, default states)
```

### 2. Selective Fact Projection for AI Prompts
Rather than feeding raw database dumps into LLM context, `src/services/ai/bookFacts.js` calculates and sanitizes domain metrics:
- Identifies whether a book is still in pre-production (suppressing irrelevant sales/royalty metrics).
- Computes exact next payout deadlines based on the 45-day post-quarter schedule.
- Checks whether royalties are below the ₹1,000 threshold or genuinely overdue.

### 3. Resilience Strategy
If the AI API is unreachable:
1. Retries with exponential backoff up to 3 times.
2. If still unavailable, falls back to deterministic regex keyword triage so tickets are never dropped.
3. Sets ticket AI status to `failed` and logs error internally.
4. Admins are shown a *"AI draft unavailable — write manually"* banner with an interactive *"Retry AI"* button.

---

## 📌 Notes & Assumptions Made

1. **Royalty Cycle & Calculation Schedule**:
   - Payouts are calculated quarterly and disbursed within 45 days of quarter end (Feb 14, May 15, Aug 14, Nov 14).
   - If accumulated royalties are below ₹1,000, they roll over to subsequent quarters without triggering an overdue status.
   - For books still in production (e.g. *Cover Design* or *Typesetting* like BK013 and BK015), sales and royalty fields are null-safe and properly hidden until live publication.

2. **File Attachment Handling**:
   - In accordance with the assignment brief (*"UI only — actual upload is bonus, not required"*), the file dropzone validates file size, format, and simulates attachment state without requiring an external S3 bucket or third-party storage credentials.

3. **Tenant & Role-Based Security**:
   - Authors are strictly quarantined to their own books, royalties, and submitted tickets.
   - Admins hold global curatorial access across all author records with rights to override AI classification, alter priority scores, and append confidential internal notes.

4. **Near-Real-Time Polling vs. WebSockets**:
   - Implemented a 10-second resilient polling mechanism (`usePolling`) for both ticket threads and queue listings. This provides seamless updates without the socket disconnects and memory leaks common on free-tier container platforms like Render and Vercel.

5. **AI Reliability & Graceful Degradation**:
   - LLM integration utilizes Google Gemini (`gemini-2.5-flash`) for low latency and high quality.
   - If the AI API experiences rate limits or network dropouts, 3 retries with backoff are attempted before safely falling back to a deterministic regex keyword classifier. Ticket ingestion is never blocked.

---

## 📝 Approach & Production Evolution (Write-Up)

### What Was Prioritised
1. **Robust AI Pipeline**: Ensuring the AI sounds like a real BookLeaf coordinator, cites actual policies (80/20 split, 45-day quarterly windows, ₹1,000 threshold, 5–7 day reprint verification), and respects edge cases (in-production titles).
2. **Data Integrity & Security**: Strict role enforcement where authors can never view or manipulate another author's tickets or books.
3. **Operational Clarity**: Highlighting overdue tickets (72h+), providing editable drafts, and recording private internal notes.

### Trade-offs Made
- **Near-Real-Time Sync via Polling (10s)**: Chosen over WebSockets to minimize infrastructure complexity and connection teardown issues on serverless / free container tiers, while still providing seamless background synchronization.
- **UI File Upload Simulation**: As permitted by requirements, attachments validate file size and type on the client without external S3/Cloudinary storage bloat.

### Future Production Roadmap
1. **Vector RAG**: Indexing expanding publishing contracts and dynamic FAQ updates using Pinecone or pgvector.
2. **Email Webhook Ingestion**: Ingesting inbound author emails directly into ticket threads via SendGrid / Postmark.
3. **Staff Shift Scheduling & Assignment Routing**: Automatic round-robin assignment based on category specialization (e.g. Royalties routed to Finance staff).
