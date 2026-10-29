# Decisions, assumptions, and open questions

Lightweight decision log. Each entry: context → decision → alternatives → consequences.
Status: **Accepted**, **Provisional** (revisit soon), or **Open** (needs input).

---

## Requirements baseline

### Confirmed (from the research proposal and project brief)
- Bounded educational/behavioral support system; not an autonomous financial adviser.
- Never: account access, transactions, product applications, lending/investment decisions,
  professional financial/legal/tax advice.
- Six functions: learner profile, learning planner, decision support, behavioral support,
  resource navigation, safety & escalation.
- Student control: consent before sensitive context; inspect/correct/export/delete data;
  "no intervention" is valid.
- Stack: Next.js + TypeScript + Tailwind; FastAPI + Pydantic + SQLAlchemy + Alembic;
  PostgreSQL; Claude primary, Gemini optional; n8n; MCP; pytest; Playwright.
- Three research conditions must be supportable without cross-contamination.
- Alignment targets: NIST AI RMF 1.0 and NIST AI 600-1 (Generative AI Profile).
- Fictional data only during development; no assumed IRB or institutional approval.

### Assumptions (please confirm or correct)
- A1. Repository root is this `MoneyMentor/` directory (not a nested `claricents-ai/`).
- ~~A2. Product name~~ — confirmed: MoneyMentor, assistant Milo (D-002).
- A3. Single institution, English-language UI initially.
- A4. Web-first, responsive; no native mobile app.
- A5. Students authenticate via institutional SSO eventually; mechanism unknown.
- A6. No hosting target chosen; nothing here assumes a specific cloud.

---

## D-001 Monorepo at repository root — Accepted
**Context:** Brief proposed `claricents-ai/` as the root; the working directory is
`MoneyMentor/`. **Decision:** Use the current directory as the monorepo root with
`apps/`, `services/`, `workflows/`, `prompts/`, `evals/`, `tests/`, `docs/`, `infra/`.
**Consequence:** One git repo, one CI pipeline, shared docs. No JS workspace tooling
(Turborepo/pnpm workspaces) yet — only one JS package exists.

## D-002 Product and assistant naming — Accepted
**Context:** The original brief mixed *MoneyMentor* and *ClariCents* and left the
assistant unnamed. **Decision (confirmed by project lead, 2026-10-28):** product is
**MoneyMentor**; the assistant is **Milo**. All naming lives in
`apps/web/src/lib/brand.ts`; "ClariCents" is not used anywhere.

## D-003 Python 3.12 + venv + pip — Accepted
**Context:** macOS system Python is 3.9 (too old for current typing syntax); Homebrew
3.12 is installed; `uv` is not. **Decision:** Python 3.12, standard `venv`, dependencies in
`pyproject.toml` with bounded version ranges. **Alternatives:** uv (faster, lockfile) —
reasonable future upgrade; Poetry — heavier. **Consequence:** No lockfile yet;
reproducibility relies on version ranges. Revisit when CI is added.

## D-004 psycopg 3 driver — Accepted
Modern, maintained PostgreSQL driver supported by SQLAlchemy 2.x (`postgresql+psycopg://`).
Binary wheel for easy local install. Alternative psycopg2 is legacy; asyncpg would push us
to async SQLAlchemy, which isn't needed yet.

## D-005 Sync SQLAlchemy for now — Provisional
Sync sessions are simpler to learn, test, and debug. FastAPI runs sync endpoints in a
thread pool. Revisit if LLM-heavy endpoints need high concurrency (then: async engine, or
offload LLM calls to n8n/background jobs).

## D-006 Local PostgreSQL: Docker on 5433, or native — Accepted
Docker isn't installed on the primary dev machine, which already runs PostgreSQL 18 on
5432. Compose maps to 5433 to avoid a clash; `infra/postgres/create_dev_db.sql` supports
the native install. Both use a dedicated non-superuser role.

## D-007 Liveness vs. readiness health checks — Accepted
`/health` never touches dependencies (so a DB outage doesn't make the process look dead);
`/health/ready` checks the DB and returns 503 without error details.

## D-008 Keep Next.js Cache Components (framework default) — Accepted
New in Next.js 16 defaults. Uncached data must be in `<Suspense>`. Gives a fast static
shell with streamed dynamic parts. Consequence: contributors must read the bundled Next.js
docs; older tutorials may be wrong.

## D-009 Server-only API base URL — Accepted
`API_BASE_URL` (no `NEXT_PUBLIC_`) — the browser never learns the backend address from the
bundle; server components call the API. Client-side calls (e.g., chat streaming) will need
a deliberate design: likely a Next.js route handler as a backend-for-frontend.

## D-010 shadcn/ui deferred; tokens compatible — Provisional
No interactive components yet, so no dependency added. Tokens use shadcn names so
`npx shadcn init` later needs minimal re-theming. Adopt when forms/dialogs arrive (Phase
1.2 or 2).

## D-011 Frontend tests: lint + typecheck + build now — Provisional
Vitest + Testing Library and Playwright are deferred to milestone 1.2 to avoid four new
dev dependencies before there's logic to test.

## D-015 TypeScript calculators for the UI preview — Provisional
**Context:** The supervisor demo needs working calculators before the backend tools exist.
**Decision:** `apps/web/src/lib/calculators.ts` mirrors the planned Python tools (integer
cents, input validation) and is unit-tested with Node's built-in `node:test` (no new
dependency; needs `allowImportingTsExtensions`). **Consequence:** two implementations
until Sprint 2, when the Python tool becomes authoritative and the UI calls the API. Both
must keep the `500 − 350 − 200 = −50` reference test.

## D-012 httpx2 for the test client — Accepted
Starlette 1.10 deprecates `httpx` for `TestClient` in favor of `httpx2` (pydantic org,
same author). Dev-only dependency.

## D-013 Deterministic safety in application code — Accepted
Scope/prohibited-action checks are code with tests, run before and after any LLM call.
Prompts may restate rules, but prompts are not the enforcement mechanism.

## D-014 n8n's role — Open
n8n is in the brief for orchestration. Concern: it adds a second runtime that must not
hold user data or bypass the API. Proposal: Phase 2 runs in-process (no LLM needed);
Phase 3 introduces n8n behind the API and compares it to in-process orchestration on
reliability, latency, and debuggability before committing.

---

## Open questions for the research team
1. ~~Final product and assistant names~~ — resolved (D-002).
2. Authentication: which institutional SSO, and is IT engagement feasible this year?
3. Message retention window and de-identification standard for logs.
4. Who verifies and maintains `approved_resources` listings, and how often?
5. Which campus resources (financial aid, basic needs, counseling) can be listed, and
   with whose permission?
