using Microsoft.EntityFrameworkCore;
using LMS.API.Models;

namespace LMS.API.Data;

public class LMSDbContext : DbContext
{
    public LMSDbContext(DbContextOptions<LMSDbContext> options) : base(options)
    {
    }

    public DbSet<Admin> Admins { get; set; }
    public DbSet<Instructor> Instructors { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Course> Courses { get; set; }
    public DbSet<CourseTopic> CourseTopics { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<CartItem> CartItems { get; set; }
    public DbSet<Purchase> Purchases { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        base.OnConfiguring(optionsBuilder);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Admin>()
            .HasIndex(a => a.Email)
            .IsUnique();

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Username)
            .IsUnique();

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<Course>()
            .HasOne(c => c.Category)
            .WithMany(cat => cat.Courses)
            .HasForeignKey(c => c.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Course>()
            .HasOne(c => c.Instructor)
            .WithMany(i => i.Courses)
            .HasForeignKey(c => c.InstructorId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<CourseTopic>()
            .HasOne(ct => ct.Course)
            .WithMany(c => c.Topics)
            .HasForeignKey(ct => ct.CourseId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<CartItem>()
            .HasOne(ci => ci.User)
            .WithMany(u => u.CartItems)
            .HasForeignKey(ci => ci.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<CartItem>()
            .HasOne(ci => ci.Course)
            .WithMany(c => c.CartItems)
            .HasForeignKey(ci => ci.CourseId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Purchase>()
            .HasOne(p => p.User)
            .WithMany(u => u.Purchases)
            .HasForeignKey(p => p.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Purchase>()
            .HasOne(p => p.Course)
            .WithMany(c => c.Purchases)
            .HasForeignKey(p => p.CourseId)
            .OnDelete(DeleteBehavior.Restrict);

        SeedData(modelBuilder);
    }

    private void SeedData(ModelBuilder modelBuilder)
    {

        modelBuilder.Entity<Admin>().HasData(
            new Admin
            {
                AdminId = 1,
                Email = "admin@lms.com",
                Password = "$2a$11$U8147i2JYN.raf8LpGLmZOQUDrWWTfo84dwleldmRvw8OrUmVihKS",
                Address = "123 Admin Street, Admin City"
            }
        );

        modelBuilder.Entity<Category>().HasData(
            new Category { CategoryId = 1, Name = "Full Stack" },
            new Category { CategoryId = 2, Name = "Backend" },
            new Category { CategoryId = 3, Name = "Frontend" },
            new Category { CategoryId = 4, Name = "UI-UX Design" }
        );

        var seedDate = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc);
        
        modelBuilder.Entity<Instructor>().HasData(
            new Instructor
            {
                InstructorId = 1,
                Name = "John Smith",
                JobTitle = JobTitle.FullStackDeveloper,
                Rate = 5,
                Description = "Experienced full-stack developer with 8+ years in web development.",
                ImageUrl = "/images/instructors/john-smith.jpg",
                CreatedAt = seedDate,
                UpdatedAt = seedDate
            },
            new Instructor
            {
                InstructorId = 2,
                Name = "Sarah Johnson",
                JobTitle = JobTitle.FrontendDeveloper,
                Rate = 4,
                Description = "Frontend specialist focusing on React and modern JavaScript frameworks.",
                ImageUrl = "/images/instructors/sarah-johnson.jpg",
                CreatedAt = seedDate,
                UpdatedAt = seedDate
            },
            new Instructor
            {
                InstructorId = 3,
                Name = "Michael Brown",
                JobTitle = JobTitle.BackendDeveloper,
                Rate = 5,
                Description = "Backend expert specializing in .NET Core and cloud architectures.",
                ImageUrl = "/images/instructors/michael-brown.jpg",
                CreatedAt = seedDate,
                UpdatedAt = seedDate
            },
            new Instructor
            {
                InstructorId = 4,
                Name = "Emily Davis",
                JobTitle = JobTitle.UIUXDesigner,
                Rate = 4,
                Description = "Creative UI/UX designer with expertise in user-centered design principles.",
                ImageUrl = "/images/instructors/emily-davis.jpg",
                CreatedAt = seedDate,
                UpdatedAt = seedDate
            }
        );
    }
}
