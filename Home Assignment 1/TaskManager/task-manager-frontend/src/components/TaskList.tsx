import React from 'react';
import { Task } from '../types/Task';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onToggleComplete, onDelete }) => {
  return (
    <div className="mt-6">
      {tasks.length === 0 ? (
        <p className="text-gray-500 text-center">No tasks found</p>
      ) : (
        <ul className="space-y-4">
          {tasks.map(task => (
            <li
              key={task.id}
              className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    checked={task.isCompleted}
                    onChange={() => onToggleComplete(task)}
                    className="h-5 w-5"
                  />
                  <div>
                    <p className={`text-lg ${task.isCompleted ? 'line-through text-gray-500' : ''}`}>
                      {task.description}
                    </p>
                    <div className="flex space-x-2 mt-2">
                      <span className={`px-2 py-1 rounded text-sm ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      {task.tags.map(tag => (
                        <span
                          key={tag}
                          className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onDelete(task.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const getPriorityColor = (priority: Task['priority']) => {
  switch (priority) {
    case 'High':
      return 'bg-red-100 text-red-800';
    case 'Medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'Low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default TaskList;