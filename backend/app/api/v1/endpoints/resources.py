from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from app.core.security import get_current_user
from app.models.resource import ResourceCreate, ResourceResponse
from app.services import resource_service

router = APIRouter()

@router.post("/", response_model=ResourceResponse)
async def create_resource(resource_data: ResourceCreate, current_user: dict = Depends(get_current_user)):
    return await resource_service.create_resource(resource_data, current_user)

@router.get("/", response_model=List[ResourceResponse])
async def get_resources(
    category: Optional[str] = None,
    tag: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 50
):
    return await resource_service.get_resources(category, tag, search, limit)

@router.get("/{resource_id}", response_model=ResourceResponse)
async def get_resource(resource_id: str):
    resource = await resource_service.get_resource_by_id(resource_id)
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    return resource
