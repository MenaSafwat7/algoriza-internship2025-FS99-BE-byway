namespace LMS.API.Services;

public interface IFileService
{
    Task<string> SaveImageAsync(IFormFile image, string folder);
    bool DeleteImage(string? imageUrl);
    bool IsValidImage(IFormFile file);
}
