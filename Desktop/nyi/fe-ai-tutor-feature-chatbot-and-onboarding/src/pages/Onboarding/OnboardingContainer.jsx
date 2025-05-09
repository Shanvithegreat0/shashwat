import React, { useEffect } from 'react';
import { Box, Typography, Container } from '@mui/material';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';

// A simpler page just for hosting the onboarding chatbot experience
const OnboardingContainer = () => {
  const theme = useTheme();
  const { user } = useSelector((state) => state.auth);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(135deg, #0a1929 0%, #071426 100%)' 
          : 'linear-gradient(135deg, #e8f0fe 0%, #f5f7ff 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decoration */}
      <Box
        sx={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '40%',
          height: '40%',
          borderRadius: '50%',
          background: theme.palette.mode === 'dark'
            ? 'radial-gradient(circle, rgba(25,118,210,0.1) 0%, rgba(25,118,210,0) 70%)'
            : 'radial-gradient(circle, rgba(25,118,210,0.1) 0%, rgba(25,118,210,0) 70%)',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-10%',
          left: '-5%',
          width: '40%',
          height: '40%',
          borderRadius: '50%',
          background: theme.palette.mode === 'dark'
            ? 'radial-gradient(circle, rgba(25,118,210,0.1) 0%, rgba(25,118,210,0) 70%)'
            : 'radial-gradient(circle, rgba(25,118,210,0.1) 0%, rgba(25,118,210,0) 70%)',
          zIndex: 0,
        }}
      />

      {/* Content */}
      <Container maxWidth="md" sx={{ zIndex: 1, textAlign: 'center', px: 3 }}>
        <Typography 
          variant="h2" 
          component="h1" 
          fontWeight="bold" 
          sx={{ 
            mb: 2,
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #42a5f5 0%, #1976d2 100%)'
              : 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textFillColor: 'transparent',
          }}
        >
          Welcome to AI Tutor
        </Typography>
        
        <Typography 
          variant="h6" 
          color="text.secondary" 
          maxWidth="600px" 
          mx="auto"
          sx={{ opacity: 0.9 }}
        >
          Setting up your personalized learning experience...
        </Typography>
      </Container>
      
      {/* The ChatbotUI component will overlay on this page */}
    </Box>
  );
};

export default OnboardingContainer; 