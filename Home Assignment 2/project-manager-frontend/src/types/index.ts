export interface User {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  bio?: string;
  profileImageUrl?: string;
  createdAt: string;
}

export interface UpdateProfileData {
  fullName?: string;
  bio?: string;
  profileImageUrl?: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  email: string;
}

export interface Project {
  id: number;
  title: string;
  description?: string;
  createdAt: string;
  userId: number;
}

export interface ProjectDetail extends Project {
  tasks: Task[];
}

export interface CreateProjectData {
  title: string;
  description?: string;
}

export interface Task {
  id: number;
  title: string;
  dueDate?: string;
  isCompleted: boolean;
  estimatedHours: number;
  dependencies: string;
  createdAt: string;
  projectId: number;
}

export interface CreateTaskData {
  title: string;
  dueDate?: string;
  estimatedHours: number;
  dependencies: string;
}

export interface UpdateTaskData {
  title: string;
  dueDate?: string;
  isCompleted: boolean;
  estimatedHours: number;
  dependencies: string;
}

// Smart Scheduler Types
export interface ScheduleTaskInput {
  title: string;
  estimatedHours: number;
  dueDate?: string;
  dependencies: string[];
}

export interface ScheduleRequest {
  tasks: ScheduleTaskInput[];
}

export interface ScheduledTask {
  title: string;
  estimatedHours: number;
  dueDate?: string;
  dependencies: string[];
  order: number;
}

export interface ScheduleResponse {
  recommendedOrder: ScheduledTask[];
}
