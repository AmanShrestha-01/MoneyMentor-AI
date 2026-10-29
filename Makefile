# Convenience commands. Each target is a thin wrapper — read it to see the real command.
PYTHON ?= python3.12
API := services/api
WEB := apps/web

.PHONY: setup api-setup web-setup db-up db-down migrate api web check api-check web-check

setup: api-setup web-setup ## Install all dependencies

api-setup:
	cd $(API) && $(PYTHON) -m venv .venv && .venv/bin/pip install -e ".[dev]"
	@test -f $(API)/.env || cp $(API)/.env.example $(API)/.env

web-setup:
	cd $(WEB) && npm install
	@test -f $(WEB)/.env.local || cp $(WEB)/.env.example $(WEB)/.env.local

db-up: ## Start Docker Postgres (requires Docker)
	docker compose -f infra/docker-compose.yml up -d --wait

db-down:
	docker compose -f infra/docker-compose.yml down

migrate:
	cd $(API) && .venv/bin/alembic upgrade head

api: ## Run FastAPI on :8000 with auto-reload
	cd $(API) && .venv/bin/uvicorn app.main:app --reload --port 8000

web: ## Run Next.js on :3000
	cd $(WEB) && npm run dev

check: api-check web-check ## Run every automated check

api-check:
	cd $(API) && .venv/bin/ruff check . && .venv/bin/ruff format --check . && .venv/bin/pytest

web-check:
	cd $(WEB) && npm run lint && npm run typecheck && npm test && npm run build
