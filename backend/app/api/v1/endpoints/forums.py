from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from app.core.security import get_current_user
from app.models.forum import ForumPostCreate, ForumPostResponse, CommentCreate, CommentResponse
from app.services import forum_service

router = APIRouter()

@router.post("/", response_model=ForumPostResponse)
async def create_forum_post(post_data: ForumPostCreate, current_user: dict = Depends(get_current_user)):
    return await forum_service.create_post(post_data, current_user)

@router.get("/", response_model=List[ForumPostResponse])
async def get_forum_posts(
    category: Optional[str] = None,
    tag: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 50
):
    return await forum_service.get_posts(category, tag, search, limit)

@router.get("/{post_id}", response_model=ForumPostResponse)
async def get_forum_post(post_id: str):
    post = await forum_service.get_post_by_id(post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@router.post("/{post_id}/like")
async def like_post(post_id: str, current_user: dict = Depends(get_current_user)):
    return await forum_service.like_post(post_id, current_user["id"])

@router.post("/{post_id}/comments", response_model=CommentResponse)
async def create_comment(post_id: str, comment_data: CommentCreate, current_user: dict = Depends(get_current_user)):
    return await forum_service.create_comment(post_id, comment_data, current_user)

@router.get("/{post_id}/comments", response_model=List[CommentResponse])
async def get_comments(post_id: str):
    return await forum_service.get_comments(post_id)
