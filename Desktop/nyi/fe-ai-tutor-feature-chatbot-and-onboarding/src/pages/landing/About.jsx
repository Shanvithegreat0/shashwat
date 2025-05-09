import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Avatar,
  Card,
  CardContent,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  alpha
} from '@mui/material';
import { School, Star, Group, Timeline, Check } from '@mui/icons-material';
import { Link } from 'react-router-dom';
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

// Team members data
const teamMembers = [
  {
    name: 'Dr. Sarah Johnson',
    role: 'Founder & CEO',
    bio: 'Former education technology researcher with over 15 years of experience in AI-driven educational tools.',
    image: 'https://randomuser.me/api/portraits/women/32.jpg'
  },
  {
    name: 'Michael Chen',
    role: 'Chief Technology Officer',
    bio: 'AI specialist with background in machine learning and educational technology from Stanford University.',
    image: 'https://randomuser.me/api/portraits/men/26.jpg'
  },
  {
    name: 'Priya Patel',
    role: 'Head of Curriculum',
    bio: 'Education expert with experience designing learning programs for top educational institutions worldwide.',
    image: 'https://randomuser.me/api/portraits/women/65.jpg'
  },
  {
    name: 'James Wilson',
    role: 'Head of Product',
    bio: 'Product leader with experience at leading EdTech companies focusing on personalized learning solutions.',
    image: 'https://randomuser.me/api/portraits/men/42.jpg'
  }
];

// Our values data
const ourValues = [
  {
    title: 'Student-Centered Learning',
    description: "We believe that education should be tailored to each student's unique needs, learning style, and pace.",
    icon: <School color="primary" sx={{ fontSize: 40 }} />
  },
  {
    title: 'Educational Excellence',
    description: 'We maintain the highest standards in our content, technology, and methodology to ensure quality learning experiences.',
    icon: <Star color="primary" sx={{ fontSize: 40 }} />
  },
  {
    title: 'Inclusive and Accessible',
    description: 'We strive to make quality education accessible to all students regardless of background or circumstance.',
    icon: <Group color="primary" sx={{ fontSize: 40 }} />
  },
  {
    title: 'Continuous Improvement',
    description: 'We constantly evolve our platform based on research, feedback, and technological advancements.',
    icon: <Timeline color="primary" sx={{ fontSize: 40 }} />
  }
];

// Milestones data
const milestones = [
  {
    year: '2019',
    title: 'Company Founded',
    description: 'AI Tutor was established with a mission to revolutionize personalized learning.'
  },
  {
    year: '2020',
    title: 'First Version Launch',
    description: 'Released our first beta version with basic quiz functionality and personalized feedback.'
  },
  {
    year: '2021',
    title: 'AI Technology Implementation',
    description: 'Integrated advanced AI algorithms to provide personalized study plans and recommendations.'
  },
  {
    year: '2022',
    title: 'Major Platform Expansion',
    description: 'Added support for multiple exam types and subject areas, significantly growing our user base.'
  },
  {
    year: '2023',
    title: 'Global Reach',
    description: 'Expanded internationally, now helping students in over 50 countries prepare for exams.'
  }
];

const AboutPage = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Box>
      
      {/* Hero Section */}
      <Box 
        sx={{ 
          pt: { xs: 10, md: 16 }, 
          pb: { xs: 8, md: 12 }, 
          bgcolor: 'background.default',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Decorative elements */}
        <Box 
          sx={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 70%)`,
            animation: `${float} 15s infinite ease-in-out`
          }}
        />
        
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6} sx={{ animation: `${fadeIn} 0.8s ease-out` }}>
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 800,
                  mb: 3,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  background: isDarkMode 
                    ? theme.palette.custom.gradients.primaryLight
                    : theme.palette.custom.gradients.primaryDark,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  letterSpacing: '-0.02em'
                }}
              >
                Our Mission & Story
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                At AI Tutor, we're transforming education through personalized learning experiences powered by artificial intelligence.
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7 }}>
                Founded in 2019, our team of educators and AI specialists came together with a shared vision: to create an educational platform that adapts to each student's unique learning needs and helps them achieve their academic goals.
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                Today, we're proud to serve students worldwide, helping them master subjects, prepare for exams, and build confidence in their academic abilities through our intelligent tutoring system.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} sx={{ animation: `${fadeIn} 0.8s 0.2s both` }}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80"
                alt="Team working together"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 4,
                  boxShadow: theme.palette.custom.shadows.cardLarge,
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  }
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Our Values Section */}
      <Box 
        sx={{ 
          py: 10, 
          position: 'relative',
          overflow: 'hidden',
          background: isDarkMode 
            ? theme.palette.custom.gradients.darkBg
            : theme.palette.custom.gradients.lightBg,
        }}
      >
        <Container maxWidth="lg">
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
              Our Core Values
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
              These principles guide everything we do and every decision we make.
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {ourValues.map((value, index) => (
              <Grid item xs={12} sm={6} md={3} key={index} sx={{ animation: `${fadeIn} 0.8s ${0.1 * (index + 1)}s both` }}>
                <Card sx={{ 
                  height: '100%', 
                  borderRadius: 3,
                  boxShadow: isDarkMode ? theme.palette.custom.shadows.darkSmall : theme.palette.custom.shadows.medium,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: isDarkMode ? theme.palette.custom.shadows.darkMedium : theme.palette.custom.shadows.large,
                  },
                  border: isDarkMode ? `1px solid ${alpha(theme.palette.primary.main, 0.2)}` : 'none'
                }}>
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Box 
                      sx={{ 
                        mb: 3,
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                    >
                      <Box
                        sx={{
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: theme.palette.primary.main,
                          p: 2,
                          borderRadius: '50%',
                          width: 80,
                          height: 80,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'transform 0.2s ease',
                          '&:hover': {
                            transform: 'rotate(5deg) scale(1.05)',
                          }
                        }}
                      >
                        {value.icon}
                      </Box>
                    </Box>
                    <Typography variant="h5" component="h3" sx={{ fontWeight: 600, mb: 2 }}>
                      {value.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {value.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Our Team Section */}
      <Box sx={{ py: 10, bgcolor: 'background.default' }}>
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
              Meet Our Team
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
              Passionate experts dedicated to transforming education through technology.
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {teamMembers.map((member, index) => (
              <Grid item xs={12} sm={6} md={3} key={index} sx={{ animation: `${fadeIn} 0.8s ${0.1 * (index + 1)}s both` }}>
                <Card sx={{ 
                  height: '100%', 
                  borderRadius: 3,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
                  }
                }}>
                  <Box 
                    sx={{ 
                      pt: 5, 
                      pb: 3,
                      px: 3, 
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
                        top: -40,
                        left: -40,
                        width: 150,
                        height: 150,
                        borderRadius: '50%',
                        bgcolor: alpha('#ffffff', 0.05),
                      }}
                    />
                    <Avatar
                      src={member.image}
                      alt={member.name}
                      sx={{ 
                        width: 120, 
                        height: 120, 
                        mx: 'auto', 
                        mb: 2,
                        border: '4px solid white',
                        boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.05)',
                        }
                      }}
                    />
                    <Typography variant="h5" component="h3" sx={{ fontWeight: 600, mb: 1, color: 'white' }}>
                      {member.name}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ color: alpha('#ffffff', 0.9), mb: 1, fontWeight: 500 }}>
                      {member.role}
                    </Typography>
                  </Box>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                      {member.bio}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Milestones Section */}
      <Box 
        sx={{ 
          py: 10, 
          bgcolor: 'background.paper',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8, animation: `${fadeIn} 0.8s both` }}>
            <Typography variant="h2" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
              Our Journey
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
              Key milestones that shaped our growth and development
            </Typography>
          </Box>
          
          <Box sx={{ position: 'relative', px: { xs: 2, md: 4 }, py: 4 }}>
            {/* Timeline line */}
            <Box
              sx={{
                position: 'absolute',
                left: { xs: 32, md: '50%' },
                transform: { xs: 'none', md: 'translateX(-50%)' },
                top: 0,
                bottom: 0,
                width: 4,
                bgcolor: alpha(theme.palette.primary.main, 0.2),
                zIndex: 0,
                borderRadius: 2,
              }}
            />
            
            {/* Timeline items */}
            {milestones.map((milestone, index) => (
              <Box 
                key={index}
                sx={{ 
                  position: 'relative', 
                  mb: 6, 
                  animation: `${fadeIn} 0.8s ${0.15 * (index + 1)}s both`,
                  '&:last-child': {
                    mb: 0
                  }
                }}
              >
                <Grid 
                  container 
                  spacing={{ xs: 2, md: 4 }} 
                  sx={{ 
                    flexDirection: { 
                      xs: 'row', 
                      md: index % 2 === 0 ? 'row' : 'row-reverse'
                    } 
                  }}
                >
                  <Grid item xs={12} md={6}>
                    <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                      <Card
                        sx={{
                          p: 4,
                          borderRadius: 3,
                          boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                          transition: 'all 0.3s ease',
                          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                          height: '100%',
                          '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
                          }
                        }}
                      >
                        <Typography 
                          variant="h6" 
                          component="div" 
                          sx={{ 
                            color: theme.palette.primary.main, 
                            fontWeight: 600, 
                            mb: 1 
                          }}
                        >
                          {milestone.title}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          {milestone.description}
                        </Typography>
                      </Card>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
                    {/* Year marker - mobile */}
                    <Box
                      sx={{
                        display: { xs: 'flex', md: 'none' },
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        bgcolor: theme.palette.primary.main,
                        color: 'white',
                        fontWeight: 700,
                        flexShrink: 0,
                        mr: 3,
                        boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
                        zIndex: 1
                      }}
                    >
                      {milestone.year}
                    </Box>
                    
                    {/* Center year marker - desktop */}
                    <Box
                      sx={{
                        display: { xs: 'none', md: 'flex' },
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        bgcolor: theme.palette.primary.main,
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '1.25rem',
                        zIndex: 1,
                        boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translate(-50%, -50%) scale(1.1)',
                          boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
                        }
                      }}
                    >
                      {milestone.year}
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Global Reach Section */}
      <Box 
        sx={{ 
          py: 10, 
          bgcolor: 'background.default',
          position: 'relative'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6} sx={{ animation: `${fadeIn} 0.8s both` }}>
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
                Global Reach
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 4, lineHeight: 1.7 }}>
                Expanded internationally, now helping students in over 50 countries prepare for exams.
              </Typography>
              <List sx={{ mb: 4 }}>
                {[
                  'Personalized learning experiences for students worldwide',
                  'Support for multiple languages and educational systems',
                  'Culturally relevant content and examples',
                  'Regional exam-specific content and preparation'
                ].map((item, index) => (
                  <ListItem key={index} sx={{ px: 0, py: 1 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Check sx={{ color: theme.palette.primary.main }} />
                    </ListItemIcon>
                    <ListItemText primary={item} />
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={12} md={6} sx={{ animation: `${fadeIn} 0.8s 0.2s both` }}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80"
                alt="Global map"
                sx={{
                  width: '100%',
                  borderRadius: 4,
                  boxShadow: theme.palette.custom.shadows.cardLarge,
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                  }
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default AboutPage; 