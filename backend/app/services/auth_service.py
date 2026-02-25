import uuid
import secrets
from datetime import datetime, timezone, timedelta
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

async def request_password_reset(email: str):
    user = await db.users.find_one({"email": email})
    if not user:
        # For security, don't reveal if email exists, but we'll return a success message anyway
        return {"message": "If an account exists with this email, a reset link will be sent."}
    
    reset_token = secrets.token_urlsafe(32)
    expires = datetime.now(timezone.utc) + timedelta(hours=1)
    
    await db.users.update_one(
        {"id": user["id"]},
        {"$set": {
            "reset_token": reset_token,
            "reset_token_expires": expires.isoformat()
        }}
    )
    
    # In a real app, send email. Here we log it for the user to see.
    print(f"PASSWORD RESET TOKEN FOR {email}: {reset_token}")
    return {"message": "Reset token generated. Check terminal logs."}

async def confirm_password_reset(token: str, new_password: str):
    user = await db.users.find_one({
        "reset_token": token,
        "reset_token_expires": {"$gt": datetime.now(timezone.utc).isoformat()}
    })
    
    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")
    
    await db.users.update_one(
        {"id": user["id"]},
        {"$set": {
            "password": hash_password(new_password),
            "reset_token": None,
            "reset_token_expires": None
        }}
    )
    
    return {"message": "Password successfully reset"}
