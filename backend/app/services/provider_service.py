import uuid
from datetime import datetime, timezone
from typing import List, Optional
from app.core.database import db
from app.models.provider import ServiceProviderCreate

async def create_provider(provider_data: ServiceProviderCreate, current_user: dict):
    provider_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    
    provider_doc = {
        "id": provider_id,
        "name": provider_data.name,
        "description": provider_data.description,
        "services": provider_data.services,
        "disability_focus": provider_data.disability_focus,
        "location": provider_data.location,
        "website": provider_data.website,
        "email": provider_data.email,
        "phone": provider_data.phone,
        "owner_id": current_user["id"],
        "is_verified": False,
        "rating": 0.0,
        "reviews_count": 0,
        "created_at": now
    }
    
    await db.providers.insert_one(provider_doc)
    return {k: v for k, v in provider_doc.items() if k != "_id"}

async def get_providers(
    service: Optional[str] = None,
    disability_focus: Optional[str] = None,
    location: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 50
):
    query = {}
    if service:
        query["services"] = service
    if disability_focus:
        query["disability_focus"] = disability_focus
    if location:
        query["location"] = {"$regex": location, "$options": "i"}
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}}
        ]
    
    providers = await db.providers.find(query, {"_id": 0}).limit(limit).to_list(limit)
    return providers

async def get_provider_by_id(provider_id: str):
    provider = await db.providers.find_one({"id": provider_id}, {"_id": 0})
    return provider
