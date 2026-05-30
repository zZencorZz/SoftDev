import { api } from "../axiosInstance";



export interface ProjectLink {
  name: string;
  url: string;
}

export interface LookupItem {
  id: number;
  name: string;
}

export interface CreateProjectPayload {
  name: string;
  description: string;
  language_id: number;
  platform_id: number;
  architecture_id: number;
  software_type_id: number;
  target_users_count: number;
  links: ProjectLink[];
  price: number;
  deadline: string; 
}

interface NestedRef {
  id: number;
  name: string;
}

interface UserRef {
  id: number;
  username: string;
  role: string;
}

export interface ProjectResponse {
  id: number;
  name: string;
  description: string;
  client: UserRef;
  manager: UserRef;
  language: NestedRef;
  platform: NestedRef;
  architecture: NestedRef;
  software_type: NestedRef;
  target_users_count: number;
  links: ProjectLink[];
  status: string;
  price: number;
  deadline: string;
  created_at: string;
  updated_at: string;
}

export const projectService = {
  async getProjects(): Promise<ProjectResponse[]> {
    const response = await api.get<ProjectResponse[]>('/projects/');
    return response.data;
  },

  async createProject(payload: CreateProjectPayload): Promise<ProjectResponse> {
    const response = await api.post<ProjectResponse>('/projects/', payload);
    return response.data;
  },

//   async updateProject(projectId: number, payload: any): Promise<ProjectResponse> {
//     const response = await api.put<ProjectResponse>(`/projects/${projectId}`, payload);
//     return response.data;
//   },

  async getArchitectures(): Promise<LookupItem[]> {
    const response = await api.get<LookupItem[]>('/architectures/');
    return response.data;
  },

  async getSoftwareTypes(): Promise<LookupItem[]> {
    const response = await api.get<LookupItem[]>('/software_types/');
    return response.data;
  },

  async getPlatforms(): Promise<LookupItem[]> {
    const response = await api.get<LookupItem[]>('/platforms/');
    return response.data;
  },

  async getLanguages(): Promise<LookupItem[]> {
    const response = await api.get<LookupItem[]>('/languages/');
    return response.data;
  },
};