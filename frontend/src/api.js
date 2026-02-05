import axios from 'axios';

// Backend base URL (from env)
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const apiClient = axios.create({
  baseURL: BASE_URL,
});

// Attach JWT token automatically
apiClient.interceptors.request.use(
  (config) => {
    const authData = localStorage.getItem('lifetag-auth');
    if (authData) {
      try {
        const { token } = JSON.parse(authData);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (e) {
        console.error('Failed to parse auth data:', e);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;