from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from app.core.security import get_current_user
from app.models.connection import ConnectionResponse, ConnectionCreate, ConnectionAction
from app.services import connection_service

router = APIRouter()

@router.post("/request/{user_id}", response_model=ConnectionResponse)
async def send_request(user_id: str, current_user: dict = Depends(get_current_user)):
    if current_user["id"] == user_id:
        raise HTTPException(status_code=400, detail="Cannot connect with yourself")
    
    connection, message = await connection_service.create_connection_request(
        current_user["id"], user_id
    )
    
    if message == "Already exists":
        raise HTTPException(status_code=400, detail="Connection or request already exists")
    
    return connection

@router.put("/respond/{request_id}", response_model=ConnectionResponse)
async def respond_to_request(
    request_id: str, 
    action_data: ConnectionAction, 
    current_user: dict = Depends(get_current_user)
):
    connection = await connection_service.respond_to_connection_request(
        request_id, current_user["id"], action_data.action
    )
    
    if not connection:
        raise HTTPException(status_code=404, detail="Pending connection request not found")
        
    return connection

@router.get("/pending", response_model=List[ConnectionResponse])
async def get_pending(current_user: dict = Depends(get_current_user)):
    return await connection_service.get_pending_requests(current_user["id"])

@router.get("", response_model=List[ConnectionResponse])
async def get_accepted_connections(current_user: dict = Depends(get_current_user)):
    return await connection_service.get_connections(current_user["id"])

@router.get("/status/{user_id}", response_model=Optional[ConnectionResponse])
async def get_status(user_id: str, current_user: dict = Depends(get_current_user)):
    return await connection_service.get_connection_status(current_user["id"], user_id)
