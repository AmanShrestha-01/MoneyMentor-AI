# Roadmap

Status key: ✅ done & verified · 🟡 partial · ⬜ not started

Each phase ends with a demo, passing checks, and updated docs. **The next phase starts
only after explicit approval.**

## Sprint plan (from the project lead, 2026-10-28)

The near-term work is organized into four sprints. They map onto the phases below.

| Sprint | Scope | Deliverable | Phases |
|---|---|---|---|
| 1 — Foundations & security | Next.js, FastAPI, PostgreSQL schema, authentication, consent model, pytest | A student account and authorized profile flow working end to end | rest of 1 |
| 2 — Milo's first useful workflow | Cash-flow calculator, Claude integration, n8n workflow, error handling, synthetic test scenarios | A student asks a financial question and gets a verified explanation | 2, 3 |
| 3 — Knowledge & personalization | Approved resources, learner profile, lesson retrieval, optional pgvector search | Milo gives grounded explanations and remembers permitted progress | 4 |
| 4 — Evaluation & staging | Promptfoo tests, Langfuse tracing, cross-user authz tests, safe error workflows, approved staging deploy | A documented prototype with reproducible reliability and security tests | 6 |

New tools named here (Promptfoo, Langfuse, pgvector) are **proposed, not yet adopted**;
each gets a `DECISIONS.md` entry before it is installed. Phase 5 (multi-agent
experiments) comes after Sprint 4.

UI/UX prototype (clickable, fictional data): https://claude.ai/artifact/JzKKihrZUoTS5akdZFYiJA

## Phase 0 — Discovery ✅
- ✅ Inspected repository (empty) and local toolchain
- ✅ Recorded confirmed requirements vs. assumptions (`DECISIONS.md`)
- ✅ Architecture proposal (`ARCHITECTURE.md`)
- ✅ Foundational docs

## Phase 1 — Foundation 🟡
Done in milestone 1.1:
- ✅ Next.js frontend scaffold with design tokens and responsive dashboard (fictional data)
- ✅ FastAPI backend with settings, DB session, liveness/readiness health checks
- ✅ Alembic configured (verified against PostgreSQL 18; no revisions yet)
- ✅ Docker Compose + native-Postgres options; `.env.example` files
- ✅ Backend tests (pytest), lint (ruff); frontend lint, typecheck, build
- ✅ Makefile commands
- ✅ Clickable student UI preview in Next.js: dashboard, Milo chat walkthrough (consent →
  calculation → alternatives), My Learning, Decision Lab, Resources, Profile & Privacy, and
  an *About this project* progress page for the faculty supervisor. Fictional data; no AI.
- ✅ Frontend unit tests for the preview calculators (Node's built-in test runner)

Remaining for Phase 1 (proposed milestone 1.2):
- ⬜ First migration: `users`, `learner_profiles`, `consent_records` (minimal schema)
- ⬜ Development-only authentication (seeded fictional user, real signed session)
- ⬜ Authorization dependency + tests proving cross-user access is denied
- ⬜ Frontend test runner (Vitest) and one Playwright smoke test
- ⬜ CI workflow (GitHub Actions) running `make check`
- ⬜ Decide whether to adopt shadcn/ui now (needed once forms/dialogs arrive)

## Phase 2 — First complete workflow ⬜
"$500 available, $350 rent, $200 purchase" → `-50` shortfall, explained, with
alternatives. No LLM required for the calculation.
- Chat input UI, `POST /chat/messages`, request validation
- Consent-aware workflow, deterministic safety pre/post checks
- `calculate_cash_flow` Python tool + structured output
- Message and tool-call audit records
- Unit, API, and scenario tests (incl. missing values, malformed input, refusal of consent,
  "just buy it for me" prohibited request)

## Phase 3 — Agent integration ⬜
- Model-provider abstraction; Claude for extraction/explanation
- n8n workflow execution (evaluate against in-process orchestration first)
- MCP server exposing the approved tools via the same authz layer
- Tool error handling, run tracing, token/latency metrics

## Phase 4 — Student learning features ⬜
Learner profiles, learning planner, lessons, knowledge checks, student-controlled memory,
data export/deletion.

## Phase 5 — Advanced agent experiments ⬜
Specialist agents, consensus vs. single-agent baseline, prompt versioning with human
approval, routing optimization, reverse prompting.

## Phase 6 — Evaluation & hardening ⬜
Synthetic eval datasets (all scenario types in the project brief), regression suite,
security tests, performance measurement, demo for the research team.
