from typing import List, Optional
from app.core.database import db
from app.models.user import UserUpdate

async def get_users(
    user_type: Optional[str] = None,
    disability_category: Optional[str] = None,
    location: Optional[str] = None,
    limit: int = 50
):
    query = {}
    if user_type:
        query["user_type"] = user_type
    if disability_category:
        query["disability_categories"] = disability_category
    if location:
        query["location"] = {"$regex": location, "$options": "i"}
    
    users = await db.users.find(query, {"_id": 0, "password": 0}).limit(limit).to_list(limit)
    return users

async def get_user_by_id(user_id: str):
    user = await db.users.find_one({"id": user_id}, {"_id": 0, "password": 0})
    return user

async def update_user(user_id: str, update_data: UserUpdate):
    update_dict = {k: v for k, v in update_data.model_dump().items() if v is not None}
    if update_dict:
        await db.users.update_one({"id": user_id}, {"$set": update_dict})
    
    updated_user = await db.users.find_one({"id": user_id}, {"_id": 0, "password": 0})
    return updated_user
