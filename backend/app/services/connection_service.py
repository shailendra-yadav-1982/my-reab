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
    
    # Enrich with names for the response
    sender = await db.users.find_one({"id": sender_id}, {"name": 1})
    receiver = await db.users.find_one({"id": receiver_id}, {"name": 1})
    if sender:
        connection_dict["sender_name"] = sender.get("name")
    if receiver:
        connection_dict["receiver_name"] = receiver.get("name")
        
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
        
    connection = await db.connections.find_one({"id": request_id}, {"_id": 0})
    if connection:
        sender = await db.users.find_one({"id": connection["sender_id"]}, {"name": 1})
        receiver = await db.users.find_one({"id": connection["receiver_id"]}, {"name": 1})
        if sender:
            connection["sender_name"] = sender.get("name")
        if receiver:
            connection["receiver_name"] = receiver.get("name")
            
    return connection

async def get_pending_requests(user_id: str):
    requests = await db.connections.find(
        {"receiver_id": user_id, "status": "pending"},
        {"_id": 0}
    ).to_list(None)
    
    # Enrich with sender names
    for req in requests:
        sender = await db.users.find_one({"id": req["sender_id"]}, {"name": 1})
        if sender:
            req["sender_name"] = sender.get("name")
            
    return requests

async def get_connections(user_id: str):
    connections = await db.connections.find(
        {
            "$or": [{"sender_id": user_id}, {"receiver_id": user_id}],
            "status": "accepted"
        },
        {"_id": 0}
    ).to_list(None)
    
    # Enrich with names
    for conn in connections:
        sender = await db.users.find_one({"id": conn["sender_id"]}, {"name": 1})
        receiver = await db.users.find_one({"id": conn["receiver_id"]}, {"name": 1})
        if sender:
            conn["sender_name"] = sender.get("name")
        if receiver:
            conn["receiver_name"] = receiver.get("name")
            
    return connections

async def get_connection_status(user_id1: str, user_id2: str):
    connection = await db.connections.find_one({
        "$or": [
            {"sender_id": user_id1, "receiver_id": user_id2},
            {"sender_id": user_id2, "receiver_id": user_id1}
        ]
    }, {"_id": 0})
    
    if connection:
        sender = await db.users.find_one({"id": connection["sender_id"]}, {"name": 1})
        receiver = await db.users.find_one({"id": connection["receiver_id"]}, {"name": 1})
        if sender:
            connection["sender_name"] = sender.get("name")
        if receiver:
            connection["receiver_name"] = receiver.get("name")
            
    return connection
