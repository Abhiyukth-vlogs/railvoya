from typing import List
from fastapi import APIRouter, Depends, Response, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.config import settings
from app.schemas.user import (
    UserCreate,
    UserLogin,
    UserResponse,
    SavedPassengerCreate,
    SavedPassengerResponse,
)
from app.services.auth_service import AuthService
from app.api.deps import get_current_user_optional, get_current_user_required
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["Authentication & Account"])

@router.post("/signup", response_model=UserResponse)
async def signup(
    payload: UserCreate,
    response: Response,
    db: AsyncSession = Depends(get_db)
):
    user = await AuthService.create_user(
        db=db,
        email=payload.email,
        password=payload.password,
        full_name=payload.full_name,
        phone=payload.phone
    )
    session = await AuthService.create_session(db, user.id)
    
    # Set HttpOnly session cookie
    response.set_cookie(
        key=settings.SESSION_COOKIE_NAME,
        value=session.session_token,
        max_age=settings.SESSION_MAX_AGE_SECONDS,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite=settings.COOKIE_SAMESITE,
        path="/"
    )
    return user

@router.post("/login", response_model=UserResponse)
async def login(
    payload: UserLogin,
    response: Response,
    db: AsyncSession = Depends(get_db)
):
    user = await AuthService.authenticate_user(
        db=db,
        email=payload.email,
        password=payload.password
    )
    session = await AuthService.create_session(db, user.id)
    
    # Set HttpOnly session cookie
    response.set_cookie(
        key=settings.SESSION_COOKIE_NAME,
        value=session.session_token,
        max_age=settings.SESSION_MAX_AGE_SECONDS,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite=settings.COOKIE_SAMESITE,
        path="/"
    )
    return user

@router.post("/logout")
async def logout(
    response: Response,
    current_user: User = Depends(get_current_user_required),
    db: AsyncSession = Depends(get_db)
):
    # Clear cookie
    response.delete_cookie(
        key=settings.SESSION_COOKIE_NAME,
        path="/"
    )
    return {"message": "Successfully logged out."}

@router.get("/me", response_model=UserResponse)
async def get_current_profile(
    current_user: User = Depends(get_current_user_required)
):
    return current_user

@router.get("/passengers", response_model=List[SavedPassengerResponse])
async def list_saved_passengers(
    current_user: User = Depends(get_current_user_required),
    db: AsyncSession = Depends(get_db)
):
    return await AuthService.get_saved_passengers(db, current_user.id)

@router.post("/passengers", response_model=SavedPassengerResponse)
async def add_saved_passenger(
    payload: SavedPassengerCreate,
    current_user: User = Depends(get_current_user_required),
    db: AsyncSession = Depends(get_db)
):
    return await AuthService.save_passenger(
        db=db,
        user_id=current_user.id,
        full_name=payload.full_name,
        age=payload.age,
        gender=payload.gender,
        berth_preference=payload.berth_preference,
        food_preference=payload.food_preference,
        senior_citizen=payload.senior_citizen
    )

@router.delete("/passengers/{passenger_id}")
async def remove_saved_passenger(
    passenger_id: str,
    current_user: User = Depends(get_current_user_required),
    db: AsyncSession = Depends(get_db)
):
    success = await AuthService.delete_saved_passenger(db, current_user.id, passenger_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"error": "PASSENGER_NOT_FOUND", "message": "Saved passenger not found."}
        )
    return {"message": "Saved passenger removed."}
