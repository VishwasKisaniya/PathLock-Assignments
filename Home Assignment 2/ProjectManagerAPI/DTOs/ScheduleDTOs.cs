using System.ComponentModel.DataAnnotations;

namespace ProjectManagerAPI.DTOs
{
    public class ScheduleTaskDto
    {
        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        public double EstimatedHours { get; set; }

        public DateTime? DueDate { get; set; }

        public List<string> Dependencies { get; set; } = new List<string>();
    }

    public class ScheduleRequestDto
    {
        [Required]
        public List<ScheduleTaskDto> Tasks { get; set; } = new List<ScheduleTaskDto>();
    }

    public class ScheduledTaskDto
    {
        public string Title { get; set; } = string.Empty;
        public double EstimatedHours { get; set; }
        public DateTime? DueDate { get; set; }
        public List<string> Dependencies { get; set; } = new List<string>();
        public int Order { get; set; }
    }

    public class ScheduleResponseDto
    {
        public List<ScheduledTaskDto> RecommendedOrder { get; set; } = new List<ScheduledTaskDto>();
    }
}
