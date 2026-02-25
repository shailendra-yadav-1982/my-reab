from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from uvicorn.middleware.proxy_headers import ProxyHeadersMiddleware
import os

from .api.v1.api import api_router
from .core.config import logger

app = FastAPI(title="Disability Pride Connect API")

# Setup Proxy Headers for Railway/HTTPS (Must be first to correctly identify protocol)
app.add_middleware(ProxyHeadersMiddleware, trusted_hosts="*")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup Session middleware for Authlib/SSO
# Note: https_only=True is required for cookies to work on HTTPS (Railway)
ENVIRONMENT = os.environ.get('ENVIRONMENT', 'development')
IS_PROD = ENVIRONMENT == 'production' or os.environ.get('RAILWAY_STATIC_URL')

app.add_middleware(
    SessionMiddleware, 
    secret_key=os.environ.get('JWT_SECRET', 'temp-secret-key-for-sessions'),
    https_only=IS_PROD,
    same_site="lax"
)

# Include API Router
app.include_router(api_router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Disability Pride Connect API is running", "status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))
