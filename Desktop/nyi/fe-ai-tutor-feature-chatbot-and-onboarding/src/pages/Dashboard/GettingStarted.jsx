import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  Button,
  Avatar,
  Divider,
  Alert
} from '@mui/material';
import { 
  School as SchoolIcon,
  AssignmentTurnedIn as AssignmentIcon,
  Timeline as TimelineIcon,
  Settings as SettingsIcon,
  Chat as ChatIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const GettingStarted = () => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  
  useEffect(() => {
    // Check if user has completed onboarding
    const onboardingData = localStorage.getItem('onboardingData');
    if (onboardingData) {
      const data = JSON.parse(onboardingData);
      setHasCompletedOnboarding(data.completed === true);
    } else {
      setHasCompletedOnboarding(false);
    }
  }, []);
  
  const steps = [
    {
      id: 1,
      title: "Complete Your Profile",
      description: "Set up your personalized learning experience for JEE preparation.",
      icon: <SettingsIcon color="primary" sx={{ fontSize: 40 }} />,
      action: "Configure Now",
      path: "/onboarding",
      priority: !hasCompletedOnboarding
    },
    {
      id: 2,
      title: "Explore Exams",
      description: "Browse available exams and understand the structure and syllabus.",
      icon: <SchoolIcon color="primary" sx={{ fontSize: 40 }} />,
      action: "View Exams",
      path: "/exams",
      disabled: !hasCompletedOnboarding
    },
    {
      id: 3,
      title: "Take a Practice Test",
      description: "Test your knowledge with a quick assessment to identify your strengths.",
      icon: <AssignmentIcon color="primary" sx={{ fontSize: 40 }} />,
      action: "Start Test",
      path: "/quiz",
      disabled: !hasCompletedOnboarding
    },
    {
      id: 4,
      title: "Track Progress",
      description: "Monitor your performance and track improvement over time.",
      icon: <TimelineIcon color="primary" sx={{ fontSize: 40 }} />,
      action: "View Dashboard",
      path: "/dashboard",
      disabled: !hasCompletedOnboarding
    }
  ];

  const handleButtonClick = (path, disabled) => {
    if (disabled) return;
    navigate(path);
  };

  return (
    <Box sx={{ py: 5, px: { xs: 2, sm: 3, md: 4 } }}>
      <Container maxWidth="lg">
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            borderRadius: 2,
            mb: 4,
            backgroundColor: 'primary.main',
            color: 'white'
          }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Welcome to AI Tutor, {user?.name || 'Student'}!
          </Typography>
          
          {!hasCompletedOnboarding && (
            <Typography variant="subtitle1" sx={{ maxWidth: '800px', opacity: 0.9 }}>
              Complete your profile setup to unlock all features and personalize your JEE preparation.
            </Typography>
          )}
        </Paper>
        
        {!hasCompletedOnboarding && (
          <Alert 
            severity="info" 
            sx={{ 
              mb: 4, 
              borderLeft: '4px solid',
              borderLeftColor: 'primary.main'
            }}
          >
            <Typography variant="subtitle1" fontWeight="medium">
              Click the chat icon in the corner to set up your profile
            </Typography>
          </Alert>
        )}
        
        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
          Get Started
        </Typography>
        
        <Grid container spacing={3}>
          {steps.map(step => (
            <Grid item xs={12} sm={6} key={step.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  opacity: step.disabled ? 0.7 : 1,
                  position: 'relative',
                  ...(step.priority && {
                    border: '2px solid',
                    borderColor: 'primary.main'
                  })
                }}
                elevation={step.priority ? 2 : 1}
              >
                {step.priority && (
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      top: 0, 
                      right: 20, 
                      bgcolor: 'primary.main',
                      color: 'white',
                      px: 2,
                      py: 0.5,
                      borderBottomLeftRadius: 8,
                      borderBottomRightRadius: 8,
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      textTransform: 'uppercase'
                    }}
                  >
                    Required
                  </Box>
                )}
                <CardContent sx={{ p: 3, flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', mb: 2 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: step.disabled ? 'action.disabledBackground' : 'primary.light', 
                        width: 48, 
                        height: 48,
                        mr: 2
                      }}
                    >
                      {step.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {step.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {step.description}
                      </Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button 
                      variant={step.priority ? "contained" : "outlined"}
                      color="primary"
                      disabled={step.disabled}
                      onClick={() => handleButtonClick(step.path, step.disabled)}
                      endIcon={step.priority ? <ChatIcon /> : undefined}
                    >
                      {step.action}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default GettingStarted; 