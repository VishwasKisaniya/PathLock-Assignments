import React from 'react';
import { Task, Priority } from '../types/Task';

interface TaskStatisticsProps {
  tasks: Task[];
}

const TaskStatistics: React.FC<TaskStatisticsProps> = ({ tasks }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.isCompleted).length;
  const completionRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const priorityDistribution = {
    [Priority.High]: tasks.filter(task => task.priority === Priority.High).length,
    [Priority.Medium]: tasks.filter(task => task.priority === Priority.Medium).length,
    [Priority.Low]: tasks.filter(task => task.priority === Priority.Low).length,
  };

  const uniqueTags = [...new Set(tasks.flatMap(task => task.tags))];
  const tagsCount = uniqueTags.length;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Task Statistics</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-medium">Completion Rate</h3>
          <div className="mt-2 relative pt-1">
            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
              <div
                style={{ width: `${completionRate}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
              />
            </div>
            <span className="text-sm text-gray-600 mt-1">{completionRate}% completed</span>
          </div>
        </div>

        <div>
          <h3 className="font-medium">Priority Distribution</h3>
          <div className="mt-2 space-y-2">
            {Object.entries(priorityDistribution).map(([priority, count]) => (
              <div key={priority} className="flex justify-between items-center">
                <span className="text-sm">{priority}</span>
                <span className="text-sm font-medium">{count} tasks</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-medium">Tag Stats</h3>
          <p className="text-sm text-gray-600 mt-1">
            {tagsCount} unique tags used
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {uniqueTags.map(tag => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskStatistics;