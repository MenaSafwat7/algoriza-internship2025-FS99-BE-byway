# LMS Admin Dashboard

A modern React-based admin dashboard for managing the Learning Management System (LMS). Built with React 18, Vite, and Tailwind CSS.

## 🚀 Live Demo

**Production:** [https://menasafwat7.github.io/algoriza-internship2025-FS99-FE-byway-admin](https://menasafwat7.github.io/algoriza-internship2025-FS99-FE-byway-admin)

## ✨ Features

- **Dashboard Overview**
  - Total instructors, categories, and courses
  - Monthly purchase statistics
  - Category distribution charts
  - Real-time data visualization

- **Course Management**
  - Create, edit, and delete courses
  - Course categorization
  - Image upload support
  - Course topics and curriculum management

- **Instructor Management**
  - Add and manage instructors
  - Instructor profiles and ratings
  - Job title assignments

- **Authentication**
  - Secure admin login
  - JWT token-based authentication
  - Protected routes

## 🛠 Technology Stack

- **Frontend:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM
- **Forms:** React Hook Form
- **Charts:** Recharts
- **Icons:** Lucide React
- **UI Components:** Headless UI
- **HTTP Client:** Axios
- **Notifications:** React Hot Toast

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd frontend/admin-dashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:5045
VITE_APP_NAME=LMS Admin Dashboard
```

### API Configuration

The dashboard connects to the LMS API backend. Update the API base URL in:
- `src/services/api.js` - API service configuration
- `vite.config.js` - Proxy configuration for development

## 🚀 Deployment

### GitHub Pages (Automatic)

The project is configured for automatic deployment to GitHub Pages:

1. **Push to main branch** - Triggers automatic deployment
2. **GitHub Actions** - Builds and deploys the project
3. **Live URL** - Available at the configured GitHub Pages URL

### Manual Deployment

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy the `build` folder** to your hosting provider

## 📁 Project Structure

```
admin-dashboard/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Layout.js
│   │   ├── ProtectedRoute.js
│   │   └── ...
│   ├── pages/
│   │   ├── Login.js
│   │   ├── Dashboard.js
│   │   ├── Courses.js
│   │   └── Instructors.js
│   ├── contexts/
│   │   └── AuthContext.js
│   ├── services/
│   │   └── api.js
│   ├── hooks/
│   │   └── useSocialLogin.js
│   ├── App.js
│   └── index.js
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

## 🔐 Authentication

### Admin Login Credentials

- **Email:** `admin@lms.com`
- **Password:** `Admin123!`

### JWT Authentication

The dashboard uses JWT tokens for authentication:
- Tokens are stored in localStorage
- Automatic token refresh
- Protected route handling

## 🎨 UI/UX Features

- **Responsive Design** - Works on desktop, tablet, and mobile
- **Dark/Light Theme** - Toggle between themes
- **Modern UI** - Clean and intuitive interface
- **Loading States** - Smooth loading indicators
- **Error Handling** - User-friendly error messages
- **Toast Notifications** - Real-time feedback

## 📊 Charts and Analytics

- **Recharts Integration** - Interactive charts
- **Real-time Data** - Live statistics updates
- **Category Distribution** - Visual course categorization
- **Purchase Analytics** - Monthly revenue tracking

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting (if configured)
- **Component Structure** - Functional components with hooks

## 🚨 Troubleshooting

### Common Issues

1. **API Connection Issues**
   - Check backend server is running
   - Verify API base URL configuration
   - Check CORS settings

2. **Build Issues**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify all dependencies are installed

3. **Authentication Issues**
   - Clear localStorage and try again
   - Check JWT token expiration
   - Verify admin credentials

## 📝 License

This project is licensed under the MIT License.

## 👥 Contributors

- **Mina Safwat** - Initial development

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Contact: [your-email@example.com]

---

**Built with ❤️ using React 18 and Vite**
