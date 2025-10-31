using ProjectManagerAPI.DTOs;

namespace ProjectManagerAPI.Services
{
    public interface ISchedulerService
    {
        ScheduleResponseDto ScheduleTasks(ScheduleRequestDto request);
    }

    public class SchedulerService : ISchedulerService
    {
        public ScheduleResponseDto ScheduleTasks(ScheduleRequestDto request)
        {
            var tasks = request.Tasks;
            var taskMap = tasks.ToDictionary(t => t.Title, t => t);
            var result = new List<ScheduledTaskDto>();

            // Build adjacency list and in-degree map
            var adjList = new Dictionary<string, List<string>>();
            var inDegree = new Dictionary<string, int>();

            foreach (var task in tasks)
            {
                if (!adjList.ContainsKey(task.Title))
                {
                    adjList[task.Title] = new List<string>();
                    inDegree[task.Title] = 0;
                }
            }

            // Build the graph
            foreach (var task in tasks)
            {
                foreach (var dep in task.Dependencies)
                {
                    if (taskMap.ContainsKey(dep))
                    {
                        adjList[dep].Add(task.Title);
                        inDegree[task.Title]++;
                    }
                }
            }

            // Topological sort using Kahn's algorithm
            var queue = new Queue<string>();

            // Add all tasks with no dependencies to queue
            foreach (var task in tasks)
            {
                if (inDegree[task.Title] == 0)
                {
                    queue.Enqueue(task.Title);
                }
            }

            var order = 1;

            while (queue.Count > 0)
            {
                // If multiple tasks have no dependencies, prioritize by due date
                var tasksWithNoDeps = new List<string>();
                var count = queue.Count;

                for (int i = 0; i < count; i++)
                {
                    tasksWithNoDeps.Add(queue.Dequeue());
                }

                // Sort by due date (null dates go last)
                tasksWithNoDeps = tasksWithNoDeps
                    .OrderBy(title =>
                    {
                        var task = taskMap[title];
                        return task.DueDate ?? DateTime.MaxValue;
                    })
                    .ToList();

                foreach (var taskTitle in tasksWithNoDeps)
                {
                    var task = taskMap[taskTitle];

                    result.Add(new ScheduledTaskDto
                    {
                        Title = task.Title,
                        EstimatedHours = task.EstimatedHours,
                        DueDate = task.DueDate,
                        Dependencies = task.Dependencies,
                        Order = order++
                    });

                    // Reduce in-degree for dependent tasks
                    foreach (var neighbor in adjList[taskTitle])
                    {
                        inDegree[neighbor]--;
                        if (inDegree[neighbor] == 0)
                        {
                            queue.Enqueue(neighbor);
                        }
                    }
                }
            }

            // Check for cycles
            if (result.Count != tasks.Count)
            {
                throw new InvalidOperationException("Circular dependency detected in task dependencies");
            }

            return new ScheduleResponseDto
            {
                RecommendedOrder = result
            };
        }
    }
}
