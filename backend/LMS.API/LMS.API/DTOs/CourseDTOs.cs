using System.ComponentModel.DataAnnotations;
using LMS.API.Models;

namespace LMS.API.DTOs;

public class CourseDto
{
    public int CourseId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public int InstructorId { get; set; }
    public string InstructorName { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public CourseLevel Level { get; set; }
    public string LevelName { get; set; } = string.Empty;
    public int TotalHours { get; set; }
    public int Rate { get; set; }
    public decimal Price { get; set; }
    public bool HasCertification { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public List<CourseTopicDto> Topics { get; set; } = new();
}

public class CourseTopicDto
{
    public int TopicId { get; set; }
    public string TopicName { get; set; } = string.Empty;
    public int LectureCount { get; set; }
    public int DurationMinutes { get; set; }
    public int Order { get; set; }
}

public class CreateCourseDto
{
    [Required]
    [StringLength(255)]
    public string Name { get; set; } = string.Empty;

    [StringLength(2000)]
    public string? Description { get; set; }

    [Required]
    public int CategoryId { get; set; }

    [Required]
    public int InstructorId { get; set; }

    [Required]
    public CourseLevel Level { get; set; }

    [Required]
    [Range(1, 1000)]
    public int TotalHours { get; set; }

    [Required]
    [Range(1, 5)]
    public int Rate { get; set; }

    [Required]
    [Range(0, 999999.99)]
    public decimal Price { get; set; }

    public bool HasCertification { get; set; }

    public IFormFile? Image { get; set; }

    public List<CreateCourseTopicDto> Topics { get; set; } = new();
}

public class CreateCourseTopicDto
{
    [Required]
    [StringLength(255)]
    public string TopicName { get; set; } = string.Empty;

    [Required]
    [Range(1, 100)]
    public int LectureCount { get; set; }

    [Required]
    [Range(1, 10000)]
    public int DurationMinutes { get; set; }

    [Required]
    [Range(1, 100)]
    public int Order { get; set; }
}

public class UpdateCourseDto
{
    [Required]
    [StringLength(255)]
    public string Name { get; set; } = string.Empty;

    [StringLength(2000)]
    public string? Description { get; set; }

    [Required]
    public int CategoryId { get; set; }

    [Required]
    public int InstructorId { get; set; }

    [Required]
    public CourseLevel Level { get; set; }

    [Required]
    [Range(1, 1000)]
    public int TotalHours { get; set; }

    [Required]
    [Range(1, 5)]
    public int Rate { get; set; }

    [Required]
    [Range(0, 999999.99)]
    public decimal Price { get; set; }

    public bool HasCertification { get; set; }

    public IFormFile? Image { get; set; }

    public List<CreateCourseTopicDto> Topics { get; set; } = new();
}
