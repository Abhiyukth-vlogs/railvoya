from datetime import datetime, timezone, timedelta
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from fastapi import HTTPException, status
from app.models.user import User, Session
from app.models.passenger import SavedPassenger
from app.core.security import hash_password, verify_password, generate_session_token
from app.core.config import settings

def utc_now():
    return datetime.now(timezone.utc)

class AuthService:
    @staticmethod
    async def create_user(
        db: AsyncSession,
        email: str,
        password: str,
        full_name: str,
        phone: Optional[str] = None
    ) -> User:
        # Check if email exists
        res = await db.execute(select(User).where(User.email == email.lower().strip()))
        if res.scalars().first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={"error": "EMAIL_ALREADY_EXISTS", "message": "An account with this email already exists."}
            )

        hashed = hash_password(password)
        user = User(
            email=email.lower().strip(),
            password_hash=hashed,
            full_name=full_name.strip(),
            phone=phone.strip() if phone else None
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
        return user

    @staticmethod
    async def authenticate_user(
        db: AsyncSession,
        email: str,
        password: str
    ) -> User:
        res = await db.execute(select(User).where(User.email == email.lower().strip()))
        user = res.scalars().first()
        if not user or not verify_password(password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail={"error": "INVALID_CREDENTIALS", "message": "Invalid email or password."}
            )
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={"error": "ACCOUNT_DISABLED", "message": "This account is inactive."}
            )
        return user

    @staticmethod
    async def create_session(db: AsyncSession, user_id: str) -> Session:
        token = generate_session_token()
        expires = utc_now() + timedelta(seconds=settings.SESSION_MAX_AGE_SECONDS)
        session = Session(
            user_id=user_id,
            session_token=token,
            expires_at=expires
        )
        db.add(session)
        await db.commit()
        await db.refresh(session)
        return session

    @staticmethod
    async def get_user_by_session_token(db: AsyncSession, token: str) -> Optional[User]:
        if not token:
            return None
        res = await db.execute(
            select(Session).where(
                Session.session_token == token,
                Session.expires_at > utc_now()
            )
        )
        session = res.scalars().first()
        if not session:
            return None

        user_res = await db.execute(select(User).where(User.id == session.user_id))
        return user_res.scalars().first()

    @staticmethod
    async def invalidate_session(db: AsyncSession, token: str) -> None:
        if token:
            await db.execute(delete(Session).where(Session.session_token == token))
            await db.commit()

    @staticmethod
    async def get_saved_passengers(db: AsyncSession, user_id: str) -> List[SavedPassenger]:
        res = await db.execute(
            select(SavedPassenger)
            .where(SavedPassenger.user_id == user_id)
            .order_by(SavedPassenger.created_at.desc())
        )
        return list(res.scalars().all())

    @staticmethod
    async def save_passenger(
        db: AsyncSession,
        user_id: str,
        full_name: str,
        age: int,
        gender: str,
        berth_preference: str = "No Preference",
        food_preference: str = "No Food",
        senior_citizen: bool = False
    ) -> SavedPassenger:
        # Check if identical passenger already saved
        existing = await db.execute(
            select(SavedPassenger).where(
                SavedPassenger.user_id == user_id,
                SavedPassenger.full_name == full_name.strip(),
                SavedPassenger.age == age
            )
        )
        found = existing.scalars().first()
        if found:
            return found

        sp = SavedPassenger(
            user_id=user_id,
            full_name=full_name.strip(),
            age=age,
            gender=gender,
            berth_preference=berth_preference,
            food_preference=food_preference,
            senior_citizen=senior_citizen
        )
        db.add(sp)
        await db.commit()
        await db.refresh(sp)
        return sp

    @staticmethod
    async def delete_saved_passenger(db: AsyncSession, user_id: str, passenger_id: str) -> bool:
        res = await db.execute(
            select(SavedPassenger).where(
                SavedPassenger.id == passenger_id,
                SavedPassenger.user_id == user_id
            )
        )
        p = res.scalars().first()
        if not p:
            return False
        await db.delete(p)
        await db.commit()
        return True
