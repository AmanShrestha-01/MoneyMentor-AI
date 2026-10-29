# MoneyMentor

**Learn Money. Make smarter decisions.**

MoneyMentor is an academic research prototype: a bounded, student-controlled, agentic AI
platform for financial **education** and **decision support** for college students. It
supports the research project *Adaptive Agentic AI Financial Capability and Well-Being
Intervention for Underserved College Students*.

**Faculty supervisor:** Dr. Md Rahman, Professor and Associate Chair, Department of
Computer Science, Morgan State University.

> **Status: Phase 1 foundation + clickable student UI preview.** The web app has six
> student screens (dashboard, Milo chat walkthrough, learning, Decision Lab, resources,
> privacy) and an *About this project* progress page at `/project`. All data is
> fictional, and **no AI model is connected yet** — the Milo chat is a scripted
> walkthrough. The backend currently provides health checks only.
> See [docs/ROADMAP.md](docs/ROADMAP.md).

MoneyMentor is **not** a financial adviser. It never accesses bank accounts, moves money,
applies for financial products, or makes decisions for students. See
[docs/RESEARCH_BOUNDARIES.md](docs/RESEARCH_BOUNDARIES.md).

## Tech stack

**In use**

| Layer | Technology |
|---|---|
| Frontend | Next.js 16.4 (App Router, Cache Components), React 19.3, TypeScript 5.9, Tailwind CSS 4.3 |
| Backend | Python 3.12, FastAPI 0.162, Pydantic 2.14, Uvicorn 0.54 |
| Database | PostgreSQL 18, SQLAlchemy 2.1, Alembic 1.20, psycopg 3.3 |
| Testing & quality | pytest 9.2, Ruff 0.17, ESLint 9, Node's built-in test runner (`node:test`) |
| Local infrastructure | Docker Compose (optional), Make |

**Planned** (not yet installed — see [docs/ROADMAP.md](docs/ROADMAP.md))

| Purpose | Technology | Sprint |
|---|---|---|
| Reasoning and explanations | Claude (primary), Gemini (optional), behind a model-provider abstraction | 2 |
| Workflow orchestration | n8n | 2 |
| Approved tool access | Model Context Protocol (MCP) | 2–3 |
| Retrieval over approved content | pgvector | 3 |
| Agent evaluation | Promptfoo | 4 |
| Tracing and observability | Langfuse | 4 |
| UI testing | Playwright | 4 |

## Repository layout

```
apps/web/          Next.js 16 frontend (App Router, TypeScript, Tailwind CSS 4)
services/api/      FastAPI backend (Python 3.12, SQLAlchemy 2.1, Alembic, psycopg 3)
infra/             Local PostgreSQL (Docker Compose, or SQL for a native install)
workflows/n8n/     n8n workflow exports (Phase 3, empty)
prompts/           Versioned agent prompts (Phase 3+, empty)
evals/             Synthetic agent evaluation scenarios (Phase 3+, empty)
tests/             Cross-service / end-to-end tests (later, empty)
docs/              Architecture, roadmap, decisions, research boundaries, learning notes
```

## Prerequisites

| Tool | Version used | Notes |
|---|---|---|
| Python | 3.12 | macOS system Python 3.9 is too old. `brew install python@3.12` |
| Node.js | 22+ (tested on 26) | npm included |
| PostgreSQL | 18 | Docker **or** a native install (see below) |

## Quick start

### 1. Install dependencies

```bash
make setup
```

This creates `services/api/.venv`, installs Python and npm packages, and copies
`.env.example` files to `services/api/.env` and `apps/web/.env.local` if they don't exist.

### 2. Start PostgreSQL — pick one

**Option A — Docker** (database on host port 5433, matches the default `.env`):

```bash
make db-up
```

**Option B — existing native PostgreSQL on port 5432**: create a dedicated role and
database (prompts for your Postgres superuser password), then point the API at it:

```bash
psql -h localhost -p 5432 -U postgres -f infra/postgres/create_dev_db.sql
# in services/api/.env:
# DATABASE_URL=postgresql+psycopg://moneymentor:moneymentor_dev@localhost:5432/moneymentor
```

### 3. Apply migrations

```bash
make migrate
```

(There are no tables yet; this creates Alembic's version-tracking table.)

### 4. Run the app — two terminals

```bash
make api   # FastAPI at http://localhost:8000  (interactive docs: /docs)
make web   # Next.js at http://localhost:3000
```

Open http://localhost:3000. The footer shows live API and database status.

| URL | Purpose |
|---|---|
| http://localhost:8000/health | Liveness: is the API process up? |
| http://localhost:8000/health/ready | Readiness: can it reach the database? (503 if not) |
| http://localhost:8000/docs | OpenAPI docs (development only) |

## Checks

```bash
make check       # everything below
make api-check   # ruff lint + format check + pytest
make web-check   # eslint + tsc + unit tests (node:test) + production build
```

The database integration test is skipped unless `TEST_DATABASE_URL` is set:

```bash
cd services/api
TEST_DATABASE_URL=postgresql+psycopg://moneymentor:moneymentor_dev@localhost:5433/moneymentor \
  .venv/bin/pytest -m integration
```

## Documentation

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — system design; implemented vs. proposed
- [docs/ROADMAP.md](docs/ROADMAP.md) — phases and status
- [docs/DECISIONS.md](docs/DECISIONS.md) — decision log, assumptions, open questions
- [docs/RESEARCH_BOUNDARIES.md](docs/RESEARCH_BOUNDARIES.md) — what this prototype may and may not do
- [docs/LEARNING_NOTES.md](docs/LEARNING_NOTES.md) — engineering concepts explained as they are introduced
- [CLAUDE.md](CLAUDE.md) — rules for AI coding assistants working in this repo
