from pydantic import BaseModel, EmailStr
from typing import List, Optional

USER_TYPES = ["individual", "service_provider", "ngo", "caregiver"]
DISABILITY_CATEGORIES = ["physical", "cognitive", "invisible", "psychiatric", "sensory", "multiple", "prefer_not_to_say"]

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    user_type: str = "individual"
    organization_name: Optional[str] = None
    disability_categories: List[str] = []
    bio: Optional[str] = None
    location: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    user_type: str
    organization_name: Optional[str] = None
    disability_categories: List[str] = []
    bio: Optional[str] = None
    location: Optional[str] = None
    avatar_url: Optional[str] = None
    created_at: str
    is_verified: bool = False

class UserUpdate(BaseModel):
    name: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    disability_categories: Optional[List[str]] = None
    organization_name: Optional[str] = None
    avatar_url: Optional[str] = None
