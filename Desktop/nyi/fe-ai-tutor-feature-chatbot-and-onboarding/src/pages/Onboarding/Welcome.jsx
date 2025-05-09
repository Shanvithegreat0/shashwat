import React from 'react';
import { 
  Box, 
  Card, 
  Typography, 
  Button, 
  Grid, 
  Paper, 
  Stack
} from '@mui/material';
import { 
  School as SchoolIcon, 
  Timer as TimerIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { skipOnboarding } from '../../utils/userService';

const Welcome = () => {
  const navigate = useNavigate();
  
  const handleStart = () => {
    navigate('/onboarding');
  };
  
  const handleSkip = () => {
    // Save minimal onboarding data to localStorage to prevent future redirects
    skipOnboarding();
    navigate('/exams');
  };
  
  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center',
      bgcolor: '#f5f7ff',
      p: 3
    }}>
      <Card elevation={3} sx={{ maxWidth: 900, mx: 'auto', borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ 
          bgcolor: 'primary.main', 
          color: 'white', 
          p: 3,
          position: 'relative',
          overflow: 'hidden'
        }}>
          <Box sx={{ 
            position: 'absolute', 
            top: -30, 
            right: -30, 
            width: 200, 
            height: 200, 
            borderRadius: '50%', 
            backgroundColor: 'rgba(255,255,255,0.1)' 
          }} />
          
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Welcome to AI Tutor!
            </Typography>
            <Typography variant="h6">
              Let's personalize your learning experience
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Take a few minutes to set up your personalized study plan
          </Typography>
          
          <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
            By answering a few simple questions, we can create a customized learning experience
            that helps you achieve your goals faster and more effectively.
          </Typography>
          
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {[
              { 
                icon: <SchoolIcon fontSize="large" color="primary" />, 
                title: 'Personalized Study Plan', 
                description: 'Get a tailored study plan based on your exam preparation needs' 
              },
              { 
                icon: <AssessmentIcon fontSize="large" color="primary" />, 
                title: 'Customized Quizzes', 
                description: 'Receive quizzes that focus on your weak areas to improve faster' 
              },
              { 
                icon: <TimerIcon fontSize="large" color="primary" />, 
                title: 'Efficient Learning', 
                description: 'Save time by focusing on the topics that need the most attention' 
              },
              { 
                icon: <TrendingUpIcon fontSize="large" color="primary" />, 
                title: 'Track Your Progress', 
                description: 'Monitor your improvement over time with detailed analytics' 
              }
            ].map((benefit, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box>
                      {benefit.icon}
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {benefit.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {benefit.description}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button 
              variant="text" 
              color="primary" 
              onClick={handleSkip}
            >
              Skip for now
            </Button>
            
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={handleStart}
              endIcon={<ArrowForwardIcon />}
            >
              Get Started
            </Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default Welcome; 