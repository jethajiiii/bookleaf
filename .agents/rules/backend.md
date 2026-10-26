# Backend rules

- app.js builds the Express app; server.js starts it. Keep them separate.
- Route files only map method+path -> validate -> controller. No logic.
- Controllers: parse req, call ONE service function, send res. Max ~15 lines each.
- Services: business logic + DB access. Return plain data, never req/res.
- Authors' queries must ALWAYS be scoped by req.user.id. Never query by _id alone.
- Author-facing responses must never include internalNotes, ai.*, or assignedTo.
- Error shape: { error: { code, message, details? } } with correct HTTP status (400 validation, 401 unauthenticated, 403 forbidden, 404, 409, 429, 500).
- Use asyncHandler for all async controllers.
- Use lean() for read queries; use projection/select deliberately.
- Null-safe: books in production have null mrp/publicationDate. Never coerce null to 0.
