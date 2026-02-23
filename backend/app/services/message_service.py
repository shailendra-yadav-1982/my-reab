import uuid
from datetime import datetime, timezone
from typing import List
from fastapi import HTTPException
from app.core.database import db
from app.models.message import MessageCreate

async def send_message(message_data: MessageCreate, current_user: dict):
    # Check recipient exists
    recipient = await db.users.find_one({"id": message_data.recipient_id})
    if not recipient:
        raise HTTPException(status_code=404, detail="Recipient not found")
    
    message_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    
    message_doc = {
        "id": message_id,
        "sender_id": current_user["id"],
        "sender_name": current_user["name"],
        "recipient_id": message_data.recipient_id,
        "content": message_data.content,
        "is_read": False,
        "created_at": now
    }
    
    await db.messages.insert_one(message_doc)
    return {k: v for k, v in message_doc.items() if k != "_id"}

async def get_conversations(user_id: str):
    pipeline = [
        {"$match": {"$or": [
            {"sender_id": user_id},
            {"recipient_id": user_id}
        ]}},
        {"$sort": {"created_at": -1}},
        {"$group": {
            "_id": {"$cond": [
                {"$eq": ["$sender_id", user_id]},
                "$recipient_id",
                "$sender_id"
            ]},
            "last_message": {"$first": "$content"},
            "last_message_time": {"$first": "$created_at"},
            "unread_count": {"$sum": {"$cond": [
                {"$and": [
                    {"$eq": ["$recipient_id", user_id]},
                    {"$eq": ["$is_read", False]}
                ]},
                1, 0
            ]}}
        }}
    ]
    
    conversations = await db.messages.aggregate(pipeline).to_list(100)
    
    # Get user names
    result = []
    for conv in conversations:
        user = await db.users.find_one({"id": conv["_id"]}, {"_id": 0, "name": 1})
        if user:
            result.append({
                "user_id": conv["_id"],
                "user_name": user["name"],
                "last_message": conv["last_message"],
                "last_message_time": conv["last_message_time"],
                "unread_count": conv["unread_count"]
            })
    return result

async def get_messages_with_user(other_user_id: str, current_user_id: str):
    messages = await db.messages.find({
        "$or": [
            {"sender_id": current_user_id, "recipient_id": other_user_id},
            {"sender_id": other_user_id, "recipient_id": current_user_id}
        ]
    }, {"_id": 0}).sort("created_at", 1).to_list(100)
    
    # Mark messages as read
    await db.messages.update_many(
        {"sender_id": other_user_id, "recipient_id": current_user_id, "is_read": False},
        {"$set": {"is_read": True}}
    )
    return messages
