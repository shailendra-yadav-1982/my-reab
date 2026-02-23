from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Helper to get required env var or raise clear error
def get_env_required(name: str) -> str:
    val = os.environ.get(name)
    if not val:
        logger.error(f"Critical environment variable '{name}' is missing!")
        # On Railway, failing fast with a clear error is better than a KeyError later
        raise RuntimeError(f"ENVIRONMENT ERROR: '{name}' is required but not set.")
    return val

# MongoDB connection
try:
    mongo_url = get_env_required('MONGO_URL')
    db_name = get_env_required('DB_NAME')
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
except Exception as e:
    logger.error(f"Failed to initialize database: {str(e)}")
    # We allow the app to boot so the user can see the error in logs
    db = None

# JWT Configuration
JWT_SECRET = os.environ.get('JWT_SECRET', 'temp-secret-change-me-in-production')
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

security = HTTPBearer()

# Create the main app
app = FastAPI(title="Disability Pride Connect API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# ============== MODELS ==============

# User Types
USER_TYPES = ["individual", "service_provider", "ngo", "caregiver"]
DISABILITY_CATEGORIES = ["physical", "cognitive", "invisible", "psychiatric", "sensory", "multiple", "prefer_not_to_say"]

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    user_type: str = "individual"
    organization_name: Optional[str] = None
    disability_categories: List[str] = []
    bio: Optional[str] = None
    location: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    user_type: str
    organization_name: Optional[str] = None
    disability_categories: List[str] = []
    bio: Optional[str] = None
    location: Optional[str] = None
    avatar_url: Optional[str] = None
    created_at: str
    is_verified: bool = False

class UserUpdate(BaseModel):
    name: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    disability_categories: Optional[List[str]] = None
    organization_name: Optional[str] = None
    avatar_url: Optional[str] = None

# Forum Models
class ForumPostCreate(BaseModel):
    title: str
    content: str
    category: str
    tags: List[str] = []

class ForumPostResponse(BaseModel):
    id: str
    title: str
    content: str
    category: str
    tags: List[str]
    author_id: str
    author_name: str
    author_type: str
    created_at: str
    updated_at: str
    likes: int = 0
    comments_count: int = 0

class CommentCreate(BaseModel):
    content: str

class CommentResponse(BaseModel):
    id: str
    post_id: str
    content: str
    author_id: str
    author_name: str
    created_at: str

# Service Provider Models
class ServiceProviderCreate(BaseModel):
    name: str
    description: str
    services: List[str]
    disability_focus: List[str]
    location: str
    website: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None

class ServiceProviderResponse(BaseModel):
    id: str
    name: str
    description: str
    services: List[str]
    disability_focus: List[str]
    location: str
    website: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    owner_id: str
    is_verified: bool = False
    rating: float = 0.0
    reviews_count: int = 0
    created_at: str

# Event Models
class EventCreate(BaseModel):
    title: str
    description: str
    event_type: str
    location: str
    is_virtual: bool = False
    virtual_link: Optional[str] = None
    start_date: str
    end_date: Optional[str] = None
    accessibility_features: List[str] = []

class EventResponse(BaseModel):
    id: str
    title: str
    description: str
    event_type: str
    location: str
    is_virtual: bool
    virtual_link: Optional[str] = None
    start_date: str
    end_date: Optional[str] = None
    accessibility_features: List[str]
    organizer_id: str
    organizer_name: str
    attendees_count: int = 0
    created_at: str

# Message Models
class MessageCreate(BaseModel):
    recipient_id: str
    content: str

class MessageResponse(BaseModel):
    id: str
    sender_id: str
    sender_name: str
    recipient_id: str
    content: str
    is_read: bool = False
    created_at: str

class ConversationResponse(BaseModel):
    user_id: str
    user_name: str
    last_message: str
    last_message_time: str
    unread_count: int

# Resource Models
class ResourceCreate(BaseModel):
    title: str
    description: str
    category: str
    url: Optional[str] = None
    content: Optional[str] = None
    tags: List[str] = []

class ResourceResponse(BaseModel):
    id: str
    title: str
    description: str
    category: str
    url: Optional[str] = None
    content: Optional[str] = None
    tags: List[str]
    author_id: str
    author_name: str
    created_at: str
    views: int = 0

# ============== AUTHENTICATION ==============

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(user_id: str) -> str:
    payload = {
        "user_id": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("user_id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        user = await db.users.find_one({"id": user_id}, {"_id": 0, "password": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ============== AUTH ROUTES ==============

@api_router.post("/auth/register", response_model=dict)
async def register(user_data: UserCreate):
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

@api_router.post("/auth/login", response_model=dict)
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    token = create_token(user["id"])
    user_response = {k: v for k, v in user.items() if k not in ["password", "_id"]}
    
    return {"token": token, "user": user_response}

@api_router.get("/auth/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    return current_user

@api_router.put("/auth/me", response_model=UserResponse)
async def update_me(update_data: UserUpdate, current_user: dict = Depends(get_current_user)):
    update_dict = {k: v for k, v in update_data.model_dump().items() if v is not None}
    if update_dict:
        await db.users.update_one({"id": current_user["id"]}, {"$set": update_dict})
    
    updated_user = await db.users.find_one({"id": current_user["id"]}, {"_id": 0, "password": 0})
    return updated_user

# ============== USER ROUTES ==============

@api_router.get("/users", response_model=List[UserResponse])
async def get_users(
    user_type: Optional[str] = None,
    disability_category: Optional[str] = None,
    location: Optional[str] = None,
    limit: int = 50
):
    query = {}
    if user_type:
        query["user_type"] = user_type
    if disability_category:
        query["disability_categories"] = disability_category
    if location:
        query["location"] = {"$regex": location, "$options": "i"}
    
    users = await db.users.find(query, {"_id": 0, "password": 0}).limit(limit).to_list(limit)
    return users

@api_router.get("/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: str):
    user = await db.users.find_one({"id": user_id}, {"_id": 0, "password": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# ============== FORUM ROUTES ==============

@api_router.post("/forums", response_model=ForumPostResponse)
async def create_forum_post(post_data: ForumPostCreate, current_user: dict = Depends(get_current_user)):
    post_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    
    post_doc = {
        "id": post_id,
        "title": post_data.title,
        "content": post_data.content,
        "category": post_data.category,
        "tags": post_data.tags,
        "author_id": current_user["id"],
        "author_name": current_user["name"],
        "author_type": current_user["user_type"],
        "created_at": now,
        "updated_at": now,
        "likes": 0,
        "comments_count": 0,
        "liked_by": []
    }
    
    await db.forum_posts.insert_one(post_doc)
    return {k: v for k, v in post_doc.items() if k not in ["_id", "liked_by"]}

@api_router.get("/forums", response_model=List[ForumPostResponse])
async def get_forum_posts(
    category: Optional[str] = None,
    tag: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 50
):
    query = {}
    if category:
        query["category"] = category
    if tag:
        query["tags"] = tag
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"content": {"$regex": search, "$options": "i"}}
        ]
    
    posts = await db.forum_posts.find(query, {"_id": 0, "liked_by": 0}).sort("created_at", -1).limit(limit).to_list(limit)
    return posts

@api_router.get("/forums/{post_id}", response_model=ForumPostResponse)
async def get_forum_post(post_id: str):
    post = await db.forum_posts.find_one({"id": post_id}, {"_id": 0, "liked_by": 0})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@api_router.post("/forums/{post_id}/like")
async def like_post(post_id: str, current_user: dict = Depends(get_current_user)):
    post = await db.forum_posts.find_one({"id": post_id})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    liked_by = post.get("liked_by", [])
    if current_user["id"] in liked_by:
        # Unlike
        await db.forum_posts.update_one(
            {"id": post_id},
            {"$pull": {"liked_by": current_user["id"]}, "$inc": {"likes": -1}}
        )
        return {"liked": False}
    else:
        # Like
        await db.forum_posts.update_one(
            {"id": post_id},
            {"$push": {"liked_by": current_user["id"]}, "$inc": {"likes": 1}}
        )
        return {"liked": True}

@api_router.post("/forums/{post_id}/comments", response_model=CommentResponse)
async def create_comment(post_id: str, comment_data: CommentCreate, current_user: dict = Depends(get_current_user)):
    post = await db.forum_posts.find_one({"id": post_id})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    comment_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    
    comment_doc = {
        "id": comment_id,
        "post_id": post_id,
        "content": comment_data.content,
        "author_id": current_user["id"],
        "author_name": current_user["name"],
        "created_at": now
    }
    
    await db.comments.insert_one(comment_doc)
    await db.forum_posts.update_one({"id": post_id}, {"$inc": {"comments_count": 1}})
    
    return {k: v for k, v in comment_doc.items() if k != "_id"}

@api_router.get("/forums/{post_id}/comments", response_model=List[CommentResponse])
async def get_comments(post_id: str):
    comments = await db.comments.find({"post_id": post_id}, {"_id": 0}).sort("created_at", 1).to_list(100)
    return comments

# ============== SERVICE PROVIDER ROUTES ==============

@api_router.post("/providers", response_model=ServiceProviderResponse)
async def create_service_provider(provider_data: ServiceProviderCreate, current_user: dict = Depends(get_current_user)):
    provider_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    
    provider_doc = {
        "id": provider_id,
        "name": provider_data.name,
        "description": provider_data.description,
        "services": provider_data.services,
        "disability_focus": provider_data.disability_focus,
        "location": provider_data.location,
        "website": provider_data.website,
        "email": provider_data.email,
        "phone": provider_data.phone,
        "owner_id": current_user["id"],
        "is_verified": False,
        "rating": 0.0,
        "reviews_count": 0,
        "created_at": now
    }
    
    await db.providers.insert_one(provider_doc)
    return {k: v for k, v in provider_doc.items() if k != "_id"}

@api_router.get("/providers", response_model=List[ServiceProviderResponse])
async def get_providers(
    service: Optional[str] = None,
    disability_focus: Optional[str] = None,
    location: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 50
):
    query = {}
    if service:
        query["services"] = service
    if disability_focus:
        query["disability_focus"] = disability_focus
    if location:
        query["location"] = {"$regex": location, "$options": "i"}
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}}
        ]
    
    providers = await db.providers.find(query, {"_id": 0}).limit(limit).to_list(limit)
    return providers

@api_router.get("/providers/{provider_id}", response_model=ServiceProviderResponse)
async def get_provider(provider_id: str):
    provider = await db.providers.find_one({"id": provider_id}, {"_id": 0})
    if not provider:
        raise HTTPException(status_code=404, detail="Provider not found")
    return provider

# ============== EVENT ROUTES ==============

@api_router.post("/events", response_model=EventResponse)
async def create_event(event_data: EventCreate, current_user: dict = Depends(get_current_user)):
    event_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    
    event_doc = {
        "id": event_id,
        "title": event_data.title,
        "description": event_data.description,
        "event_type": event_data.event_type,
        "location": event_data.location,
        "is_virtual": event_data.is_virtual,
        "virtual_link": event_data.virtual_link,
        "start_date": event_data.start_date,
        "end_date": event_data.end_date,
        "accessibility_features": event_data.accessibility_features,
        "organizer_id": current_user["id"],
        "organizer_name": current_user["name"],
        "attendees": [],
        "attendees_count": 0,
        "created_at": now
    }
    
    await db.events.insert_one(event_doc)
    return {k: v for k, v in event_doc.items() if k not in ["_id", "attendees"]}

@api_router.get("/events", response_model=List[EventResponse])
async def get_events(
    event_type: Optional[str] = None,
    is_virtual: Optional[bool] = None,
    location: Optional[str] = None,
    upcoming: bool = True,
    limit: int = 50
):
    query = {}
    if event_type:
        query["event_type"] = event_type
    if is_virtual is not None:
        query["is_virtual"] = is_virtual
    if location:
        query["location"] = {"$regex": location, "$options": "i"}
    if upcoming:
        query["start_date"] = {"$gte": datetime.now(timezone.utc).isoformat()}
    
    events = await db.events.find(query, {"_id": 0, "attendees": 0}).sort("start_date", 1).limit(limit).to_list(limit)
    return events

@api_router.get("/events/{event_id}", response_model=EventResponse)
async def get_event(event_id: str):
    event = await db.events.find_one({"id": event_id}, {"_id": 0, "attendees": 0})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

@api_router.post("/events/{event_id}/attend")
async def attend_event(event_id: str, current_user: dict = Depends(get_current_user)):
    event = await db.events.find_one({"id": event_id})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    attendees = event.get("attendees", [])
    if current_user["id"] in attendees:
        # Leave event
        await db.events.update_one(
            {"id": event_id},
            {"$pull": {"attendees": current_user["id"]}, "$inc": {"attendees_count": -1}}
        )
        return {"attending": False}
    else:
        # Attend event
        await db.events.update_one(
            {"id": event_id},
            {"$push": {"attendees": current_user["id"]}, "$inc": {"attendees_count": 1}}
        )
        return {"attending": True}

# ============== MESSAGE ROUTES ==============

@api_router.post("/messages", response_model=MessageResponse)
async def send_message(message_data: MessageCreate, current_user: dict = Depends(get_current_user)):
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

@api_router.get("/messages/conversations", response_model=List[ConversationResponse])
async def get_conversations(current_user: dict = Depends(get_current_user)):
    # Get all unique conversations
    pipeline = [
        {"$match": {"$or": [
            {"sender_id": current_user["id"]},
            {"recipient_id": current_user["id"]}
        ]}},
        {"$sort": {"created_at": -1}},
        {"$group": {
            "_id": {"$cond": [
                {"$eq": ["$sender_id", current_user["id"]]},
                "$recipient_id",
                "$sender_id"
            ]},
            "last_message": {"$first": "$content"},
            "last_message_time": {"$first": "$created_at"},
            "unread_count": {"$sum": {"$cond": [
                {"$and": [
                    {"$eq": ["$recipient_id", current_user["id"]]},
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

@api_router.get("/messages/{user_id}", response_model=List[MessageResponse])
async def get_messages_with_user(user_id: str, current_user: dict = Depends(get_current_user)):
    messages = await db.messages.find({
        "$or": [
            {"sender_id": current_user["id"], "recipient_id": user_id},
            {"sender_id": user_id, "recipient_id": current_user["id"]}
        ]
    }, {"_id": 0}).sort("created_at", 1).to_list(100)
    
    # Mark messages as read
    await db.messages.update_many(
        {"sender_id": user_id, "recipient_id": current_user["id"], "is_read": False},
        {"$set": {"is_read": True}}
    )
    
    return messages

# ============== RESOURCE ROUTES ==============

@api_router.post("/resources", response_model=ResourceResponse)
async def create_resource(resource_data: ResourceCreate, current_user: dict = Depends(get_current_user)):
    resource_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    
    resource_doc = {
        "id": resource_id,
        "title": resource_data.title,
        "description": resource_data.description,
        "category": resource_data.category,
        "url": resource_data.url,
        "content": resource_data.content,
        "tags": resource_data.tags,
        "author_id": current_user["id"],
        "author_name": current_user["name"],
        "created_at": now,
        "views": 0
    }
    
    await db.resources.insert_one(resource_doc)
    return {k: v for k, v in resource_doc.items() if k != "_id"}

@api_router.get("/resources", response_model=List[ResourceResponse])
async def get_resources(
    category: Optional[str] = None,
    tag: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 50
):
    query = {}
    if category:
        query["category"] = category
    if tag:
        query["tags"] = tag
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}}
        ]
    
    resources = await db.resources.find(query, {"_id": 0}).sort("created_at", -1).limit(limit).to_list(limit)
    return resources

@api_router.get("/resources/{resource_id}", response_model=ResourceResponse)
async def get_resource(resource_id: str):
    resource = await db.resources.find_one({"id": resource_id}, {"_id": 0})
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    
    # Increment views
    await db.resources.update_one({"id": resource_id}, {"$inc": {"views": 1}})
    resource["views"] += 1
    
    return resource

# ============== STATS ROUTE ==============

@api_router.get("/stats")
async def get_stats():
    users_count = await db.users.count_documents({})
    providers_count = await db.providers.count_documents({})
    events_count = await db.events.count_documents({})
    posts_count = await db.forum_posts.count_documents({})
    resources_count = await db.resources.count_documents({})
    
    return {
        "users": users_count,
        "providers": providers_count,
        "events": events_count,
        "posts": posts_count,
        "resources": resources_count
    }

# ============== ROOT ROUTE ==============

@api_router.get("/")
async def root():
    return {"message": "Disability Pride Connect API", "status": "healthy"}

# Include the router in the main app
app.include_router(api_router)

# CORS Configuration
# Note: allow_credentials=True REQUIRES specific origins (no "*")
origins = os.environ.get('CORS_ORIGINS', '').split(',')
origins = [o.strip() for o in origins if o.strip()]

if not origins:
    # Development mode: allow all but no credentials (safer for local dev)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    logger.warning("CORS initialized with wildcards and NO credentials (CORS_ORIGINS not set)")
else:
    # Production mode: specific origins WITH credentials
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    logger.info(f"CORS initialized with origins: {origins}")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
