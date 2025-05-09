import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Stack,
  Link as MuiLink,
  useTheme,
  Divider,
  IconButton
} from '@mui/material';
import { Link } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import Logo from './Logo';

const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box component="footer" sx={{ width: '100%' }}>
      {/* Main Footer */}
      <Box 
        sx={{ 
          bgcolor: theme.palette.mode === 'dark' ? '#0a1929' : '#012a4a',
          color: '#fff', 
          py: 6
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ mb: 3 }}>
                <Logo showText={true} to="/" />
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 2, maxWidth: 300 }}>
                AI Tutor is the leading AI-powered exam preparation platform, helping students achieve their academic goals through personalized learning.
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
                <IconButton size="small" aria-label="facebook" sx={{ color: 'white' }}>
                  <FacebookIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" aria-label="twitter" sx={{ color: 'white' }}>
                  <TwitterIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" aria-label="linkedin" sx={{ color: 'white' }}>
                  <LinkedInIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" aria-label="instagram" sx={{ color: 'white' }}>
                  <InstagramIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" aria-label="youtube" sx={{ color: 'white' }}>
                  <YouTubeIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Grid>

            <Grid item xs={6} sm={3} md={2}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                Platform
              </Typography>
              <Stack spacing={1.5}>
                <MuiLink component={Link} to="/features" sx={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', '&:hover': { color: 'white' } }}>
                  Features
                </MuiLink>
                <MuiLink component={Link} to="/pricing" sx={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', '&:hover': { color: 'white' } }}>
                  Pricing
                </MuiLink>
              </Stack>
            </Grid>

            <Grid item xs={6} sm={3} md={2}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                Exams
              </Typography>
              <Stack spacing={1.5}>
                <MuiLink component={Link} to="/exams/jee" sx={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', '&:hover': { color: 'white' } }}>
                  JEE
                </MuiLink>
                <MuiLink component={Link} to="/exams/neet" sx={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', '&:hover': { color: 'white' } }}>
                  NEET
                </MuiLink>
                <MuiLink component={Link} to="/exams/gate" sx={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', '&:hover': { color: 'white' } }}>
                  GATE
                </MuiLink>
                <MuiLink component={Link} to="/exams/gmat" sx={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', '&:hover': { color: 'white' } }}>
                  GMAT
                </MuiLink>
              </Stack>
            </Grid>

            <Grid item xs={6} sm={3} md={2}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                Resources
              </Typography>
              <Stack spacing={1.5}>
                <MuiLink component={Link} to="/blog" sx={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', '&:hover': { color: 'white' } }}>
                  Blog
                </MuiLink>
                <MuiLink component={Link} to="/guides" sx={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', '&:hover': { color: 'white' } }}>
                  Guides
                </MuiLink>
                <MuiLink component={Link} to="/faq" sx={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', '&:hover': { color: 'white' } }}>
                  FAQ
                </MuiLink>
                <MuiLink component={Link} to="/support" sx={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', '&:hover': { color: 'white' } }}>
                  Support
                </MuiLink>
              </Stack>
            </Grid>

            <Grid item xs={6} sm={3} md={2}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                Company
              </Typography>
              <Stack spacing={1.5}>
                <MuiLink component={Link} to="/about" sx={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', '&:hover': { color: 'white' } }}>
                  About
                </MuiLink>
                <MuiLink component={Link} to="/contact" sx={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', '&:hover': { color: 'white' } }}>
                  Contact
                </MuiLink>
                <MuiLink component={Link} to="/privacy" sx={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', '&:hover': { color: 'white' } }}>
                  Privacy
                </MuiLink>
                <MuiLink component={Link} to="/terms" sx={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', '&:hover': { color: 'white' } }}>
                  Terms
                </MuiLink>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Copyright Footer */}
      <Box 
        sx={{ 
          bgcolor: theme.palette.mode === 'dark' ? '#061626' : '#011e36',
          color: 'rgba(255,255,255,0.6)', 
          py: 2
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            justifyContent: 'space-between',
            alignItems: { xs: 'center', sm: 'center' } 
          }}>
            <Typography variant="body2">
              © {currentYear} AITutor. All rights reserved.
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              mt: { xs: 1.5, sm: 0 },
              gap: 2,
              fontSize: '0.75rem' 
            }}>
              <MuiLink component={Link} to="/terms" sx={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', '&:hover': { color: 'white' } }}>
                Terms
              </MuiLink>
              <MuiLink component={Link} to="/privacy" sx={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', '&:hover': { color: 'white' } }}>
                Privacy
              </MuiLink>
              <MuiLink component={Link} to="/cookies" sx={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', '&:hover': { color: 'white' } }}>
                Cookies
              </MuiLink>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Footer; 