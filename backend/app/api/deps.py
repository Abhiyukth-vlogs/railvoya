from typing import Optional
from fastapi import Depends, Request, Cookie
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.config import settings
from app.models.user import User
from app.services.auth_service import AuthService

async def get_current_user_optional(
    request: Request,
    db: AsyncSession = Depends(get_db)
) -> Optional[User]:
    """Retrieve current user from HttpOnly session cookie or Authorization header, or None if guest."""
    # 1. Check HttpOnly cookie
    token = request.cookies.get(settings.SESSION_COOKIE_NAME)
    
    # 2. Check Authorization Bearer header fallback
    if not token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1].strip()

    if not token:
        return None

    return await AuthService.get_user_by_session_token(db, token)

async def get_current_user_required(
    user: Optional[User] = Depends(get_current_user_optional)
) -> User:
    """Enforce authentication requirement for protected endpoints."""
    from fastapi import HTTPException, status
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"error": "AUTHENTICATION_REQUIRED", "message": "Please log in to continue."}
        )
    return user
