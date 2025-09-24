using System.ComponentModel.DataAnnotations;

namespace LMS.API.Models;

public class User
{
    [Key]
    public int UserId { get; set; }

    [Required]
    [StringLength(255)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string Username { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [StringLength(255)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [StringLength(255)]
    public string Password { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
    public virtual ICollection<Purchase> Purchases { get; set; } = new List<Purchase>();
}
