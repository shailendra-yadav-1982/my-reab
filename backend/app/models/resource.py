from pydantic import BaseModel
from typing import List, Optional

class ResourceCreate(BaseModel):
    title: str
    description: str
    category: str
    url: Optional[str] = None
    content: Optional[str] = None
    tags: List[str] = []

class ResourceResponse(BaseModel):
    id: str
    title: str
    description: str
    category: str
    url: Optional[str] = None
    content: Optional[str] = None
    tags: List[str]
    author_id: str
    author_name: str
    created_at: str
    views: int = 0
