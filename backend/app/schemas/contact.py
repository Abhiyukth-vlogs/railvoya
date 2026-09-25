from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional
from datetime import datetime

class ContactCreateRequest(BaseModel):
    full_name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    phone: Optional[str] = Field(default=None, pattern=r"^[6-9]\d{9}$")
    subject: str = Field(min_length=3, max_length=200)
    message: str = Field(min_length=10, max_length=2000)

class ContactResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    full_name: str
    email: str
    subject: str
    message: str
    status: str
    confirmation_message: str = "Your message was saved"
    created_at: datetime
