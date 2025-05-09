import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  useTheme
} from "@mui/material";
import { useFormik } from "formik";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { useNavigate, useSearchParams, Link } from "react-router";
import { useToast } from "../../components/Toasts/useToast";
import { useResetPasswordMutation } from "../../store/slices/apiServices";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { motion } from 'framer-motion';

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();
  const [triggerReset, { isLoading }] = useResetPasswordMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const token = searchParams.get("token");

  const validationSchema = Yup.object({
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required'),
    });

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const { data, message } = await triggerReset({
          token: token,
          password: values.password,
        }).unwrap();
        showToast({ message, type: "success" });
        navigate("/login");
      } catch (error) {
        showToast({ message: error.data.message, type: "error" });
      }
    },
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form noValidate onSubmit={formik.handleSubmit}>
        <Card variant="outlined" sx={{ 
          borderRadius: 2, 
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          overflow: 'hidden',
          width: '100%',
          maxWidth: '450px',
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)'
        }}>
          <CardHeader
            sx={{ 
              textAlign: "center", 
              pt: 4,
              pb: 2,
              '& .MuiCardHeader-title': {
                fontSize: '1.75rem',
                fontWeight: 600,
                color: theme.palette.primary.main
              },
              '& .MuiCardHeader-subheader': {
                fontSize: '1rem',
                mt: 1
              }
            }}
            title="Create New Password"
            subheader="Enter your new password below"
          />
          <Divider sx={{ mx: 3 }} />
          <CardContent sx={{ px: { xs: 2, sm: 3 }, pt: 3 }}>
            <TextField
              required
              label="New Password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              margin="normal"
              fullWidth
              name="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              InputProps={{
                sx: { borderRadius: 1.5 },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <TextField
              required
              label="Confirm New Password"
              type={showConfirmPassword ? "text" : "password"}
              variant="outlined"
              margin="normal"
              fullWidth
              name="confirmPassword"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmPassword}
              error={
                formik.touched.confirmPassword &&
                Boolean(formik.errors.confirmPassword)
              }
              helperText={
                formik.touched.confirmPassword && formik.errors.confirmPassword
              }
              InputProps={{
                sx: { borderRadius: 1.5 },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={handleClickShowConfirmPassword}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </CardContent>
          <CardActions sx={{ px: 3, pb: 2, pt: 1 }}>
            <Button 
              disabled={isLoading} 
              type="submit" 
              fullWidth 
              variant="contained"
              sx={{ 
                py: 1.2, 
                borderRadius: 1.5,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600
              }}
            >
              {isLoading ? 'Updating Password...' : 'Reset Password'}
            </Button>
          </CardActions>
          <CardActions sx={{ px: 3, pb: 3, justifyContent: 'center' }}>
            <Button 
              LinkComponent={Link} 
              to="/login"
              variant="text"
              sx={{ 
                textTransform: 'none',
                fontSize: '0.9rem',
                '&:hover': {
                  backgroundColor: 'transparent',
                  textDecoration: 'underline'
                }
              }}
            >
              Back to Sign In
            </Button>
          </CardActions>
        </Card>
      </form>
    </motion.div>
  );
};

export default ResetPassword;
