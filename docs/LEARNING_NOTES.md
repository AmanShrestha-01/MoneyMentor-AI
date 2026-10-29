# Learning notes

Engineering concepts introduced in this project, in the order they appeared. Each covers:
**Purpose · Where it fits · When industry uses it · Example · Own this · Delegate this.**

---

## 1. The backend as the policy enforcement point

**Purpose.** One component decides whether an action is allowed. Everything else (UI,
LLM, workflow engine) can only *ask*.

**Where it fits.** FastAPI. Claude may propose "call `calculate_cash_flow`"; FastAPI
checks the session, consent, and scope, and only then runs the function.

**When industry uses it.** Any system where untrusted input can trigger actions — and LLM
output is untrusted input. This is the main defense against prompt injection: even if a
model is tricked, it has no authority to use.

**Example.**
```python
# Bad: trusts whatever user_id the model or client sent
def get_progress(user_id: UUID): ...

# Good: identity comes from the verified session, never from the request body
def get_progress(user: Annotated[User, Depends(current_user)]): ...
```

**Own this.** Where every trust boundary is, and why a model-supplied ID is never trusted.

**Delegate this.** Boilerplate for auth dependencies and their tests — once you've
specified the rules.

---

## 2. Configuration from environment variables

**Purpose.** The same code runs in development, test, and production; only configuration
changes. Secrets stay out of git.

**Where it fits.** `services/api/app/core/config.py` (`Settings`), `.env.example` files,
`apps/web/.env.local`.

**When industry uses it.** Essentially always (the "12-factor app" convention). Secret
managers (Vault, cloud secret stores) feed the same variables in production.

**Example.** `DATABASE_URL` set in `.env` → `get_settings().database_url`. Tests build
`Settings(environment="test")` directly instead of touching the environment.

**Own this.** Which values are secrets, which are safe defaults, and that `.env` is never
committed.

**Delegate this.** Writing the settings class and example files.

---

## 3. Database migrations (Alembic)

**Purpose.** Schema changes become versioned, reviewable scripts that run the same way on
every machine — instead of someone running `CREATE TABLE` by hand.

**Where it fits.** `services/api/alembic/`. Models in Python → `alembic revision
--autogenerate` drafts a migration → you review it → `alembic upgrade head` applies it.

**When industry uses it.** Every team with a relational database in more than one
environment.

**Example.**
```bash
.venv/bin/alembic revision --autogenerate -m "add learner_profiles"
# open alembic/versions/<file>.py and READ it
.venv/bin/alembic upgrade head
.venv/bin/alembic downgrade -1   # undo, if needed
```

**Own this.** Reading every migration before applying it. Autogenerate misses things
(renames look like drop+add — which deletes data) and can't know your intent.

**Delegate this.** Drafting migrations and writing data backfills, under review.

---

## 4. Liveness vs. readiness checks

**Purpose.** Two different questions: "is the process alive?" (restart it if not) and "can
it serve traffic right now?" (stop sending requests if not).

**Where it fits.** `GET /health` and `GET /health/ready` in `app/api/routes/health.py`.

**When industry uses it.** Container orchestrators (Kubernetes, ECS), load balancers,
uptime monitors. Mixing them up causes restart loops: a DB outage makes every API
instance "dead", they all restart, and nothing gets better.

**Example.** Stop Postgres → `/health` stays 200, `/health/ready` returns 503
`{"status":"unavailable","checks":{"database":"unavailable"}}`.

**Own this.** What each check should and shouldn't depend on; never leaking internal
error details in a public endpoint.

**Delegate this.** Writing the endpoints and their tests.

---

## 5. Dependency injection and test overrides

**Purpose.** A function receives what it needs (settings, DB session, a checker) instead
of creating it. Tests can then substitute fakes without monkey-patching.

**Where it fits.** FastAPI `Depends(...)`. The readiness route depends on
`get_database_check`; tests replace it via `app.dependency_overrides`.

**When industry uses it.** Everywhere testability matters. In this project it will also
carry the authenticated user and their permissions into every route.

**Example.** `tests/test_health.py`:
```python
client.app.dependency_overrides[get_database_check] = lambda: lambda: False
assert client.get("/health/ready").status_code == 503
```

**Own this.** Designing the seams: what should be injectable (I/O, time, identity,
external APIs) and what shouldn't (pure logic).

**Delegate this.** Writing fixtures and override boilerplate.

---

## 6. Server-only config and streaming in Next.js 16

**Purpose.** Keep backend details on the server, and show the fast static parts of a page
immediately while slow, live parts stream in.

**Where it fits.** `apps/web/src/lib/api.ts` reads `API_BASE_URL` (no `NEXT_PUBLIC_`
prefix → never bundled for the browser). `ApiStatusBadge` is an async server component
wrapped in `<Suspense>` on the dashboard; the build marks `/` as *Partial Prerender*.

**When industry uses it.** Modern React frameworks; any page mixing static content with
per-request data.

**Example.**
```tsx
<Suspense fallback={<span>Checking API status…</span>}>
  <ApiStatusBadge />   {/* fetches fresh on every request */}
</Suspense>
```

**Own this.** Which code runs on the server vs. the browser, and therefore what a user
could see in their browser's dev tools.

**Delegate this.** Component markup and styling.
