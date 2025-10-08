# LMS API - Learning Management System Backend

A RESTful API built with ASP.NET Core 9.0 for managing an online Learning Management System (LMS). This API provides endpoints for user authentication, course management, instructor management, shopping cart functionality, and purchase processing.

## 🚀 Live Demo

**Production API:** [http://minasafwat-001-site1.stempurl.com/](http://minasafwat-001-site1.stempurl.com/)

**Swagger Documentation:** [http://minasafwat-001-site1.stempurl.com/swagger](http://minasafwat-001-site1.stempurl.com/swagger)

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Authentication](#authentication)
- [Seed Data](#seed-data)
- [Deployment](#deployment)

## ✨ Features

- **User Management**
  - User registration and authentication
  - JWT-based authorization
  - Role-based access control (Admin/User)

- **Course Management**
  - CRUD operations for courses
  - Course categorization
  - Course topics and curriculum
  - Course ratings and pricing
  - Image upload support

- **Instructor Management**
  - Instructor profiles
  - Job titles and ratings
  - Instructor-course associations

- **Category Management**
  - Course category organization
  - Category-based course filtering

- **Shopping Cart**
  - Add/remove courses to cart
  - User-specific cart management
  - Real-time cart updates

- **Purchase System**
  - Course purchase processing
  - Purchase history tracking
  - Tax and discount calculations

- **Admin Dashboard**
  - Dashboard statistics
  - Total instructors, categories, courses
  - Monthly purchase reports
  - Category distribution analytics

## 🛠 Technology Stack

- **Framework:** ASP.NET Core 9.0
- **Database:** SQL Server
- **ORM:** Entity Framework Core 9.0
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** BCrypt.Net
- **API Documentation:** Swagger/OpenAPI
- **CORS:** Configured for frontend integration

## 📦 Prerequisites

- [.NET 9.0 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) (or SQL Server Express/LocalDB)
- [Visual Studio 2022](https://visualstudio.microsoft.com/) or [VS Code](https://code.visualstudio.com/)

## 🔧 Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd backend/LMS.API/LMS.API
   ```

2. **Restore dependencies:**
   ```bash
   dotnet restore
   ```

3. **Install EF Core tools (if not already installed):**
   ```bash
   dotnet tool install --global dotnet-ef
   ```

## ⚙️ Configuration

### 1. Update Connection String

Edit `appsettings.json` and `appsettings.Development.json` with your database connection string:

**For Production (`appsettings.json`):**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=YOUR_SERVER;Initial Catalog=YOUR_DATABASE;User Id=YOUR_USER;Password=YOUR_PASSWORD"
  },
  "Jwt": {
    "SecretKey": "YourSuperSecretKeyForJWTTokenGeneration123456789",
    "Issuer": "LMS.API",
    "Audience": "LMS.Client"
  }
}
```

**For Development (`appsettings.Development.json`):**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=LMSDB_Dev;Trusted_Connection=true;MultipleActiveResultSets=true;TrustServerCertificate=true"
  }
}
```

### 2. Configure CORS (Optional)

Update allowed origins in `Program.cs`:
```csharp
options.AddPolicy("AllowFrontend", policy =>
{
    policy.WithOrigins("http://localhost:3000", "http://localhost:3001", "https://your-production-domain.com")
          .AllowAnyHeader()
          .AllowAnyMethod()
          .AllowCredentials();
});
```

### 3. Configure JWT Settings

Update JWT secret key in `appsettings.json` (use a strong, unique key for production):
```json
{
  "Jwt": {
    "SecretKey": "Generate-A-Secure-Random-Key-At-Least-32-Characters-Long",
    "Issuer": "LMS.API",
    "Audience": "LMS.Client"
  }
}
```

## 🗄️ Database Setup

### 1. Apply Migrations

```bash
dotnet ef database update
```

This command will:
- Create the database if it doesn't exist
- Apply all migrations
- Seed initial data (Admin, Categories, Instructors)

### 2. Verify Database

Check that these tables were created:
- Admins
- Users
- Categories
- Instructors
- Courses
- CourseTopics
- CartItems
- Purchases

### 3. Create New Migration (when model changes)

```bash
dotnet ef migrations add MigrationName
dotnet ef database update
```

## 🚀 Running the Application

### Development Mode

```bash
dotnet run
```

The API will be available at:
- **HTTP:** `http://localhost:5045`
- **Swagger UI:** `http://localhost:5045/swagger`

### Production Mode

```bash
dotnet run --configuration Release
```

### Using Visual Studio

1. Open `LMS.API.sln`
2. Press `F5` or click "Start Debugging"

## 📚 API Documentation

### Swagger UI

Access the interactive API documentation at:
- **Local:** `http://localhost:5045/swagger`
- **Production:** `http://minasafwat-001-site1.stempurl.com/swagger`

### Main Endpoints

#### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/User/register` | Register new user | No |
| POST | `/api/User/login` | User login | No |
| POST | `/api/Admin/login` | Admin login | No |

#### Categories

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/Category` | Get all categories | No |

#### Courses

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/Course` | Get all courses | No |
| GET | `/api/Course/{id}` | Get course by ID | No |
| POST | `/api/Course` | Create course | Admin |
| PUT | `/api/Course/{id}` | Update course | Admin |
| DELETE | `/api/Course/{id}` | Delete course | Admin |

#### Instructors

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/Instructor` | Get all instructors | Admin |
| GET | `/api/Instructor/{id}` | Get instructor by ID | Admin |
| POST | `/api/Instructor` | Create instructor | Admin |
| PUT | `/api/Instructor/{id}` | Update instructor | Admin |
| DELETE | `/api/Instructor/{id}` | Delete instructor | Admin |

#### Cart

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/Cart` | Get user's cart | User |
| POST | `/api/Cart` | Add course to cart | User |
| DELETE | `/api/Cart/{courseId}` | Remove from cart | User |

#### Purchase

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/Purchase` | Process purchase | User |
| GET | `/api/Purchase/history` | Get purchase history | User |

#### Admin Dashboard

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/Admin/dashboard-stats` | Get dashboard statistics | Admin |

## 📁 Project Structure

```
LMS.API/
├── Controllers/
│   ├── AdminController.cs       # Admin authentication & dashboard
│   ├── UserController.cs        # User authentication
│   ├── CategoryController.cs    # Category management
│   ├── CourseController.cs      # Course CRUD operations
│   ├── InstructorController.cs  # Instructor CRUD operations
│   ├── CartController.cs        # Shopping cart operations
│   └── PurchaseController.cs    # Purchase processing
├── Data/
│   └── LMSDbContext.cs          # Database context & seed data
├── DTOs/
│   ├── AuthDTOs.cs              # Authentication DTOs
│   ├── CommonDTOs.cs            # Shared DTOs
│   ├── CourseDTOs.cs            # Course-related DTOs
│   └── InstructorDTOs.cs        # Instructor DTOs
├── Models/
│   ├── Admin.cs                 # Admin entity
│   ├── User.cs                  # User entity
│   ├── Category.cs              # Category entity
│   ├── Course.cs                # Course entity
│   ├── CourseTopic.cs           # Course topic entity
│   ├── Instructor.cs            # Instructor entity
│   ├── CartItem.cs              # Cart item entity
│   ├── Purchase.cs              # Purchase entity
│   └── Enums.cs                 # Enumerations
├── Services/
│   ├── IJwtService.cs           # JWT service interface
│   ├── JwtService.cs            # JWT implementation
│   ├── IFileService.cs          # File service interface
│   └── FileService.cs           # File handling
├── Migrations/                  # EF Core migrations
├── wwwroot/                     # Static files
│   └── images/                  # Course & instructor images
├── Program.cs                   # Application entry point
├── appsettings.json             # Production configuration
└── appsettings.Development.json # Development configuration
```

## 🔐 Authentication

### JWT Authentication

The API uses JWT Bearer tokens for authentication. After login, include the token in requests:

```http
Authorization: Bearer <your-jwt-token>
```

### User Roles

- **Admin:** Full access to all endpoints
- **User:** Access to user-specific features (cart, purchases, courses)

### Example: Login & Use Token

1. **Login:**
```bash
POST /api/User/login
Content-Type: application/json

{
  "usernameOrEmail": "user@example.com",
  "password": "password123"
}
```

2. **Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "userType": "User",
  "name": "John Doe",
  "email": "user@example.com"
}
```

3. **Use Token:**
```bash
GET /api/Cart
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

## 🌱 Seed Data

The application automatically seeds initial data on first run:

### Admin Account
- **Email:** `admin@lms.com`
- **Password:** `Admin123!`

### Categories
- Full Stack
- Backend
- Frontend
- UI-UX Design

### Instructors
1. **John Smith** - Full Stack Developer (⭐5)
2. **Sarah Johnson** - Frontend Developer (⭐4)
3. **Michael Brown** - Backend Developer (⭐5)
4. **Emily Davis** - UI/UX Designer (⭐4)

## 🌐 Deployment

### Build for Production

```bash
dotnet publish -c Release -o ./publish
```

### Deployment Checklist

- [ ] Update connection string in `appsettings.json`
- [ ] Set strong JWT secret key
- [ ] Configure CORS allowed origins
- [ ] Apply database migrations
- [ ] Test all endpoints
- [ ] Enable HTTPS in production
- [ ] Set up logging and monitoring

### Environment Variables (Optional)

You can override settings using environment variables:

```bash
export ConnectionStrings__DefaultConnection="your-connection-string"
export Jwt__SecretKey="your-secret-key"
```

## 🧪 Testing

### Using Swagger UI

1. Navigate to `/swagger`
2. Click "Authorize" button
3. Enter token: `Bearer <your-jwt-token>`
4. Test endpoints interactively

### Using cURL

```bash
curl -X POST http://localhost:5045/api/User/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail":"admin@lms.com","password":"Admin123!"}'
```

### Using Postman

1. Import API from Swagger JSON: `http://localhost:5045/swagger/v1/swagger.json`
2. Set up environment variables for token management
3. Create test collections for each controller

## 🔧 Troubleshooting

### Database Connection Issues

**Error:** "Cannot connect to database"

**Solution:**
- Verify SQL Server is running
- Check connection string in `appsettings.json`
- Test connection using SQL Server Management Studio

### Migration Issues

**Error:** "Pending model changes"

**Solution:**
```bash
dotnet ef migrations add FixModelChanges
dotnet ef database update
```

### JWT Token Issues

**Error:** "Unauthorized 401"

**Solution:**
- Check token is included in `Authorization` header
- Verify token format: `Bearer <token>`
- Ensure token hasn't expired
- Check JWT secret key matches in configuration

## 📝 License

This project is licensed under the MIT License.

## 👥 Contributors

- **Mina Safwat** - Initial development

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Contact: [your-email@example.com]

## 🔄 Version History

### v1.0.0 (Current)
- Initial release
- User authentication
- Course management
- Cart and purchase functionality
- Admin dashboard
- Swagger documentation

---

**Built with ❤️ using ASP.NET Core 9.0**

