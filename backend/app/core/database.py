import logging
from motor.motor_asyncio import AsyncIOMotorClient
from .config import MONGO_URL, get_env_required, logger
import os

# MongoDB connection
try:
    db_name = os.environ.get('DB_NAME', 'disability_inclusion_connect')
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[db_name]
    logger.info("Database connection initialized")
except Exception as e:
    logger.error(f"Failed to initialize database: {str(e)}")
    # We allow the app to boot so the user can see the error in logs
    db = None
