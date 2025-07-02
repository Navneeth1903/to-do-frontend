# Task Tracker Frontend

A modern React-based frontend application for the Task Tracker with a beautiful UI, real-time updates, and responsive design.

## 🚀 Features

- **Modern React 18** with TypeScript
- **Beautiful UI** with Tailwind CSS and Radix UI components
- **Real-time Updates** via WebSocket connection
- **Responsive Design** for mobile and desktop
- **Authentication System** with login/signup
- **Task Management** with CRUD operations
- **Dashboard Analytics** with charts and statistics
- **Task Sharing** and collaboration features
- **Calendar View** for task scheduling
- **Search and Filtering** capabilities
- **Dark/Light Theme** support
- **Form Validation** with React Hook Form and Zod

## 📋 Prerequisites

- Node.js 18+
- npm or yarn package manager
- Backend API running (see backend README)

## 🛠️ Installation

1. **Clone the repository and navigate to frontend:**
   ```bash
   cd TaskTracker/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables:**
   ```env
   VITE_API_BASE_URL=http://localhost:5000
   ```

## 🏃‍♂️ Running the Application

### Development Mode
```bash
npm run dev
```
The application will start on `http://localhost:3000`

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 🎨 UI Components

The application uses a comprehensive set of UI components built with:

- **Radix UI** - Accessible, unstyled components
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Framer Motion** - Smooth animations
- **Class Variance Authority** - Component variants

### Available Components

- **Button** - Multiple variants and sizes
- **Input** - Form inputs with validation
- **Card** - Content containers
- **Dialog** - Modal dialogs
- **Dropdown Menu** - Context menus
- **Calendar** - Date picker
- **Progress** - Progress indicators
- **Toast** - Notification system
- **Table** - Data tables
- **Charts** - Data visualization

## 📱 Pages & Features

### Authentication
- **Login Page** - User authentication
- **Signup Page** - User registration
- **OAuth Integration** - Social login (configured)

### Dashboard
- **Main Dashboard** - Task overview and statistics
- **Stats Cards** - Key metrics display
- **Recent Tasks** - Quick task access
- **Quick Actions** - Create, edit, delete tasks

### Task Management
- **Task List** - View all tasks with filtering
- **Task Creation** - Add new tasks
- **Task Editing** - Modify existing tasks
- **Task Details** - View task information
- **Task Sharing** - Share tasks with other users

### Views
- **All Tasks** - Complete task list
- **Personal Tasks** - User's own tasks
- **Work Tasks** - Work-related tasks
- **Shared Tasks** - Tasks shared with user
- **Team Projects** - Collaborative tasks
- **Calendar View** - Task scheduling

### Analytics
- **Statistics Review** - Detailed analytics
- **Progress Tracking** - Task completion rates
- **Performance Metrics** - User productivity data

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:5000` |

### API Configuration

The frontend communicates with the backend through a centralized API configuration:

- **API Base URL** - Configured via environment variable
- **Request Headers** - Automatic user ID injection
- **Error Handling** - Centralized error management
- **Response Caching** - React Query for data caching

### WebSocket Configuration

Real-time updates are handled via WebSocket connection:

- **Automatic Connection** - Connects when user is authenticated
- **Reconnection Logic** - Handles connection drops
- **Event Handling** - Task updates, sharing, deletion

## 🚀 Deployment

### Render Deployment

1. **Create a new Static Site** on Render
2. **Connect your GitHub repository**
3. **Configure settings:**
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
   - **Root Directory:** `frontend`

4. **Set Environment Variables:**
   ```
   VITE_API_BASE_URL=https://your-backend-url.onrender.com
   ```

5. **Deploy and note your frontend URL**

### Vercel Deployment

1. **Connect your GitHub repository** to Vercel
2. **Set build settings:**
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

3. **Set Environment Variables:**
   ```
   VITE_API_BASE_URL=https://your-backend-url.onrender.com
   ```

4. **Deploy**

### Netlify Deployment

1. **Connect your GitHub repository** to Netlify
2. **Set build settings:**
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`

3. **Set Environment Variables** in Netlify dashboard
4. **Deploy**

## 🎯 Key Features Implementation

### Authentication Flow
```typescript
// User login
const handleLogin = async (email: string, password: string) => {
  const response = await apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  
  localStorage.setItem('userId', response.user.id);
  localStorage.setItem('isLoggedIn', 'true');
};
```

### Task Management
```typescript
// Fetch tasks with React Query
const { data: tasks, isLoading } = useQuery({
  queryKey: ['/api/tasks'],
  queryFn: () => apiRequest('/api/tasks')
});
```

### Real-time Updates
```typescript
// WebSocket connection
const { isConnected } = useWebSocket();

// Listen for task updates
useEffect(() => {
  if (isConnected) {
    // Handle real-time updates
  }
}, [isConnected]);
```

## 🔍 Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Verify `VITE_API_BASE_URL` is set correctly
   - Check if backend is running and accessible
   - Ensure CORS is configured on backend

2. **Build Errors**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check for missing dependencies
   - Verify TypeScript types

3. **WebSocket Connection Issues**
   - Check if WebSocket URL is correct
   - Verify backend WebSocket endpoint is working
   - Check browser console for connection errors

4. **Authentication Issues**
   - Clear localStorage and try again
   - Check if backend authentication endpoints are working
   - Verify session configuration

### Development Tips

- **Hot Reload** - Changes are reflected immediately in development
- **TypeScript** - Full type safety for better development experience
- **ESLint** - Code quality and consistency
- **Prettier** - Code formatting

## 📊 Performance

- **Code Splitting** - Automatic route-based code splitting
- **Lazy Loading** - Components loaded on demand
- **Image Optimization** - Optimized image loading
- **Bundle Analysis** - Monitor bundle size with `npm run build`

## 🔐 Security

- **Environment Variables** - Sensitive data stored in environment variables
- **Input Validation** - Client-side validation with Zod
- **XSS Protection** - React's built-in XSS protection
- **CSRF Protection** - Backend handles CSRF protection

## 📱 Responsive Design

The application is fully responsive and works on:

- **Desktop** - Full feature set with sidebar navigation
- **Tablet** - Adapted layout with collapsible sidebar
- **Mobile** - Touch-optimized interface with bottom navigation

## 🎨 Theming

The application supports:

- **Light Theme** - Default theme
- **Dark Theme** - Dark mode support (configured)
- **Custom Colors** - Tailwind CSS custom color palette
- **Component Variants** - Multiple styling options

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. 


This project is a part of a hackathon run by https://www.katomaran.com
