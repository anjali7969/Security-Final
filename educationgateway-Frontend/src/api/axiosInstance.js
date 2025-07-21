// src/api/axiosInstance.js
import axios from 'axios';

// Create instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5003',
  withCredentials: true, // Send cookies
});

// Interceptor to fetch and attach CSRF token
let csrfToken = null;

axiosInstance.interceptors.request.use(
  async (config) => {
    // Fetch CSRF token once if not yet fetched
    if (!csrfToken) {
      try {
        const response = await axios.get('http://localhost:5003/get-csrf-token', {
          withCredentials: true,
        });
        csrfToken = response.data.csrfToken;
      } catch (err) {
        console.error("Failed to fetch CSRF token:", err);
      }
    }

    // Attach token to protected requests
    if (['post', 'put', 'delete'].includes(config.method)) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
