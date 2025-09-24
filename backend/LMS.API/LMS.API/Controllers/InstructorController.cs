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
[Authorize(Roles = "Admin")]
public class InstructorController : ControllerBase
{
    private readonly LMSDbContext _context;
    private readonly IFileService _fileService;

    public InstructorController(LMSDbContext context, IFileService fileService)
    {
        _context = context;
        _fileService = fileService;
    }

    /// <summary>
    /// Get instructors with pagination and search
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<PaginatedResult<InstructorDto>>> GetInstructors(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? search = null)
    {
        try
        {
            var query = _context.Instructors.AsQueryable();

            // Apply search filter
            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(i => i.Name.Contains(search) || 
                                        i.JobTitle.ToString().Contains(search));
            }

            var totalCount = await query.CountAsync();

            var instructors = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(i => new InstructorDto
                {
                    InstructorId = i.InstructorId,
                    Name = i.Name,
                    JobTitle = i.JobTitle,
                    JobTitleName = i.JobTitle.ToString(),
                    Rate = i.Rate,
                    Description = i.Description,
                    ImageUrl = i.ImageUrl,
                    CreatedAt = i.CreatedAt,
                    UpdatedAt = i.UpdatedAt,
                    CourseCount = i.Courses.Count
                })
                .ToListAsync();

            return Ok(new PaginatedResult<InstructorDto>
            {
                Items = instructors,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while fetching instructors", error = ex.Message });
        }
    }

    /// <summary>
    /// Get instructor by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<InstructorDto>> GetInstructor(int id)
    {
        try
        {
            var instructor = await _context.Instructors
                .Include(i => i.Courses)
                .FirstOrDefaultAsync(i => i.InstructorId == id);

            if (instructor == null)
            {
                return NotFound(new { message = "Instructor not found" });
            }

            var instructorDto = new InstructorDto
            {
                InstructorId = instructor.InstructorId,
                Name = instructor.Name,
                JobTitle = instructor.JobTitle,
                JobTitleName = instructor.JobTitle.ToString(),
                Rate = instructor.Rate,
                Description = instructor.Description,
                ImageUrl = instructor.ImageUrl,
                CreatedAt = instructor.CreatedAt,
                UpdatedAt = instructor.UpdatedAt,
                CourseCount = instructor.Courses.Count
            };

            return Ok(instructorDto);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while fetching the instructor", error = ex.Message });
        }
    }

    /// <summary>
    /// Create a new instructor
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<InstructorDto>> CreateInstructor([FromForm] CreateInstructorDto createDto)
    {
        try
        {
            string? imageUrl = null;

            // Handle image upload
            if (createDto.Image != null)
            {
                if (!_fileService.IsValidImage(createDto.Image))
                {
                    return BadRequest(new { message = "Invalid image file. Please upload a JPG, JPEG, PNG, or GIF file under 5MB." });
                }

                imageUrl = await _fileService.SaveImageAsync(createDto.Image, "instructors");
            }

            var instructor = new Instructor
            {
                Name = createDto.Name,
                JobTitle = createDto.JobTitle,
                Rate = createDto.Rate,
                Description = createDto.Description,
                ImageUrl = imageUrl,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Instructors.Add(instructor);
            await _context.SaveChangesAsync();

            var instructorDto = new InstructorDto
            {
                InstructorId = instructor.InstructorId,
                Name = instructor.Name,
                JobTitle = instructor.JobTitle,
                JobTitleName = instructor.JobTitle.ToString(),
                Rate = instructor.Rate,
                Description = instructor.Description,
                ImageUrl = instructor.ImageUrl,
                CreatedAt = instructor.CreatedAt,
                UpdatedAt = instructor.UpdatedAt,
                CourseCount = 0
            };

            return CreatedAtAction(nameof(GetInstructor), new { id = instructor.InstructorId }, instructorDto);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while creating the instructor", error = ex.Message });
        }
    }

    /// <summary>
    /// Update an instructor
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<InstructorDto>> UpdateInstructor(int id, [FromForm] UpdateInstructorDto updateDto)
    {
        try
        {
            var instructor = await _context.Instructors.FindAsync(id);
            if (instructor == null)
            {
                return NotFound(new { message = "Instructor not found" });
            }

            string? newImageUrl = instructor.ImageUrl;

            // Handle image upload
            if (updateDto.Image != null)
            {
                if (!_fileService.IsValidImage(updateDto.Image))
                {
                    return BadRequest(new { message = "Invalid image file. Please upload a JPG, JPEG, PNG, or GIF file under 5MB." });
                }

                // Delete old image
                _fileService.DeleteImage(instructor.ImageUrl);

                // Save new image
                newImageUrl = await _fileService.SaveImageAsync(updateDto.Image, "instructors");
            }

            // Update instructor properties
            instructor.Name = updateDto.Name;
            instructor.JobTitle = updateDto.JobTitle;
            instructor.Rate = updateDto.Rate;
            instructor.Description = updateDto.Description;
            instructor.ImageUrl = newImageUrl;
            instructor.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            var instructorDto = new InstructorDto
            {
                InstructorId = instructor.InstructorId,
                Name = instructor.Name,
                JobTitle = instructor.JobTitle,
                JobTitleName = instructor.JobTitle.ToString(),
                Rate = instructor.Rate,
                Description = instructor.Description,
                ImageUrl = instructor.ImageUrl,
                CreatedAt = instructor.CreatedAt,
                UpdatedAt = instructor.UpdatedAt,
                CourseCount = await _context.Courses.CountAsync(c => c.InstructorId == id)
            };

            return Ok(instructorDto);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while updating the instructor", error = ex.Message });
        }
    }

    /// <summary>
    /// Delete an instructor
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteInstructor(int id)
    {
        try
        {
            var instructor = await _context.Instructors
                .Include(i => i.Courses)
                .FirstOrDefaultAsync(i => i.InstructorId == id);

            if (instructor == null)
            {
                return NotFound(new { message = "Instructor not found" });
            }

            // Check if instructor has courses
            if (instructor.Courses.Any())
            {
                return BadRequest(new { message = "Cannot delete instructor. This instructor is assigned to one or more courses." });
            }

            // Delete image file
            _fileService.DeleteImage(instructor.ImageUrl);

            _context.Instructors.Remove(instructor);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Instructor deleted successfully" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while deleting the instructor", error = ex.Message });
        }
    }
}
