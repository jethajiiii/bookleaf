# Frontend rules

- Feature-based folders. Pages compose small components; pages stay under ~120 lines.
- All HTTP goes through api/*.js modules using one axios instance. No fetch/axios in components.
- Shared UI primitives live in components/ui. Do not restyle per page.
- Handle loading, empty and error states on every data view.
- All money/date/null formatting goes through lib/formatters.js (formatINR(null) -> "—", formatDate(null) -> "—"). Never render "null" or "NaN".
- Visual style: warm cream background (#F4EDE0), card #FBF7EF with 1px #E4D9C4 border, terracotta primary (#D4704B), mustard #E0B050, teal #3F7F8C, sage #7C9A6B, charcoal text #2B2622. Serif headings (Fraunces), Inter body. Pill buttons. Put these as Tailwind theme tokens in tailwind config; never hardcode hex in components.
- Role-based routing via ProtectedRoute. Token stored in localStorage via AuthContext.
- Polling via usePolling hook (5s), paused when document.hidden.
