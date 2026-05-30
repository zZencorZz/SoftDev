import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { authService } from './auth/authServ';


export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});
let isRefreshing = false;

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (window.location.pathname.includes('/auth')) {
        return Promise.reject(error);
      }

      originalRequest._retry = true; 
      isRefreshing = true;

      try {
        const data = await authService.refresh();
        const newAccessToken = data.access_token;
        localStorage.setItem('access_token', newAccessToken);
        
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        
        isRefreshing = false;
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
          window.location.href = '/auth';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);