from app.core.database import db

async def get_app_stats():
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
