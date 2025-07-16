// api.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

// Create base Axios instance
const createApi = (basePath) => {
  const instance = axios.create({
    baseURL: `${BASE_URL}${basePath}`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Attach token to requests
  instance.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.access) {
      config.headers.Authorization = `Bearer ${user.access}`;
    }
    return config;
  });

  // Handle 401 errors and attempt token refresh
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      const isUnauthorized =
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url.includes('token/refresh');

      if (isUnauthorized) {
        originalRequest._retry = true;

        try {
          const user = JSON.parse(localStorage.getItem('user'));
          const refreshToken = user?.refresh;
          if (!refreshToken) throw new Error('Refresh token missing');

          const tokenRes = await axios.post(`${BASE_URL}/api/account/token/refresh/`, {
            refresh: refreshToken,
          });

          const newAccess = tokenRes.data.access;
          const updatedUser = { ...user, access: newAccess };

          localStorage.setItem('user', JSON.stringify(updatedUser));

          // Update the original request with new access token
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;

          return instance(originalRequest);
        } catch (refreshErr) {
          localStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(refreshErr);
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

// Export specific API instances
export const authApi = createApi('/api/account/');
export const propertyApi = createApi('/api/property/');
