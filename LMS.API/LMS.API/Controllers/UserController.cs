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

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register([FromBody] UserRegisterDto registerDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState
                    .Where(x => x.Value?.Errors.Count > 0)
                    .ToDictionary(
                        kvp => kvp.Key,
                        kvp => kvp.Value?.Errors.Select(e => e.ErrorMessage).ToArray() ?? Array.Empty<string>()
                    );
                return BadRequest(new { message = "Invalid data", errors });
            }

            var existingUsername = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == registerDto.Username);
            if (existingUsername != null)
            {
                return BadRequest(new { message = "Username is already taken" });
            }

            var existingEmail = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == registerDto.Email.ToLower());
            if (existingEmail != null)
            {
                return BadRequest(new { message = "Email is already registered" });
            }

            var passwordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);

            var user = new User
            {
                FullName = registerDto.FullName,
                Username = registerDto.Username,
                Email = registerDto.Email.ToLower(),
                Password = passwordHash,
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
            Console.WriteLine($"Registration error: {ex.Message}");
            Console.WriteLine($"Stack trace: {ex.StackTrace}");
            return StatusCode(500, new { message = "An error occurred during registration" });
        }
    }

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
