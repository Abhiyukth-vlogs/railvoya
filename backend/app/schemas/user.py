from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)
    full_name: str = Field(min_length=2, max_length=100)
    phone: Optional[str] = Field(default=None, pattern=r"^[6-9]\d{9}$")

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    email: str
    full_name: str
    phone: Optional[str] = None
    created_at: datetime

class SavedPassengerCreate(BaseModel):
    full_name: str = Field(min_length=2, max_length=100)
    age: int = Field(ge=1, le=120)
    gender: str = Field(pattern=r"^(Male|Female|Transgender)$")
    berth_preference: str = Field(default="No Preference")
    food_preference: str = Field(default="No Food")
    senior_citizen: bool = False

class SavedPassengerResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    full_name: str
    age: int
    gender: str
    berth_preference: str
    food_preference: str
    senior_citizen: bool
    created_at: datetime
