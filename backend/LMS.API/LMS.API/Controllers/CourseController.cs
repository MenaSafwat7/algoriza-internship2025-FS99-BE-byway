using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using LMS.API.Data;
using LMS.API.DTOs;
using LMS.API.Models;
using LMS.API.Services;

namespace LMS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CourseController : ControllerBase
{
    private readonly LMSDbContext _context;
    private readonly IFileService _fileService;

    public CourseController(LMSDbContext context, IFileService fileService)
    {
        _context = context;
        _fileService = fileService;
    }

    /// <summary>
    /// Get courses with filtering, sorting, and pagination
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<PaginatedResult<CourseDto>>> GetCourses(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 12,
        [FromQuery] string? search = null,
        [FromQuery] int? categoryId = null,
        [FromQuery] CourseLevel? level = null,
        [FromQuery] int? minRating = null,
        [FromQuery] decimal? minPrice = null,
        [FromQuery] decimal? maxPrice = null,
        [FromQuery] string sortBy = "latest") // latest, oldest, priceHigh, priceLow, rating
    {
        try
        {
            var query = _context.Courses
                .Include(c => c.Category)
                .Include(c => c.Instructor)
                .Include(c => c.Topics)
                .AsQueryable();

            // Apply filters
            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(c => c.Name.Contains(search) || 
                                        c.Description!.Contains(search) ||
                                        c.Instructor.Name.Contains(search));
            }

            if (categoryId.HasValue)
            {
                query = query.Where(c => c.CategoryId == categoryId.Value);
            }

            if (level.HasValue)
            {
                query = query.Where(c => c.Level == level.Value);
            }

            if (minRating.HasValue)
            {
                query = query.Where(c => c.Rate >= minRating.Value);
            }

            if (minPrice.HasValue)
            {
                query = query.Where(c => c.Price >= minPrice.Value);
            }

            if (maxPrice.HasValue)
            {
                query = query.Where(c => c.Price <= maxPrice.Value);
            }

            // Apply sorting
            query = sortBy.ToLower() switch
            {
                "oldest" => query.OrderBy(c => c.CreatedAt),
                "pricehigh" => query.OrderByDescending(c => c.Price),
                "pricelow" => query.OrderBy(c => c.Price),
                "rating" => query.OrderByDescending(c => c.Rate),
                _ => query.OrderByDescending(c => c.CreatedAt) // latest (default)
            };

            var totalCount = await query.CountAsync();

            var courses = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(c => new CourseDto
                {
                    CourseId = c.CourseId,
                    Name = c.Name,
                    Description = c.Description,
                    CategoryId = c.CategoryId,
                    CategoryName = c.Category.Name,
                    InstructorId = c.InstructorId,
                    InstructorName = c.Instructor.Name,
                    ImageUrl = c.ImageUrl,
                    Level = c.Level,
                    LevelName = c.Level.ToString(),
                    TotalHours = c.TotalHours,
                    Rate = c.Rate,
                    Price = c.Price,
                    HasCertification = c.HasCertification,
                    CreatedAt = c.CreatedAt,
                    UpdatedAt = c.UpdatedAt,
                    Topics = c.Topics.Select(t => new CourseTopicDto
                    {
                        TopicId = t.TopicId,
                        TopicName = t.TopicName,
                        LectureCount = t.LectureCount,
                        DurationMinutes = t.DurationMinutes,
                        Order = t.Order
                    }).OrderBy(t => t.Order).ToList()
                })
                .ToListAsync();

            return Ok(new PaginatedResult<CourseDto>
            {
                Items = courses,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while fetching courses", error = ex.Message });
        }
    }

    /// <summary>
    /// Get course by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<CourseDto>> GetCourse(int id)
    {
        try
        {
            var course = await _context.Courses
                .Include(c => c.Category)
                .Include(c => c.Instructor)
                .Include(c => c.Topics)
                .FirstOrDefaultAsync(c => c.CourseId == id);

            if (course == null)
            {
                return NotFound(new { message = "Course not found" });
            }

            var courseDto = new CourseDto
            {
                CourseId = course.CourseId,
                Name = course.Name,
                Description = course.Description,
                CategoryId = course.CategoryId,
                CategoryName = course.Category.Name,
                InstructorId = course.InstructorId,
                InstructorName = course.Instructor.Name,
                ImageUrl = course.ImageUrl,
                Level = course.Level,
                LevelName = course.Level.ToString(),
                TotalHours = course.TotalHours,
                Rate = course.Rate,
                Price = course.Price,
                HasCertification = course.HasCertification,
                CreatedAt = course.CreatedAt,
                UpdatedAt = course.UpdatedAt,
                Topics = course.Topics.Select(t => new CourseTopicDto
                {
                    TopicId = t.TopicId,
                    TopicName = t.TopicName,
                    LectureCount = t.LectureCount,
                    DurationMinutes = t.DurationMinutes,
                    Order = t.Order
                }).OrderBy(t => t.Order).ToList()
            };

            return Ok(courseDto);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while fetching the course", error = ex.Message });
        }
    }

    /// <summary>
    /// Get top courses by rating
    /// </summary>
    [HttpGet("top-rated")]
    public async Task<ActionResult<List<CourseDto>>> GetTopRatedCourses([FromQuery] int count = 4)
    {
        try
        {
            var courses = await _context.Courses
                .Include(c => c.Category)
                .Include(c => c.Instructor)
                .OrderByDescending(c => c.Rate)
                .ThenByDescending(c => c.CreatedAt)
                .Take(count)
                .Select(c => new CourseDto
                {
                    CourseId = c.CourseId,
                    Name = c.Name,
                    Description = c.Description,
                    CategoryId = c.CategoryId,
                    CategoryName = c.Category.Name,
                    InstructorId = c.InstructorId,
                    InstructorName = c.Instructor.Name,
                    ImageUrl = c.ImageUrl,
                    Level = c.Level,
                    LevelName = c.Level.ToString(),
                    TotalHours = c.TotalHours,
                    Rate = c.Rate,
                    Price = c.Price,
                    HasCertification = c.HasCertification,
                    CreatedAt = c.CreatedAt,
                    UpdatedAt = c.UpdatedAt
                })
                .ToListAsync();

            return Ok(courses);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while fetching top-rated courses", error = ex.Message });
        }
    }

    /// <summary>
    /// Get related courses by category
    /// </summary>
    [HttpGet("{id}/related")]
    public async Task<ActionResult<List<CourseDto>>> GetRelatedCourses(int id, [FromQuery] int count = 4)
    {
        try
        {
            var course = await _context.Courses.FindAsync(id);
            if (course == null)
            {
                return NotFound(new { message = "Course not found" });
            }

            var relatedCourses = await _context.Courses
                .Include(c => c.Category)
                .Include(c => c.Instructor)
                .Where(c => c.CategoryId == course.CategoryId && c.CourseId != id)
                .OrderByDescending(c => c.Rate)
                .Take(count)
                .Select(c => new CourseDto
                {
                    CourseId = c.CourseId,
                    Name = c.Name,
                    Description = c.Description,
                    CategoryId = c.CategoryId,
                    CategoryName = c.Category.Name,
                    InstructorId = c.InstructorId,
                    InstructorName = c.Instructor.Name,
                    ImageUrl = c.ImageUrl,
                    Level = c.Level,
                    LevelName = c.Level.ToString(),
                    TotalHours = c.TotalHours,
                    Rate = c.Rate,
                    Price = c.Price,
                    HasCertification = c.HasCertification,
                    CreatedAt = c.CreatedAt,
                    UpdatedAt = c.UpdatedAt
                })
                .ToListAsync();

            return Ok(relatedCourses);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while fetching related courses", error = ex.Message });
        }
    }

    /// <summary>
    /// Create a new course (Admin only)
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<CourseDto>> CreateCourse([FromForm] CreateCourseDto createDto)
    {
        try
        {
            // Validate instructor and category exist
            var instructor = await _context.Instructors.FindAsync(createDto.InstructorId);
            if (instructor == null)
            {
                return BadRequest(new { message = "Invalid instructor ID" });
            }

            var category = await _context.Categories.FindAsync(createDto.CategoryId);
            if (category == null)
            {
                return BadRequest(new { message = "Invalid category ID" });
            }

            string? imageUrl = null;

            // Handle image upload
            if (createDto.Image != null)
            {
                if (!_fileService.IsValidImage(createDto.Image))
                {
                    return BadRequest(new { message = "Invalid image file. Please upload a JPG, JPEG, PNG, or GIF file under 5MB." });
                }

                imageUrl = await _fileService.SaveImageAsync(createDto.Image, "courses");
            }

            var course = new Course
            {
                Name = createDto.Name,
                Description = createDto.Description,
                CategoryId = createDto.CategoryId,
                InstructorId = createDto.InstructorId,
                ImageUrl = imageUrl,
                Level = createDto.Level,
                TotalHours = createDto.TotalHours,
                Rate = createDto.Rate,
                Price = createDto.Price,
                HasCertification = createDto.HasCertification,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Courses.Add(course);
            await _context.SaveChangesAsync();

            // Add topics
            if (createDto.Topics.Any())
            {
                var topics = createDto.Topics.Select(t => new CourseTopic
                {
                    CourseId = course.CourseId,
                    TopicName = t.TopicName,
                    LectureCount = t.LectureCount,
                    DurationMinutes = t.DurationMinutes,
                    Order = t.Order
                }).ToList();

                _context.CourseTopics.AddRange(topics);
                await _context.SaveChangesAsync();
            }

            // Return the created course
            return await GetCourse(course.CourseId);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while creating the course", error = ex.Message });
        }
    }

    /// <summary>
    /// Update a course (Admin only)
    /// </summary>
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<CourseDto>> UpdateCourse(int id, [FromForm] UpdateCourseDto updateDto)
    {
        try
        {
            var course = await _context.Courses
                .Include(c => c.Topics)
                .FirstOrDefaultAsync(c => c.CourseId == id);

            if (course == null)
            {
                return NotFound(new { message = "Course not found" });
            }

            // Validate instructor and category exist
            var instructor = await _context.Instructors.FindAsync(updateDto.InstructorId);
            if (instructor == null)
            {
                return BadRequest(new { message = "Invalid instructor ID" });
            }

            var category = await _context.Categories.FindAsync(updateDto.CategoryId);
            if (category == null)
            {
                return BadRequest(new { message = "Invalid category ID" });
            }

            string? newImageUrl = course.ImageUrl;

            // Handle image upload
            if (updateDto.Image != null)
            {
                if (!_fileService.IsValidImage(updateDto.Image))
                {
                    return BadRequest(new { message = "Invalid image file. Please upload a JPG, JPEG, PNG, or GIF file under 5MB." });
                }

                // Delete old image
                _fileService.DeleteImage(course.ImageUrl);

                // Save new image
                newImageUrl = await _fileService.SaveImageAsync(updateDto.Image, "courses");
            }

            // Update course properties
            course.Name = updateDto.Name;
            course.Description = updateDto.Description;
            course.CategoryId = updateDto.CategoryId;
            course.InstructorId = updateDto.InstructorId;
            course.ImageUrl = newImageUrl;
            course.Level = updateDto.Level;
            course.TotalHours = updateDto.TotalHours;
            course.Rate = updateDto.Rate;
            course.Price = updateDto.Price;
            course.HasCertification = updateDto.HasCertification;
            course.UpdatedAt = DateTime.UtcNow;

            // Update topics
            _context.CourseTopics.RemoveRange(course.Topics);

            if (updateDto.Topics.Any())
            {
                var topics = updateDto.Topics.Select(t => new CourseTopic
                {
                    CourseId = course.CourseId,
                    TopicName = t.TopicName,
                    LectureCount = t.LectureCount,
                    DurationMinutes = t.DurationMinutes,
                    Order = t.Order
                }).ToList();

                _context.CourseTopics.AddRange(topics);
            }

            await _context.SaveChangesAsync();

            // Return the updated course
            return await GetCourse(course.CourseId);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while updating the course", error = ex.Message });
        }
    }

    /// <summary>
    /// Delete a course (Admin only)
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteCourse(int id)
    {
        try
        {
            var course = await _context.Courses
                .Include(c => c.Purchases)
                .FirstOrDefaultAsync(c => c.CourseId == id);

            if (course == null)
            {
                return NotFound(new { message = "Course not found" });
            }

            // Check if course has been purchased
            if (course.Purchases.Any())
            {
                return BadRequest(new { message = "Cannot delete course. This course has been purchased by users." });
            }

            // Delete image file
            _fileService.DeleteImage(course.ImageUrl);

            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Course deleted successfully" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while deleting the course", error = ex.Message });
        }
    }
}
