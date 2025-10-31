using TaskManager.API.Models;

namespace TaskManager.API.Services;

public interface ITaskService
{
    List<TaskItem> GetAllTasks();
    TaskItem GetTaskById(Guid id);
    TaskItem CreateTask(TaskItem task);
    TaskItem UpdateTask(TaskItem task);
    void DeleteTask(Guid id);
    List<TaskItem> GetTasksByPriority(Priority priority);
    List<TaskItem> GetTasksByTag(string tag);
}

public class TaskService : ITaskService
{
    private readonly List<TaskItem> _tasks = new();

    public List<TaskItem> GetAllTasks()
    {
        return _tasks;
    }

    public TaskItem GetTaskById(Guid id)
    {
        var task = _tasks.FirstOrDefault(t => t.Id == id);
        if (task == null)
            throw new KeyNotFoundException($"Task with ID {id} not found");
        return task;
    }

    public TaskItem CreateTask(TaskItem task)
    {
        var newTask = new TaskItem
        {
            Id = Guid.NewGuid(),
            Description = task.Description,
            IsCompleted = task.IsCompleted,
            Priority = task.Priority,
            Tags = task.Tags ?? new List<string>(),
            DueDate = task.DueDate,
            CreatedAt = DateTime.UtcNow,
            CompletedAt = null,
            TimeSpent = null
        };
        
        _tasks.Add(newTask);
        return newTask;
    }

    public TaskItem UpdateTask(TaskItem task)
    {
        var existingTask = GetTaskById(task.Id);
        var index = _tasks.IndexOf(existingTask);
        
        if (task.IsCompleted && !existingTask.IsCompleted)
            task.CompletedAt = DateTime.UtcNow;
        else if (!task.IsCompleted)
            task.CompletedAt = null;

        _tasks[index] = task;
        return task;
    }

    public void DeleteTask(Guid id)
    {
        var task = GetTaskById(id);
        _tasks.Remove(task);
    }

    public List<TaskItem> GetTasksByPriority(Priority priority)
    {
        return _tasks.Where(t => t.Priority == priority).ToList();
    }

    public List<TaskItem> GetTasksByTag(string tag)
    {
        return _tasks.Where(t => t.Tags.Contains(tag)).ToList();
    }
}