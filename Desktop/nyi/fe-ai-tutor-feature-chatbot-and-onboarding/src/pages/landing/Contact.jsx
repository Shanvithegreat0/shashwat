import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  Card,
  CardContent,
  Snackbar,
  Alert,
  InputAdornment,
  Divider,
  Stack
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Send as SendIcon,
  Person as PersonIcon,
  Subject as SubjectIcon,
  Message as MessageIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const officeLocations = [
  {
    city: 'San Francisco',
    address: '123 Market Street, Suite 400, San Francisco, CA 94105',
    phone: '+1 (415) 555-1234',
    email: 'sf@aitutor.com'
  },
  {
    city: 'New York',
    address: '100 Broadway, 20th Floor, New York, NY 10005',
    phone: '+1 (212) 555-5678',
    email: 'nyc@aitutor.com'
  },
  {
    city: 'London',
    address: '10 Oxford Street, London W1D 1BS, United Kingdom',
    phone: '+44 20 7123 4567',
    email: 'london@aitutor.com'
  }
];

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Mock form submission
    console.log('Form submitted:', formData);
    
    // Show success message
    setSnackbar({
      open: true,
      message: 'Your message has been sent! We will get back to you soon.',
      severity: 'success'
    });
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

  return (
    <Box>
      
      {/* Hero Section */}
      <Box 
        sx={{ 
          pt: { xs: 5, md: 16 }, 
          pb: { xs: 8, md: 12 },
          bgcolor: 'background.default'
        }}
      >
        <Container maxWidth="lg"  >
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h1"
              sx={{
                fontWeight: 800,
                mb: 3,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                backgroundImage: 'linear-gradient(90deg, #2563EB 0%, #3B82F6 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Get in Touch
            </Typography>
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{ mb: 2, maxWidth: 700, mx: 'auto' }}
            >
              Have questions or feedback? We'd love to hear from you.
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: 'auto' }}
            >
              Fill out the form below and our team will get back to you as soon as possible.
            </Typography>
          </Box>

          <Grid container spacing={6}>
            {/* Contact Form */}
            <Grid item xs={12} md={7}>
              <Card sx={{ 
                borderRadius: 3, 
                boxShadow: 4,
                height: '100%',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  boxShadow: 8,
                }
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h4" component="h2" sx={{ fontWeight: 700, mb: 3 }}>
                    Send Us a Message
                  </Typography>
                  
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Your Name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          error={!!errors.name}
                          helperText={errors.name}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PersonIcon color="primary" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Email Address"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          error={!!errors.email}
                          helperText={errors.email}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <EmailIcon color="primary" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          error={!!errors.subject}
                          helperText={errors.subject}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <SubjectIcon color="primary" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Your Message"
                          name="message"
                          multiline
                          rows={6}
                          value={formData.message}
                          onChange={handleChange}
                          error={!!errors.message}
                          helperText={errors.message}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 2 }}>
                                <MessageIcon color="primary" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          size="large"
                          endIcon={<SendIcon />}
                          sx={{
                            py: 1.5,
                            px: 4,
                            fontWeight: 600,
                            fontSize: '1rem',
                            borderRadius: 2,
                          }}
                        >
                          Send Message
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Contact Info */}
            <Grid item xs={12} md={5}>
              <Card sx={{ 
                borderRadius: 3, 
                boxShadow: 4,
                height: '100%',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  boxShadow: 8,
                }
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h4" component="h2" sx={{ fontWeight: 700, mb: 4 }}>
                    Contact Information
                  </Typography>
                  
                  <Stack spacing={4}>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <EmailIcon color="primary" sx={{ mr: 2 }} />
                        <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                          Email Us
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        General Inquiries:
                        <Typography 
                          component="a" 
                          href="mailto:info@aitutor.com" 
                          color="primary.main"
                          sx={{ ml: 1, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                        >
                          info@aitutor.com
                        </Typography>
                      </Typography>
                      <Typography variant="body1">
                        Support:
                        <Typography 
                          component="a" 
                          href="mailto:support@aitutor.com" 
                          color="primary.main"
                          sx={{ ml: 1, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                        >
                          support@aitutor.com
                        </Typography>
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <PhoneIcon color="primary" sx={{ mr: 2 }} />
                        <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                          Call Us
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        Customer Service: +1 (800) 123-4567
                      </Typography>
                      <Typography variant="body1">
                        Technical Support: +1 (800) 765-4321
                      </Typography>
                    </Box>
                    
                    <Divider />
                    
                    <Box>
                      <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 2 }}>
                        Office Locations
                      </Typography>
                      
                      <Stack spacing={3}>
                        {officeLocations.map((office, index) => (
                          <Box key={index}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main' }}>
                              {office.city}
                            </Typography>
                            <Box sx={{ display: 'flex', mt: 1 }}>
                              <LocationIcon color="action" sx={{ mr: 1, fontSize: 20, mt: 0.5 }} />
                              <Typography variant="body2" color="text.secondary">
                                {office.address}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', mt: 1 }}>
                              <PhoneIcon color="action" sx={{ mr: 1, fontSize: 20, mt: 0.5 }} />
                              <Typography variant="body2" color="text.secondary">
                                {office.phone}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', mt: 1 }}>
                              <EmailIcon color="action" sx={{ mr: 1, fontSize: 20, mt: 0.5 }} />
                              <Typography 
                                variant="body2" 
                                component="a"
                                href={`mailto:${office.email}`}
                                color="primary.main"
                                sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                              >
                                {office.email}
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Map Section */}
      <Box sx={{ py: 10, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h2" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
              Find Us
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Visit our headquarters in San Francisco
            </Typography>
          </Box>
          
          <Paper
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: 4,
              height: 450,
              width: '100%',
              bgcolor: 'grey.200', // Placeholder background
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {/* Map would be embedded here - using placeholder for now */}
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
              Interactive Map Would Be Embedded Here
              <br />
              (Google Maps or other mapping service)
            </Typography>
          </Paper>
        </Container>
      </Box>

      {/* FAQ Section */}
      <Box sx={{ py: 10, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h2" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
              Frequently Asked Questions
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Quick answers to common questions
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {[
              {
                question: 'How quickly will I receive a response?',
                answer: 'We aim to respond to all inquiries within 24-48 business hours. For urgent matters, we recommend calling our customer service line.'
              },
              {
                question: 'Can I schedule a demo of the platform?',
                answer: 'Yes! You can request a demo by filling out the contact form or by emailing demo@aitutor.com with your availability.'
              },
              {
                question: 'Do you offer educational partnerships?',
                answer: 'We work with schools, universities, and educational organizations. Please contact partnerships@aitutor.com for more information.'
              },
              {
                question: 'How do I report a technical issue?',
                answer: 'Please email support@aitutor.com with details of the issue you are experiencing, including screenshots if applicable.'
              }
            ].map((faq, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Card sx={{
                  height: '100%',
                  borderRadius: 3,
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                      {faq.question}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {faq.answer}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Snackbar for form submission feedback */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

    </Box>
  );
};

export default ContactPage; 