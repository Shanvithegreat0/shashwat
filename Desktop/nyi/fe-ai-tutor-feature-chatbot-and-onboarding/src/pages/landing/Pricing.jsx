import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  FormControlLabel,
  Stack,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import { 
  CheckCircle, 
  Star,
  Security as SecurityIcon,
  MonetizationOn as MonetizationOnIcon,
  Support as SupportIcon 
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useColorMode } from '../../theme/ThemeContext';
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

// Define the advantages array that was missing
const advantages = [
  {
    icon: <MonetizationOnIcon fontSize="large" />,
    title: 'Cost Effective',
    description: 'Maximize your learning investment with plans designed to deliver exceptional value at every price point.'
  },
  {
    icon: <SecurityIcon fontSize="large" />,
    title: 'No Hidden Fees',
    description: 'Complete transparency with all features clearly listed. What you see is exactly what you get.'
  },
  {
    icon: <Star fontSize="large" />,
    title: 'Premium Features',
    description: 'Access to cutting-edge AI learning tools that adapt to your unique study needs and goals.'
  },
  {
    icon: <SupportIcon fontSize="large" />,
    title: 'Responsive Support',
    description: 'Get help when you need it with our tiered support system designed for every subscription level.'
  }
];

const pricingPlans = [
  {
    title: 'Free',
    price: {
      monthly: 0,
      yearly: 0
    },
    features: [
      'Access to basic quizzes',
      'Limited practice questions',
      'Basic performance tracking',
      'Community support'
    ],
    buttonText: 'Start Free',
    buttonVariant: 'outlined',
    highlighted: false
  },
  {
    title: 'Standard',
    price: {
      monthly: 19.99,
      yearly: 14.99
    },
    features: [
      'Everything in Free plan',
      'Full access to question bank',
      'Personalized study plans',
      'Detailed performance analytics',
      'Email support'
    ],
    buttonText: 'Start Standard',
    buttonVariant: 'contained',
    highlighted: true
  },
  {
    title: 'Premium',
    price: {
      monthly: 39.99,
      yearly: 29.99
    },
    features: [
      'Everything in Standard plan',
      'Advanced AI recommendations',
      'Mock test simulations',
      'Unlimited practice tests',
      'Priority support',
      'Group study features'
    ],
    buttonText: 'Start Premium',
    buttonVariant: 'contained',
    highlighted: false
  }
];

const PricingPage = () => {
  const [isAnnual, setIsAnnual] = React.useState(true);
  const theme = useTheme();
  const { mode } = useColorMode();
  const isDarkMode = mode === 'dark';

  const handleBillingChange = () => {
    setIsAnnual(!isAnnual);
  };

  return (
    <Box sx={{ overflowX: 'hidden' }}>
      {/* Hero Section */}
      <Box 
        sx={{ 
          pt: { xs: 12, md: 16 },
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
          <Box sx={{ textAlign: 'center', mb: 8, animation: `${fadeIn} 0.8s ease-out` }}>
            <Typography
              variant="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                lineHeight: 1.2,
                mb: 3,
                background: isDarkMode 
                  ? theme.palette.custom.gradients.primaryLight
                  : theme.palette.custom.gradients.primaryDark,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Simple, Transparent Pricing
            </Typography>
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{ 
                mb: 4, 
                maxWidth: 700, 
                mx: 'auto',
                opacity: 0.9
              }}
            >
              Choose the plan that fits your needs. No hidden fees, cancel anytime.
            </Typography>
            
            <FormControlLabel
              control={
                <Switch
                  checked={isAnnual}
                  onChange={handleBillingChange}
                  color="primary"
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: theme.palette.primary.main,
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.5),
                    },
                  }}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography
                    sx={{
                      mr: 1,
                      fontWeight: !isAnnual ? 600 : 400,
                      color: !isAnnual ? 'primary.main' : 'text.secondary',
                      transition: 'color 0.3s, font-weight 0.3s',
                    }}
                  >
                    Monthly
                  </Typography>
                  <Typography
                    sx={{
                      ml: 1,
                      fontWeight: isAnnual ? 600 : 400,
                      color: isAnnual ? 'primary.main' : 'text.secondary',
                      transition: 'color 0.3s, font-weight 0.3s',
                    }}
                  >
                    Annual (Save 25%)
                  </Typography>
                </Box>
              }
              labelPlacement="end"
              sx={{ mt: 2 }}
            />
          </Box>

          <Grid container spacing={4} justifyContent="center">
            {pricingPlans.map((plan, index) => (
              <Grid 
                item 
                xs={12} 
                md={4} 
                key={index} 
                sx={{ 
                  animation: `${fadeIn} 0.8s ${0.1 * (index + 1)}s both`,
                  display: 'flex',
                }}
              >
                <Card
                  elevation={plan.highlighted ? 8 : 2}
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    borderRadius: 3,
                    ...(plan.highlighted && {
                      borderTop: '5px solid',
                      borderColor: 'primary.main',
                      transform: { md: 'scale(1.05)' },
                      boxShadow: isDarkMode 
                        ? '0 12px 30px rgba(0, 0, 0, 0.4)' 
                        : '0 12px 30px rgba(0, 0, 0, 0.15)',
                    }),
                    '&:hover': {
                      transform: plan.highlighted 
                        ? 'scale(1.07)' 
                        : 'scale(1.02)',
                      boxShadow: isDarkMode 
                        ? '0 15px 35px rgba(0, 0, 0, 0.5)' 
                        : '0 15px 35px rgba(0, 0, 0, 0.15)',
                    },
                  }}
                >
                  {plan.highlighted && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 15,
                        right: -30,
                        transform: 'rotate(45deg)',
                        bgcolor: 'primary.main',
                        color: 'white',
                        py: 0.5,
                        px: 4,
                        fontWeight: 'bold',
                        fontSize: '0.8rem',
                        zIndex: 1,
                        boxShadow: '0 2px 10px rgba(0,0,0,0.15)'
                      }}
                    >
                      MOST POPULAR
                    </Box>
                  )}
                  <CardContent sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography 
                      variant="h5" 
                      component="h2" 
                      sx={{ 
                        fontWeight: 600, 
                        mb: 1,
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      {plan.highlighted && (
                        <Star 
                          sx={{ 
                            mr: 1, 
                            color: theme.palette.primary.main,
                            animation: `${float} 3s infinite ease-in-out`
                          }} 
                        />
                      )}
                      {plan.title}
                    </Typography>
                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="h3"
                        component="span"
                        sx={{ 
                          fontWeight: 700,
                          color: plan.highlighted ? 'primary.main' : 'text.primary'
                        }}
                      >
                        ${isAnnual ? plan.price.yearly : plan.price.monthly}
                      </Typography>
                      <Typography
                        variant="h6"
                        component="span"
                        color="text.secondary"
                        sx={{ ml: 1 }}
                      >
                        {plan.price.monthly === 0 ? '' : isAnnual ? '/mo (billed annually)' : '/month'}
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 3 }} />
                    <List sx={{ mb: 4, flexGrow: 1 }}>
                      {plan.features.map((feature, idx) => (
                        <ListItem key={idx} disableGutters sx={{ py: 1 }}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <CheckCircle 
                              color="primary" 
                              fontSize="small" 
                              sx={{ 
                                color: plan.highlighted ? 'primary.main' : undefined
                              }}
                            />
                          </ListItemIcon>
                          <ListItemText 
                            primary={feature} 
                            primaryTypographyProps={{ 
                              fontWeight: 500,
                              color: 'text.primary'
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                    <Box sx={{ mt: 'auto' }}>
                      <Button
                        component={Link}
                        to="/register"
                        variant={plan.buttonVariant}
                        color="primary"
                        fullWidth
                        size="large"
                        sx={{ 
                          py: 1.5, 
                          fontWeight: 600,
                          boxShadow: plan.highlighted ? '0 4px 14px rgba(0,0,0,0.15)' : 'none',
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            transform: 'translateY(-3px)',
                            boxShadow: plan.highlighted ? '0 6px 20px rgba(0,0,0,0.2)' : '0 4px 14px rgba(0,0,0,0.1)',
                          }
                        }}
                      >
                        {plan.buttonText}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Advantages Section */}
      <Box sx={{ py: 10, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8, animation: `${fadeIn} 0.8s both` }}>
            <Typography 
              variant="h2" 
              component="h2" 
              sx={{ 
                fontWeight: 700, 
                fontSize: { xs: '2rem', md: '2.75rem' },
                mb: 2,
                background: isDarkMode 
                  ? theme.palette.custom.gradients.primaryLight
                  : theme.palette.custom.gradients.primaryDark,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Why Choose Our Pricing
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
              Designed to provide maximum value with transparent, flexible options
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {advantages.map((advantage, index) => (
              <Grid item xs={12} sm={6} md={3} key={index} sx={{ animation: `${fadeIn} 0.8s ${0.1 * (index + 1)}s both` }}>
                <Card sx={{ 
                  height: '100%', 
                  borderRadius: 3,
                  boxShadow: isDarkMode ? theme.palette.custom.shadows.darkSmall : theme.palette.custom.shadows.small,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: isDarkMode ? theme.palette.custom.shadows.darkMedium : theme.palette.custom.shadows.large,
                  },
                  border: isDarkMode ? `1px solid ${alpha(theme.palette.primary.main, 0.2)}` : 'none'
                }}>
                  <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <Box 
                      sx={{
                        mb: 3,
                        bgcolor: alpha(theme.palette.primary.main, isDarkMode ? 0.15 : 0.1),
                        color: theme.palette.primary.main,
                        p: 2, 
                        borderRadius: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 70,
                        height: 70,
                        transition: 'transform 0.2s ease',
                        '&:hover': {
                          transform: 'rotate(5deg) scale(1.05)',
                        }
                      }}
                    >
                      {advantage.icon}
                    </Box>
                    <Typography variant="h6" component="h3" sx={{ mb: 2, fontWeight: 600 }}>
                      {advantage.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {advantage.description}
                    </Typography>
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
          py: 10, 
          background: 'linear-gradient(135deg, #4285F4 0%, #2563EB 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Decorative elements */}
        <Box 
          sx={{ 
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            bgcolor: alpha('#ffffff', 0.05),
            zIndex: 0,
            animation: `${float} 15s infinite ease-in-out`
          }} 
        />
        <Box 
          sx={{ 
            position: 'absolute',
            bottom: -60,
            left: -60,
            width: 180,
            height: 180,
            borderRadius: '50%',
            bgcolor: alpha('#ffffff', 0.05),
            zIndex: 0,
            animation: `${float} 18s infinite ease-in-out reverse`
          }} 
        />
        
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', animation: `${fadeIn} 0.8s both` }}>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 700, 
                mb: 3,
                textShadow: theme.palette.custom.shadows.textShadow
              }}
            >
              Ready to Transform Your Learning?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Join thousands of students who are achieving academic success with AI Tutor.
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
                  bgcolor: theme.palette.custom.gradients.buttonGradient,
                  color: 'white',
                  py: 1.5,
                  px: 4,
                  fontSize: { xs: '1.1rem', sm: '1.2rem', md: '1.25rem' },
                  fontWeight: 600,
                  boxShadow: theme.palette.custom.shadows.small,
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                    color: 'primary.dark',
                    boxShadow: theme.palette.custom.shadows.cardHover,
                  },
                }}
              >
                Get Started Free
              </Button>
              <Button
                component={Link}
                to="/contact"
                variant="outlined"
                size="large"
                sx={{
                  color: 'white',
                  borderColor: 'white',
                  borderWidth: 2,
                  py: 1.5,
                  px: 4,
                  fontSize: { xs: '1.1rem', sm: '1.2rem', md: '1.25rem' },
                  fontWeight: 600,
                  transition: 'all 0.2s ease-in-out',
                  borderRadius: 2,
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    transform: 'translateY(-3px)',
                  },
                }}
              >
                Contact Sales
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default PricingPage; 