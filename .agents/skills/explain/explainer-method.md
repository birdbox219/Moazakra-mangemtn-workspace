# The Explainer Method

This is the teaching framework to follow every time /explain is invoked.
Not all layers apply to every piece of code — use judgment. But always cover at least layers 1–4.

---

## Layer 1 — The One-Sentence Purpose (The "Why Does This Exist?")

Before touching a single line, answer:
> "If this code vanished, what would break and why would anyone notice?"

This anchors everything. State it in plain language, no jargon.

**Example:**
> "This middleware exists because every HTTP request needs to carry proof of identity — without it, anyone could call any endpoint pretending to be anyone."

---

## Layer 2 — The Real-World Analogy

Pick an analogy from the physical or everyday world that maps to what the code is doing.
The analogy must match the *structure*, not just the vibe.

**Rules for good analogies:**
- The analogy's parts should map 1-to-1 with the code's parts
- Say explicitly what maps to what: "The `queue` here is like the ticket dispenser at a deli — the number is your `JobId`, the counter is your `Worker`, and the deli itself is the `Database`"
- Don't just say "it's like a factory" and move on — walk through it

**Common analogy targets by concept:**

| Concept | Analogy |
|---|---|
| HTTP Request/Response | A letter you send + the reply you get back |
| Middleware pipeline | Airport security — every gate checks one thing, in order |
| Dependency Injection | A restaurant where you don't cook your own food — you declare what you want, the kitchen provides it |
| Database transaction | A bank transfer — either both accounts update or neither does |
| JWT token | A stamped wristband at a concert — proves you paid, checked at the door |
| Message queue | A to-do list that survives a power outage |
| Repository pattern | A librarian — you ask for a book by title, you don't touch the shelves yourself |
| Caching | A sticky note on your monitor so you don't have to Google the same thing twice |
| Event-driven arch | A smoke detector — it doesn't know who will respond, it just raises the alarm |
| Recursion | Russian nesting dolls — each doll opens to reveal the same problem, smaller |
| Index (DB) | A book's index at the back — instead of reading every page, jump to the right one |
| Foreign key | A name badge at a company — the badge ID links you to your full HR record |

Add your own when the concept doesn't fit the table.

---

## Layer 3 — Line-by-Line Walkthrough

Go through the code **in execution order**, not source order.

For each meaningful line or block, explain:
1. **What it does** — literal action
2. **Why it's here** — what breaks without it
3. **What data looks like at this point** — show a concrete example value

**Format to use:**
```
[Line or block]
→ What: ...
→ Why: ...
→ Data snapshot: input was X, now it's Y
```

**Rules:**
- Don't skip lines saying "this is obvious" — if it's in the code, it earned an explanation
- Show actual example values, not just types. Not `string name` but `name = "Ahmad"`
- When a function calls another function, note that you're going deeper: "this calls into the DB layer — we'll trace that next"
- Highlight side effects: "this line doesn't return anything — its job is to *mutate* the `_cache` dictionary"

---

## Layer 4 — Data Flow Trace

Pick the most important piece of data in the code and trace its entire journey.

Show it as a numbered flow:

```
1. User submits form → { name: "Ahmad", email: "a@x.com" }
2. React sends POST /api/users with JSON body
3. ASP.NET model binding maps JSON → CreateUserDto { Name="Ahmad", Email="a@x.com" }
4. Controller passes dto to UserService.Create(dto)
5. Service hashes the password, builds User entity
6. DbHelper runs INSERT → SQL Server writes row, returns Id=42
7. Service returns User { Id=42, Name="Ahmad" }
8. Controller returns 201 Created with Location: /api/users/42
9. React receives response, adds user to local state
10. UI re-renders showing the new user in the list
```

Always show real-looking data at each step, not placeholder types.

---

## Layer 5 — Architecture Fit

Answer: **where does this live in the overall system?**

Draw a simple ASCII map if useful:

```
[React Frontend]
      │  fetch POST /api/users
      ▼
[ASP.NET Controller]   ← you are here
      │  calls
      ▼
[UserService]
      │  calls
      ▼
[DbHelper → SQL Server]
```

Then explain:
- What layer this code belongs to (presentation / business logic / data access)
- What it is allowed to know about (and what it must NOT know about)
- Why the separation exists — what goes wrong if you mix layers

---

## Layer 6 — The "What If" Tests

This is what separates surface understanding from deep understanding.
Ask 2–3 "what if" questions and answer them:

- "What if this line throws an exception — what happens to the caller?"
- "What if two requests hit this at the same time — is there a race condition?"
- "What if the database is down — does this fail gracefully or silently corrupt data?"
- "What if someone passes null here — where does it blow up?"
- "What if you removed the `await` — what would actually happen?"
- "What if the cache returns a stale value — does anything care?"

These questions reveal the **implicit contracts** the code relies on.

---

## Layer 7 — Alternatives & Trade-offs (when relevant)

Only include this when the code made a non-obvious choice.

Format:
> "This uses X. The alternatives were Y and Z.
> X was chosen because [reason]. The cost is [trade-off].
> If the requirement changes to [scenario], you'd want to switch to Y."

**Example:**
> "This uses raw ADO.NET instead of Entity Framework. That means more verbose code but full control over the SQL — useful when you need to optimize specific queries or the schema is complex enough that EF's generated SQL becomes a problem. If the team grows and query complexity is low, EF would reduce boilerplate significantly."

---

## Tone & Format Rules

- **Write like a senior engineer explaining to a smart junior** — no condescension, no hand-holding, but also no assumed knowledge
- Use **concrete examples over abstract descriptions** always
- **Bold** the most important insight in each layer
- Keep analogies grounded — don't over-extend them past where they fit
- End with a one-paragraph summary: "The mental model to carry forward is..."
- If the code is long, prioritize the most architecturally interesting parts, then offer to go deeper on specific sections

---

## What NOT to Do

- ❌ Don't just restate the code in English ("this line sets x to 5")
- ❌ Don't list every parameter without explaining what the data represents
- ❌ Don't use analogies that don't map structurally
- ❌ Don't skip the "why" — the why is everything
- ❌ Don't end without a mental model summary
