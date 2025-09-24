using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LMS.API.Data;
using LMS.API.DTOs;
using LMS.API.Models;
using LMS.API.Services;

namespace LMS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly LMSDbContext _context;
    private readonly IJwtService _jwtService;

    public UserController(LMSDbContext context, IJwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    /// <summary>
    /// User registration endpoint
    /// </summary>
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register([FromBody] UserRegisterDto registerDto)
    {
        try
        {
            // Check if username already exists
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == registerDto.Username || u.Email == registerDto.Email);

            if (existingUser != null)
            {
                if (existingUser.Username == registerDto.Username)
                {
                    return BadRequest(new { message = "Username is already taken" });
                }
                if (existingUser.Email == registerDto.Email)
                {
                    return BadRequest(new { message = "Email is already registered" });
                }
            }

            // Create new user
            var user = new User
            {
                FullName = registerDto.FullName,
                Username = registerDto.Username,
                Email = registerDto.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var token = _jwtService.GenerateUserToken(user.UserId, user.Username, user.Email);

            return Ok(new AuthResponseDto
            {
                Token = token,
                UserType = "User",
                Name = user.FullName,
                Email = user.Email
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred during registration", error = ex.Message });
        }
    }

    /// <summary>
    /// User login endpoint
    /// </summary>
    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login([FromBody] UserLoginDto loginDto)
    {
        try
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == loginDto.UsernameOrEmail || u.Email == loginDto.UsernameOrEmail);

            if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.Password))
            {
                return Unauthorized(new { message = "Invalid username/email or password" });
            }

            var token = _jwtService.GenerateUserToken(user.UserId, user.Username, user.Email);

            return Ok(new AuthResponseDto
            {
                Token = token,
                UserType = "User",
                Name = user.FullName,
                Email = user.Email
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred during login", error = ex.Message });
        }
    }
}
