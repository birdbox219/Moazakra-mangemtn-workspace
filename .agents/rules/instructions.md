---
trigger: always_on
---

# AGENTS.md — ASP.NET Core + React + SQL Server Project Rules

Cross-tool rules for Antigravity, Claude Code, and Cursor.
These apply to every agent action in this project.

---

## 1. Project Stack (Read First)

- **Backend:** ASP.NET Core Web API (C#)
- **Frontend:** React (TypeScript, Vite)
- **Database:** Microsoft SQL Server — raw ADO.NET only
- **ORM:** None. Entity Framework is NOT used. Never suggest it.
- **Auth:** JWT (when applicable)
- **Styling:** Tailwind CSS

Do not introduce new dependencies, frameworks, or patterns outside this stack without explicitly asking first.

---

## 2. Planning Rules

- **Always plan before coding.** For any task touching more than one file, state what files you will create or modify and why — before writing a single line of code.
- If a task is ambiguous, ask one clarifying question before proceeding. Do not guess and over-build.
- When modifying existing code, state what the current behavior is before explaining what you're changing and why.
- Never refactor, rename, or restructure files unless explicitly asked to do so.

---

## 3. Backend Rules (ASP.NET Core)

### General
- Use `ActionResult<T>` return types on all controller actions.
- Return `Ok()`, `NotFound()`, `BadRequest()`, `CreatedAtAction()`, or `NoContent()` — never raw objects.
- All error responses must include a message: `return NotFound(new { message = "..." })`.
- Register all services via dependency injection in `Program.cs`. No `new` inside controllers.

### SQL Server (ADO.NET)
- **Never use Entity Framework or LINQ-to-SQL.** Use `SqlConnection`, `SqlCommand`, `SqlDataReader` directly via the project's `DbHelper`.
- **All queries must be parameterized.** Never interpolate user input into SQL strings.
- Handle `DBNull` explicitly when reading nullable columns.
- For INSERT operations that return a new ID, use `OUTPUT INSERTED.Id` in the SQL.
- Database migrations are plain `.sql` files in the `Migrations/` folder, numbered sequentially (`001_`, `002_`, etc.). Never generate schema changes as C# code.

### API Design
- Follow REST conventions strictly: GET for reads, POST for creates, PUT for full updates, DELETE for deletes.
- Route prefix is `api/[controller]` — do not deviate.
- DTOs are separate from domain models. Never serialize internal domain fields directly (e.g. password hashes).
- Validate all incoming DTOs with data annotations. Check `ModelState.IsValid` before processing.

---

## 4. Frontend Rules (React + TypeScript)

### General
- All components are written in TypeScript (`.tsx`). No plain `.js` or `.jsx` files.
- Use functional components and hooks only. No class components.
- Define prop types explicitly — no implicit `any`.

### API Calls
- All API calls go through the central `src/api/client.ts` file. Never write raw `fetch` calls inside components.
- The API base URL comes from `.env` via `import.meta.env.VITE_API_URL`. Never hardcode a localhost URL in component code.
- Handle loading, error, and success states for every async operation. Never leave a component that can fail silently.

### State
- Use `useState` and `useEffect` for local state. Do not introduce Redux, Zustand, or other state libraries unless asked.
- Optimistic UI updates must always include a rollback on failure.

### File Structure
- Components live in `src/features/[feature-name]/` or `src/components/` for shared UI.
- API functions live in `src/api/`.
- Types and interfaces live in `src/types/`.
- Do not create new folders outside this structure without asking.

---

## 5. Safety Rules

- **Never delete files** without explicit confirmation from the user.
- **Never run database commands** (DROP, TRUNCATE, DELETE without WHERE) without pausing and asking for confirmation.
- **Never modify migration files** that have already been applied. Create a new migration instead.
- **Never touch `Program.cs` middleware order** without explaining the impact — middleware order in ASP.NET Core is critical.
- Do not commit secrets, connection strings, or API keys. These belong in `appsettings.Development.json` or `.env` (both gitignored).

---

## 6. Code Quality Rules

- Every new public method on a service or controller gets a one-line XML doc comment (`/// <summary>`).
- No magic numbers or strings in logic. Use constants or configuration.
- No commented-out code left behind. Delete it or don't include it.
- When fixing a bug, explain the root cause in a code comment at the fix site if it's non-obvious.
- Do not leave `TODO` or `FIXME` comments unless the user explicitly asked for a placeholder.

---

## 7. Communication Rules

- When a task is complete, summarize: what was created/changed, why, and what the user should verify.
- If you encounter an error while executing, explain what failed and what you tried before asking for help.
- If a request conflicts with these rules, say so explicitly instead of silently doing something else.
