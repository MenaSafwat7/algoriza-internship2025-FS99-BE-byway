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
        [FromQuery] string sortBy = "latest")
    {
        try
        {
            var query = _context.Courses
                .Include(c => c.Category)
                .Include(c => c.Instructor)
                .Include(c => c.Topics)
                .AsQueryable();

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

            query = sortBy.ToLower() switch
            {
                "oldest" => query.OrderBy(c => c.CreatedAt),
                "pricehigh" => query.OrderByDescending(c => c.Price),
                "pricelow" => query.OrderBy(c => c.Price),
                "rating" => query.OrderByDescending(c => c.Rate),
                _ => query.OrderByDescending(c => c.CreatedAt)
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
                    Certification = c.Certification,
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
                Certification = course.Certification,
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
                    Certification = c.Certification,
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

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<CourseDto>> CreateCourse([FromForm] CreateCourseDto createDto)
    {
        try
        {

            Console.WriteLine($"CreateCourse called with:");
            Console.WriteLine($"Name: {createDto.Name}");
            Console.WriteLine($"CategoryId: {createDto.CategoryId}");
            Console.WriteLine($"InstructorId: {createDto.InstructorId}");
            Console.WriteLine($"Level: {createDto.Level}");
            Console.WriteLine($"TotalHours: {createDto.TotalHours}");
            Console.WriteLine($"Rate: {createDto.Rate}");
            Console.WriteLine($"Price: {createDto.Price}");
            Console.WriteLine($"HasCertification: {createDto.HasCertification}");
            Console.WriteLine($"Certification: {createDto.Certification}");
            Console.WriteLine($"TopicsJson: {createDto.TopicsJson}");
            Console.WriteLine($"TopicsJson length: {createDto.TopicsJson?.Length ?? 0}");

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

            Console.WriteLine($"Image file received: {createDto.Image != null}");
            if (createDto.Image != null)
            {
                Console.WriteLine($"Image file name: {createDto.Image.FileName}");
                Console.WriteLine($"Image file size: {createDto.Image.Length} bytes");
                Console.WriteLine($"Image content type: {createDto.Image.ContentType}");
                
                if (!_fileService.IsValidImage(createDto.Image))
                {
                    Console.WriteLine("Image validation failed");
                    return BadRequest(new { message = "Invalid image file. Please upload a JPG, JPEG, PNG, or GIF file under 5MB." });
                }

                Console.WriteLine("Image validation passed, attempting to save...");
                try
                {
                    imageUrl = await _fileService.SaveImageAsync(createDto.Image, "courses");
                    Console.WriteLine($"Image saved successfully: {imageUrl}");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error saving image: {ex.Message}");
                    Console.WriteLine($"Stack trace: {ex.StackTrace}");
                    return BadRequest(new { message = "Failed to save image file", error = ex.Message });
                }
            }
            else
            {
                Console.WriteLine("No image file provided");
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
                Certification = createDto.Certification,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Courses.Add(course);
            await _context.SaveChangesAsync();

            List<CreateCourseTopicDto> topics = new();

            Console.WriteLine($"TopicsJson: {createDto.TopicsJson}");
            Console.WriteLine($"Topics count: {createDto.Topics.Count}");

            if (!string.IsNullOrEmpty(createDto.TopicsJson))
            {
                try
                {
                    var options = new System.Text.Json.JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    };
                    topics = System.Text.Json.JsonSerializer.Deserialize<List<CreateCourseTopicDto>>(createDto.TopicsJson, options) ?? new();
                    Console.WriteLine($"Deserialized topics count: {topics.Count}");
                    foreach (var topic in topics)
                    {
                        Console.WriteLine($"Topic: {topic.TopicName}, Lectures: {topic.LectureCount}, Duration: {topic.DurationMinutes}");
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Topics deserialization error: {ex.Message}");
                    return BadRequest(new { message = "Invalid topics JSON format", error = ex.Message });
                }
            }
            else if (createDto.Topics.Any())
            {
                topics = createDto.Topics.ToList();
                Console.WriteLine($"Using direct topics, count: {topics.Count}");
            }

            if (topics.Any())
            {
                var courseTopics = topics.Select(t => new CourseTopic
                {
                    CourseId = course.CourseId,
                    TopicName = t.TopicName,
                    LectureCount = t.LectureCount,
                    DurationMinutes = t.DurationMinutes,
                    Order = t.Order
                }).ToList();

                _context.CourseTopics.AddRange(courseTopics);
                await _context.SaveChangesAsync();
            }

            return await GetCourse(course.CourseId);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error in CreateCourse: {ex.Message}");
            Console.WriteLine($"Stack trace: {ex.StackTrace}");
            return StatusCode(500, new { message = "An error occurred while creating the course", error = ex.Message });
        }
    }

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

            Console.WriteLine($"UpdateCourse - Image file received: {updateDto.Image != null}");
            if (updateDto.Image != null)
            {
                Console.WriteLine($"UpdateCourse - Image file name: {updateDto.Image.FileName}");
                Console.WriteLine($"UpdateCourse - Image file size: {updateDto.Image.Length} bytes");
                Console.WriteLine($"UpdateCourse - Image content type: {updateDto.Image.ContentType}");
                
                if (!_fileService.IsValidImage(updateDto.Image))
                {
                    Console.WriteLine("UpdateCourse - Image validation failed");
                    return BadRequest(new { message = "Invalid image file. Please upload a JPG, JPEG, PNG, or GIF file under 5MB." });
                }

                Console.WriteLine("UpdateCourse - Image validation passed, deleting old image...");
                _fileService.DeleteImage(course.ImageUrl);

                Console.WriteLine("UpdateCourse - Attempting to save new image...");
                try
                {
                    newImageUrl = await _fileService.SaveImageAsync(updateDto.Image, "courses");
                    Console.WriteLine($"UpdateCourse - New image saved successfully: {newImageUrl}");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"UpdateCourse - Error saving image: {ex.Message}");
                    Console.WriteLine($"UpdateCourse - Stack trace: {ex.StackTrace}");
                    return BadRequest(new { message = "Failed to save image file", error = ex.Message });
                }
            }
            else
            {
                Console.WriteLine("UpdateCourse - No image file provided, keeping existing image");
            }

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
            course.Certification = updateDto.Certification;
            course.UpdatedAt = DateTime.UtcNow;

            _context.CourseTopics.RemoveRange(course.Topics);

            List<CreateCourseTopicDto> topics = new();

            Console.WriteLine($"Update - TopicsJson: {updateDto.TopicsJson}");
            Console.WriteLine($"Update - Topics count: {updateDto.Topics.Count}");

            if (!string.IsNullOrEmpty(updateDto.TopicsJson))
            {
                try
                {
                    var options = new System.Text.Json.JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    };
                    topics = System.Text.Json.JsonSerializer.Deserialize<List<CreateCourseTopicDto>>(updateDto.TopicsJson, options) ?? new();
                    Console.WriteLine($"Update - Deserialized topics count: {topics.Count}");
                    foreach (var topic in topics)
                    {
                        Console.WriteLine($"Update - Topic: {topic.TopicName}, Lectures: {topic.LectureCount}, Duration: {topic.DurationMinutes}");
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Update - Topics deserialization error: {ex.Message}");
                    return BadRequest(new { message = "Invalid topics JSON format", error = ex.Message });
                }
            }
            else if (updateDto.Topics.Any())
            {
                topics = updateDto.Topics.ToList();
                Console.WriteLine($"Update - Using direct topics, count: {topics.Count}");
            }

            if (topics.Any())
            {
                var courseTopics = topics.Select(t => new CourseTopic
                {
                    CourseId = course.CourseId,
                    TopicName = t.TopicName,
                    LectureCount = t.LectureCount,
                    DurationMinutes = t.DurationMinutes,
                    Order = t.Order
                }).ToList();

                _context.CourseTopics.AddRange(courseTopics);
            }

            await _context.SaveChangesAsync();

            return await GetCourse(course.CourseId);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while updating the course", error = ex.Message });
        }
    }

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

            if (course.Purchases.Any())
            {
                return BadRequest(new { message = "Cannot delete course. This course has been purchased by users." });
            }

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
