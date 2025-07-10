import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: `${BASE_URL}/auth/`,
  headers: {
    'Content-Type': 'application/json',
  },
});

const authApi = axios.create({
  baseURL: `${BASE_URL}/api/`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add access token to requests
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

// Refresh token on 401
authApi.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // Prevent infinite retry loop
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/token/refresh/')
    ) {
      originalRequest._retry = true;
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const refreshToken = user?.refresh;

        if (!refreshToken) throw new Error('Refresh token missing');

        // Refresh the token
        const res = await api.post('token/refresh/', { refresh: refreshToken });
        const newAccess = res.data.access;

        // Save new access token
        const updatedUser = { ...user, access: newAccess };
        localStorage.setItem('user', JSON.stringify(updatedUser));

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return authApi(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export { api, authApi };
