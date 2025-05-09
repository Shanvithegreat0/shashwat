import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { Box, CircularProgress } from '@mui/material';

const OnboardingGuard = ({ exclude = [] }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check if user has completed onboarding
    const checkOnboardingStatus = () => {
      const onboardingData = localStorage.getItem('onboardingData');
      if (onboardingData) {
        const data = JSON.parse(onboardingData);
        setHasCompletedOnboarding(data.completed === true);
      } else {
        setHasCompletedOnboarding(false);
      }
      setIsLoading(false);
    };

    // Check onboarding status
    checkOnboardingStatus();
  }, []);

  // If current path is in exclude list, don't apply the guard
  if (exclude.includes(location.pathname)) {
    return <Outlet />;
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // If user hasn't completed onboarding, redirect to getting-started screen
  if (!hasCompletedOnboarding) {
    return <Navigate to="/getting-started" state={{ from: location }} replace />;
  }

  // If user has completed onboarding, allow access to protected routes
  return <Outlet />;
};

export default OnboardingGuard; 