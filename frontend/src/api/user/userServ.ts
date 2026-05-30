import { api } from "../axiosInstance";


export interface UserMeResponse {
id: number;
  username: string;
  role: string;
}

export const userService = {

  async getMe(): Promise<UserMeResponse> {
    const response = await api.get<UserMeResponse>('/users/me');
    return response.data;
  }
};