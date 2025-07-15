// api.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

const propertyApi = axios.create({
  baseURL: `${BASE_URL}/api/property/`,
  headers: {
    'Content-Type': 'application/json',
  },
});

const authApi = axios.create({
  baseURL: `${BASE_URL}/api/account/`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach access token automatically
authApi.interceptors.request.use(config => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.access;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    console.error('JWT attach error:', err);
  }
  return config;
});

// Auto refresh token
authApi.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/token/refresh/')
    ) {
      originalRequest._retry = true;

      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const refreshToken = user?.refresh;
        if (!refreshToken) throw new Error('Refresh token missing');

        const res = await authApi.post('token/refresh/', { refresh: refreshToken });
        const newAccess = res.data.access;

        const updatedUser = { ...user, access: newAccess };
        localStorage.setItem('user', JSON.stringify(updatedUser));

        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return authApi(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export { propertyApi, authApi };
