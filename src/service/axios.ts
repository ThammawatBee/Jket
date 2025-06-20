import axios from 'axios';
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_SERVICE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const skipAuthPaths = ['/auth/login',];

axiosInstance.interceptors.response.use(
  (response) => {
    // Handle responses (e.g., transform data)
    return response.data; // Return only data
  },
  (error) => {
    const status = error.response?.status;
    const path = error.config?.url;

    if (status === 401 && !skipAuthPaths.includes(path)) {
      localStorage.removeItem('accessToken'); // Clear token
      localStorage.removeItem('expiresAt')
      window.location.href = 'login'
    }
    // Handle response errors (e.g., logging, notifications)
    return Promise.reject(error.response || error.message);
  }
);

export default axiosInstance;