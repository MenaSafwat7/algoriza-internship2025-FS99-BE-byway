using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using LMS.API.Data;
using LMS.API.DTOs;
using LMS.API.Models;
using LMS.API.Services;
using System.Security.Claims;

namespace LMS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "User")]
public class CartController : ControllerBase
{
    private readonly LMSDbContext _context;

    public CartController(LMSDbContext context)
    {
        _context = context;
    }

    private int GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.Parse(userIdClaim ?? "0");
    }

    /// <summary>
    /// Get user's cart with summary
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<CartSummaryDto>> GetCart()
    {
        try
        {
            var userId = GetCurrentUserId();

            var cartItems = await _context.CartItems
                .Include(ci => ci.Course)
                .ThenInclude(c => c.Instructor)
                .Where(ci => ci.UserId == userId)
                .Select(ci => new CartItemDto
                {
                    CartItemId = ci.CartItemId,
                    CourseId = ci.CourseId,
                    CourseName = ci.Course.Name,
                    CourseImageUrl = ci.Course.ImageUrl,
                    InstructorName = ci.Course.Instructor.Name,
                    Price = ci.Course.Price,
                    AddedAt = ci.AddedAt
                })
                .ToListAsync();

            var subtotal = cartItems.Sum(item => item.Price);
            var discount = 0m; // Static as per requirements
            var tax = subtotal * 0.15m; // 15% tax
            var total = subtotal - discount + tax;

            var cartSummary = new CartSummaryDto
            {
                Items = cartItems,
                Subtotal = subtotal,
                Discount = discount,
                Tax = tax,
                Total = total
            };

            return Ok(cartSummary);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while fetching the cart", error = ex.Message });
        }
    }

    /// <summary>
    /// Add course to cart
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> AddToCart([FromBody] int courseId)
    {
        try
        {
            var userId = GetCurrentUserId();

            // Check if course exists
            var course = await _context.Courses.FindAsync(courseId);
            if (course == null)
            {
                return NotFound(new { message = "Course not found" });
            }

            // Check if user already purchased this course
            var existingPurchase = await _context.Purchases
                .FirstOrDefaultAsync(p => p.UserId == userId && p.CourseId == courseId);

            if (existingPurchase != null)
            {
                return BadRequest(new { message = "You have already purchased this course" });
            }

            // Check if course is already in cart
            var existingCartItem = await _context.CartItems
                .FirstOrDefaultAsync(ci => ci.UserId == userId && ci.CourseId == courseId);

            if (existingCartItem != null)
            {
                return BadRequest(new { message = "Course is already in your cart" });
            }

            // Add to cart
            var cartItem = new CartItem
            {
                UserId = userId,
                CourseId = courseId,
                AddedAt = DateTime.UtcNow
            };

            _context.CartItems.Add(cartItem);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Course added to cart successfully" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while adding the course to cart", error = ex.Message });
        }
    }

    /// <summary>
    /// Remove course from cart
    /// </summary>
    [HttpDelete("{courseId}")]
    public async Task<IActionResult> RemoveFromCart(int courseId)
    {
        try
        {
            var userId = GetCurrentUserId();

            var cartItem = await _context.CartItems
                .FirstOrDefaultAsync(ci => ci.UserId == userId && ci.CourseId == courseId);

            if (cartItem == null)
            {
                return NotFound(new { message = "Course not found in cart" });
            }

            _context.CartItems.Remove(cartItem);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Course removed from cart successfully" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while removing the course from cart", error = ex.Message });
        }
    }

    /// <summary>
    /// Clear entire cart
    /// </summary>
    [HttpDelete]
    public async Task<IActionResult> ClearCart()
    {
        try
        {
            var userId = GetCurrentUserId();

            var cartItems = await _context.CartItems
                .Where(ci => ci.UserId == userId)
                .ToListAsync();

            _context.CartItems.RemoveRange(cartItems);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Cart cleared successfully" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while clearing the cart", error = ex.Message });
        }
    }
}
