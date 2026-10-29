from collections.abc import Iterator

import pytest
from fastapi.testclient import TestClient

from app.core.config import Settings, get_settings
from app.main import create_app


@pytest.fixture
def settings() -> Settings:
    return Settings(environment="test", cors_origins="http://localhost:3000")


@pytest.fixture
def client(settings: Settings) -> Iterator[TestClient]:
    """A fresh app per test, so dependency overrides never leak between tests."""
    app = create_app(settings)
    app.dependency_overrides[get_settings] = lambda: settings
    with TestClient(app) as test_client:
        yield test_client
