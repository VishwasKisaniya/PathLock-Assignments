import React from 'react';

interface TaskFilterProps {
  currentFilter: 'all' | 'active' | 'completed';
  onFilterChange: (filter: 'all' | 'active' | 'completed') => void;
}

const TaskFilter: React.FC<TaskFilterProps> = ({ currentFilter, onFilterChange }) => {
  return (
    <div className="flex space-x-4 my-4">
      <button
        className={`px-4 py-2 rounded-md ${
          currentFilter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-100'
        }`}
        onClick={() => onFilterChange('all')}
      >
        All
      </button>
      <button
        className={`px-4 py-2 rounded-md ${
          currentFilter === 'active' ? 'bg-blue-500 text-white' : 'bg-gray-100'
        }`}
        onClick={() => onFilterChange('active')}
      >
        Active
      </button>
      <button
        className={`px-4 py-2 rounded-md ${
          currentFilter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-100'
        }`}
        onClick={() => onFilterChange('completed')}
      >
        Completed
      </button>
    </div>
  );
};

export default TaskFilter;