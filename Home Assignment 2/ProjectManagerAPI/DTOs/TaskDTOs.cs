using System.ComponentModel.DataAnnotations;

namespace ProjectManagerAPI.DTOs
{
    public class CreateTaskDto
    {
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        public DateTime? DueDate { get; set; }

        [Required]
        [Range(0.1, double.MaxValue, ErrorMessage = "Estimated hours must be greater than 0")]
        public double EstimatedHours { get; set; } = 1;

        public string Dependencies { get; set; } = "[]";
    }

    public class UpdateTaskDto
    {
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        public DateTime? DueDate { get; set; }

        public bool IsCompleted { get; set; }

        [Required]
        [Range(0.1, double.MaxValue, ErrorMessage = "Estimated hours must be greater than 0")]
        public double EstimatedHours { get; set; } = 1;

        public string Dependencies { get; set; } = "[]";
    }

    public class TaskDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public DateTime? DueDate { get; set; }
        public bool IsCompleted { get; set; }
        public double EstimatedHours { get; set; }
        public string Dependencies { get; set; } = "[]";
        public DateTime CreatedAt { get; set; }
        public int ProjectId { get; set; }
    }
}
