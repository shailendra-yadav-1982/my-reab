import os
import logging
from pathlib import Path
from dotenv import load_dotenv
from authlib.integrations.starlette_client import OAuth

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
load_dotenv(ROOT_DIR / '.env')

def get_env_required(name: str) -> str:
    val = os.environ.get(name)
    if not val:
        logger.error(f"Critical environment variable '{name}' is missing!")
        raise RuntimeError(f"ENVIRONMENT ERROR: '{name}' is required but not set.")
    return val

# JWT Configuration
JWT_SECRET = os.environ.get('JWT_SECRET', 'temp-secret-change-me-in-production')
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

# OIDC Configuration
oauth = OAuth()
OIDC_ISSUER_URL = os.environ.get('OIDC_ISSUER_URL')
OIDC_CLIENT_ID = os.environ.get('OIDC_CLIENT_ID')
OIDC_CLIENT_SECRET = os.environ.get('OIDC_CLIENT_SECRET')

def setup_oidc(oauth_obj: OAuth):
    if OIDC_ISSUER_URL and OIDC_CLIENT_ID and OIDC_CLIENT_SECRET:
        oauth_obj.register(
            name='oidc',
            client_id=OIDC_CLIENT_ID,
            client_secret=OIDC_CLIENT_SECRET,
            server_metadata_url=f"{OIDC_ISSUER_URL.rstrip('/')}/.well-known/openid-configuration",
            client_kwargs={'scope': 'openid email profile'},
        )
        logger.info(f"OIDC client registered with issuer: {OIDC_ISSUER_URL}")
    else:
        logger.warning("OIDC configuration incomplete. SSO will not be available.")

# Initialize OIDC
setup_oidc(oauth)
