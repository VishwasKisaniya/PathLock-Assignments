import axios from 'axios';
import type {
  AuthResponse,
  LoginData,
  RegisterData,
  Project,
  ProjectDetail,
  CreateProjectData,
  Task,
  CreateTaskData,
  UpdateTaskData,
  User,
  UpdateProfileData,
  ScheduleRequest,
  ScheduleResponse,
} from '../types';

// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5102/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized (401) - Redirecting to login');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Use setTimeout to ensure state is updated before navigation
      setTimeout(() => {
        window.location.href = '/login';
      }, 100);
    } else if (error.response?.status === 403) {
      console.warn('Forbidden (403) - Access denied');
    } else if (error.response?.status >= 500) {
      console.error('Server error:', error.response?.status, error.response?.data);
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },
};

// Projects API
export const projectsAPI = {
  getAll: async (): Promise<Project[]> => {
    const response = await api.get<Project[]>('/projects');
    return response.data;
  },

  getById: async (id: number): Promise<ProjectDetail> => {
    const response = await api.get<ProjectDetail>(`/projects/${id}`);
    return response.data;
  },

  create: async (data: CreateProjectData): Promise<Project> => {
    const response = await api.post<Project>('/projects', data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/projects/${id}`);
  },
};

// Tasks API
export const tasksAPI = {
  create: async (projectId: number, data: CreateTaskData): Promise<Task> => {
    const response = await api.post<Task>(`/projects/${projectId}/tasks`, data);
    return response.data;
  },

  update: async (taskId: number, data: UpdateTaskData): Promise<Task> => {
    const response = await api.put<Task>(`/tasks/${taskId}`, data);
    return response.data;
  },

  delete: async (taskId: number): Promise<void> => {
    await api.delete(`/tasks/${taskId}`);
  },
};

// Profile API
export const profileAPI = {
  get: async (): Promise<User> => {
    const response = await api.get<User>('/profile');
    return response.data;
  },

  update: async (data: UpdateProfileData): Promise<User> => {
    const response = await api.put<User>('/profile', data);
    return response.data;
  },
};

// Smart Scheduler API
export const schedulerAPI = {
  scheduleTasks: async (projectId: number, data: ScheduleRequest): Promise<ScheduleResponse> => {
    const response = await api.post<ScheduleResponse>(`/projects/${projectId}/schedule`, data);
    return response.data;
  },
};

export default api;
