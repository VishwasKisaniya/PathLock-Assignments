using Microsoft.AspNetCore.Mvc;
using TaskManager.API.Models;
using TaskManager.API.Services;

namespace TaskManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly ITaskService _taskService;

    public TasksController(ITaskService taskService)
    {
        _taskService = taskService;
    }

    [HttpGet]
    public ActionResult<IEnumerable<TaskItem>> GetAllTasks()
    {
        return Ok(_taskService.GetAllTasks());
    }

    [HttpGet("{id}")]
    public ActionResult<TaskItem> GetTask(Guid id)
    {
        try
        {
            return Ok(_taskService.GetTaskById(id));
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpPost]
    public ActionResult<TaskItem> CreateTask(TaskItem task)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (string.IsNullOrWhiteSpace(task.Description))
        {
            return BadRequest("Description is required");
        }

        try
        {
            var createdTask = _taskService.CreateTask(task);
            return CreatedAtAction(nameof(GetTask), new { id = createdTask.Id }, createdTask);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{id}")]
    public ActionResult<TaskItem> UpdateTask(Guid id, TaskItem task)
    {
        if (id != task.Id)
            return BadRequest();

        try
        {
            return Ok(_taskService.UpdateTask(task));
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteTask(Guid id)
    {
        try
        {
            _taskService.DeleteTask(id);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpGet("priority/{priority}")]
    public ActionResult<IEnumerable<TaskItem>> GetTasksByPriority(Priority priority)
    {
        return Ok(_taskService.GetTasksByPriority(priority));
    }

    [HttpGet("tag/{tag}")]
    public ActionResult<IEnumerable<TaskItem>> GetTasksByTag(string tag)
    {
        return Ok(_taskService.GetTasksByTag(tag));
    }
}