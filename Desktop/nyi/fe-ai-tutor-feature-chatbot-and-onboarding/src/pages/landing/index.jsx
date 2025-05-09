import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Stack,
  Paper,
  Divider,
  useTheme,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  IconButton,
  AppBar,
  Toolbar,
  styled
} from '@mui/material';
import {
  School as SchoolIcon,
  Analytics as AnalyticsIcon,
  Psychology as PsychologyIcon,
  Speed as SpeedIcon,
  Lightbulb as LightbulbIcon,
  RecordVoiceOver as RecordVoiceOverIcon,
  Diversity3 as Diversity3Icon,
  StarBorder as StarBorderIcon,
  Timer as TimerIcon,
  AutoGraph as AutoGraphIcon,
  Group as GroupIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowForward as ArrowForwardIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  PlayArrow as PlayArrowIcon,
  QuestionAnswer as QuestionAnswerIcon,
  EmojiEvents as EmojiEventsIcon,
  TrendingUp as TrendingUpIcon,
  AutoAwesome as AutoAwesomeIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import heroBackground from '../../../public/assets/icons/full_logo.png';

// Styled components
const SearchButton = styled(Button)({
  backgroundColor: '#012a4a',
  color: 'white',
  padding: '12px 32px',
  borderRadius: '30px',
  '&:hover': {
    backgroundColor: '#023e8a',
  },
});

const TopBanner = styled(Box)({
  backgroundColor: '#012a4a',
  color: '#f8f9fa',
  padding: '4px',
  textAlign: 'center',
  fontSize: '0.875rem',
  letterSpacing: '0.5px',
  fontWeight: '500'
});

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'JEE Advanced, Rank 45',
    content: 'AI Tutor helped me focus on my weak areas in Physics and Math. The personalized study plans were crucial in my JEE preparation.',
    avatar: '/avatars/avatar1.jpg'
  },
  {
    name: 'Rahul Gupta',
    role: 'NEET, 99.6 percentile',
    content: 'The subject-specific questions and detailed explanations helped me master difficult Biology concepts. I couldn\'t have done it without AI Tutor.',
    avatar: '/avatars/avatar2.jpg'
  },
  {
    name: 'Anjali Patel',
    role: 'GATE CSE, AIR 12',
    content: 'The analytics dashboard gave me insights into my progress and helped me manage my time efficiently. Excellent platform for serious exam preparation.',
    avatar: '/avatars/avatar3.jpg'
  }
];

const LandingPage = () => {
  const theme = useTheme();

  const scrollToFeatures = () => {
    const featuresHeading = document.querySelector('[data-scroll-target="why-choose"]');
    if (featuresHeading) {
      const offset = 80; // Offset to account for any fixed headers
      const elementPosition = featuresHeading.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const journeySteps = [
    {
      number: '1',
      title: 'Select your target exam',
      color: theme.palette.info.light
    },
    {
      number: '2',
      title: 'Get personalized study plan',
      color: theme.palette.secondary.light
    },
    {
      number: '3',
      title: 'Track your progress',
      color: theme.palette.success.light
    },
    {
      number: '4',
      title: 'Achieve your dreams',
      color: theme.palette.warning.light
    },
  ];

  const features = [
    {
      icon: <SchoolIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Exam-Specific Preparation',
      description: 'Targeted practice tests and study materials designed specifically for the JEE exam format and syllabus.'
    },
    {
      icon: <PsychologyIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'AI-Powered Tutoring',
      description: 'Get detailed explanations and personalized feedback on your answers through advanced AI technology.'
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Performance Analytics',
      description: 'Track your progress with detailed analytics to identify strengths and areas for improvement.'
    },
    {
      icon: <AutoAwesomeIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Adaptive Learning',
      description: 'Our system adapts to your performance, focusing more on topics where you need additional practice.'
    }
  ];

  return (
    <Box sx={{ bgcolor: theme.palette.mode === 'dark' ? '#0a1929' : theme.palette.background.default, overflowX: 'hidden' }}>
      {/* Hero Section */}
      <Box 
        sx={{ 
          backgroundImage: theme.palette.mode === 'dark' 
            ? 'linear-gradient(180deg, #1a237e 0%, #0d47a1 100%)' 
            : 'linear-gradient(180deg, #f8f9fa 0%, #e8eaf6 100%)',
          pt: { xs: 10, md: 12 },
          pb: { xs: 12, md: 16 },
          position: 'relative'
        }}
      >
        {/* Decorative shapes */}
        <Box 
          sx={{ 
            position: 'absolute',
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, rgba(66, 133, 244, 0.15) 0%, rgba(66, 133, 244, 0.08) 100%)'
              : 'linear-gradient(135deg, rgba(66, 133, 244, 0.1) 0%, rgba(66, 133, 244, 0.05) 100%)',
            top: '10%',
            right: '-150px',
            zIndex: 0
          }} 
        />
        <Box 
          sx={{ 
            position: 'absolute',
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, rgba(219, 68, 55, 0.15) 0%, rgba(219, 68, 55, 0.08) 100%)'
              : 'linear-gradient(135deg, rgba(219, 68, 55, 0.1) 0%, rgba(219, 68, 55, 0.05) 100%)',
            bottom: '5%',
            left: '-100px',
            zIndex: 0
          }} 
        />

        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6} sx={{ zIndex: 1 }}>
              <Typography 
                variant="h1" 
                sx={{ 
                  fontWeight: 800,
                  fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                  lineHeight: 1.2,
                  mb: 2,
                  color: theme.palette.mode === 'dark' ? '#fff' : '#0d47a1',
                  textShadow: theme.palette.mode === 'dark' ? '0px 1px 3px rgba(0,0,0,0.2)' : 'none'
                }}
              >
                Master Your Exams With AI-Powered Tutoring
              </Typography>
              
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  mb: 4,
                  color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.8)' : theme.palette.text.secondary,
                  maxWidth: '90%'
                }}
              >
                Personalized learning experience that adapts to your needs and helps you achieve your academic goals.
              </Typography>
              
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ 
                    py: 1.5,
                    px: 3,
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderRadius: 2,
                    boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)',
                    bgcolor: theme.palette.mode === 'dark' ? '#4285f4' : undefined,
                    '&:hover': {
                      bgcolor: theme.palette.mode === 'dark' ? '#5c9eff' : undefined,
                    }
                  }}
                >
                  Get Started Free
                </Button>
                <Button
                  component={Link}
                  to="/features"
                  variant="outlined"
                  size="large"
                  sx={{ 
                    py: 1.5,
                    px: 3,
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderRadius: 2,
                    color: theme.palette.mode === 'dark' ? '#fff' : theme.palette.primary.main,
                    borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.5)' : theme.palette.primary.main,
                    '&:hover': {
                      borderColor: theme.palette.mode === 'dark' ? '#fff' : undefined,
                      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : undefined
                    }
                  }}
                >
                  Learn More
                </Button>
              </Stack>
            </Grid>
            
            <Grid item xs={12} md={6} sx={{ zIndex: 1 }}>
              <Card
                elevation={4}
                sx={{
                  borderRadius: 4,
                  overflow: 'hidden',
                  background: theme.palette.mode === 'dark' ? '#0d2c54' : '#fff',
                  border: theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.1)' : 'none',
                  boxShadow: theme.palette.mode === 'dark' 
                    ? '0 8px 20px rgba(0,0,0,0.4)' 
                    : '0 8px 20px rgba(0,0,0,0.09)'
                }}
              >
                <Box
                  sx={{
                    p: 3,
                    background: theme.palette.mode === 'dark' 
                      ? 'linear-gradient(90deg, #1a73e8 0%, #4285f4 100%)' 
                      : 'linear-gradient(90deg, #1a73e8 0%, #4285f4 100%)',
                    color: 'white',
                  }}
                >
                  <Typography variant="h6" fontWeight={600}>
                    Start your journey today
                  </Typography>
                </Box>
                
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    {journeySteps.map((step, index) => (
                      <Stack key={index} direction="row" spacing={2} alignItems="center">
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 2,
                            bgcolor: step.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold',
                          }}
                        >
                          {step.number}
                        </Box>
                        <Typography 
                          variant="body1" 
                          fontWeight={500}
                          sx={{ 
                            color: theme.palette.mode === 'dark' ? '#fff' : 'inherit'
                          }}
                        >
                          {step.title}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h2"
          align="center"
          sx={{
            fontWeight: 700,
            mb: 6,
            color: theme.palette.mode === 'dark' ? '#fff' : 'inherit'
          }}
        >
          Why Choose AI<Box component="span" sx={{ color: '#4285f4', fontWeight: 700 }}>Tutor</Box>
        </Typography>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  borderRadius: 3,
                  p: 2,
                  transition: 'all 0.3s ease',
                  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : theme.palette.divider}`,
                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(13,41,84,0.5)' : 'transparent',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: theme.palette.mode === 'dark' 
                      ? '0 10px 25px rgba(0,0,0,0.3)' 
                      : '0 10px 25px rgba(0,0,0,0.08)',
                  }
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      mb: 1, 
                      fontWeight: 600,
                      color: theme.palette.mode === 'dark' ? '#fff' : 'inherit'
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.7)' : theme.palette.text.secondary 
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          bgcolor: theme.palette.mode === 'dark' 
            ? 'rgba(26, 115, 232, 0.15)' 
            : '#f0f5ff',
          py: 8,
          borderTop: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : theme.palette.divider}`,
          borderBottom: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : theme.palette.divider}`,
        }}
      >
        <Container maxWidth="md">
          <Box textAlign="center">
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 3,
                color: theme.palette.mode === 'dark' ? '#fff' : 'inherit'
              }}
            >
              Ready to Excel in Your Exams?
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 4,
                maxWidth: 600,
                mx: 'auto',
                color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.7)' : theme.palette.text.secondary
              }}
            >
              Join thousands of students who have improved their scores with our AI-powered tutoring platform.
            </Typography>
            <Button
              component={Link}
              to="/register"
              variant="contained"
              size="large"
              sx={{
                py: 1.5,
                px: 4,
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: 2,
                bgcolor: theme.palette.mode === 'dark' ? '#4285f4' : undefined,
                '&:hover': {
                  bgcolor: theme.palette.mode === 'dark' ? '#5c9eff' : undefined,
                }
              }}
            >
              Sign Up Now
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage; 