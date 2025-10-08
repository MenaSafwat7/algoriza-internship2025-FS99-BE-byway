using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using LMS.API.Data;
using LMS.API.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddDbContext<LMSDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"),
        sqlOptions => sqlOptions.EnableRetryOnFailure(
            maxRetryCount: 10,
            maxRetryDelay: TimeSpan.FromSeconds(60),
            errorNumbersToAdd: null)
        .CommandTimeout(120)));

var jwtSettings = builder.Configuration.GetSection("Jwt");
var secretKey = jwtSettings["SecretKey"] ?? "DefaultSecretKeyForDevelopmentOnly123456789";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
            ValidateIssuer = true,
            ValidIssuer = jwtSettings["Issuer"] ?? "LMS.API",
            ValidateAudience = true,
            ValidAudience = jwtSettings["Audience"] ?? "LMS.Client",
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IFileService, FileService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                "http://localhost:3000", 
                "http://localhost:3001",
                "https://menasafwat7.github.io",
                "https://menasafwat7.github.io/algoriza-internship2025-FS99-FE-byway-user/",
                "https://menasafwat7.github.io/algoriza-internship2025-FS99-FE-byway-admin/",
                "https://menasafwat7.github.io/algoriza-internship2025-FS99-BE-byway/",
                "https://your-production-domain.com" 
              )
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddOpenApi();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<LMSDbContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    
    int retryCount = 0;
    int maxRetries = 5;
    
    while (retryCount < maxRetries)
    {
        try
        {
            logger.LogInformation($"Attempting database initialization (attempt {retryCount + 1}/{maxRetries})");
            
            // Test connection first
            try
            {
                var canConnect = context.Database.CanConnect();
                if (canConnect)
                {
                    logger.LogInformation("Database connection successful");
                    
                    // Use EnsureCreated instead of Migrate for shared hosting
                    logger.LogInformation("Creating database schema...");
                    context.Database.EnsureCreated();
                    logger.LogInformation("Database schema created successfully");
                    
                    // Seed admin data if not exists
                    if (!context.Admins.Any())
                    {
                        logger.LogInformation("Seeding admin data...");
                        context.Admins.Add(new LMS.API.Models.Admin
                        {
                            AdminId = 1,
                            Email = "admin@byway.com",
                            Password = "Admin@123",
                            Address = "123 Admin Street, Admin City"
                        });
                        context.SaveChanges();
                        logger.LogInformation("Admin data seeded successfully");
                    }
                    else
                    {
                        logger.LogInformation("Admin data already exists");
                    }
                    break; // Success, exit retry loop
                }
                else
                {
                    throw new Exception("Cannot connect to database - CanConnect returned false");
                }
            }
            catch (Exception dbEx)
            {
                logger.LogError(dbEx, $"Database connection failed: {dbEx.Message}");
                throw new Exception($"Database connection failed: {dbEx.Message}", dbEx);
            }
        }
        catch (Exception ex)
        {
            retryCount++;
            logger.LogWarning(ex, $"Database initialization attempt {retryCount} failed: {ex.Message}");
            logger.LogWarning($"Inner exception: {ex.InnerException?.Message}");
            logger.LogWarning($"Stack trace: {ex.StackTrace}");
            
            if (retryCount >= maxRetries)
            {
                logger.LogError(ex, $"Database initialization failed after {maxRetries} attempts. Application will continue but database operations may fail.");
                break;
            }
            
            // Wait before retrying
            Thread.Sleep(TimeSpan.FromSeconds(5 * retryCount));
        }
    }
}

app.MapOpenApi();
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "LMS API v1");
    c.RoutePrefix = "swagger";
});

app.UseStaticFiles();

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
