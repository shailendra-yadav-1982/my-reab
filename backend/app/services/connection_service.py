from typing import List, Optional
from datetime import datetime
from app.core.database import db
from app.models.connection import Connection
import uuid

async def create_connection_request(sender_id: str, receiver_id: str):
    # Check if a connection or request already exists
    existing = await db.connections.find_one({
        "$or": [
            {"sender_id": sender_id, "receiver_id": receiver_id},
            {"sender_id": receiver_id, "receiver_id": sender_id}
        ]
    })
    
    if existing:
        return existing, "Already exists"
    
    new_connection = Connection(
        sender_id=sender_id,
        receiver_id=receiver_id,
        status="pending"
    )
    
    connection_dict = new_connection.model_dump()
    await db.connections.insert_one(connection_dict)
    return connection_dict, "Created"

async def respond_to_connection_request(request_id: str, user_id: str, action: str):
    status = "accepted" if action == "accept" else "declined"
    
    # Ensure the user responding is the intended receiver
    result = await db.connections.update_one(
        {"id": request_id, "receiver_id": user_id, "status": "pending"},
        {"$set": {"status": status, "updated_at": datetime.utcnow()}}
    )
    
    if result.modified_count == 0:
        return None
        
    return await db.connections.find_one({"id": request_id}, {"_id": 0})

async def get_pending_requests(user_id: str):
    requests = await db.connections.find(
        {"receiver_id": user_id, "status": "pending"},
        {"_id": 0}
    ).to_list(None)
    return requests

async def get_connections(user_id: str):
    connections = await db.connections.find(
        {
            "$or": [{"sender_id": user_id}, {"receiver_id": user_id}],
            "status": "accepted"
        },
        {"_id": 0}
    ).to_list(None)
    return connections

async def get_connection_status(user_id1: str, user_id2: str):
    connection = await db.connections.find_one({
        "$or": [
            {"sender_id": user_id1, "receiver_id": user_id2},
            {"sender_id": user_id2, "receiver_id": user_id1}
        ]
    }, {"_id": 0})
    return connection
