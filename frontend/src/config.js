const raw_url = (process.env.REACT_APP_BACKEND_URL || '').trim();
let normalized_url = raw_url.replace(/\/+$/, '');

// Safeguard: Force HTTPS if the frontend is loaded over HTTPS to prevent Mixed Content errors
if (window.location.protocol === 'https:' && normalized_url.startsWith('http:')) {
    normalized_url = normalized_url.replace('http:', 'https:');
}

export const API_BASE_URL = normalized_url;
export const API_URL = `${API_BASE_URL}/api`;
