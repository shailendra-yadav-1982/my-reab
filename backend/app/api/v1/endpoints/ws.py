from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from app.core.websocket import manager
from app.core.security import get_current_user
from app.core.config import logger
import json

router = APIRouter()

@router.websocket("/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    # In a production app, we would verify the user_id matches the token
    # But for now, we'll keep it simple to get it working
    await manager.connect(user_id, websocket)
    print(f"DEBUG: WS User connected: {user_id}")
    
    # Send current online users to the new connector
    online_users = await manager.get_online_users()
    await websocket.send_json({
        "type": "initial_presence",
        "online_users": online_users
    })

    # Notify others that this user is online
    await manager.broadcast_to_user("all", {
        "type": "presence",
        "user_id": user_id,
        "status": "online"
    })

    try:
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)
            
            # Handle incoming typing events
            if payload.get("type") == "typing":
                recipient_id = payload.get("recipient_id")
                is_typing = payload.get("is_typing")
                print(f"DEBUG: Typing event from {user_id} -> {recipient_id}: {is_typing}")
                if recipient_id:
                    await manager.broadcast_to_user(recipient_id, {
                        "type": "typing",
                        "sender_id": user_id,
                        "is_typing": is_typing
                    })
            
    except WebSocketDisconnect:
        print(f"DEBUG: WS User disconnected: {user_id}")
        manager.disconnect(user_id, websocket)
        # Only broadcast offline if NO sessions remain
        if user_id not in manager.active_connections:
            await manager.broadcast_to_user("all", {
                "type": "presence",
                "user_id": user_id,
                "status": "offline"
            })
    except Exception as e:
        print(f"DEBUG: WS error user {user_id}: {str(e)}")
        logger.error(f"WebSocket error for user {user_id}: {str(e)}")
        manager.disconnect(user_id, websocket)
        if user_id not in manager.active_connections:
            await manager.broadcast_to_user("all", {
                "type": "presence",
                "user_id": user_id,
                "status": "offline"
            })
