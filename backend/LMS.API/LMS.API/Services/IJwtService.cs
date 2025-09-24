namespace LMS.API.Services;

public interface IJwtService
{
    string GenerateAdminToken(int adminId, string email);
    string GenerateUserToken(int userId, string username, string email);
    int? GetUserIdFromToken(string token);
    string? GetUserTypeFromToken(string token);
}
