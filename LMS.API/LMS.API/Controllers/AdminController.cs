using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using LMS.API.Data;
using LMS.API.DTOs;
using LMS.API.Services;

namespace LMS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly LMSDbContext _context;
    private readonly IJwtService _jwtService;

    public AdminController(LMSDbContext context, IJwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login([FromBody] AdminLoginDto loginDto)
    {
        try
        {
            var admin = await _context.Admins
                .FirstOrDefaultAsync(a => a.Email == loginDto.Email);

            if (admin == null || admin.Password != loginDto.Password)
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }

            var token = _jwtService.GenerateAdminToken(admin.AdminId, admin.Email);

            return Ok(new AuthResponseDto
            {
                Token = token,
                UserType = "Admin",
                Name = "Administrator",
                Email = admin.Email
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred during login", error = ex.Message });
        }
    }

    [HttpPost("update-password")]
    public async Task<ActionResult> UpdatePassword([FromBody] AdminPasswordUpdateDto passwordDto)
    {
        try
        {
            var admin = await _context.Admins
                .FirstOrDefaultAsync(a => a.Email == passwordDto.Email);

            if (admin == null)
            {
                return NotFound(new { message = "Admin not found" });
            }

            // Update password without hashing
            admin.Password = passwordDto.NewPassword;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Password updated successfully" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while updating password", error = ex.Message });
        }
    }

    [HttpGet("dashboard-stats")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<DashboardStatsDto>> GetDashboardStats()
    {
        try
        {
            var totalInstructors = await _context.Instructors.CountAsync();
            var totalCategories = await _context.Categories.CountAsync();
            var totalCourses = await _context.Courses.CountAsync();

            var currentMonth = DateTime.UtcNow.Month;
            var currentYear = DateTime.UtcNow.Year;
            var purchasesThisMonth = await _context.Purchases
                .Where(p => p.PurchaseDate.Month == currentMonth && p.PurchaseDate.Year == currentYear)
                .SumAsync(p => p.Amount);

            var categoryStats = await _context.Categories
                .Select(c => new CategoryStatsDto
                {
                    CategoryName = c.Name,
                    CourseCount = c.Courses.Count
                })
                .ToListAsync();

            if (totalCourses > 0)
            {
                foreach (var stat in categoryStats)
                {
                    stat.Percentage = Math.Round((decimal)stat.CourseCount / totalCourses * 100, 1);
                }
            }

            return Ok(new DashboardStatsDto
            {
                TotalInstructors = totalInstructors,
                TotalCategories = totalCategories,
                TotalCourses = totalCourses,
                PurchasesThisMonth = purchasesThisMonth,
                CategoryStats = categoryStats
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while fetching dashboard stats", error = ex.Message });
        }
    }
}
