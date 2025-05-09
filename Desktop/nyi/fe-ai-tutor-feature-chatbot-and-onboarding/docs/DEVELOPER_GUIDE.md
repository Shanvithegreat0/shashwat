# AI Tutor Frontend - Developer Guide

This guide is designed to help new developers quickly get up to speed with the AI Tutor Frontend project. It covers setup, coding standards, common tasks, and troubleshooting tips.

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm (v8+) or yarn
- Git

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone [repository-url]
   cd fe-ai-tutor
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory with the following variables:
   ```
   VITE_API_URL=http://localhost:3000/api
   VITE_GOOGLE_CLIENT_ID=your-google-client-id
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Access the application:**
   Open your browser and navigate to http://localhost:5173 (default Vite port)

## Project Structure Overview

The application follows a feature-based structure:

- `src/components/`: Reusable UI components
- `src/layouts/`: Page layout components
- `src/pages/`: Page components organized by feature
- `src/routes/`: Routing configuration
- `src/store/`: Redux store configuration and slices
- `src/theme/`: Theming configuration
- `src/utils/`: Utility functions
- `src/App.jsx`: Main application component
- `src/main.jsx`: Application entry point

## Development Workflow

### Creating a New Component

1. Create a new file in the appropriate directory:
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

2. Import and use the component where needed:
   ```jsx
   import MyComponent from '../components/MyComponent';
   
   const ParentComponent = () => {
     return (
       <div>
         <MyComponent prop1="Hello" prop2="World" />
       </div>
     );
   };
   ```

### Adding a New Page

1. Create a new page component in the appropriate directory:
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
   ```

2. Add the page to the router in `src/routes/index.jsx`:
   ```jsx
   // Inside the route configuration
   <Route path="/new-page" element={<NewPage />} />
   ```

### Working with Redux

1. **Using existing state:**
   ```jsx
   import { useSelector, useDispatch } from 'react-redux';
   import { someAction } from '../store/slices/someSlice';
   
   const MyComponent = () => {
     const dispatch = useDispatch();
     const data = useSelector((state) => state.someSlice.data);
     
     const handleAction = () => {
       dispatch(someAction(payload));
     };
     
     return (
       // Component JSX
     );
   };
   ```

2. **Creating a new slice:**
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
   ```

3. **Adding the slice to the store:**
   ```jsx
   // src/store/index.js
   import newFeatureReducer from './slices/newFeature';
   
   export const store = configureStore({
     reducer: {
       // ... existing reducers
       newFeature: newFeatureReducer,
     },
     // ... rest of configuration
   });
   ```

### Working with API Calls

1. **Adding a new endpoint to RTK Query:**
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

2. **Using API hooks in components:**
   ```jsx
   import { useGetNewFeatureDataQuery, useCreateNewFeatureItemMutation } from '../store/slices/apiServices';
   
   const MyComponent = () => {
     const { data, isLoading, error } = useGetNewFeatureDataQuery({ param1: 'value1' });
     const [createItem, { isLoading: isCreating }] = useCreateNewFeatureItemMutation();
     
     const handleCreateItem = async () => {
       try {
         await createItem({ name: 'New Item' }).unwrap();
         // Handle success
       } catch (error) {
         // Handle error
       }
     };
     
     // Component JSX
   };
   ```

## Styling Guidelines

The application uses Material-UI (MUI) for styling:

1. **Using MUI components:**
   ```jsx
   import { Button, TextField, Typography, Box } from '@mui/material';
   
   const MyComponent = () => {
     return (
       <Box sx={{ padding: 2 }}>
         <Typography variant="h4">Title</Typography>
         <TextField label="Input" variant="outlined" />
         <Button variant="contained" color="primary">
           Submit
         </Button>
       </Box>
     );
   };
   ```

2. **Custom styling with sx prop:**
   ```jsx
   <Box
     sx={{
       display: 'flex',
       flexDirection: 'column',
       gap: 2,
       padding: 3,
       backgroundColor: 'background.paper',
       borderRadius: 1,
       boxShadow: 1,
     }}
   >
     {/* Component content */}
   </Box>
   ```

3. **Responsive design:**
   ```jsx
   <Box
     sx={{
       display: 'flex',
       flexDirection: { xs: 'column', md: 'row' },
       padding: { xs: 1, sm: 2, md: 3 },
     }}
   >
     {/* Responsive content */}
   </Box>
   ```

## Authentication

### Handling Protected Routes

The application uses route guards to handle protected routes:

```jsx
// Example of checking authentication in a component
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedComponent = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return (
    // Protected content
  );
};
```

### Managing Authentication State

```jsx
// Login example
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/slices/auth';
import { useLoginMutation } from '../store/slices/apiServices';

const LoginComponent = () => {
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  
  const handleLogin = async (credentials) => {
    try {
      const result = await login(credentials).unwrap();
      localStorage.setItem('at', result.token);
      dispatch(loginSuccess(result.user));
    } catch (error) {
      // Handle error
    }
  };
  
  // Component JSX
};
```

## Best Practices

### Performance Optimization

1. **Memoization:**
   ```jsx
   import React, { useMemo, useCallback } from 'react';
   
   const MyComponent = ({ data }) => {
     const processedData = useMemo(() => {
       return data.map(item => /* expensive operation */);
     }, [data]);
     
     const handleAction = useCallback(() => {
       // Handler implementation
     }, [/* dependencies */]);
     
     return (
       // Component JSX
     );
   };
   ```

2. **Optimizing renders:**
   ```jsx
   import React from 'react';
   
   const ChildComponent = React.memo(({ prop1, prop2, onAction }) => {
     return (
       // Component JSX
     );
   });
   ```

### Error Handling

```jsx
import { useDispatch } from 'react-redux';
import { showToast } from '../store/slices/toasts';

const MyComponent = () => {
  const dispatch = useDispatch();
  
  const handleAction = async () => {
    try {
      // Action logic
    } catch (error) {
      dispatch(showToast({
        message: error.message || 'An error occurred',
        type: 'error',
      }));
    }
  };
  
  // Component JSX
};
```

## Form Handling Best Practices

```jsx
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextField, Button, Box, Typography } from '@mui/material';

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
});

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
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
};
```

## Common Issues and Solutions

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

### Performance Issues

**Problem**: Slow rendering with large data sets  
**Solution**: Implement virtualization for long lists

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

## Unit Testing

The project uses Jest and React Testing Library for unit testing:

```jsx
// src/__tests__/components/MyComponent.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import MyComponent from '../../components/MyComponent';
import reducer from '../../store/slices/myFeature';

const renderWithRedux = (
  ui,
  {
    initialState = {},
    store = configureStore({
      reducer: { myFeature: reducer },
      preloadedState: initialState,
    }),
    ...renderOptions
  } = {}
) => {
  const Wrapper = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  );
  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

describe('MyComponent', () => {
  test('renders correctly', () => {
    renderWithRedux(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  test('handles click events', () => {
    renderWithRedux(<MyComponent />);
    const button = screen.getByRole('button', { name: 'Click Me' });
    fireEvent.click(button);
    expect(screen.getByText('Button Clicked')).toBeInTheDocument();
  });
});
```

## Debugging Tips

1. **Redux DevTools**:
   Install the Redux DevTools browser extension to inspect Redux state and actions.

2. **React DevTools**:
   Use React DevTools browser extension to inspect component hierarchy and props.

3. **Console Logging**:
   Use structured console logs to track component lifecycle:
   ```jsx
   useEffect(() => {
     console.group('MyComponent useEffect');
     console.log('Dependencies changed:', deps);
     console.log('Current state:', state);
     console.groupEnd();
     
     // Effect logic
   }, [deps]);
   ```

4. **Network Monitoring**:
   Use browser DevTools Network tab to monitor API requests and responses.

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

## Additional Resources

- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Material-UI Documentation](https://mui.com/material-ui/getting-started/)
- [React Router Documentation](https://reactrouter.com/docs/en/v6)
- [RTK Query Documentation](https://redux-toolkit.js.org/rtk-query/overview) 