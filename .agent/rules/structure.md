# Required folder structure

```text
bookleaf-portal/
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   ├── env.js
│   │   │   └── db.js
│   │   ├── constants/
│   │   │   ├── roles.js
│   │   │   ├── ticketStatus.js
│   │   │   ├── categories.js
│   │   │   └── priorities.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Book.js
│   │   │   └── Ticket.js
│   │   ├── middleware/
│   │   │   ├── authenticate.js
│   │   │   ├── requireRole.js
│   │   │   ├── validate.js
│   │   │   ├── errorHandler.js
│   │   │   └── notFound.js
│   │   ├── validators/
│   │   │   ├── auth.schema.js
│   │   │   ├── ticket.schema.js
│   │   │   └── admin.schema.js
│   │   ├── routes/
│   │   │   ├── index.js
│   │   │   ├── auth.routes.js
│   │   │   ├── book.routes.js
│   │   │   ├── ticket.routes.js
│   │   │   └── admin.routes.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── book.controller.js
│   │   │   ├── ticket.controller.js
│   │   │   └── admin.controller.js
│   │   ├── services/
│   │   │   ├── auth.service.js
│   │   │   ├── book.service.js
│   │   │   ├── ticket.service.js
│   │   │   ├── adminTicket.service.js
│   │   │   └── ai/
│   │   │       ├── client.js
│   │   │       ├── classify.js
│   │   │       ├── draft.js
│   │   │       ├── prompts.js
│   │   │       ├── kb.js
│   │   │       ├── bookFacts.js
│   │   │       ├── fallback.js
│   │   │       └── index.js
│   │   ├── utils/
│   │   │   ├── ApiError.js
│   │   │   ├── asyncHandler.js
│   │   │   └── logger.js
│   │   ├── seed/
│   │   │   ├── seed.js
│   │   │   └── bookleaf_sample_data.json
│   │   ├── docs/
│   │   │   └── openapi.yaml
│   │   ├── app.js (express app, no listen)
│   │   └── server.js (connect db + listen)
│   ├── .env.example
│   └── package.json
├── client/
│   ├── src/
│   │   ├── api/
│   │   │   ├── httpClient.js
│   │   │   ├── auth.api.js
│   │   │   ├── books.api.js
│   │   │   ├── tickets.api.js
│   │   │   └── admin.api.js
│   │   ├── app/
│   │   │   ├── App.jsx
│   │   │   ├── router.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── Badge.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Select.jsx
│   │   │   │   ├── Textarea.jsx
│   │   │   │   ├── Spinner.jsx
│   │   │   │   ├── EmptyState.jsx
│   │   │   │   └── Toast.jsx
│   │   │   └── layout/
│   │   │       ├── AuthorLayout.jsx
│   │   │       ├── AdminLayout.jsx
│   │   │       ├── TopBar.jsx
│   │   │       └── Sidebar.jsx
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   └── LoginPage.jsx
│   │   │   ├── books/
│   │   │   │   ├── MyBooksPage.jsx
│   │   │   │   └── BookCard.jsx
│   │   │   ├── tickets/
│   │   │   │   ├── SubmitQueryPage.jsx
│   │   │   │   ├── MyTicketsPage.jsx
│   │   │   │   ├── TicketCard.jsx
│   │   │   │   └── MessageThread.jsx
│   │   │   └── admin/
│   │   │       ├── TicketQueuePage.jsx
│   │   │       ├── TicketDetailPage.jsx
│   │   │       ├── QueueFilters.jsx
│   │   │       ├── AiDraftPanel.jsx
│   │   │       ├── TicketControls.jsx
│   │   │       ├── BookSnapshot.jsx
│   │   │       └── InternalNotes.jsx
│   │   ├── hooks/
│   │   │   ├── usePolling.js
│   │   │   └── useAuth.js
│   │   ├── lib/
│   │   │   ├── formatters.js
│   │   │   └── constants.js
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── README.md
└── GEMINI.md
```
