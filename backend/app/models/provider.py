from pydantic import BaseModel
from typing import List, Optional

class ServiceProviderCreate(BaseModel):
    name: str
    description: str
    services: List[str]
    disability_focus: List[str]
    location: str
    website: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None

class ServiceProviderResponse(BaseModel):
    id: str
    name: str
    description: str
    services: List[str]
    disability_focus: List[str]
    location: str
    website: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    owner_id: str
    is_verified: bool = False
    rating: float = 0.0
    reviews_count: int = 0
    created_at: str
