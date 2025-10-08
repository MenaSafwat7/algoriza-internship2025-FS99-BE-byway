using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using LMS.API.Data;
using LMS.API.DTOs;
using LMS.API.Models;
using System.Security.Claims;

namespace LMS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "User")]
public class PurchaseController : ControllerBase
{
    private readonly LMSDbContext _context;

    public PurchaseController(LMSDbContext context)
    {
        _context = context;
    }

    private int GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.Parse(userIdClaim ?? "0");
    }

    [HttpPost]
    public async Task<IActionResult> ProcessPurchase([FromBody] ProcessPurchaseDto purchaseDto)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            var userId = GetCurrentUserId();
            var courseIds = purchaseDto.CourseIds;

            if (!courseIds.Any())
            {
                var cartItems = await _context.CartItems
                    .Where(ci => ci.UserId == userId)
                    .ToListAsync();

                if (!cartItems.Any())
                {
                    return BadRequest(new { message = "Cart is empty" });
                }

                courseIds = cartItems.Select(ci => ci.CourseId).ToList();
            }

            var courses = await _context.Courses
                .Where(c => courseIds.Contains(c.CourseId))
                .ToListAsync();

            if (courses.Count != courseIds.Count)
            {
                return BadRequest(new { message = "One or more courses not found" });
            }

            var existingPurchases = await _context.Purchases
                .Where(p => p.UserId == userId && courseIds.Contains(p.CourseId))
                .Select(p => p.CourseId)
                .ToListAsync();

            if (existingPurchases.Any())
            {
                return BadRequest(new { message = "You have already purchased one or more of these courses" });
            }

            var subtotal = courses.Sum(c => c.Price);
            var discount = purchaseDto.Discount;
            var tax = (subtotal - discount) * 0.15m;
            var totalAmount = subtotal - discount + tax;

            var purchases = courses.Select(course => new Purchase
            {
                UserId = userId,
                CourseId = course.CourseId,
                PurchaseDate = DateTime.UtcNow,
                Amount = course.Price,
                Tax = (course.Price - (discount / courses.Count)) * 0.15m,
                Discount = discount / courses.Count
            }).ToList();

            _context.Purchases.AddRange(purchases);

            var cartItemsToRemove = await _context.CartItems
                .Where(ci => ci.UserId == userId && courseIds.Contains(ci.CourseId))
                .ToListAsync();

            _context.CartItems.RemoveRange(cartItemsToRemove);

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return Ok(new {
                message = "Purchase completed successfully",
                totalAmount,
                coursesCount = courses.Count
            });
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return StatusCode(500, new { message = "An error occurred while processing the purchase", error = ex.Message });
        }
    }

    [HttpGet]
    public async Task<ActionResult<List<PurchaseDto>>> GetPurchases()
    {
        try
        {
            var userId = GetCurrentUserId();

            var purchases = await _context.Purchases
                .Include(p => p.Course)
                .ThenInclude(c => c.Instructor)
                .Where(p => p.UserId == userId)
                .OrderByDescending(p => p.PurchaseDate)
                .Select(p => new PurchaseDto
                {
                    PurchaseId = p.PurchaseId,
                    CourseId = p.CourseId,
                    CourseName = p.Course.Name,
                    CourseImageUrl = p.Course.ImageUrl,
                    InstructorName = p.Course.Instructor.Name,
                    PurchaseDate = p.PurchaseDate,
                    Amount = p.Amount,
                    Tax = p.Tax,
                    Discount = p.Discount
                })
                .ToListAsync();

            return Ok(purchases);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while fetching purchase history", error = ex.Message });
        }
    }

    [HttpGet("check/{courseId}")]
    public async Task<ActionResult<bool>> HasPurchasedCourse(int courseId)
    {
        try
        {
            var userId = GetCurrentUserId();

            var hasPurchased = await _context.Purchases
                .AnyAsync(p => p.UserId == userId && p.CourseId == courseId);

            return Ok(hasPurchased);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while checking purchase status", error = ex.Message });
        }
    }
}
