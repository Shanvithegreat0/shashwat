# AI Tutor Frontend - Technical Documentation

This document provides detailed technical information about the AI Tutor Frontend implementation. It's intended for developers who need to understand the internal architecture, data flow, and specific implementation patterns.

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

## State Management

### Redux Implementation

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

### RTK Query Implementation

The application uses RTK Query for API calls:

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

## Routing Implementation

### Route Configuration

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

### Route Guards

Custom route guards control access to different parts of the application:

```jsx
// Example of a route guard
const PrivateRoutes = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" />;
};
```

## Authentication System

### JWT Implementation

The application uses JWT tokens for authentication:

1. **Token Storage**:
   - Access token stored in localStorage as 'at'
   - Refresh token handled by HTTP-only cookies

2. **Token Refresh Logic**:
   ```javascript
   const checkRefreshToken = async () => {
     try {
       const { data } = await triggerGetRefreshToken();
       // Handle successful token refresh
     } catch (error) {
       // Handle refresh failure
     }
   }
   ```

3. **Auth Headers**:
   - JWT token attached to API requests via `Authorization` header

### OAuth Integration

Google OAuth is implemented using `@react-oauth/google`:

```jsx
<GoogleOAuthProvider clientId={gClientId}>
  <RouterProvider router={routes} />
</GoogleOAuthProvider>
```

## UI Framework Implementation

### Material-UI Integration

The application uses Material-UI with custom theming:

```jsx
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
});
```

### Theme Context

A custom theme context provides theme management:

```jsx
export const ThemeContextProvider = ({ children }) => {
  // Theme state and methods
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};
```

## Form Handling

### Form Validation

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
  <form onSubmit={handleSubmit(onSubmit)}>
    {/* Form fields */}
  </form>
);
```

## Quiz System Implementation

### Quiz Flow

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

### Quiz Component Structure

```
Quiz/
├── QuizContainer.jsx      # Main container
├── QuestionRenderer.jsx   # Question display logic
├── AnswerComponent.jsx    # Answer input handling
├── QuizNavigation.jsx     # Navigation between questions
├── Timer.jsx             # Quiz timer component
└── QuizResult.jsx        # Results display
```

## Performance Optimizations

### Code Splitting

The application uses React.lazy and Suspense for code splitting:

```jsx
const LandingPage = React.lazy(() => import('../pages/landing'));

// In router
<Route path="/" element={
  <Suspense fallback={<LoadingComponent />}>
    <LandingPage />
  </Suspense>
} />
```

### Memo and Callback Optimizations

React.memo, useCallback, and useMemo are used to optimize rendering:

```jsx
// Memoized component
const MemoizedComponent = React.memo(({ prop1, prop2 }) => {
  // Component logic
});

// In functional component
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
const memoizedCallback = useCallback(() => doSomething(a, b), [a, b]);
```

### Network Optimization

RTK Query provides built-in caching and request deduplication:

```javascript
// In apiServices.js
getExams: builder.query({
  query: () => 'exams',
  keepUnusedDataFor: 300, // Cache for 5 minutes
}),
```

## Error Handling

### API Error Handling

Centralized error handling for API requests:

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

### Boundary Pattern

React Error Boundaries catch and handle component errors:

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

## Testing Strategy

### Component Testing

Jest and React Testing Library for component testing:

```javascript
test('renders login form', () => {
  render(<Login />);
  const emailInput = screen.getByLabelText(/email/i);
  const passwordInput = screen.getByLabelText(/password/i);
  const submitButton = screen.getByRole('button', { name: /sign in/i });
  
  expect(emailInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
  expect(submitButton).toBeInTheDocument();
});
```

### Redux Testing

Testing Redux slices and selectors:

```javascript
test('should handle login success', () => {
  const initialState = { user: null, isAuthenticated: false };
  const user = { id: '1', name: 'Test User' };
  const action = loginSuccess(user);
  const newState = authReducer(initialState, action);
  
  expect(newState.user).toEqual(user);
  expect(newState.isAuthenticated).toBe(true);
});
```

## Environment Configuration

### Environment Variables

The application uses Vite's environment variable system:

```
# .env.development
VITE_API_URL=http://localhost:3000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id

# .env.production
VITE_API_URL=https://api.example.com/api
VITE_GOOGLE_CLIENT_ID=your-production-google-client-id
```

Access in code:
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

## Build and Deployment

### Build Configuration

Vite configuration in `vite.config.js`:

```javascript
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'terser',
  },
  server: {
    port: 3000,
  },
});
```

### Deployment Process

Standard build and deployment process:

1. Run `npm run build`
2. Deploy `dist` directory to hosting platform
3. Ensure environment variables are set correctly

## Security Considerations

1. **XSS Protection**:
   - React's built-in HTML escaping
   - Content Security Policy
   - Proper input validation

2. **CSRF Protection**:
   - Token-based authentication
   - SameSite cookie attributes

3. **Secure Authentication**:
   - HTTPS-only
   - Token expiration and refresh
   - Secure logout process

4. **Data Validation**:
   - Client-side validation
   - Server-side validation as the source of truth

## Future Improvements

1. **Performance**:
   - Implement Web Workers for heavy computations
   - Add service worker for offline capability
   - Further optimize bundle size

2. **Architecture**:
   - Consider migration to React Query for data fetching
   - Implement micro-frontend architecture for large scale
   - Add stronger typing with TypeScript

3. **Features**:
   - Enhance analytics capabilities
   - Add collaborative features
   - Improve accessibility compliance 