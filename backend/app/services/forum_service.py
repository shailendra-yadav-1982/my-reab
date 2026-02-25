import uuid
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import HTTPException
from app.core.database import db
from app.models.forum import ForumPostCreate, CommentCreate

async def create_post(post_data: ForumPostCreate, current_user: dict):
    post_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    
    post_doc = {
        "id": post_id,
        "title": post_data.title,
        "content": post_data.content,
        "category": post_data.category,
        "tags": post_data.tags,
        "author_id": current_user["id"],
        "author_name": current_user["name"],
        "author_type": current_user["user_type"],
        "created_at": now,
        "updated_at": now,
        "likes": 0,
        "comments_count": 0,
        "liked_by": []
    }
    
    await db.forum_posts.insert_one(post_doc)
    return {k: v for k, v in post_doc.items() if k not in ["_id", "liked_by"]}

async def get_posts(
    category: Optional[str] = None,
    tag: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 50
):
    query = {}
    if category:
        query["category"] = category
    if tag:
        query["tags"] = tag
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"content": {"$regex": search, "$options": "i"}}
        ]
    
    posts = await db.forum_posts.find(query, {"_id": 0, "liked_by": 0}).sort("created_at", -1).limit(limit).to_list(limit)
    return posts

async def get_post_by_id(post_id: str):
    post = await db.forum_posts.find_one({"id": post_id}, {"_id": 0, "liked_by": 0})
    return post

async def like_post(post_id: str, user_id: str):
    post = await db.forum_posts.find_one({"id": post_id})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    liked_by = post.get("liked_by", [])
    if user_id in liked_by:
        # Unlike
        await db.forum_posts.update_one(
            {"id": post_id},
            {"$pull": {"liked_by": user_id}, "$inc": {"likes": -1}}
        )
        return {"liked": False}
    else:
        # Like
        await db.forum_posts.update_one(
            {"id": post_id},
            {"$push": {"liked_by": user_id}, "$inc": {"likes": 1}}
        )
        return {"liked": True}

async def create_comment(post_id: str, comment_data: CommentCreate, current_user: dict):
    post = await db.forum_posts.find_one({"id": post_id})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    comment_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    
    comment_doc = {
        "id": comment_id,
        "post_id": post_id,
        "content": comment_data.content,
        "author_id": current_user["id"],
        "author_name": current_user["name"],
        "created_at": now
    }
    
    await db.comments.insert_one(comment_doc)
    await db.forum_posts.update_one({"id": post_id}, {"$inc": {"comments_count": 1}})
    return {k: v for k, v in comment_doc.items() if k != "_id"}

async def get_comments(post_id: str):
    comments = await db.comments.find({"post_id": post_id}, {"_id": 0}).sort("created_at", 1).to_list(100)
    return comments
