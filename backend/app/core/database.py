import logging
from motor.motor_asyncio import AsyncIOMotorClient
from .config import get_env_required

logger = logging.getLogger(__name__)

# MongoDB connection
try:
    mongo_url = get_env_required('MONGO_URL')
    db_name = get_env_required('DB_NAME')
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    logger.info("Database connection initialized")
except Exception as e:
    logger.error(f"Failed to initialize database: {str(e)}")
    # We allow the app to boot so the user can see the error in logs
    db = None
