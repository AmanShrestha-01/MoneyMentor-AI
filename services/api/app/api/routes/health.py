"""Health endpoints.

/health        liveness:  is the process up? Never touches dependencies.
/health/ready  readiness: can it serve real traffic? Checks the database.

Responses deliberately omit error details (hostnames, driver messages) so a public
health check cannot be used to learn about infrastructure.
"""

from collections.abc import Callable
from typing import Annotated, Literal

from fastapi import APIRouter, Depends, Response, status
from pydantic import BaseModel

from app.core.config import Settings, get_settings
from app.db.session import database_is_reachable

router = APIRouter(prefix="/health", tags=["health"])


class LivenessResponse(BaseModel):
    status: Literal["ok"]
    service: str
    version: str
    environment: str


class ReadinessResponse(BaseModel):
    status: Literal["ok", "unavailable"]
    checks: dict[str, Literal["ok", "unavailable"]]


def get_database_check() -> Callable[[], bool]:
    """Dependency seam so tests can substitute the database check."""
    return database_is_reachable


@router.get("", response_model=LivenessResponse)
def liveness(settings: Annotated[Settings, Depends(get_settings)]) -> LivenessResponse:
    return LivenessResponse(
        status="ok",
        service=settings.app_name,
        version=settings.app_version,
        environment=settings.environment,
    )


@router.get("/ready", response_model=ReadinessResponse)
def readiness(
    response: Response,
    check_database: Annotated[Callable[[], bool], Depends(get_database_check)],
) -> ReadinessResponse:
    database_ok = check_database()
    if not database_ok:
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
    return ReadinessResponse(
        status="ok" if database_ok else "unavailable",
        checks={"database": "ok" if database_ok else "unavailable"},
    )
