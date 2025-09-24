using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LMS.API.Models;

public class CourseTopic
{
    [Key]
    public int TopicId { get; set; }

    [Required]
    public int CourseId { get; set; }

    [Required]
    [StringLength(255)]
    public string TopicName { get; set; } = string.Empty;

    public int LectureCount { get; set; }

    public int DurationMinutes { get; set; }

    public int Order { get; set; }

    // Navigation properties
    [ForeignKey("CourseId")]
    public virtual Course Course { get; set; } = null!;
}
