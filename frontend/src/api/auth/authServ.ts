import { AuthRequest, AuthResponse } from '@/types/auth/auth.types';
import { api } from '../axiosInstance';

export const authService = {
  register: async (data: AuthRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  login: async (data: AuthRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  refresh: async (): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/refresh', {}, { withCredentials: true });
    return response.data;
  }
};