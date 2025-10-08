using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LMS.API.Models;

public class Course
{
    [Key]
    public int CourseId { get; set; }

    [Required]
    [StringLength(255)]
    public string Name { get; set; } = string.Empty;

    [StringLength(2000)]
    public string? Description { get; set; }

    [Required]
    public int CategoryId { get; set; }

    [Required]
    public int InstructorId { get; set; }

    [StringLength(500)]
    public string? ImageUrl { get; set; }

    [Required]
    public CourseLevel Level { get; set; }

    public int TotalHours { get; set; }

    [Range(1, 5)]
    public int Rate { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    public decimal Price { get; set; }

    public bool HasCertification { get; set; }

    [StringLength(2000)]
    public string? Certification { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    [ForeignKey("CategoryId")]
    public virtual Category Category { get; set; } = null!;

    [ForeignKey("InstructorId")]
    public virtual Instructor Instructor { get; set; } = null!;

    public virtual ICollection<CourseTopic> Topics { get; set; } = new List<CourseTopic>();
    public virtual ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
    public virtual ICollection<Purchase> Purchases { get; set; } = new List<Purchase>();
}
