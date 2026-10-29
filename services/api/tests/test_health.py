import os

import pytest
from fastapi.testclient import TestClient

from app.api.routes.health import get_database_check


def test_liveness_reports_service_metadata(client: TestClient) -> None:
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {
        "status": "ok",
        "service": "MoneyMentor API",
        "version": "0.1.0",
        "environment": "test",
    }


def test_readiness_ok_when_database_reachable(client: TestClient) -> None:
    client.app.dependency_overrides[get_database_check] = lambda: lambda: True

    response = client.get("/health/ready")

    assert response.status_code == 200
    assert response.json() == {"status": "ok", "checks": {"database": "ok"}}


def test_readiness_503_when_database_unreachable(client: TestClient) -> None:
    client.app.dependency_overrides[get_database_check] = lambda: lambda: False

    response = client.get("/health/ready")

    assert response.status_code == 503
    body = response.json()
    assert body == {"status": "unavailable", "checks": {"database": "unavailable"}}


def test_cors_allows_configured_origin_only(client: TestClient) -> None:
    allowed = client.get("/health", headers={"Origin": "http://localhost:3000"})
    blocked = client.get("/health", headers={"Origin": "https://evil.example"})

    assert allowed.headers.get("access-control-allow-origin") == "http://localhost:3000"
    assert "access-control-allow-origin" not in blocked.headers


def test_docs_hidden_outside_development(client: TestClient) -> None:
    assert client.get("/docs").status_code == 404


@pytest.mark.integration
@pytest.mark.skipif(not os.getenv("TEST_DATABASE_URL"), reason="TEST_DATABASE_URL not set")
def test_readiness_against_real_database(monkeypatch: pytest.MonkeyPatch) -> None:
    from app.core.config import get_settings
    from app.db.session import get_engine, get_sessionmaker
    from app.main import create_app

    monkeypatch.setenv("DATABASE_URL", os.environ["TEST_DATABASE_URL"])
    for cached in (get_settings, get_engine, get_sessionmaker):
        cached.cache_clear()
    try:
        with TestClient(create_app()) as real_client:
            response = real_client.get("/health/ready")
        assert response.status_code == 200
        assert response.json()["checks"]["database"] == "ok"
    finally:
        for cached in (get_settings, get_engine, get_sessionmaker):
            cached.cache_clear()
