import {
  Box,
  Button,
  Card,
  TextField,
  Typography,
  useTheme,
  InputAdornment,
  IconButton,
  Divider,
  Grid
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '../../store/slices/apiServices';
import { loginSuccess } from '../../store/slices/auth';
import { useToast } from '../../components/Toasts/useToast';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [triggerRegister, { isLoading }] = useRegisterMutation();
  const { showToast } = useToast();
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      inviteCode: ''
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string().email('Invalid email format').required('Email is required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Please confirm your password'),
      inviteCode: Yup.string().required('Invite code is required')
    }),
    onSubmit: async (values) => {
      try {
        const { data, message } = await triggerRegister(values).unwrap();
        dispatch(loginSuccess(data));
        showToast({ message, type: "success" });
        navigate('/dashboard');
      } catch (error) {
        showToast({ message: error.data.message || 'Registration failed', type: "error" });
      }
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Grid container spacing={0} sx={{ width: '100%', height: '100%' }}>
      {/* Left side - Desktop only */}
      <Grid item xs={0} sm={6} md={6} lg={6} sx={{ display: { xs: 'none', sm: 'block' } }}>
        <Box sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant="h4" component="h1" sx={{ mb: 2, fontWeight: 600 }}>
            Advanced AI-powered <Typography component="span" sx={{ color: theme.palette.custom.highlightBlue, fontSize: { sm: 32, md: 42, lg: 48 }, fontWeight: 600 }}>JEE preparation</Typography>
          </Typography>
          <Typography fontSize={20} sx={{ mt: 3, opacity: 0.8 }}>
            Our platform uses AI to create personalized study plans, 
            provide instant feedback, and help you excel in your JEE exams.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', maxWidth: 400, mt: 6 }}>
            <img width="100%" src="/assets/icons/robot.png" alt="AI Robot" />
          </Box>
        </Box>
      </Grid>
      
      {/* Right side - Register form */}
      <Grid item xs={12} sm={6} md={6} lg={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Card
          sx={{
            maxWidth: 400,
            width: '100%',
            borderRadius: 2,
            boxShadow: theme.palette.custom.shadows.card,
            backgroundColor: theme.palette.background.paper,
            p: 0,
            overflow: 'auto'
          }}
        >
          <Box sx={{ p: 2, pb: 1 }}>
            <Typography variant="h5" component="h1" fontWeight={600} color="primary" textAlign="center" sx={{ mb: 0.5 }}>
              Create Account
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 2 }}>
              Join AITutor and start your learning journey
            </Typography>
            
            <Divider sx={{ mb: 2 }} />
            
            <form onSubmit={formik.handleSubmit}>
              <TextField
                fullWidth
                id="inviteCode"
                name="inviteCode"
                label="Invite Code *"
                size="small"
                value={formik.values.inviteCode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.inviteCode && Boolean(formik.errors.inviteCode)}
                helperText={formik.touched.inviteCode && formik.errors.inviteCode}
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{ 
                  mb: 1.5,
                  '& .MuiOutlinedInput-root': {
                    height: 40
                  }
                }}
              />
              
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Full Name *"
                size="small"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{ 
                  mb: 1.5,
                  '& .MuiOutlinedInput-root': {
                    height: 40
                  }
                }}
              />
              
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email Address *"
                size="small"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{ 
                  mb: 1.5,
                  '& .MuiOutlinedInput-root': {
                    height: 40
                  }
                }}
              />
              
              <TextField
                fullWidth
                id="password"
                name="password"
                label="Password *"
                size="small"
                type={showPassword ? "text" : "password"}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={togglePasswordVisibility}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{ 
                  mb: 1.5,
                  '& .MuiOutlinedInput-root': {
                    height: 40
                  }
                }}
              />
              
              <TextField
                fullWidth
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm Password *"
                size="small"
                type={showConfirmPassword ? "text" : "password"}
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={toggleConfirmPasswordVisibility}
                        edge="end"
                        size="small"
                      >
                        {showConfirmPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{ 
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    height: 40
                  }
                }}
              />
              
              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={isLoading}
                sx={{ 
                  py: 1, 
                  borderRadius: 50, 
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  mb: 1
                }}
              >
                Create Account
              </Button>
            </form>
            
            <Divider sx={{ my: 1.5 }}>
              <Typography variant="body2" color="text.secondary" fontSize="0.8rem">OR</Typography>
            </Divider>
            
            <Typography variant="body2" textAlign="center" sx={{ mb: 1 }}>
              Already have an account?
            </Typography>
            
            <Button
              component={Link}
              to="/login"
              fullWidth
              variant="outlined"
              size="small"
              sx={{ 
                py: 0.8, 
                borderRadius: 50, 
                textTransform: 'none',
                fontSize: '0.95rem',
                mb: 1
              }}
            >
              Sign In
            </Button>
            
            <Typography variant="caption" color="text.secondary" textAlign="center" sx={{ display: 'block', mt: 1, fontSize: '0.7rem' }}>
              By registering, you agree to our Terms of Service and Privacy Policy
            </Typography>
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Register;