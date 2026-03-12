import asyncio
import json
import aio_pika
from typing import Dict, List, Set
from fastapi import WebSocket
from app.core.config import logger, RABBIT_URL

class WebSocketManager:
    def __init__(self):
        # active_connections[user_id] = [WebSocket, ...]
        self.active_connections: Dict[str, List[WebSocket]] = {}
        self.rabbitmq_url = RABBIT_URL
        self.connection = None
        self.channel = None
        self.exchange = None

    async def connect(self, user_id: str, websocket: WebSocket):
        await websocket.accept()
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        self.active_connections[user_id].append(websocket)
        logger.info(f"User {user_id} connected via WebSocket. Active sessions: {len(self.active_connections[user_id])}")

    def disconnect(self, user_id: str, websocket: WebSocket):
        if user_id in self.active_connections:
            self.active_connections[user_id].remove(websocket)
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]
        logger.info(f"User {user_id} disconnected from WebSocket.")

    async def init_rabbitmq(self):
        """Initialize RabbitMQ connection and exchange with fallback"""
        try:
            self.connection = await aio_pika.connect_robust(
                self.rabbitmq_url,
                timeout=5 # Don't hang forever if RabbitMQ is down
            )
            self.channel = await self.connection.channel()
            self.exchange = await self.channel.declare_exchange(
                "chat_exchange", aio_pika.ExchangeType.TOPIC
            )
            logger.info("RabbitMQ connection established for WebSocket manager")
            asyncio.create_task(self.consume_messages())
            return True
        except Exception as e:
            logger.warning(f"RabbitMQ unavailable, using in-memory fallback: {str(e)}")
            return False

    async def broadcast_to_user(self, user_id: str, message: dict):
        """Send message via RabbitMQ if available, otherwise fallback to in-memory"""
        user_id = str(user_id)
        print(f"DEBUG: Broadcasting to {user_id}: {message.get('type')}")
        if self.exchange:
            try:
                await self.exchange.publish(
                    aio_pika.Message(body=json.dumps(message).encode()),
                    routing_key=f"user.{user_id}"
                )
            except Exception as e:
                print(f"RabbitMQ publish error: {str(e)}")
                # Fallback to in-memory for THIS instance
                await self._broadcast_in_memory(user_id, message)
        else:
            await self._broadcast_in_memory(user_id, message)

    async def _broadcast_in_memory(self, user_id: str, message: dict):
        user_id = str(user_id)
        if user_id == "all":
            for uid in list(self.active_connections.keys()):
                for ws in self.active_connections[uid]:
                    try:
                        await ws.send_json(message)
                    except Exception:
                        pass
        elif user_id in self.active_connections:
            for ws in self.active_connections[user_id]:
                try:
                    await ws.send_json(message)
                except Exception:
                    pass

    async def consume_messages(self):
        """Listen for messages on RabbitMQ and send them to active WebSockets"""
        queue = await self.channel.declare_queue(exclusive=True)
        # Bind to both specific user and global updates
        await queue.bind(self.exchange, routing_key="user.#")
        
        async with queue.iterator() as queue_iter:
            async for message in queue_iter:
                async with message.process():
                    routing_key = message.routing_key
                    target_id = routing_key.split(".")[1]
                    payload = json.loads(message.body.decode())
                    
                    if target_id == "all":
                        # Broadcast to EVERYONE connected to this server instance
                        for uid in list(self.active_connections.keys()):
                            for ws in self.active_connections[uid]:
                                try:
                                    await ws.send_json(payload)
                                except Exception:
                                    pass
                    elif target_id in self.active_connections:
                        # Send to specific user's active sessions
                        for ws in self.active_connections[target_id]:
                            try:
                                await ws.send_json(payload)
                            except Exception:
                                pass

    async def get_online_users(self) -> List[str]:
        """Return list of user IDs currently connected to this instance"""
        return list(self.active_connections.keys())

# Global manager instance
manager = WebSocketManager()
