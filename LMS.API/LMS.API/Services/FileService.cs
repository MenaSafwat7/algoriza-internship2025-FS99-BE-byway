namespace LMS.API.Services;

public class FileService : IFileService
{
    private readonly IWebHostEnvironment _environment;
    private readonly string[] _allowedExtensions = { ".jpg", ".jpeg", ".png", ".gif" };
    private const long MaxFileSize = 5 * 1024 * 1024;

    public FileService(IWebHostEnvironment environment)
    {
        _environment = environment;
    }

    public async Task<string> SaveImageAsync(IFormFile image, string folder)
    {
        Console.WriteLine($"FileService.SaveImageAsync called for folder: {folder}");
        Console.WriteLine($"WebRootPath: {_environment.WebRootPath}");
        
        if (!IsValidImage(image))
            throw new ArgumentException("Invalid image file");

        var uploadsPath = Path.Combine(_environment.WebRootPath, "images", folder);
        Console.WriteLine($"Uploads path: {uploadsPath}");

        if (!Directory.Exists(uploadsPath))
        {
            Console.WriteLine($"Creating directory: {uploadsPath}");
            Directory.CreateDirectory(uploadsPath);
        }

        var fileName = $"{Guid.NewGuid()}{Path.GetExtension(image.FileName).ToLower()}";
        var filePath = Path.Combine(uploadsPath, fileName);
        Console.WriteLine($"File path: {filePath}");

        try
        {
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await image.CopyToAsync(stream);
            }
            Console.WriteLine($"File saved successfully: {filePath}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error saving file: {ex.Message}");
            Console.WriteLine($"Stack trace: {ex.StackTrace}");
            throw;
        }

        var returnUrl = $"/images/{folder}/{fileName}";
        Console.WriteLine($"Returning URL: {returnUrl}");
        return returnUrl;
    }

    public bool DeleteImage(string? imageUrl)
    {
        if (string.IsNullOrEmpty(imageUrl))
            return true;

        try
        {
            var filePath = Path.Combine(_environment.WebRootPath, imageUrl.TrimStart('/'));
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
                return true;
            }
        }
        catch
        {

        }

        return false;
    }

    public bool IsValidImage(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return false;

        if (file.Length > MaxFileSize)
            return false;

        var extension = Path.GetExtension(file.FileName).ToLower();
        return _allowedExtensions.Contains(extension);
    }
}
