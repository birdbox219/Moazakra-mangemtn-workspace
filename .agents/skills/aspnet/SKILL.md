---
name: aspnet
description: ASP.NET Core backend guidance for this project. Use when writing controllers, API endpoints, SQL Server queries, database migrations, CORS configuration, or connecting the React frontend to the backend. Triggers on: "add endpoint", "create controller", "query database", "SQL", "migration", "fetch from frontend", "CORS", "API route", "connect React", "stored procedure".
---

# ASP.NET Core Project Standards

This project uses **ASP.NET Core Web API** with **Microsoft SQL Server** (raw ADO.NET — no Entity Framework) and a **React** frontend.

Refer to the supporting files when needed:
- [api-structure.md](api-structure.md) — Controller layout, routing, response conventions
- [sql-server.md](sql-server.md) — Raw SQL patterns, migrations, connection setup
- [frontend-connect.md](frontend-connect.md) — CORS config, React fetch patterns

## Quick Rules

- No Entity Framework. Use `SqlConnection` / `SqlCommand` / `SqlDataReader` directly.
- Always use parameterized queries — never string-interpolate SQL.
- Return `ActionResult<T>` from controllers. Use `Ok()`, `NotFound()`, `BadRequest()` with a message.
- CORS is configured in `Program.cs` — do not add it per-controller.
- React calls the API via `fetch` or `axios` using a base URL from `.env`.
- Database migrations are plain `.sql` files run manually or via a migration runner script.
