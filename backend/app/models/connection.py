from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime
import uuid

class Connection(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    sender_id: str
    receiver_id: str
    status: Literal["pending", "accepted", "declined"] = "pending"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ConnectionResponse(BaseModel):
    id: str
    sender_id: str
    sender_name: Optional[str] = None
    receiver_id: str
    receiver_name: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: datetime

class ConnectionCreate(BaseModel):
    receiver_id: str

class ConnectionAction(BaseModel):
    action: Literal["accept", "decline"]
