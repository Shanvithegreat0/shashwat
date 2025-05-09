import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Stack,
  Button,
  Divider,
  useTheme,
  useMediaQuery,
  alpha,
  Card,
  CardContent
} from '@mui/material';
import {
  Psychology as PsychologyIcon,
  Analytics as AnalyticsIcon,
  Timer as TimerIcon,
  Assessment as AssessmentIcon,
  DataUsage as DataUsageIcon,
  School as SchoolIcon,
  Devices as DevicesIcon,
  Security as SecurityIcon,
  Subscriptions as SubscriptionsIcon,
  Cloud as CloudIcon,
  Equalizer as EqualizerIcon,
  LibraryBooks as LibraryBooksIcon,
  Rocket as RocketIcon,
  SmartToy as SmartToyIcon,
  BarChart as BarChartIcon,
  AccessTime as AccessTimeIcon,
  Assignment as AssignmentIcon,
  Speed as SpeedIcon,
  SystemUpdateAlt as SystemUpdateAltIcon,
  CompareArrows as CompareArrowsIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useColorMode } from '../../theme/ThemeContext';
import { keyframes } from '@mui/system';
import Logo from '../../components/Logo';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

// Feature icons with customized styles
const FeatureIcon = ({ icon, color, isDarkMode }) => {
  return (
    <Box 
      sx={{
        p: 2.5,
        bgcolor: isDarkMode ? alpha(color, 0.15) : alpha(color, 0.12),
        color: color,
        borderRadius: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: isDarkMode ? `0 0 20px ${alpha(color, 0.3)}` : `0 8px 16px ${alpha(color, 0.1)}`,
        animation: `${float} 3s ease-in-out infinite`,
        fontSize: 40,
        width: 70,
        height: 70,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: isDarkMode ? `0 0 25px ${alpha(color, 0.4)}` : `0 10px 20px ${alpha(color, 0.15)}`,
        }
      }}
    >
      {icon}
    </Box>
  );
};

// Icons and colors for features
const featureIcons = {
  ai: <SmartToyIcon sx={{ fontSize: 50, color: theme => theme.palette.custom.featureIcons.ai }} />,
  analytics: <BarChartIcon sx={{ fontSize: 50, color: theme => theme.palette.custom.featureIcons.analytics }} />,
  time: <AccessTimeIcon sx={{ fontSize: 50, color: theme => theme.palette.custom.featureIcons.time }} />,
  assessment: <AssignmentIcon sx={{ fontSize: 50, color: theme => theme.palette.custom.featureIcons.assessment }} />,
  performance: <SpeedIcon sx={{ fontSize: 50, color: theme => theme.palette.custom.featureIcons.performance }} />,
  expert: <SchoolIcon sx={{ fontSize: 50, color: theme => theme.palette.custom.featureIcons.expert }} />,
  device: <DevicesIcon sx={{ fontSize: 50, color: theme => theme.palette.custom.featureIcons.device }} />,
  security: <SecurityIcon sx={{ fontSize: 50, color: theme => theme.palette.custom.featureIcons.security }} />,
  updates: <SystemUpdateAltIcon sx={{ fontSize: 50, color: theme => theme.palette.custom.featureIcons.updates }} />,
  cloud: <CloudIcon sx={{ fontSize: 50, color: theme => theme.palette.custom.featureIcons.cloud }} />,
  comparative: <CompareArrowsIcon sx={{ fontSize: 50, color: theme => theme.palette.custom.featureIcons.comparative }} />,
  library: <LibraryBooksIcon sx={{ fontSize: 50, color: theme => theme.palette.custom.featureIcons.library }} />
};

const mainFeatures = [
  {
    icon: <PsychologyIcon fontSize="large" />,
    color: '#4285F4',
    title: 'AI-Driven Learning',
    description: 'Our advanced AI technology analyzes your performance patterns and learning style to create a personalized study experience tailored specifically to your needs.',
    detail: 'The system continually adapts as you progress, focusing more on areas where you need improvement and adjusting the difficulty level accordingly.'
  },
  {
    icon: <AnalyticsIcon fontSize="large" />,
    color: '#EA4335',
    title: 'Comprehensive Analytics',
    description: 'Get detailed insights into your performance with our advanced analytics dashboard that tracks your progress across subjects and topics.',
    detail: 'Visualize your strengths and weaknesses, monitor your improvement over time, and make data-driven decisions about your study focus.'
  },
  {
    icon: <TimerIcon fontSize="large" />,
    color: '#FBBC05',
    title: 'Smart Time Management',
    description: 'Optimize your study schedule with our intelligent time management system that helps you allocate your time effectively across different subjects.',
    detail: 'The system suggests optimal study durations based on your performance and learning patterns, helping you maximize productivity and retention.'
  },
  {
    icon: <AssessmentIcon fontSize="large" />,
    color: '#34A853',
    title: 'Adaptive Assessments',
    description: 'Experience dynamic quizzes and tests that adapt to your skill level, ensuring you\'re always challenged but not overwhelmed.',
    detail: 'Our question bank contains thousands of high-quality questions with detailed solutions, covering all aspects of your exam syllabus.'
  }
];

const additionalFeatures = [
  {
    icon: <DataUsageIcon />,
    color: '#4285F4',
    title: 'Performance Tracking',
    description: 'Track your progress across subjects and topics with detailed metrics and visualizations.'
  },
  {
    icon: <SchoolIcon />,
    color: '#8E44AD',
    title: 'Expert Content',
    description: 'Access curriculum-aligned content created by subject matter experts for accurate learning.'
  },
  {
    icon: <DevicesIcon />,
    color: '#1ABC9C',
    title: 'Multi-device Access',
    description: 'Seamlessly switch between devices with our responsive design that works on all platforms.'
  },
  {
    icon: <SecurityIcon />,
    color: '#E74C3C',
    title: 'Secure Platform',
    description: 'Your data is protected with enterprise-grade security and privacy controls.'
  },
  {
    icon: <SubscriptionsIcon />,
    color: '#F39C12',
    title: 'Regular Updates',
    description: 'Stay current with regular content updates that reflect the latest exam patterns.'
  },
  {
    icon: <CloudIcon />,
    color: '#3498DB',
    title: 'Cloud Sync',
    description: 'Your progress and settings are automatically synced across all your devices.'
  },
  {
    icon: <EqualizerIcon />,
    color: '#16A085',
    title: 'Comparative Analysis',
    description: 'Compare your performance with peers to understand where you stand in your preparation.'
  },
  {
    icon: <LibraryBooksIcon />,
    color: '#27AE60',
    title: 'Resource Library',
    description: 'Access a vast library of study materials, reference guides, and practice papers.'
  }
];

const FeaturesPage = () => {
  const theme = useTheme();
  const { mode } = useColorMode();
  const isDarkMode = mode === 'dark';
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ overflowX: 'hidden' }}>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'background.default',
          pt: { xs: 12, md: 16 },
          pb: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
          '&::after': isDarkMode ? {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at top right, rgba(25, 118, 210, 0.08), transparent 70%)',
            zIndex: 0
          } : {},
          animation: `${fadeIn} 0.8s ease-out`
        }}
      >
        {/* Decorative elements */}
        <Box 
          sx={{ 
            position: 'absolute',
            top: -150,
            right: -150,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 70%)`,
            zIndex: 0,
            animation: `${float} 15s infinite ease-in-out`
          }} 
        />
        <Box 
          sx={{ 
            position: 'absolute',
            bottom: -100,
            left: -100,
            width: 250,
            height: 250,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 70%)`,
            zIndex: 0,
            animation: `${float} 18s infinite ease-in-out reverse`
          }} 
        />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center" justifyContent="center">
            <Grid item xs={12} md={10} textAlign="center" sx={{ animation: `${fadeIn} 0.8s ease-out` }}>
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '2.5rem', sm: '3rem', md: '3.75rem' },
                  mb: 3,
                  background: isDarkMode 
                    ? theme.palette.custom.gradients.primaryLight
                    : theme.palette.custom.gradients.primaryDark,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  letterSpacing: '-0.02em'
                }}
              >
                Powerful Features for Smart Learning
              </Typography>
              <Typography
                variant="h5"
                sx={{ 
                  mb: 5, 
                  fontWeight: 400,
                  opacity: 0.9,
                  color: 'text.secondary',
                  maxWidth: 800,
                  mx: 'auto'
                }}
              >
                Join thousands of students who are already benefiting from AI Tutor's innovative tools and technology.
              </Typography>
              
              <Box sx={{ mt: 4, mb: 6 }}>
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  size="large"
                  sx={{ 
                    py: 1.5, 
                    px: 4, 
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    borderRadius: 2,
                    transition: 'all 0.25s ease',
                    boxShadow: theme.palette.custom.shadows.small,
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.palette.custom.shadows.cardHover,
                    }
                  }}
                >
                  Start Free Trial
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Main Features Section */}
      <Box 
        sx={{ 
          py: { xs: 8, md: 12 },
          background: isDarkMode 
            ? theme.palette.custom.gradients.darkBg
            : theme.palette.custom.gradients.lightBg,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', mb: 8, animation: `${fadeIn} 0.8s both` }}>
            <Typography 
              variant="h2" 
              component="h2" 
              sx={{ 
                fontWeight: 700, 
                mb: 2,
                background: isDarkMode 
                  ? theme.palette.custom.gradients.primaryLight
                  : theme.palette.custom.gradients.primaryDark,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Core Features
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                maxWidth: 700, 
                mx: 'auto',
                color: isDarkMode ? 'text.secondary' : 'text.secondary',
                mb: 1
              }}
            >
              Our platform's powerful capabilities designed to enhance your learning
            </Typography>
          </Box>
          
          {mainFeatures.map((feature, index) => (
            <Box 
              key={index}
              sx={{
                mb: 8,
                '&:last-child': { mb: 0 },
                animation: `${fadeIn} 0.8s ${0.1 * (index + 1)}s both`
              }}
            >
              <Paper
                elevation={isDarkMode ? 0 : 2}
                sx={{
                  borderRadius: 4,
                  overflow: 'hidden',
                  border: isDarkMode ? `1px solid ${alpha(theme.palette.primary.main, 0.2)}` : 'none',
                  background: isDarkMode ? alpha('#132F4C', 0.6) : 'white',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: isDarkMode 
                      ? `0 12px 30px ${alpha('#000', 0.3)}` 
                      : '0 15px 35px rgba(0,0,0,0.1)',
                  }
                }}
              >
                <Grid container>
                  <Grid 
                    item 
                    xs={12} 
                    md={4} 
                    sx={{ 
                      p: 4, 
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      background: isDarkMode 
                        ? 'linear-gradient(135deg, #132F4C 0%, #0A1929 100%)'
                        : 'linear-gradient(135deg, #4285F4 0%, #1565C0 100%)',
                      textAlign: 'center',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <Box 
                      sx={{
                        position: 'absolute',
                        top: -50,
                        right: -50,
                        width: 200,
                        height: 200,
                        borderRadius: '50%',
                        bgcolor: alpha('#ffffff', 0.05),
                        animation: `${float} 20s infinite ease-in-out`,
                      }}
                    />
                    <FeatureIcon 
                      icon={feature.icon} 
                      color={isDarkMode ? alpha(feature.color, 0.9) : feature.color} 
                      isDarkMode={isDarkMode} 
                    />
                    <Typography 
                      variant="h4" 
                      component="h3" 
                      sx={{ 
                        mt: 3, 
                        fontWeight: 700, 
                        color: 'white',
                        textShadow: '0 2px 10px rgba(0,0,0,0.1)'
                      }}
                    >
                      {feature.title}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Box sx={{ p: 4 }}>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          mb: 2, 
                          fontSize: '1.1rem',
                          fontWeight: 500,
                          lineHeight: 1.6
                        }}
                      >
                        {feature.description}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ lineHeight: 1.6 }}
                      >
                        {feature.detail}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Box>
          ))}
        </Container>
      </Box>

      {/* Additional Features Section */}
      <Box sx={{ py: 10, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8, animation: `${fadeIn} 0.8s both` }}>
            <Typography 
              variant="h2" 
              component="h2" 
              sx={{ 
                fontWeight: 700, 
                mb: 2,
                background: isDarkMode 
                  ? theme.palette.custom.gradients.primaryLight
                  : theme.palette.custom.gradients.primaryDark,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Additional Features
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
              More tools and capabilities to enhance your learning experience
            </Typography>
          </Box>
          
          <Grid container spacing={3}>
            {additionalFeatures.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index} sx={{ animation: `${fadeIn} 0.8s ${0.05 * (index + 1)}s both` }}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    borderRadius: 3,
                    boxShadow: isDarkMode ? theme.palette.custom.shadows.darkSmall : theme.palette.custom.shadows.small,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: isDarkMode ? theme.palette.custom.shadows.darkMedium : theme.palette.custom.shadows.large,
                    },
                    border: isDarkMode ? `1px solid ${alpha(theme.palette.primary.main, 0.2)}` : 'none'
                  }}
                >
                  <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box 
                      sx={{ 
                        mb: 2.5,
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <Box
                        sx={{
                          bgcolor: alpha(feature.color, isDarkMode ? 0.15 : 0.1),
                          color: feature.color,
                          p: 1.5,
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'transform 0.2s ease',
                          mr: 2,
                          '&:hover': {
                            transform: 'rotate(5deg) scale(1.05)',
                          }
                        }}
                      >
                        {featureIcons[feature.title.toLowerCase()]}
                      </Box>
                      <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                        {feature.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 'auto' }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      
      {/* Learning Experience Section */}
      <Box 
        sx={{ 
          py: 10, 
          position: 'relative',
          overflow: 'hidden',
          bgcolor: 'background.default',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6} sx={{ animation: `${fadeIn} 0.8s both` }}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                alt="Student studying with AI Tutor"
                sx={{
                  width: '100%',
                  borderRadius: 4,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ animation: `${fadeIn} 0.8s 0.2s both` }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  background: isDarkMode 
                    ? theme.palette.custom.gradients.primaryLight
                    : theme.palette.custom.gradients.primaryDark,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                Enhanced Learning Experience
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                Our platform is designed to make your study time more effective and engaging.
              </Typography>
              
              {[
                {
                  title: 'Interactive Learning',
                  description: 'Engage with content through quizzes, flashcards, and interactive exercises that make learning more effective.'
                },
                {
                  title: 'Immediate Feedback',
                  description: 'Receive instant feedback on your answers with detailed explanations to help you understand concepts better.'
                },
                {
                  title: 'Customized Experience',
                  description: 'The platform adapts to your learning pace and style, ensuring you get the most out of your study time.'
                }
              ].map((item, index) => (
                <Box key={index} sx={{ mb: 3, animation: `${fadeIn} 0.8s ${0.3 + (0.1 * index)}s both` }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {item.description}
                  </Typography>
                </Box>
              ))}
              
              <Box sx={{ mt: 4 }}>
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  size="large"
                  sx={{ 
                    py: 1.5, 
                    px: 4, 
                    fontWeight: 600,
                    fontSize: '1rem',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                    }
                  }}
                >
                  Get Started Now
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* CTA Section */}
      <Box 
        sx={{ 
          py: 12, 
          bgcolor: isDarkMode ? theme.palette.custom.backgrounds.darkBlue : theme.palette.custom.backgrounds.lightBlue,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="md">
          <Box 
            sx={{ 
              textAlign: 'center', 
              p: { xs: 4, md: 8 }, 
              borderRadius: 4,
              bgcolor: 'background.paper',
              boxShadow: theme.palette.custom.shadows.xlarge,
              position: 'relative',
              zIndex: 1,
              animation: `${fadeIn} 0.8s both`
            }}
          >
            <Typography 
              variant="h3" 
              component="h2" 
              sx={{ 
                fontWeight: 700, 
                mb: 3,
                background: isDarkMode 
                  ? theme.palette.custom.gradients.primaryLight
                  : theme.palette.custom.gradients.primaryDark,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Ready to Transform Your Learning?
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 700, mx: 'auto' }}>
              Join thousands of students who are already achieving academic success with AI Tutor.
            </Typography>
            
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={3} 
              justifyContent="center"
              sx={{ animation: `${fadeIn} 0.8s 0.2s both` }}
            >
              <Button
                component={Link}
                to="/register"
                variant="contained"
                size="large"
                sx={{ 
                  py: 1.5, 
                  px: 4, 
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  boxShadow: theme.palette.custom.shadows.xlarge,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: theme.palette.custom.shadows.cardHover,
                  }
                }}
              >
                Start Free Trial
              </Button>
              <Button
                component={Link}
                to="/pricing"
                variant="outlined"
                size="large"
                sx={{ 
                  py: 1.5, 
                  px: 4, 
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                  }
                }}
              >
                View Pricing
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default FeaturesPage; 