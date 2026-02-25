import os
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import RedirectResponse
from app.core.config import oauth, OIDC_ISSUER_URL

router = APIRouter()

@router.get("/login")
async def sso_login(request: Request):
    if not OIDC_ISSUER_URL:
        raise HTTPException(status_code=400, detail="SSO not configured")
    
    redirect_uri = str(request.url_for('sso_callback'))
    from app.core.config import logger
    
    # If running behind a proxy or on Railway, ensure https
    if os.environ.get('RAILWAY_STATIC_URL') or os.environ.get('ENVIRONMENT') == 'production':
        redirect_uri = redirect_uri.replace('http://', 'https://')
        
    logger.info(f"Initiating SSO login. Redirect URI: {redirect_uri}")
    return await oauth.oidc.authorize_redirect(request, redirect_uri)

@router.get("/callback")
async def sso_callback(request: Request):
    if not OIDC_ISSUER_URL:
        raise HTTPException(status_code=400, detail="SSO not configured")
        
    try:
        from app.core.security import create_token
        from app.core.database import db
        from app.core.config import logger
        logger.info("SSO callback received. Attempting to authorize access token.")
        
        token = await oauth.oidc.authorize_access_token(request)
        user_info = token.get('userinfo')
        if not user_info:
            logger.error("SSO Callback: Failed to get user info from token")
            raise HTTPException(status_code=400, detail="Failed to get user info from OIDC provider")
        
        logger.info(f"SSO login successful for user: {user_info.get('email')}")
        email = user_info.get('email')
        if not email:
            raise HTTPException(status_code=400, detail="OIDC provider did not return an email")
            
        # Check if user exists, if not create
        user = await db.users.find_one({"email": email})
        if not user:
            import uuid
            from datetime import datetime, timezone
            user_id = str(uuid.uuid4())
            user = {
                "id": user_id,
                "email": email,
                "name": user_info.get('name', email.split('@')[0]),
                "user_type": "individual",
                "created_at": datetime.now(timezone.utc).isoformat(),
                "is_verified": True,
                "auth_provider": "oidc",
                "bio": "",
                "location": "",
                "disability_categories": []
            }
            await db.users.insert_one(user)
            user_id = user["id"]
        else:
            user_id = user["id"]
            
        # Create JWT for our app
        app_token = create_token(user_id)
        
        # Redirect back to frontend with token
        frontend_url = os.environ.get('FRONTEND_URL', 'http://localhost:3000').rstrip('/')
        return RedirectResponse(url=f"{frontend_url}/sso-callback?token={app_token}")
        
    except Exception as e:
        from app.core.config import logger
        logger.error(f"SSO callback error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
