from app.core.database import db

async def get_app_stats():
    users_count = await db.users.count_documents({})
    providers_count = await db.providers.count_documents({})
    events_count = await db.events.count_documents({})
    posts_count = await db.forum_posts.count_documents({})
    resources_count = await db.resources.count_documents({})
    
    # Calculate unique countries from user locations
    countries = await db.users.distinct("location", {"location": {"$ne": None}})
    countries_count = len(countries)
    
    # Get visit count
    analytics = await db.analytics.find_one({"type": "site_visits"})
    visit_count = analytics.get("count", 0) if analytics else 0
    
    return {
        "users": users_count,
        "providers": providers_count,
        "events": events_count,
        "posts": posts_count,
        "resources": resources_count,
        "countries": countries_count,
        "visits": visit_count
    }

async def record_visit():
    await db.analytics.update_one(
        {"type": "site_visits"},
        {"$inc": {"count": 1}},
        upsert=True
    )
