import axios from 'axios';

// Helper function to resolve live backend API base URL with fallback to Railway production
const getApiBaseUrl = () => {
  let envUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;
  if (!envUrl || envUrl.trim() === '' || envUrl.includes('localhost') && window.location.hostname !== 'localhost') {
    envUrl = 'https://backend-production-7c9e.up.railway.app/api';
  }
  
  envUrl = envUrl.trim().replace(/\/+$/, '');
  if (!envUrl.endsWith('/api')) {
    envUrl = `${envUrl}/api`;
  }
  return envUrl;
};

const API_BASE_URL = getApiBaseUrl();

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || localStorage.getItem('rural_edu_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => {
    // Defense against HTML response when JSON is expected (e.g. Vercel SPA rewrites)
    if (typeof response.data === 'string' && response.data.trim().startsWith('<!')) {
      console.warn('[API Warning] Received HTML response instead of JSON from:', response.config.url);
      return { ...response, data: [] };
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('rural_edu_token');
      localStorage.removeItem('rural_edu_user');
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
