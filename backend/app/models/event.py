from pydantic import BaseModel
from typing import List, Optional

class EventCreate(BaseModel):
    title: str
    description: str
    event_type: str
    location: str
    is_virtual: bool = False
    virtual_link: Optional[str] = None
    start_date: str
    end_date: Optional[str] = None
    accessibility_features: List[str] = []

class EventResponse(BaseModel):
    id: str
    title: str
    description: str
    event_type: str
    location: str
    is_virtual: bool
    virtual_link: Optional[str] = None
    start_date: str
    end_date: Optional[str] = None
    accessibility_features: List[str]
    organizer_id: str
    organizer_name: str
    attendees_count: int = 0
    created_at: str
