from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from app.core.security import get_current_user
from app.models.event import EventCreate, EventResponse
from app.services import event_service

router = APIRouter()

@router.post("/", response_model=EventResponse)
async def create_event(event_data: EventCreate, current_user: dict = Depends(get_current_user)):
    return await event_service.create_event(event_data, current_user)

@router.get("/", response_model=List[EventResponse])
async def get_events(
    event_type: Optional[str] = None,
    is_virtual: Optional[bool] = None,
    location: Optional[str] = None,
    upcoming: bool = True,
    limit: int = 50
):
    return await event_service.get_events(event_type, is_virtual, location, upcoming, limit)

@router.get("/{event_id}", response_model=EventResponse)
async def get_event(event_id: str):
    event = await event_service.get_event_by_id(event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

@router.post("/{event_id}/attend")
async def attend_event(event_id: str, current_user: dict = Depends(get_current_user)):
    return await event_service.attend_event(event_id, current_user["id"])
