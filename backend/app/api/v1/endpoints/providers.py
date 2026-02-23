from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from app.core.security import get_current_user
from app.models.provider import ServiceProviderCreate, ServiceProviderResponse
from app.services import provider_service

router = APIRouter()

@router.post("/", response_model=ServiceProviderResponse)
async def create_service_provider(provider_data: ServiceProviderCreate, current_user: dict = Depends(get_current_user)):
    return await provider_service.create_provider(provider_data, current_user)

@router.get("/", response_model=List[ServiceProviderResponse])
async def get_providers(
    service: Optional[str] = None,
    disability_focus: Optional[str] = None,
    location: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 50
):
    return await provider_service.get_providers(service, disability_focus, location, search, limit)

@router.get("/{provider_id}", response_model=ServiceProviderResponse)
async def get_provider(provider_id: str):
    provider = await provider_service.get_provider_by_id(provider_id)
    if not provider:
        raise HTTPException(status_code=404, detail="Provider not found")
    return provider
