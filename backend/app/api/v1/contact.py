from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.contact import ContactCreateRequest, ContactResponse
from app.models.contact import ContactSubmission
from app.api.deps import get_current_user_optional
from app.models.user import User
from typing import Optional

router = APIRouter(prefix="/contact", tags=["Contact & Support"])

@router.post("", response_model=ContactResponse, status_code=status.HTTP_201_CREATED)
async def submit_contact_message(
    payload: ContactCreateRequest,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db)
):
    submission = ContactSubmission(
        user_id=current_user.id if current_user else None,
        full_name=payload.full_name.strip(),
        email=payload.email.strip(),
        phone=payload.phone.strip() if payload.phone else None,
        subject=payload.subject.strip(),
        message=payload.message.strip(),
        status="RECEIVED"
    )
    db.add(submission)
    await db.commit()
    await db.refresh(submission)
    return submission
