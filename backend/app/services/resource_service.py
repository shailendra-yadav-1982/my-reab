import uuid
from datetime import datetime, timezone
from typing import List, Optional
from app.core.database import db
from app.models.resource import ResourceCreate

async def create_resource(resource_data: ResourceCreate, current_user: dict):
    resource_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    
    resource_doc = {
        "id": resource_id,
        "title": resource_data.title,
        "description": resource_data.description,
        "category": resource_data.category,
        "url": resource_data.url,
        "content": resource_data.content,
        "tags": resource_data.tags,
        "author_id": current_user["id"],
        "author_name": current_user["name"],
        "created_at": now,
        "views": 0
    }
    
    await db.resources.insert_one(resource_doc)
    return {k: v for k, v in resource_doc.items() if k != "_id"}

async def get_resources(
    category: Optional[str] = None,
    tag: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 50
):
    query = {}
    if category:
        query["category"] = category
    if tag:
        query["tags"] = tag
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}}
        ]
    
    resources = await db.resources.find(query, {"_id": 0}).sort("created_at", -1).limit(limit).to_list(limit)
    return resources

async def get_resource_by_id(resource_id: str):
    resource = await db.resources.find_one({"id": resource_id}, {"_id": 0})
    if resource:
        # Increment views
        await db.resources.update_one({"id": resource_id}, {"$inc": {"views": 1}})
        resource["views"] += 1
    return resource
