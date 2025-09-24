using LMS.API.Models;

namespace LMS.API.DTOs;

public class CategoryDto
{
    public int CategoryId { get; set; }
    public string Name { get; set; } = string.Empty;
    public int CourseCount { get; set; }
}

public class DashboardStatsDto
{
    public int TotalInstructors { get; set; }
    public int TotalCategories { get; set; }
    public int TotalCourses { get; set; }
    public decimal PurchasesThisMonth { get; set; }
    public List<CategoryStatsDto> CategoryStats { get; set; } = new();
}

public class CategoryStatsDto
{
    public string CategoryName { get; set; } = string.Empty;
    public int CourseCount { get; set; }
    public decimal Percentage { get; set; }
}

public class PaginatedResult<T>
{
    public List<T> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
    public bool HasNextPage => Page < TotalPages;
    public bool HasPreviousPage => Page > 1;
}

public class CartItemDto
{
    public int CartItemId { get; set; }
    public int CourseId { get; set; }
    public string CourseName { get; set; } = string.Empty;
    public string? CourseImageUrl { get; set; }
    public string InstructorName { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public DateTime AddedAt { get; set; }
}

public class CartSummaryDto
{
    public List<CartItemDto> Items { get; set; } = new();
    public decimal Subtotal { get; set; }
    public decimal Discount { get; set; }
    public decimal Tax { get; set; }
    public decimal Total { get; set; }
}

public class PurchaseDto
{
    public int PurchaseId { get; set; }
    public int CourseId { get; set; }
    public string CourseName { get; set; } = string.Empty;
    public string? CourseImageUrl { get; set; }
    public string InstructorName { get; set; } = string.Empty;
    public DateTime PurchaseDate { get; set; }
    public decimal Amount { get; set; }
    public decimal Tax { get; set; }
    public decimal Discount { get; set; }
}

public class ProcessPurchaseDto
{
    public List<int> CourseIds { get; set; } = new();
    public decimal Discount { get; set; } = 0;
}
