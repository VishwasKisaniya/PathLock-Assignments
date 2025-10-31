export enum Priority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High'
}

export interface Task {
  id: string;
  description: string;
  isCompleted: boolean;
  priority: Priority;
  dueDate: string | null;
  tags: string[];
  createdAt: string;
  completedAt: string | null;
  timeSpent: number | null;
}