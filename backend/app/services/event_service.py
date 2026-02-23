import uuid
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import HTTPException
from app.core.database import db
from app.models.event import EventCreate

async def create_event(event_data: EventCreate, current_user: dict):
    event_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    
    event_doc = {
        "id": event_id,
        "title": event_data.title,
        "description": event_data.description,
        "event_type": event_data.event_type,
        "location": event_data.location,
        "is_virtual": event_data.is_virtual,
        "virtual_link": event_data.virtual_link,
        "start_date": event_data.start_date,
        "end_date": event_data.end_date,
        "accessibility_features": event_data.accessibility_features,
        "organizer_id": current_user["id"],
        "organizer_name": current_user["name"],
        "attendees": [],
        "attendees_count": 0,
        "created_at": now
    }
    
    await db.events.insert_one(event_doc)
    return {k: v for k, v in event_doc.items() if k not in ["_id", "attendees"]}

async def get_events(
    event_type: Optional[str] = None,
    is_virtual: Optional[bool] = None,
    location: Optional[str] = None,
    upcoming: bool = True,
    limit: int = 50
):
    query = {}
    if event_type:
        query["event_type"] = event_type
    if is_virtual is not None:
        query["is_virtual"] = is_virtual
    if location:
        query["location"] = {"$regex": location, "$options": "i"}
    if upcoming:
        query["start_date"] = {"$gte": datetime.now(timezone.utc).isoformat()}
    
    events = await db.events.find(query, {"_id": 0, "attendees": 0}).sort("start_date", 1).limit(limit).to_list(limit)
    return events

async def get_event_by_id(event_id: str):
    event = await db.events.find_one({"id": event_id}, {"_id": 0, "attendees": 0})
    return event

async def attend_event(event_id: str, user_id: str):
    event = await db.events.find_one({"id": event_id})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    attendees = event.get("attendees", [])
    if user_id in attendees:
        # Leave event
        await db.events.update_one(
            {"id": event_id},
            {"$pull": {"attendees": user_id}, "$inc": {"attendees_count": -1}}
        )
        return {"attending": False}
    else:
        # Attend event
        await db.events.update_one(
            {"id": event_id},
            {"$push": {"attendees": user_id}, "$inc": {"attendees_count": 1}}
        )
        return {"attending": True}
