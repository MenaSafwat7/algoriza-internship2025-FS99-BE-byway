using System.ComponentModel.DataAnnotations;

namespace LMS.API.Models;

public class Admin
{
    [Key]
    public int AdminId { get; set; }

    [Required]
    [EmailAddress]
    [StringLength(255)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [StringLength(255)]
    public string Password { get; set; } = string.Empty;

    [StringLength(500)]
    public string? Address { get; set; }
}
