import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Stack,
  Paper,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import {
  School as SchoolIcon,
  Psychology as PsychologyIcon,
  TrendingUp as TrendingUpIcon,
  StarRate as StarRateIcon,
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import Footer from '../../components/Footer';
import { keyframes } from '@mui/system';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

// Testimonial data
const testimonials = [
  {
    name: 'Alex Johnson',
    role: 'Medical Student',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    content: 'AI Tutor completely transformed my MCAT preparation. The personalized study plan identified my weak areas and helped me improve my score by 15 points!',
    rating: 5
  },
  {
    name: 'Sophia Williams',
    role: 'Law Student',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    content: "Preparing for the bar exam was overwhelming until I found AI Tutor. The platform's adaptive quizzes and detailed explanations made complex concepts much clearer.",
    rating: 5
  },
  {
    name: 'Marcus Chen',
    role: 'Undergraduate Student',
    image: 'https://randomuser.me/api/portraits/men/67.jpg',
    content: "The AI-generated practice questions are incredibly relevant. It's like having a tutor who knows exactly what I need to work on to improve.",
    rating: 4
  }
];

const features = [
  {
    icon: <PsychologyIcon sx={{ fontSize: 40 }} />,
    title: 'AI-Powered Learning',
    description: 'Our intelligent algorithms adapt to your learning style and performance, creating a personalized study experience.'
  },
  {
    icon: <SchoolIcon sx={{ fontSize: 40 }} />,
    title: 'Exam-Focused Content',
    description: 'Comprehensive question banks and study materials tailored specifically to your target exam.'
  },
  {
    icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
    title: 'Progress Tracking',
    description: 'Detailed analytics and insights to monitor your improvement and focus your study time effectively.'
  }
];

const LandingPage = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box 
        sx={{
          pt: { xs: 10, md: 16 },
          pb: { xs: 12, md: 20 },
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
          color: 'white',
        }}
      >
        {/* Abstract background shapes */}
        <Box sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 500,
          height: 500,
          borderRadius: '50%',
          bgcolor: alpha('#ffffff', 0.05),
          zIndex: 0,
          animation: `${float} 15s infinite ease-in-out`
        }} />
        <Box sx={{
          position: 'absolute',
          bottom: -150,
          left: -150,
          width: 400,
          height: 400,
          borderRadius: '50%',
          bgcolor: alpha('#ffffff', 0.05),
          zIndex: 0,
          animation: `${float} 18s infinite ease-in-out reverse`
        }} />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={7} sx={{ animation: `${fadeIn} 0.8s ease-out` }}>
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 800,
                  mb: 3,
                  fontSize: { xs: '2.5rem', sm: '3rem', md: '3.75rem' },
                  textShadow: '0 4px 8px rgba(0,0,0,0.15)',
                  letterSpacing: '-0.02em'
                }}
              >
                Innovative AI Solutions for a Smarter World
              </Typography>
              <Typography
                variant="h5"
                sx={{ 
                  mb: 4, 
                  fontWeight: 400,
                  opacity: 0.95,
                  lineHeight: 1.6,
                  maxWidth: '90%'
                }}
              >
                Our mission is to harness the power of AI to solve real-world problems and create a better future for all. Experience personalized learning with our cutting-edge AI tutoring platform.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  size="large"
                  sx={{ 
                    py: 1.5, 
                    px: 4, 
                    bgcolor: 'white', 
                    color: 'primary.main',
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.common.white, 0.9),
                      transform: 'translateY(-3px)',
                      boxShadow: '0 6px 16px rgba(0,0,0,0.18)',
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
                  endIcon={<ArrowForwardIcon />}
                  sx={{ 
                    py: 1.5, 
                    px: 4, 
                    borderColor: 'white', 
                    color: 'white',
                    borderWidth: 2,
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: alpha(theme.palette.common.white, 0.1),
                      transform: 'translateY(-3px)',
                    }
                  }}
                >
                  Learn More
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={5} sx={{ animation: `${fadeIn} 0.8s 0.2s both` }}>
              <Box
                component="img"
                src="https://img.freepik.com/free-vector/cute-robot-waving-hand-cartoon-vector-icon-illustration-science-technology-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-3669.jpg"
                alt="Friendly AI robot assistant"
                sx={{
                  width: '100%',
                  borderRadius: 4,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                  transform: { xs: 'scale(1)', md: 'scale(1.1)' },
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: { xs: 'scale(1.02)', md: 'scale(1.13)' },
                  }
                }}
              />
            </Grid>
          </Grid>
          
          {/* Stats section */}
          <Box sx={{ mt: { xs: 8, md: 12 }, animation: `${fadeIn} 0.8s 0.4s both` }}>
            <Grid container spacing={4} justifyContent="center">
              {[
                { number: '250,000+', label: 'Active Users' },
                { number: '95%', label: 'Problem-Solving Accuracy' },
                { number: '100+', label: 'AI Solutions Deployed' }
              ].map((stat, index) => (
                <Grid item xs={12} sm={4} key={index}>
                  <Paper 
                    sx={{ 
                      p: 3, 
                      textAlign: 'center', 
                      bgcolor: alpha(theme.palette.common.white, 0.1),
                      backdropFilter: 'blur(8px)',
                      borderRadius: 3,
                      boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                      border: '1px solid',
                      borderColor: alpha(theme.palette.common.white, 0.1),
                      transition: 'transform 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                      }
                    }}
                  >
                    <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                      {stat.number}
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9 }}>
                      {stat.label}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>
      
      {/* How It Works Section */}
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
                  ? 'linear-gradient(90deg, #80b4ff 0%, #4285F4 100%)'
                  : 'linear-gradient(90deg, #1565C0 0%, #4285F4 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              AI-Powered Learning Solutions
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
              Our intelligent platform transforms education through advanced AI technologies
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {[
              {
                title: 'Assess Your Level',
                description: 'Take a diagnostic assessment to identify your strengths and weaknesses in each subject area.',
                icon: '1',
                image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
              },
              {
                title: 'Get Personalized Plan',
                description: 'Receive a custom study plan that focuses on your areas for improvement and matches your schedule.',
                icon: '2',
                image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
              },
              {
                title: 'Practice Effectively',
                description: 'Work through adaptive questions and lessons that adjust to your performance in real-time.',
                icon: '3',
                image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
              },
              {
                title: 'Track Your Progress',
                description: 'Monitor your improvement with detailed analytics and adjust your study strategy accordingly.',
                icon: '4',
                image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
              }
            ].map((step, index) => (
              <Grid item xs={12} md={6} key={index} sx={{ animation: `${fadeIn} 0.8s ${0.1 * (index + 1)}s both` }}>
                <Card sx={{ 
                    height: '100%', 
                  borderRadius: 4,
                    overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.15)',
                    }
                }}>
                  <Grid container>
                    <Grid item xs={12} md={5}>
                  <Box 
                    sx={{ 
                      position: 'relative',
                          height: { xs: 200, md: '100%' }, 
                          overflow: 'hidden',
                          bgcolor: theme.palette.primary.main
                    }}
                  >
                    <Box
                      component="img"
                      src={step.image}
                      alt={step.title}
                      sx={{
                        width: '100%',
                        height: '100%',
                            objectFit: 'cover',
                            opacity: 0.85,
                            transition: 'transform 0.5s ease',
                            '&:hover': {
                              transform: 'scale(1.05)',
                            }
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 16,
                        left: 16,
                            width: 40,
                            height: 40,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                            fontSize: 20,
                            fontWeight: 'bold',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                            border: '2px solid white',
                      }}
                    >
                      {step.icon}
                    </Box>
                  </Box>
                    </Grid>
                    <Grid item xs={12} md={7}>
                      <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Typography variant="h5" component="h3" sx={{ fontWeight: 700, mb: 2 }}>
                      {step.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {step.description}
                    </Typography>
                  </CardContent>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      
      {/* Features Section */}
      <Box 
        sx={{ 
          py: 10, 
          position: 'relative',
          overflow: 'hidden',
          background: isDarkMode 
            ? 'linear-gradient(135deg, #0A1929 0%, #132F4C 100%)' 
            : 'linear-gradient(135deg, #F0F7FF 0%, #DCEEFB 100%)',
        }}
      >
        {/* Decorative elements */}
        <Box sx={{
          position: 'absolute',
          top: -100,
          left: -100,
          width: 300,
          height: 300,
          borderRadius: '50%',
          bgcolor: alpha(theme.palette.primary.main, 0.05),
          zIndex: 0,
          animation: `${float} 20s infinite ease-in-out`
        }} />
        <Box sx={{
          position: 'absolute',
          bottom: -150,
          right: -100,
          width: 350,
          height: 350,
          borderRadius: '50%',
          bgcolor: alpha(theme.palette.primary.main, 0.05),
          zIndex: 0,
          animation: `${float} 25s infinite ease-in-out reverse`
        }} />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', mb: 8, animation: `${fadeIn} 0.8s both` }}>
                <Typography
              variant="h2" 
                  component="h2"
              sx={{ 
                fontWeight: 700, 
                mb: 2,
                color: isDarkMode ? 'white' : 'text.primary'
              }}
                >
              Key Features
                </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                maxWidth: 700, 
                mx: 'auto',
                color: isDarkMode ? 'text.secondary' : 'text.secondary'
              }}
            >
              Powerful tools designed to enhance your learning experience
                        </Typography>
                      </Box>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index} sx={{ animation: `${fadeIn} 0.8s ${0.1 * (index + 1)}s both` }}>
                <Card 
                  sx={{ 
                    p: 4, 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    borderRadius: 4,
                    boxShadow: isDarkMode ? '0 8px 32px rgba(0,0,0,0.2)' : '0 8px 32px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: isDarkMode ? '0 12px 40px rgba(0,0,0,0.25)' : '0 12px 40px rgba(0,0,0,0.15)',
                    },
                    border: isDarkMode ? `1px solid ${alpha(theme.palette.primary.main, 0.2)}` : 'none'
                  }}
                >
                  <Box 
                sx={{
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                      p: 2, 
                      borderRadius: 3,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3,
                      width: 80,
                      height: 80,
                      transition: 'transform 0.2s ease',
                      '&:hover': {
                        transform: 'rotate(5deg) scale(1.05)',
                      }
                    }}
                  >
                    {React.cloneElement(feature.icon, { fontSize: 'large' })}
                  </Box>
                  <Typography variant="h5" component="h3" sx={{ mb: 2, fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Card>
            </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      
      {/* Testimonials Section */}
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
                  ? 'linear-gradient(90deg, #80b4ff 0%, #4285F4 100%)'
                  : 'linear-gradient(90deg, #1565C0 0%, #4285F4 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Student Success Stories
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
              Hear from students who have transformed their learning with AI Tutor
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index} sx={{ animation: `${fadeIn} 0.8s ${0.1 * (index + 1)}s both` }}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    borderRadius: 4,
                    overflow: 'hidden',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
                    }
                  }}
                >
                  <Box 
                    sx={{ 
                      p: 3, 
                      background: isDarkMode 
                        ? 'linear-gradient(135deg, #132F4C 0%, #0A1929 100%)' 
                        : 'linear-gradient(135deg, #4285F4 0%, #1565C0 100%)',
                      color: 'white'
                    }}
                  >
                    <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                      {[...Array(5)].map((_, i) => (
                        <StarRateIcon 
                          key={i} 
                          sx={{ 
                            color: i < testimonial.rating ? '#FBBC05' : 'rgba(255,255,255,0.3)',
                            fontSize: 20
                          }} 
                        />
                      ))}
                    </Stack>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontStyle: 'italic',
                        opacity: 0.95,
                        lineHeight: 1.6
                      }}
                    >
                      "{testimonial.content}"
                    </Typography>
                  </Box>
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        src={testimonial.image}
                        alt={testimonial.name}
                        sx={{ width: 60, height: 60 }}
                      />
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      
      {/* CTA Section */}
      <Box 
                  sx={{ 
          py: 12, 
          bgcolor: isDarkMode ? '#0A1929' : '#F0F7FF',
                    position: 'relative',
                    overflow: 'hidden',
          animation: `${fadeIn} 0.8s both`
        }}
      >
        {/* Decorative elements */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: { xs: 150, md: 300 },
          height: { xs: 150, md: 300 },
          opacity: 0.1,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${isDarkMode ? 'ffffff' : '4285F4'}' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        
        <Container maxWidth="md">
                    <Box
                      sx={{
                        textAlign: 'center',
              p: { xs: 4, md: 8 }, 
              borderRadius: 4,
              bgcolor: 'background.paper',
              boxShadow: '0 15px 50px rgba(0,0,0,0.1)',
              position: 'relative',
                        zIndex: 1
                      }}
                    >
            <Typography 
              variant="h3" 
              component="h2" 
                      sx={{ 
                fontWeight: 700, 
                mb: 3,
                background: isDarkMode 
                  ? 'linear-gradient(90deg, #80b4ff 0%, #4285F4 100%)'
                  : 'linear-gradient(90deg, #1565C0 0%, #4285F4 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Ready to Start Your Learning Journey?
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 700, mx: 'auto' }}>
              Join thousands of students who are already achieving academic success with AI Tutor.
            </Typography>
            
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={3} 
              justifyContent="center"
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
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  transition: 'all 0.2s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 6px 16px rgba(0,0,0,0.18)',
                }
              }}
            >
              Get Started Free
            </Button>
              <Button
                component={Link}
                to="/contact-sales"
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
                Contact Sales
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>
      
      <Footer />
    </Box>
  );
};

export default LandingPage; 