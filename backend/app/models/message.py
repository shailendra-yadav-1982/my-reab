from pydantic import BaseModel
from typing import List

class MessageCreate(BaseModel):
    recipient_id: str
    content: str

class MessageResponse(BaseModel):
    id: str
    sender_id: str
    sender_name: str
    recipient_id: str
    content: str
    is_read: bool = False
    created_at: str

class ConversationResponse(BaseModel):
    user_id: str
    user_name: str
    last_message: str
    last_message_time: str
    unread_count: int
