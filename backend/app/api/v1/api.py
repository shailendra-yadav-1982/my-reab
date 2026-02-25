from fastapi import APIRouter
from .endpoints import auth, users, forums, providers, events, messages, resources, stats, sso, connections

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(sso.router, prefix="/auth/sso", tags=["sso"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(forums.router, prefix="/forums", tags=["forums"])
api_router.include_router(providers.router, prefix="/providers", tags=["providers"])
api_router.include_router(events.router, prefix="/events", tags=["events"])
api_router.include_router(messages.router, prefix="/messages", tags=["messages"])
api_router.include_router(resources.router, prefix="/resources", tags=["resources"])
api_router.include_router(stats.router, prefix="/stats", tags=["stats"])
api_router.include_router(connections.router, prefix="/connections", tags=["connections"])

@api_router.get("/")
async def root():
    return {"message": "Disability Pride Connect API v1", "status": "healthy"}
