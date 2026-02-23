from fastapi import APIRouter, Depends
from typing import List
from app.core.security import get_current_user
from app.models.message import MessageCreate, MessageResponse, ConversationResponse
from app.services import message_service

router = APIRouter()

@router.post("/", response_model=MessageResponse)
async def send_message(message_data: MessageCreate, current_user: dict = Depends(get_current_user)):
    return await message_service.send_message(message_data, current_user)

@router.get("/conversations", response_model=List[ConversationResponse])
async def get_conversations(current_user: dict = Depends(get_current_user)):
    return await message_service.get_conversations(current_user["id"])

@router.get("/{user_id}", response_model=List[MessageResponse])
async def get_messages_with_user(user_id: str, current_user: dict = Depends(get_current_user)):
    return await message_service.get_messages_with_user(user_id, current_user["id"])
