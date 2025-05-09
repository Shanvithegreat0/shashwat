# AI Tutor Frontend - Complete Documentation

## Table of Contents

1. [Introduction](#introduction)
2. [Project Overview](#project-overview)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Architecture](#architecture)
   - [Component Architecture](#component-architecture)
   - [State Management Architecture](#state-management-architecture)
   - [Data Flow](#data-flow)
6. [Core Components](#core-components)
   - [Application Entry](#application-entry)
   - [App Component](#app-component)
   - [Routing System](#routing-system)
   - [Layouts](#layouts)
7. [Key Features](#key-features)
   - [Authentication Flow](#authentication-flow)
   - [User Onboarding](#user-onboarding)
   - [Exam and Assessment System](#exam-and-assessment-system)
   - [Quiz System Implementation](#quiz-system-implementation)
8. [Technical Implementation](#technical-implementation)
   - [State Management](#state-management)
   - [Routing Implementation](#routing-implementation)
   - [Authentication System](#authentication-system)
   - [API Integration](#api-integration)
   - [Form Handling](#form-handling)
   - [Performance Optimizations](#performance-optimizations)
   - [Error Handling](#error-handling)
9. [Development Workflow](#development-workflow)
   - [Setup Instructions](#setup-instructions)
   - [Development Process](#development-process)
   - [Build Process](#build-process)
10. [Best Practices](#best-practices)
11. [Troubleshooting](#troubleshooting)
12. [Contributing Guidelines](#contributing-guidelines)

## Introduction

This comprehensive documentation aims to provide all the necessary information for developers to understand, work with, and extend the AI Tutor Frontend application. It combines high-level overviews with detailed technical specifications and practical guidance for development.

## Project Overview

The AI Tutor Frontend is a modern React application designed to provide an interactive and personalized learning experience. The application serves as the user interface for the AI Tutor platform, allowing users to access various learning resources, assessments, and quizzes.

The primary purpose of the application is to:
- Provide a user-friendly interface for educational content
- Deliver personalized learning experiences
- Facilitate assessments and quizzes
- Track and display user progress
- Offer detailed analysis of performance

## Tech Stack

The application is built with the following technologies:

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

## Architecture

### Component Architecture

The application follows a component-based architecture with the following key principles:

1. **Component Hierarchy**
   - Layouts: Define page structure
   - Pages: Represent complete views
   - Components: Reusable UI elements
   - Hooks: Encapsulate reusable logic

2. **Data Flow**
   - Redux store as the single source of truth
   - Unidirectional data flow (Redux → Components)
   - React Context for theming and certain UI states
   - Component-local state for UI-specific states

3. **Code Organization**
   - Feature-based organization
   - Clear separation of concerns
   - Consistent naming conventions

### State Management Architecture

```
                            +-------------------+
                            |                   |
                            |    Redux Store    |
                            |                   |
                            +-------------------+
                                     |
                  +------------------+-------------------+
                  |                  |                   |
                  v                  v                   v
        +------------------+ +----------------+ +------------------+
        |                  | |                | |                  |
        |   Auth Slice     | |   Toast Slice  | |   API Slice      |
        |                  | |                | |                  |
        +------------------+ +----------------+ +------------------+
                  |                  |                   |
                  v                  v                   v
        +------------------+ +----------------+ +------------------+
        | - isAuthenticated| | - notifications| | - API endpoints  |
        | - user data      | | - alerts       | | - data caching   |
        | - auth status    | |                | | - request state  |
        +------------------+ +----------------+ +------------------+
```

### Data Flow

```
+-------------+     +-------------+     +-------------+
|             |     |             |     |             |
| User Action |---->| Component   |---->| Dispatch    |
|             |     | Event       |     | Action      |
+-------------+     +-------------+     +-------------+
                                              |
                                              v
+-------------+     +-------------+     +-------------+
|             |     |             |     |             |
| Component   |<----| State       |<----| Reducer     |
| Re-render   |     | Update      |     | Function    |
|             |     |             |     |             |
+-------------+     +-------------+     +-------------+
```

## Core Components

### Application Entry

The application starts with `main.jsx`, which sets up:

1. Redux store provider
2. Theme provider
3. Toast notifications
4. Core application rendering

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './store/index.js'
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import ToastContainer from './components/Toasts/ToastComponent.jsx'

const theme = createTheme({
  typography: {
    button: {
      textTransform: 'none'
    }
  },
  palette: {
    primary: {
      main: '#0099ff'
    },
    background: {
      default: '#eef2f6'
    }
  }
})

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer />
      <App />
    </ThemeProvider>
  </Provider>
)
```

### App Component

`App.jsx` is the main component that:
- Initializes the Google OAuth provider
- Checks for user authentication status on app load
- Handles refresh token mechanism
- Renders the appropriate router

```jsx
import { Box, CircularProgress } from '@mui/material'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import routes from './routes'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { useLazyGetUserDetailsQuery, useGetRefreshTokenMutation } from './store/slices/apiServices'
import { loginSuccess } from './store/slices/auth'
import { ThemeContextProvider } from './theme/ThemeContext';

const App = () => {
  const gClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
  const dispatch = useDispatch()
  const [triggerGetUserDetails, { isLoading, isUninitialized }] = useLazyGetUserDetailsQuery();
  const [triggerGetRefreshToken] = useGetRefreshTokenMutation();

  // Authentication logic and token refresh mechanism
  useEffect(() => {
    if (localStorage.getItem('at')) {
      checkUserDetails()
    }
  }, [])

  const checkUserDetails = async () => {
    try {
      const { data } = await triggerGetUserDetails();
      dispatch(loginSuccess(data.data))
    } catch (error) {
      checkRefreshToken();
    }
  }

  const checkRefreshToken = async () => {
    try {
      await triggerGetRefreshToken();
      // handle successful token refresh
    } catch (error) {
      // handle refresh failure
    }
  }

  // Loading state
  if (localStorage.getItem('at') && (isUninitialized || isLoading)) {
    return (
      <ThemeContextProvider>
        <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress size={60} thickness={4} />
        </Box>
      </ThemeContextProvider>
    );
  }
  
  return (
    <ThemeContextProvider>
      <GoogleOAuthProvider clientId={gClientId}>
        <RouterProvider router={routes} />
      </GoogleOAuthProvider>
    </ThemeContextProvider>
  )
}

export default App
```

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

```
+-----------+     +------------+     +-------------+     +-----------+
|           |     |            |     |             |     |           |
| Login Form|---->| Submit     |---->| API Request |---->| Backend   |
|           |     | Credentials|     | (RTK Query) |     | API       |
+-----------+     +------------+     +-------------+     +-----------+
                                          |
                                          v
+-----------+     +------------+     +-------------+
|           |     |            |     |             |
| Protected |<----| Update     |<----| Store Token |
| Routes    |     | Auth State |     | in Storage  |
|           |     |            |     |             |
+-----------+     +------------+     +-------------+
```

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

### Quiz System Implementation

The quiz system follows a multi-step process:

1. **Quiz Initialization**:
   - Select quiz type (module/subject/topic)
   - Load quiz configuration
   - Initialize timer and session

2. **Question Rendering**:
   - Render questions based on type
   - Track user responses
   - Handle navigation between questions

3. **Submission and Scoring**:
   - Submit answers to backend
   - Process and display results
   - Store assessment data

```
+------------+     +------------+     +------------+     +------------+
|            |     |            |     |            |     |            |
| Quiz       |---->| Question   |---->| User       |---->| Answer     |
| Initialize |     | Display    |     | Input      |     | Submission |
|            |     |            |     |            |     |            |
+------------+     +------------+     +------------+     +------------+
                                                              |
                                                              v
+------------+     +------------+     +------------+     +------------+
|            |     |            |     |            |     |            |
| Analysis   |<----| Score      |<----| Evaluate   |<----| Process    |
| Display    |     | Calculation|     | Answers    |     | Submission |
|            |     |            |     |            |     |            |
+------------+     +------------+     +------------+     +------------+
```

## Technical Implementation

### State Management

The application uses Redux Toolkit for state management:

1. **Store Configuration** (`store/index.js`):
   ```javascript
   import { configureStore } from '@reduxjs/toolkit';
   import { apiSlice } from './slices/apiServices';
   import authReducer from './slices/auth';
   import toastsReducer from './slices/toasts';

   export const store = configureStore({
     reducer: {
       [apiSlice.reducerPath]: apiSlice.reducer,
       auth: authReducer,
       toasts: toastsReducer,
     },
     middleware: (getDefaultMiddleware) =>
       getDefaultMiddleware().concat(apiSlice.middleware),
   });
   ```

2. **Auth Slice** (`store/slices/auth.js`):
   - Manages user authentication state
   - Handles login/logout actions
   - Stores user information

3. **Toast Slice** (`store/slices/toasts.js`):
   - Manages application-wide notifications
   - Supports success, error, warning, and info types

4. **API Services** (`store/slices/apiServices.js`):
   - RTK Query implementation
   - Defines API endpoints
   - Handles caching, invalidation, and error handling

### Routing Implementation

The routing system uses React Router v6 with a declarative approach:

```jsx
const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      {/* Public Routes - Landing Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        {/* Other public routes */}
      </Route>
      
      {/* Auth Routes */}
      <Route element={<PublicRoutes><AuthLayout /></PublicRoutes>}>
        <Route path="/login" element={<Login />} />
        {/* Other auth routes */}
      </Route>

      {/* Private Routes */}
      <Route element={<PrivateRoutes><PrivateLayout /></PrivateRoutes>}>
        {/* Nested route hierarchy */}
      </Route>
    </Route>
  )
);
```

### Authentication System

The application uses JWT tokens for authentication:

1. **Token Storage**:
   - Access token stored in localStorage as 'at'
   - Refresh token handled by HTTP-only cookies

2. **Auth Headers**:
   - JWT token attached to API requests via `Authorization` header

3. **Google OAuth Integration**:
   ```jsx
   <GoogleOAuthProvider clientId={gClientId}>
     <RouterProvider router={routes} />
   </GoogleOAuthProvider>
   ```

### API Integration

The application communicates with the backend API using RTK Query:

```javascript
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem('at');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation({...}),
    register: builder.mutation({...}),
    verifyUser: builder.mutation({...}),
    
    // User endpoints
    getUserDetails: builder.query({...}),
    updateUserProfile: builder.mutation({...}),
    
    // Exam endpoints
    getExams: builder.query({...}),
    getExamDetails: builder.query({...}),
    submitQuiz: builder.mutation({...}),
    // ... other endpoints
  }),
});
```

### Form Handling

Forms use a combination of:
- React Hook Form for form state management
- Yup for validation schemas
- Custom validation logic for complex cases

Example form implementation:

```jsx
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: yupResolver(validationSchema)
});

const onSubmit = (data) => {
  // Handle form submission
};

return (
  <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
    <Typography variant="h4">Login</Typography>
    
    <TextField
      label="Email"
      {...register('email')}
      error={!!errors.email}
      helperText={errors.email?.message}
    />
    
    <TextField
      label="Password"
      type="password"
      {...register('password')}
      error={!!errors.password}
      helperText={errors.password?.message}
    />
    
    <Button type="submit" variant="contained" color="primary">
      Login
    </Button>
  </Box>
);
```

### Performance Optimizations

1. **Code Splitting**:
   ```jsx
   const LandingPage = React.lazy(() => import('../pages/landing'));

   // In router
   <Route path="/" element={
     <Suspense fallback={<LoadingComponent />}>
       <LandingPage />
     </Suspense>
   } />
   ```

2. **Memo and Callback Optimizations**:
   ```jsx
   // Memoized component
   const MemoizedComponent = React.memo(({ prop1, prop2 }) => {
     // Component logic
   });

   // In functional component
   const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
   const memoizedCallback = useCallback(() => doSomething(a, b), [a, b]);
   ```

3. **List Virtualization**:
   ```jsx
   import { FixedSizeList } from 'react-window';

   const MyList = ({ items }) => {
     const Row = ({ index, style }) => (
       <div style={style}>
         {items[index].name}
       </div>
     );

     return (
       <FixedSizeList
         height={500}
         width="100%"
         itemCount={items.length}
         itemSize={50}
       >
         {Row}
       </FixedSizeList>
     );
   };
   ```

### Error Handling

1. **API Error Handling**:
   ```javascript
   try {
     const result = await apiCall();
     // Handle success
   } catch (error) {
     if (error.status === 401) {
       // Handle authentication error
     } else if (error.status === 403) {
       // Handle permission error
     } else {
       // Handle generic error
       dispatch(showToast({
         message: error.data?.message || 'An error occurred',
         type: 'error'
       }));
     }
   }
   ```

2. **React Error Boundaries**:
   ```jsx
   class ErrorBoundary extends React.Component {
     constructor(props) {
       super(props);
       this.state = { hasError: false };
     }

     static getDerivedStateFromError(error) {
       return { hasError: true };
     }

     componentDidCatch(error, errorInfo) {
       // Log error
     }

     render() {
       if (this.state.hasError) {
         return <ErrorFallback />;
       }
       return this.props.children;
     }
   }
   ```

## Development Workflow

### Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone [repository-url]
   cd fe-ai-tutor
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file with the following variables:
   ```
   VITE_API_URL=http://localhost:3000/api
   VITE_GOOGLE_CLIENT_ID=your-google-client-id
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. **Access the application**:
   Open your browser and navigate to http://localhost:5173 (default Vite port)

### Development Process

1. **Creating a New Component**:
   ```jsx
   // src/components/MyComponent.jsx
   import React from 'react';
   
   const MyComponent = ({ prop1, prop2 }) => {
     return (
       <div>
         <h2>{prop1}</h2>
         <p>{prop2}</p>
       </div>
     );
   };
   
   export default MyComponent;
   ```

2. **Adding a New Page**:
   ```jsx
   // src/pages/newFeature/NewPage.jsx
   import React from 'react';
   import MainLayout from '../../layouts/MainLayout';
   
   const NewPage = () => {
     return (
       <div>
         <h1>New Page</h1>
         <p>This is a new page component.</p>
       </div>
     );
   };
   
   export default NewPage;
   
   // Add to router in src/routes/index.jsx
   <Route path="/new-page" element={<NewPage />} />
   ```

3. **Creating a New Redux Slice**:
   ```jsx
   // src/store/slices/newFeature.js
   import { createSlice } from '@reduxjs/toolkit';
   
   const initialState = {
     data: [],
     loading: false,
     error: null,
   };
   
   const newFeatureSlice = createSlice({
     name: 'newFeature',
     initialState,
     reducers: {
       setData: (state, action) => {
         state.data = action.payload;
       },
       setLoading: (state, action) => {
         state.loading = action.payload;
       },
       setError: (state, action) => {
         state.error = action.payload;
       },
     },
   });
   
   export const { setData, setLoading, setError } = newFeatureSlice.actions;
   export default newFeatureSlice.reducer;
   
   // Add to store in src/store/index.js
   import newFeatureReducer from './slices/newFeature';
   
   export const store = configureStore({
     reducer: {
       // ... existing reducers
       newFeature: newFeatureReducer,
     },
   });
   ```

4. **Adding a New API Endpoint**:
   ```jsx
   // src/store/slices/apiServices.js
   // Inside the endpoints object
   getNewFeatureData: builder.query({
     query: (params) => `new-feature?${new URLSearchParams(params)}`,
     providesTags: ['NewFeature'],
   }),
   
   createNewFeatureItem: builder.mutation({
     query: (data) => ({
       url: 'new-feature',
       method: 'POST',
       body: data,
     }),
     invalidatesTags: ['NewFeature'],
   }),
   ```

### Build Process

1. **Create production build**:
   ```bash
   npm run build
   ```

2. **Preview production build**:
   ```bash
   npm run preview
   ```

3. **Deployment**:
   - Build the application (`npm run build`)
   - Deploy the `dist` directory to your hosting service
   - Configure environment variables for production

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

4. **Performance**:
   - Memoize expensive calculations with useMemo
   - Optimize callback functions with useCallback
   - Use React.memo for pure components
   - Implement virtualization for long lists

5. **Security**:
   - Protected routes
   - Input validation
   - Secure token handling
   - XSS protection
   - CSRF protection

## Troubleshooting

### Authentication Issues

**Problem**: Token expiration causing unexpected logouts or API errors  
**Solution**: Implement token refresh mechanism and handle 401 errors

```jsx
// In API service
baseQuery: fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = localStorage.getItem('at');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
  responseHandler: async (response) => {
    if (response.status === 401) {
      // Try to refresh token
      try {
        const refreshResult = await refreshToken();
        if (refreshResult.success) {
          // Retry original request
        } else {
          // Handle authentication failure
        }
      } catch (error) {
        // Force logout
      }
    }
    return response.json();
  },
}),
```

### State Management Issues

**Problem**: Components not updating when Redux state changes  
**Solution**: Check selector dependencies and Redux action dispatch

```jsx
// Ensure selectors are specific
const specificData = useSelector((state) => state.feature.specificProperty);

// Avoid object selectors that cause unnecessary re-renders
// Bad
const data = useSelector((state) => ({ 
  prop1: state.feature.prop1,
  prop2: state.feature.prop2 
}));

// Good
const prop1 = useSelector((state) => state.feature.prop1);
const prop2 = useSelector((state) => state.feature.prop2);
```

### Rendering Problems

**Problem**: Unnecessary re-renders affecting performance  
**Solution**: Use React DevTools to identify and fix re-rendering issues

```jsx
// Use React.memo for components that render often but with the same props
const ExpensiveComponent = React.memo(({ value }) => {
  return <div>{value}</div>;
});

// Use proper dependency arrays in useEffect, useMemo, and useCallback
useEffect(() => {
  // This effect runs only when dependency changes
}, [dependency]);
```

## Contributing Guidelines

1. **Branching Strategy**:
   - `main`: Production-ready code
   - `develop`: Development branch
   - Feature branches: `feature/feature-name`
   - Bug fixes: `fix/bug-description`

2. **Pull Request Process**:
   - Create a PR against the `develop` branch
   - Fill out the PR template
   - Ensure tests pass
   - Request review from team members

3. **Code Style**:
   - Follow the project's ESLint configuration
   - Use consistent naming conventions
   - Write meaningful comments for complex logic
   - Document public APIs

4. **Commit Messages**:
   Use conventional commit format:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation
   - `style:` for formatting changes
   - `refactor:` for code refactoring
   - `test:` for adding tests
   - `chore:` for maintenance tasks 