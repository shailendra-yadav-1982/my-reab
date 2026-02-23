from fastapi import APIRouter
from typing import List, Optional
from app.models.user import UserResponse
from app.services import user_service

router = APIRouter()

@router.get("/", response_model=List[UserResponse])
async def get_users(
    user_type: Optional[str] = None,
    disability_category: Optional[str] = None,
    location: Optional[str] = None,
    limit: int = 50
):
    return await user_service.get_users(user_type, disability_category, location, limit)

@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: str):
    user = await user_service.get_user_by_id(user_id)
    if not user:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="User not found")
    return user
