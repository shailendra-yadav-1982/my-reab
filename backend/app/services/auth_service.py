import uuid
import secrets
from datetime import datetime, timezone, timedelta
from fastapi import HTTPException
from app.core.database import db
from app.core.security import hash_password, verify_password, create_token
from app.models.user import UserCreate, UserLogin
from .email_service import send_reset_password_email, send_verification_email

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
    
    # Generate verification token (24h)
    verify_token = create_token(user_id, expires_delta=timedelta(hours=24), additional_data={"type": "verification"})
    
    # Send verification email
    await send_verification_email(user_data.email, verify_token)
    
    return {
        "message": "Registration successful! Please check your email to verify your account.",
        "requires_verification": True
    }

async def login_user(credentials: UserLogin):
    from app.core.config import logger
    logger.info(f"Login attempt started for: {credentials.email}")
    
    user = await db.users.find_one({"email": credentials.email})
    
    if not user:
        logger.warning(f"Login failed: User {credentials.email} not found")
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Handle SSO users who don't have a password stored
    if "password" not in user or not user["password"]:
        provider = user.get("auth_provider", "an external provider")
        logger.warning(f"Login failed: User {credentials.email} is an SSO user ({provider})")
        raise HTTPException(
            status_code=401, 
            detail=f"This account is linked to {provider}. Please use the SSO login option."
        )
    
    try:
        if not verify_password(credentials.password, user["password"]):
            logger.warning(f"Login failed: Incorrect password for {credentials.email}")
            raise HTTPException(status_code=401, detail="Invalid email or password")
    except Exception as e:
        logger.error(f"Critical error during password verification for {credentials.email}: {str(e)}")
        raise HTTPException(status_code=500, detail="Authentication service encountered an error")
    
    if not user.get("is_verified", False):
        logger.warning(f"Login attempt for unverified email: {credentials.email}")
        raise HTTPException(status_code=401, detail="Please verify your email address before logging in.")

    token = create_token(user["id"])
    user_response = {k: v for k, v in user.items() if k not in ["password", "_id"]}
    logger.info(f"Login successful for: {credentials.email}")
    return {"token": token, "user": user_response}

async def verify_user_email(token: str):
    import jwt
    from app.core.config import JWT_SECRET, JWT_ALGORITHM
    
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "verification":
            raise HTTPException(status_code=400, detail="Invalid token type")
        
        user_id = payload.get("user_id")
        user = await db.users.find_one({"id": user_id})
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        if user.get("is_verified"):
            return {"message": "Email already verified"}
            
        await db.users.update_one(
            {"id": user_id},
            {"$set": {"is_verified": True}}
        )
        
        return {"message": "Email verified successfully"}
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=400, detail="Verification link has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=400, detail="Invalid verification link")

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
    
    # Send real email via Resend
    await send_reset_password_email(email, reset_token)
    
    return {"message": "If an account exists, a reset link has been sent to your email."}

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
