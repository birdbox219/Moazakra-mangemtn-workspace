# Architecture Patterns Reference

Use this file when explaining code that implements a known pattern.
Don't just name the pattern — explain what problem it solves, what it feels like from the inside, and what the code's role is within it.

---

## Web / API Patterns

### MVC (Model-View-Controller)
**Problem it solves:** Code becomes unmaintainable when UI logic, business rules, and data access are tangled together.
**Mental model:** Three specialists who pass work to each other. The Controller is the traffic cop — it receives the request, delegates to the Model (business/data logic), and tells the View what to render. None of them do each other's jobs.
**Data flow:** Request → Controller → Model → Controller → View → Response
**What breaks if you mix layers:** Controllers that query the DB directly become impossible to test. Views that contain business logic become impossible to reuse.

### Repository Pattern
**Problem it solves:** Business logic shouldn't know or care whether data comes from SQL Server, MongoDB, or a flat file.
**Mental model:** A librarian with a catalog system. You say "give me Book #42" — you don't go into the shelves yourself. The librarian knows where things are; you just know what you want.
**Data flow:** Service calls `repo.GetById(42)` → Repository translates to SQL → Returns domain object → Service never sees a connection string
**What breaks if you skip it:** Swap SQL Server for PostgreSQL and you're rewriting business logic instead of just the data layer.

### Middleware Pipeline
**Problem it solves:** Every request needs the same cross-cutting concerns (auth, logging, error handling) without every controller reimplementing them.
**Mental model:** Airport security checkpoints. You pass through gates in a fixed order. Each gate does one job and either passes you through or stops you. You can't skip a gate.
**Data flow:** Request enters → Gate 1 (logging) → Gate 2 (auth check) → Gate 3 (rate limiting) → Controller → Response exits through gates in reverse
**Key insight:** Order matters. Auth middleware must run before the controller. Error handling middleware should wrap everything else.

### Dependency Injection (DI)
**Problem it solves:** Classes that create their own dependencies are hard to test and hard to swap out.
**Mental model:** A restaurant. You don't cook your own food — you sit down and the kitchen brings it. The DI container is the kitchen. You declare what you need (in the constructor), and the container figures out how to provide it.
**Data flow:** App starts → Container builds the dependency graph → When Controller is created, container injects DbHelper, Logger, etc. automatically
**What breaks without it:** `new SqlConnection()` scattered everywhere. To test, you have to have a real DB. To swap implementations, you touch every file that used `new`.

---

## Data Patterns

### Unit of Work + Transaction
**Problem it solves:** Multiple DB operations that must all succeed or all fail together.
**Mental model:** A bank transfer. You debit one account and credit another. If the credit fails, the debit must be rolled back. The transaction is the guarantee — either both happen or neither does.
**Data flow:** Begin transaction → Operation A → Operation B → If both OK: Commit → If any fails: Rollback → Either the DB has both changes or zero changes
**What breaks without it:** You debit account A successfully, then the server crashes before crediting account B. Money vanishes.

### DTO (Data Transfer Object)
**Problem it solves:** Your internal domain model has fields that shouldn't leave the server (passwords, internal IDs, audit fields).
**Mental model:** A press release vs. your internal memo. The memo has everything — the press release has only what's appropriate for the public. DTOs are press releases.
**Data flow:** HTTP request arrives as JSON → Deserializes into `CreateUserDto` (only public fields) → Service maps to `User` domain object (adds internal fields like `CreatedAt`) → Response serializes back to `UserResponseDto` (strips password hash)
**What breaks without it:** You accidentally serialize `PasswordHash` in the API response. Or you accept `Id` in a create request and someone overwrites another user's data.

### Optimistic vs Pessimistic Concurrency
**Optimistic:** "I assume no one else is editing this. I'll check when I save." — uses a `RowVersion` or `UpdatedAt` timestamp. If someone else saved first, your save is rejected.
**Pessimistic:** "I'll lock this row while I'm editing it so no one else can touch it." — uses `SELECT ... WITH (UPDLOCK)`. Safer but creates bottlenecks.
**When to use optimistic:** Low-conflict scenarios (most web apps). User edits their own profile.
**When to use pessimistic:** High-conflict scenarios. Inventory systems where two orders can't both take the last item.

---

## Frontend ↔ Backend Patterns

### REST API Contract
**Mental model:** A vending machine with a published menu. The machine (backend) doesn't know who's calling — it just responds to known inputs with known outputs. The caller (frontend) doesn't know what's inside the machine — it just knows what buttons to press.
**The contract:** URL + HTTP method + request shape + response shape. Break the contract and the other side breaks.
**Common mistake:** Changing a response field name on the backend without updating the frontend. The frontend silently gets `undefined` and you spend an hour debugging.

### Optimistic UI Updates
**Problem it solves:** Waiting for a server response before updating the UI feels slow and broken.
**Mental model:** When you like a tweet, the heart turns red immediately — the network request happens in the background. If it fails, it turns back.
**Data flow:** User clicks → UI updates immediately (optimistic) → Request fires → If success: do nothing (UI already correct) → If failure: revert UI + show error
**What breaks if done wrong:** The user sees a success state but the server rejected it. Always handle the rollback case.

---

## Async / Concurrency Patterns

### async/await
**Mental model:** Ordering food at a restaurant. You place your order (start the async operation), then you're free to have a conversation (do other work). When the food arrives (operation completes), the waiter gets your attention (continuation runs). You didn't stand frozen at the counter waiting.
**What `await` actually does:** Suspends the current method and releases the thread back to the pool. When the awaited task completes, the method resumes — potentially on a different thread.
**What breaks without it:** `GetResult()` or `.Result` on a Task blocks the thread. Under load, you exhaust the thread pool and the server stops responding to new requests.

### Message Queue / Event-Driven
**Problem it solves:** Service A shouldn't wait for Service B to finish. And if B is down, A shouldn't fail.
**Mental model:** A post office. You drop off a package (publish event). The recipient picks it up when they're ready. You don't stand there waiting. If the recipient's office is closed, the package waits safely.
**Data flow:** Order placed → Event published to queue → Order service returns immediately → Inventory service picks up event when ready → Processes independently
**What breaks without it:** Service A is now as slow as Service B. And if B goes down, A goes down with it.

---

## How to Use This File

When explaining code that implements one of these patterns:
1. Name the pattern early: "This is the Repository pattern — here's what that means..."
2. Use the mental model from this file, adapted to the actual code
3. Show how the specific code maps to the pattern's data flow
4. Point out where this code deviates from the textbook version and why
