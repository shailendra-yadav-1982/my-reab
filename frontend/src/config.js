const raw_url = process.env.REACT_APP_BACKEND_URL || '';
export const API_BASE_URL = raw_url.replace(/\/$/, '');
export const API_URL = `${API_BASE_URL}/api`;
