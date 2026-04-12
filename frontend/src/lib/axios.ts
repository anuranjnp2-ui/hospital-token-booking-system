import axios from 'axios';

// Automatically send cookies (Django sessionid, csrftoken) with every request
const DEFAULT_URL = 'http://localhost:8000/api/';
const rawBaseURL = import.meta.env.VITE_API_URL;

// Production warning for missing environment variable
if (import.meta.env.PROD && !rawBaseURL) {
  console.warn(
    "VITE_API_URL is NOT set in production environment! " +
    "Falling back to localhost which will likely fail. " +
    "Please set VITE_API_URL in your Vercel/deployment environment."
  );
}

// Ensure baseURL ends with a slash
const finalBaseURL = rawBaseURL || DEFAULT_URL;
const baseURL = finalBaseURL.endsWith('/') ? finalBaseURL : `${finalBaseURL}/`;

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add CSRF token interceptor if needed
apiClient.interceptors.request.use((config) => {
  const csrfToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrftoken='))
    ?.split('=')[1];

  if (csrfToken) {
    config.headers['X-CSRFToken'] = csrfToken;
  }
  return config;
});
