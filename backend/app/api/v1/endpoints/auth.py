from fastapi import APIRouter, Depends, Request
from app.core.security import get_current_user
from app.core.config import oauth, OIDC_ISSUER_URL
from app.models.user import UserCreate, UserLogin, UserResponse, UserUpdate
from app.services import auth_service, user_service

router = APIRouter()

@router.post("/register", response_model=dict)
async def register(user_data: UserCreate):
    return await auth_service.register_user(user_data)

@router.post("/login", response_model=dict)
async def login(credentials: UserLogin):
    return await auth_service.login_user(credentials)

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=UserResponse)
async def update_me(update_data: UserUpdate, current_user: dict = Depends(get_current_user)):
    return await user_service.update_user(current_user["id"], update_data)
