from pydantic import BaseModel, EmailStr
from typing import List, Optional

# User types match the registration form options
USER_TYPES = ["individual_disabled", "volunteer", "service_provider", "ngo", "caregiver"]
DISABILITY_CATEGORIES = ["physical", "cognitive", "invisible", "psychiatric", "sensory", "multiple", "prefer_not_to_say"]

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    user_type: str = "individual_disabled"
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
    user_type: str = "individual_disabled"
    organization_name: Optional[str] = None
    disability_categories: List[str] = []
    bio: Optional[str] = None
    location: Optional[str] = None
    avatar_url: Optional[str] = None
    onboarding_complete: bool = False
    created_at: Optional[str] = None
    is_verified: bool = False
    auth_provider: Optional[str] = None

class UserUpdate(BaseModel):
    name: Optional[str] = None
    user_type: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    disability_categories: Optional[List[str]] = None
    organization_name: Optional[str] = None
    avatar_url: Optional[str] = None
    onboarding_complete: Optional[bool] = None

class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str
