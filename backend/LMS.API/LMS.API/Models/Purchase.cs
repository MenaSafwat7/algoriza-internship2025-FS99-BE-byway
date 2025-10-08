using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LMS.API.Models;

public class Purchase
{
    [Key]
    public int PurchaseId { get; set; }

    [Required]
    public int UserId { get; set; }

    [Required]
    public int CourseId { get; set; }

    public DateTime PurchaseDate { get; set; } = DateTime.UtcNow;

    [Column(TypeName = "decimal(10,2)")]
    public decimal Amount { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    public decimal Tax { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    public decimal Discount { get; set; }

    [ForeignKey("UserId")]
    public virtual User User { get; set; } = null!;

    [ForeignKey("CourseId")]
    public virtual Course Course { get; set; } = null!;
}
