using System.ComponentModel.DataAnnotations;
using LMS.API.Models;

namespace LMS.API.DTOs;

public class InstructorDto
{
    public int InstructorId { get; set; }
    public string Name { get; set; } = string.Empty;
    public JobTitle JobTitle { get; set; }
    public string JobTitleName { get; set; } = string.Empty;
    public int Rate { get; set; }
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public int CourseCount { get; set; }
}

public class CreateInstructorDto
{
    [Required]
    [StringLength(255)]
    public string Name { get; set; } = string.Empty;

    [Required]
    public JobTitle JobTitle { get; set; }

    [Required]
    [Range(1, 5)]
    public int Rate { get; set; }

    [StringLength(1000)]
    public string? Description { get; set; }

    public IFormFile? Image { get; set; }
}

public class UpdateInstructorDto
{
    [Required]
    [StringLength(255)]
    public string Name { get; set; } = string.Empty;

    [Required]
    public JobTitle JobTitle { get; set; }

    [Required]
    [Range(1, 5)]
    public int Rate { get; set; }

    [StringLength(1000)]
    public string? Description { get; set; }

    public IFormFile? Image { get; set; }
}
