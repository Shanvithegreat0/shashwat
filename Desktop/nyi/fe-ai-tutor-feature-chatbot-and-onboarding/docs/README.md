# AI Tutor Frontend Documentation

## Project Overview

The AI Tutor Frontend is a modern React application designed to provide an interactive and personalized learning experience. The application serves as the user interface for the AI Tutor platform, allowing users to access various learning resources, assessments, and quizzes.

## Tech Stack

- **Framework**: React (with Vite as build tool)
- **State Management**: Redux (with Redux Toolkit)
- **Routing**: React Router v6
- **UI Library**: Material-UI (MUI)
- **API Communication**: RTK Query
- **Authentication**: JWT-based with Google OAuth integration
- **Styling**: MUI Theme with custom styling
- **Build Tool**: Vite

## Project Structure

```
fe-ai-tutor/
├── public/            # Static assets and HTML template
├── src/               # Source code
│   ├── assets/        # Images, fonts, and other static resources
│   ├── components/    # Reusable UI components
│   ├── layouts/       # Layout components (AuthLayout, MainLayout, etc.)
│   ├── pages/         # Page components organized by features
│   ├── routes/        # Routing configuration and guards
│   ├── store/         # Redux store setup and slices
│   │   └── slices/    # Redux slices for different features
│   ├── theme/         # Theme configuration and context
│   ├── utils/         # Utility functions
│   ├── App.jsx        # Main application component
│   └── main.jsx       # Entry point
├── .env               # Environment variables (git-ignored)
├── package.json       # Project dependencies and scripts
└── vite.config.js     # Vite configuration
```

## Core Components

### Application Entry

The application starts with `main.jsx`, which sets up:

1. Redux store provider
2. Theme provider
3. Toast notifications
4. Core application rendering

### App Component

`App.jsx` is the main component that:
- Initializes the Google OAuth provider
- Checks for user authentication status on app load
- Handles refresh token mechanism
- Renders the appropriate router

### Routing System

The routing system (`routes/index.jsx`) implements a comprehensive navigation structure with:

1. **Public Routes**:
   - Landing pages (Home, Features, Pricing, About, Contact)
   - Authentication pages (Login, Register, Forgot Password, Reset Password)

2. **Private Routes** (requiring authentication):
   - User verification flow
   - Invite code verification
   - Onboarding process
   - Main application pages (Dashboard, Exams, Profile, etc.)

3. **Route Guards**:
   - `PublicRoutes`: Prevents authenticated users from accessing public pages
   - `PrivateRoutes`: Prevents unauthenticated users from accessing private pages
   - `VerifiedRoutes`: Ensures the user has verified their account
   - `NotVerifiedRoutes`: Routes specific to unverified users
   - `ActivatedRoutes`: Ensures the user has used an invite code
   - `NotActivatedRoutes`: Routes specific to users who haven't used an invite code
   - `OnboardingGuard`: Ensures the user has completed onboarding

### Layouts

The application uses different layouts for different sections:

1. **PublicLayout**: Used for landing pages with marketing content
2. **AuthLayout**: Used for authentication-related pages
3. **MainLayout**: Used for the main application after authentication

### State Management

Redux is used for state management with the following slices:

1. **auth.js**: Manages authentication state, user details, and login/logout actions
2. **toasts.js**: Manages toast notifications across the application
3. **apiServices.js**: RTK Query services for API communication

## Key Features

### Authentication Flow

1. **Login/Registration**:
   - Email/password authentication
   - Google OAuth integration
   - Registration with email verification

2. **Account Verification**:
   - Email verification process
   - OTP verification

3. **Password Management**:
   - Forgot password flow
   - Reset password functionality

### User Onboarding

The application includes a guided onboarding process for new users:
1. Welcome screen
2. User preferences setup
3. Guided tour of key features

### Exam and Assessment System

1. **Exam Listing**: Browse available exams
2. **Exam Details**: View detailed information about each exam
3. **Quiz System**: Take quizzes with various configurations
   - Module-based quizzes
   - Subject-based quizzes
   - Topic-based quizzes
4. **Results and Analysis**: Review quiz results and performance analysis

### User Dashboard

Personalized dashboard showing:
- Progress tracking
- Recent activities
- Recommended learning paths
- Performance statistics

## API Integration

The application communicates with the backend API using RTK Query:

1. **Authentication Endpoints**:
   - Login
   - Register
   - Verify user
   - Reset password

2. **User Endpoints**:
   - Get user details
   - Update profile
   - Track progress

3. **Exam Endpoints**:
   - List exams
   - Get exam details
   - Submit quiz answers
   - Get quiz results

## Theme and Styling

The application uses Material-UI with a custom theme:

1. **Theme Context**: `ThemeContextProvider` for managing theme state
2. **Color Scheme**: Primary color (#0099ff) with customizable palette
3. **Typography**: Custom typography settings
4. **Responsive Design**: Mobile-first approach with responsive layouts

## Navigation

The application includes multiple navigation components:

1. **Header**: Main navigation bar with user menu
2. **Bottom Navigation**: Mobile-friendly navigation bar
3. **Breadcrumbs**: Context-aware breadcrumb navigation

## Authentication Mechanism

1. **Token Storage**: JWT tokens stored in localStorage
   - Access token (`at`)
   - Refresh token (for token renewal)

2. **Session Management**:
   - Automatic token refresh
   - Session persistence
   - Secure logout

3. **Protected Routes**: Route guards to prevent unauthorized access

## Error Handling

1. **Toast Notifications**: User-friendly error messages
2. **Form Validation**: Client-side validation with helpful error messages
3. **API Error Handling**: Consistent error handling for API requests

## Development Workflow

### Setup Instructions

1. **Clone the repository**:
   ```
   git clone [repository-url]
   cd fe-ai-tutor
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file with the following variables:
   ```
   VITE_API_URL=http://localhost:3000/api
   VITE_GOOGLE_CLIENT_ID=your-google-client-id
   ```

4. **Start development server**:
   ```
   npm run dev
   ```

### Build Process

1. **Create production build**:
   ```
   npm run build
   ```

2. **Preview production build**:
   ```
   npm run preview
   ```

## Performance Considerations

1. **Code Splitting**: Routes are lazy-loaded for better performance
2. **Optimization**: Efficient re-rendering with proper React patterns
3. **Asset Optimization**: Optimized images and assets
4. **Caching**: API response caching with RTK Query

## Best Practices

1. **Component Structure**:
   - Functional components with hooks
   - Proper prop validation
   - Consistent naming conventions

2. **State Management**:
   - Redux for global state
   - Local state with useState/useReducer
   - Context API for theme and other shared states

3. **Code Organization**:
   - Feature-based folder structure
   - Reusable components
   - Utility functions for common operations

4. **Security**:
   - Protected routes
   - Input validation
   - Secure token handling

## Common Issues and Troubleshooting

1. **Authentication Issues**:
   - Clear localStorage and reload the page
   - Check for expired tokens
   - Verify API endpoint configuration

2. **Rendering Problems**:
   - Check for React key warnings
   - Verify component dependencies in useEffect
   - Inspect component re-rendering patterns

3. **API Connection Issues**:
   - Verify API URL in environment variables
   - Check network tab for request/response details
   - Confirm CORS configuration

## Extending the Application

### Adding New Pages

1. Create a new component in the appropriate folder under `pages/`
2. Add the route in `routes/index.jsx`
3. Update navigation components if necessary

### Adding New Features

1. Create necessary components, hooks, and utilities
2. Add Redux slice if needed for state management
3. Integrate with existing components and routes
4. Update documentation


## Contributing Guidelines

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request 