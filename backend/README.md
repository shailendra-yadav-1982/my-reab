# MyEnAb Backend

FastAPI backend for the MyEnAb community platform.

## Architecture

- **WebSockets**: Real-time communication is handled via WebSockets.
- **Message Broker**: RabbitMQ is used as a message broker for scalable broadcasting.
- **Database**: MongoDB (via Motor) stores all persistent data.

## Getting Started

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Start Infrastructure**:
   ```bash
   docker compose up -d
   ```

3. **Run Server**:
   ```bash
   python -m uvicorn server:app --reload
   ```

## WebSocket Endpoints

- `WS /api/ws/{user_id}`: Connect to the real-time notification stream.

## Message Types

- `new_message`: Sent when a new message is received.
- `presence`: Sent when a user's online status changes.
