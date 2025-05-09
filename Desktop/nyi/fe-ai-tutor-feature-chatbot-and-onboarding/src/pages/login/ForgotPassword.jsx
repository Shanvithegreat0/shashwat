import {
  Box,
  Button,
  Card,
  TextField,
  Typography,
  useTheme,
  Divider,
  Grid
} from "@mui/material";
import { useFormik } from "formik";
import React from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router";
import { useForgotPasswordMutation } from "../../store/slices/apiServices";
import { useToast } from '../../components/Toasts/useToast';

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const [triggerForgot, { isLoading }] = useForgotPasswordMutation();
  const { showToast } = useToast()

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Email is required"),
    }),
    onSubmit: async (values) => {
      try {
        const { data, message } = await triggerForgot({ email: values.email }).unwrap();
        showToast({ message, type: "success" })
        navigate(`/verify-otp/${values.email}`)
      } catch (error) {
        showToast({ message: error.data.message, type: "error" })
      }
    },
  });

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
      
      {/* Right side - Forgot Password form */}
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
              Reset Your Password
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 2 }}>
              Enter your email to receive a password reset code
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
                Send Reset Code
              </Button>
            </form>
            
            <Divider sx={{ my: 1.5 }}>
              <Typography variant="body2" color="text.secondary" fontSize="0.8rem">OR</Typography>
            </Divider>
            
            <Typography variant="body2" textAlign="center" sx={{ mb: 1 }}>
              Remember your password?
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
              Back to Sign In
            </Button>
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ForgotPassword;
