from fastapi import APIRouter
from app.services import stats_service

router = APIRouter()

@router.get("/")
async def get_stats():
    return await stats_service.get_app_stats()
