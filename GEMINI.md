# BookLeaf Author Support & Communication Portal

## What this is
Two-portal web app (Author + Admin) for handling author support tickets, with AI-assisted classification, priority scoring and reply drafting. Graded on: AI integration, architecture & code quality, API design.

## Stack
- Server: Node.js (ESM), Express, MongoDB + Mongoose, Zod, JWT, bcryptjs
- Client: React (Vite), Tailwind CSS, react-router-dom, axios
- AI: provider-agnostic wrapper (Gemini default, Claude optional)

## Non-negotiable quality rules
1. Strict layering on the server: routes -> controllers -> services -> models. Controllers never touch Mongoose directly. Services hold business logic.
2. One responsibility per file. Max ~150 lines per file. Split if larger.
3. No duplicated logic. Extract shared helpers/constants.
4. No magic strings: statuses, roles, categories, priorities live in constants.
5. Every request body/query is validated with Zod before reaching a controller.
6. Errors: throw ApiError; one central error handler. Never return a bare 500.
7. No hardcoded secrets. All config via validated env (src/config/env.js).
8. Naming: camelCase vars/functions, PascalCase components/models, kebab-case not used for JS files except config. Plural REST nouns.
9. Comments explain WHY, not WHAT. JSDoc on exported service functions.
10. No console.log in committed code except via the logger utility.
11. Do not add dependencies without saying why.
12. Do not add features I did not ask for. Do not leave TODOs or dead code.

## Folder structure (do not deviate)
See @./.agents/rules/structure.md

## Workflow
Small, focused changes. After each task: list files created/changed, and how I can verify it works. Do not run ahead to the next phase.
