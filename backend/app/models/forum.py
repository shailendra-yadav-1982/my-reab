from pydantic import BaseModel
from typing import List

class ForumPostCreate(BaseModel):
    title: str
    content: str
    category: str
    tags: List[str] = []

class ForumPostResponse(BaseModel):
    id: str
    title: str
    content: str
    category: str
    tags: List[str]
    author_id: str
    author_name: str
    author_type: str
    created_at: str
    updated_at: str
    likes: int = 0
    comments_count: int = 0

class CommentCreate(BaseModel):
    content: str

class CommentResponse(BaseModel):
    id: str
    post_id: str
    content: str
    author_id: str
    author_name: str
    created_at: str
