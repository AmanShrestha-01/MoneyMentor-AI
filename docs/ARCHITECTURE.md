# Architecture

Each section is labeled **Implemented** (exists and verified) or **Proposed** (design
intent, not built). Proposed designs will change as we learn; record changes in
`DECISIONS.md`.

---

## 1. System overview

```
                         ┌───────────────────────────────────────────────┐
  Student browser ──────▶│ apps/web  (Next.js)                           │
                         │  UI only. Server components call the API.     │
                         └───────────────┬───────────────────────────────┘
                                         │ HTTPS + session (Proposed)
                         ┌───────────────▼───────────────────────────────┐
                         │ services/api  (FastAPI)                       │
                         │  POLICY ENFORCEMENT POINT                     │
                         │  authn · authz · consent · validation ·       │
                         │  safety checks · tool execution · audit       │
                         └──┬──────────────┬──────────────┬──────────────┘
                            │              │              │
                 ┌──────────▼───┐  ┌───────▼───────┐  ┌───▼──────────────┐
                 │ PostgreSQL   │  │ Model provider│  │ n8n (Proposed)   │
                 │ (Implemented │  │ abstraction   │  │ workflow runs,   │
                 │  connection) │  │ Claude/Gemini │  │ retries, routing │
                 └──────────────┘  │ (Proposed)    │  │ calls back into  │
                                   └───────────────┘  │ the API only     │
                                                      └──────────────────┘
```

### Responsibility split (the most important design rule)

| Component | Decides | Must never |
|---|---|---|
| **Claude** (LLM) | How to interpret language; which *permitted* action to propose next | Hold credentials, choose the user identity, execute tools directly, change its own permissions |
| **n8n** | Sequencing, retries, timeouts, routing between steps | Hold user data at rest by default; reach the database directly; log full conversations by default |
| **FastAPI** | Who the user is, what they may do, whether consent exists, whether a request is in scope, what tools run | Trust a user ID that came from the client, the LLM, or n8n |
| **Python tool functions** | Exact, deterministic answers (cash flow, loan payment) | Depend on an LLM for arithmetic |

An LLM *proposes*; the backend *disposes*. Every tool call is re-authorized by FastAPI
using the authenticated session, regardless of who asked for it.

---

## 2. Implemented (Phase 1)

### Frontend — `apps/web`
- Next.js 16.4 App Router, React 19.3, TypeScript, Tailwind CSS 4, ESLint.
- Cache Components + Partial Prefetching enabled (framework default). The dashboard is a
  static shell; the API status streams in per request inside `<Suspense>`.
- Design tokens in `src/app/globals.css` using shadcn/ui variable names.
- `src/lib/brand.ts` — product/assistant naming (single source).
- `src/lib/demo-fixtures.ts` — **fictional** dashboard data, explicitly labeled.
- `src/lib/api.ts` — server-only API client; `API_BASE_URL` never reaches the browser.
- `src/components/app-shell.tsx` — responsive navigation (sidebar ≥1024px, scrolling top
  nav below); unbuilt sections shown as disabled "Soon" items, not links.

### Backend — `services/api`
- FastAPI app factory (`app/main.py`), CORS restricted to configured origins, OpenAPI
  docs only when `ENVIRONMENT=development`.
- Settings from environment via pydantic-settings (`app/core/config.py`).
- SQLAlchemy 2.1 engine/session with `pool_pre_ping` and connect timeout
  (`app/db/session.py`); declarative base with a constraint naming convention
  (`app/db/base.py`).
- Alembic configured to read `DATABASE_URL` from settings; no revisions yet.
- `GET /health` (liveness) and `GET /health/ready` (readiness; 503 when DB unreachable,
  without leaking error details).

### Infrastructure
- `infra/docker-compose.yml` — PostgreSQL 18 on host port 5433 (unverified locally:
  Docker isn't installed on the primary dev machine).
- `infra/postgres/create_dev_db.sql` — role/database for a native PostgreSQL install.

---

## 3. Proposed: the six agent functions

The six functions from the research proposal are **capabilities**, not necessarily six
LLM instances. Most begin as deterministic code; an LLM is added only where language
understanding is genuinely required.

| Function | Initial implementation | LLM role | Key guardrail |
|---|---|---|---|
| A. Learner profile | CRUD service + DB tables | None initially | Student can view/correct/export/delete; consent-gated fields |
| B. Learning planner | Rule-based gap → lesson selection | Later: explain *why* a lesson | Only lessons from the approved library |
| C. Decision support | Python calculators + structured output | Extract scenario values, explain trade-offs | Never decides; asks for missing values instead of guessing |
| D. Behavioral support | Policy table: (state → allowed prompt types incl. "none") | Phrase reflective questions | Frequency caps; opt-out respected; "no intervention" always valid |
| E. Resource navigation | Search over `approved_resources` | Match need → resource category | Returns only stored, verified listings; never invents eligibility |
| F. Safety & escalation | Deterministic classifiers/rules in code, run *before and after* any LLM call | Optional secondary check only | Code rules win; never overridden by agent vote |

### First workflow (Phase 2 target)

> "I have $500, rent is $350, and I want to buy something for $200. What would my
> remaining balance be?"

```
POST /chat/messages
  → authenticate session → load consent
  → safety pre-check (code)             : in scope? prohibited action requested?
  → extract inputs                       : Phase 2 = structured form/regex; Phase 3 = Claude
  → missing value? → ask (reverse prompt), stop
  → calculate_cash_flow(500, [350, 200]) : Python → remaining = -50
  → build structured result              : shortfall $50 under stated assumptions
  → offer alternatives                   : e.g., purchase after next income; smaller amount
  → safety post-check (code)             : no "you should/shouldn't buy" language
  → persist message + tool_call audit row
```

The system explains a $50 shortfall under the stated assumptions. It never authorizes or
blocks the purchase.

---

## 4. Proposed: data model

PostgreSQL, UUID primary keys, `created_at`/`updated_at` on all tables, explicit foreign
keys with deliberate `ON DELETE` behavior.

| Table | Purpose | Notes |
|---|---|---|
| `users` | Account identity | No financial data. `research_condition_id` FK (nullable). |
| `learner_profiles` | Competencies, goals, preferences | 1:1 user; student-editable; JSONB for competency map |
| `consent_records` | Granular, append-only consent events | `scope`, `granted`, `version`, `recorded_at`; latest row wins; never updated in place |
| `chat_rooms` | Conversation spaces | `room_type` enum controls allowed tools |
| `messages` | Chat messages | Content retention-limited; redaction flag; index `(room_id, created_at)` |
| `educational_lessons` | Approved lesson library | Versioned; `reviewed_by`, `source_refs` |
| `learning_progress` | Per-user lesson state | Unique `(user_id, lesson_id)` |
| `agent_runs` | One row per workflow execution | `prompt_version_id`, model, latency, token counts, outcome — **no raw prompt by default** |
| `tool_calls` | Audit of each tool execution | Tool name, validated input hash/summary, output summary, authz decision, duration |
| `feedback` | Student helpfulness ratings | Linked to message or run |
| `prompt_versions` | Versioned prompts | `status`: draft → evaluated → approved → active → retired; `approved_by` |
| `approved_resources` | Verified campus/community resources | `verified_at`, `verified_by`, `source_url`, `expires_at` |
| `research_conditions` | Study arms (feature flags per arm) | Added only after research-team approval |
| `audit_events` | Security-relevant events | Logins, consent changes, exports, deletions |

**Access control:** every query for user-owned data filters by the session user in the
service layer. Row-Level Security in PostgreSQL is a candidate second layer (decision
pending).

**Retention:** message content gets a retention window (to be set with the research
team); `agent_runs` keep metrics but not content; exports and deletions are audited.

---

## 5. Proposed: API surface

All endpoints except `/health*` require authentication. Resource-level authorization is
enforced in the service layer.

```
GET    /health                 ✅ implemented
GET    /health/ready           ✅ implemented
GET    /profile                PATCH /profile
GET    /chat/rooms             POST  /chat/rooms
POST   /chat/messages
GET    /learning/progress      POST  /learning/feedback
POST   /tools/cash-flow        POST  /tools/budget-comparison
GET    /resources
GET    /consents               POST  /consents
```

### Authentication (open decision)
- **Production/research:** institutional SSO (OIDC/SAML) — requires university IT.
- **Local development:** a dev-only login that issues a *real signed session* for a seeded
  fictional user and is compiled out / refused unless `ENVIRONMENT=development`. It goes
  through the same auth dependency as real login, so authorization code is exercised.

---

## 6. Proposed: tools and MCP

Tools are plain, typed Python functions in a service layer. Two thin adapters expose them:
the REST API (`/tools/*`) and, later, an MCP server. **Both adapters call the same
authorization check**, so permissions live in exactly one place.

Initial tool set: `calculate_cash_flow`, `compare_budget_scenarios`,
`calculate_loan_payment`, `retrieve_learning_progress`, `search_approved_resources`.

Each tool has: description, Pydantic input/output models, input validation, per-user
authorization, typed errors, and an audit record. No tool runs arbitrary SQL or code.

---

## 7. Proposed: research-condition isolation

Three conditions: (1) conventional digital education, (2) AI-personalized education
without proactive support, (3) agentic education with opt-in decision support and
resource navigation.

- A user's condition is assigned server-side and stored; the client never chooses it.
- Feature access is checked server-side per condition (e.g., `/tools/*` and proactive
  prompts return 403 outside condition 3), not just hidden in the UI.
- Analytics queries are condition-scoped; logs carry the condition ID.
- Not built until the research team approves procedures (see `RESEARCH_BOUNDARIES.md`).

---

## 8. Proposed: advanced experiments (Phase 5)

- **Chat rooms** with per-room tool allow-lists.
- **Multi-agent consensus** evaluated against a single-agent baseline before any default
  use. Agreement ≠ correctness; safety checks run independently of any vote.
- **Prompt lifecycle:** propose → store as new version → eval + regression → compare →
  human approval → deploy → rollback. No automated changes to live prompts, safety
  constraints, or tool permissions.
- **Reverse prompting:** ask a clarifying question when a required value is missing.
