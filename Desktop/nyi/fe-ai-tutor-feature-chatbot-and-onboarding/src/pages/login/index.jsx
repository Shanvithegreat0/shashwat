import { 
  Box, 
  Button,
  Card, 
  Divider, 
  IconButton, 
  InputAdornment, 
  TextField, 
  Typography,
  Grid,
  useTheme 
} from '@mui/material'
import { useFormik } from 'formik';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router';
import { GoogleLogin } from '@react-oauth/google';
import { useGoogleAuthMutation, useLoginMutation } from '../../store/slices/apiServices';
import { loginSuccess } from '../../store/slices/auth';
import { useToast } from '../../components/Toasts/useToast';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [triggerLogin, { isLoading }] = useLoginMutation()
  const [tiggerGoogleAuth, { isLoading: isGooogleAuthLoading }] = useGoogleAuthMutation();

  const { showToast } = useToast() 

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        const { data, message } = await triggerLogin(values).unwrap()
        dispatch(loginSuccess(data))
        showToast({ message, type: "success" })
        navigate('/dashboard')
      } catch (error) {
        showToast({ message: error.data.message, type: "error" })
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const { data, message } = await tiggerGoogleAuth({ authorization: credentialResponse.credential }).unwrap()
      dispatch(loginSuccess(data))
      showToast({ message, type: "success" })
      navigate('/dashboard')
    } catch (error) {
      showToast({ message: error.data.message, type: "error" })
    }
  }

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
      
      {/* Right side - Login form */}
      <Grid item xs={12} sm={6} md={6} lg={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Card
          sx={{
            maxWidth: 400,
            width: '100%',
            borderRadius: 2,
            boxShadow: theme.palette.custom.shadows.card,
            p: 0,
            overflow: 'auto'
          }}
        >
          <Box sx={{ p: 2, pb: 1 }}>
            <Typography variant="h5" component="h1" fontWeight={600} color="primary" textAlign="center" sx={{ mb: 0.5 }}>
              Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 2 }}>
              Sign in to your account
            </Typography>
            
            <Divider sx={{ mb: 2 }} />
            
            <form onSubmit={formik.handleSubmit}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email *"
                size="small"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                sx={{ 
                  mb: 1.5,
                  '& .MuiOutlinedInput-root': {
                    height: 40
                  }
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              
              <TextField
                fullWidth
                id="password"
                name="password"
                label="Password *"
                size="small"
                type={showPassword ? 'text' : 'password'}
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
                        onClick={handleClickShowPassword}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
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
                Sign in
              </Button>
            </form>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5, mb: 1 }}>
              <Button
                component={Link}
                to="/forgot-password"
                color="primary"
                size="small"
                sx={{ 
                  textTransform: 'none',
                  p: 0,
                  fontSize: '0.8rem',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    textDecoration: 'underline'
                  }
                }}
              >
                Forgot Password?
              </Button>
            </Box>
            
            <Divider sx={{ my: 1.5 }}>
              <Typography variant="body2" color="text.secondary" fontSize="0.8rem">OR</Typography>
            </Divider>
            
            <Box sx={{ mb: 1.5 }}>
              <GoogleLogin
                width="100%"
                shape="rectangular"
                text="signin_with"
                size="medium"
                onSuccess={credentialResponse => {
                  handleGoogleLogin(credentialResponse)
                }}
                onError={() => {
                  console.log('Login Failed');
                }}
              />
            </Box>
            
            <Divider sx={{ my: 1.5 }}>
              <Typography variant="body2" color="text.secondary" fontSize="0.8rem">OR</Typography>
            </Divider>
            
            <Typography variant="body2" textAlign="center" sx={{ mb: 1 }}>
              Don't have an account yet?
            </Typography>
            
            <Button
              component={Link}
              to="/register"
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
              Create an account
            </Button>
          </Box>
        </Card>
      </Grid>
    </Grid>
  )
}

export default Login