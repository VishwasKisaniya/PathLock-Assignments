using System.ComponentModel.DataAnnotations;

namespace ProjectManagerAPI.Models
{
    public class ProjectTask
    {
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        public DateTime? DueDate { get; set; }

        public bool IsCompleted { get; set; } = false;

        [Required]
        public double EstimatedHours { get; set; } = 0;

        public string Dependencies { get; set; } = "[]"; // JSON array of task IDs

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Required]
        public int ProjectId { get; set; }

        // Navigation properties
        public Project Project { get; set; } = null!;
    }
}
