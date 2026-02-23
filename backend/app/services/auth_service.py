import uuid
from datetime import datetime, timezone
from fastapi import HTTPException
from app.core.database import db
from app.core.security import hash_password, verify_password, create_token
from app.models.user import UserCreate, UserLogin

async def register_user(user_data: UserCreate):
    # Check if email exists
    existing = await db.users.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    
    user_doc = {
        "id": user_id,
        "email": user_data.email,
        "password": hash_password(user_data.password),
        "name": user_data.name,
        "user_type": user_data.user_type,
        "organization_name": user_data.organization_name,
        "disability_categories": user_data.disability_categories,
        "bio": user_data.bio,
        "location": user_data.location,
        "avatar_url": None,
        "created_at": now,
        "is_verified": False
    }
    
    await db.users.insert_one(user_doc)
    token = create_token(user_id)
    
    user_response = {k: v for k, v in user_doc.items() if k not in ["password", "_id"]}
    return {"token": token, "user": user_response}

async def login_user(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    token = create_token(user["id"])
    user_response = {k: v for k, v in user.items() if k not in ["password", "_id"]}
    return {"token": token, "user": user_response}
