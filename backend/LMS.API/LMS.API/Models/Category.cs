using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LMS.API.Models;

public class Category
{
    [Key]
    public int CategoryId { get; set; }

    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [NotMapped]
    public int CourseCount => Courses?.Count ?? 0;

    public virtual ICollection<Course> Courses { get; set; } = new List<Course>();
}
