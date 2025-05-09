import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Stack,
  Badge
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Dashboard as DashboardIcon,
  Assignment as AssignmentIcon,
  School as SchoolIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  TipsAndUpdates as TipsAndUpdatesIcon,
  Payment as PaymentIcon,
  Login as LoginIcon,
  Info as InfoIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { useColorMode } from '../theme/ThemeContext';
import { useTheme } from '@mui/material/styles';
import ThemeToggleButton from './ThemeToggleButton';
import LightDarkModeToggle from './LightDarkModeToggle';

import { useLogoutMutation } from '../store/slices/apiServices';

const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const Header = ({ transparent = false }) => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [triggerLogout]=useLogoutMutation();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const { mode } = useColorMode();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async () => {
    try {
      await triggerLogout().unwrap();
      localStorage.removeItem('at');
      localStorage.removeItem('rt');
      handleCloseUserMenu();
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  const toggleMobileDrawer = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        background: mode === 'dark' ? '#0a1929' : '#012a4a',
        boxShadow: '0 1px 2px 0 rgba(0,0,0,0.3)',
        color: '#ffffff',
        borderRadius: 0,
        zIndex: theme.zIndex.drawer + 1,
        height: '64px',
        transition: 'background-color 0.3s ease-in-out',
        '& *': {
          boxSizing: 'border-box'
        }
      }}
      elevation={0}
    >
      <Container 
        maxWidth="xl" 
        sx={{
          px: { xs: 2, sm: 3 },
          py: 0,
          height: '100%',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Toolbar 
          disableGutters 
          sx={{
            minHeight: '64px !important',
            height: '64px',
            py: 0,
            width: '100%',
            justifyContent: 'space-between',
            transition: 'none',
            '& *': {
              transition: 'background-color 0.3s ease-in-out, color 0.3s ease-in-out, border-color 0.3s ease-in-out',
            }
          }}
        >
          {/* Logo section - fixed dimensions */}
          <Box 
            component={Link} 
            to="/" 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              textDecoration: 'none',
              color: '#ffffff',
              flexGrow: { xs: 1, md: 0 },
              height: '64px',
              width: { xs: 'auto', md: '150px' }
            }}
          >
            <Logo showText={true} to={null} />
          </Box>

          {/* Mobile menu icon - fixed size */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, order: 3, width: '40px', height: '40px' }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={toggleMobileDrawer}
              color="inherit"
              sx={{ 
                width: '40px',
                height: '40px',
                p: 0
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Navigation Links - Desktop with fixed dimensions */}
          <Box sx={{ 
            display: { xs: 'none', md: 'flex' }, 
            ml: 4, 
            flexGrow: 1, 
            height: '64px',
            flexDirection: 'row',
            alignItems: 'center',
            position: 'relative',
            zIndex: theme.zIndex.drawer + 2,
            '& button': {
              letterSpacing: 0,
              fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
              fontWeight: 500,
              fontSize: '0.9rem',
              px: 2,
              height: '64px',
              borderRadius: 0,
              textTransform: 'none',
              cursor: 'pointer',
              pointerEvents: 'auto'
            }
          }}>
            {!isAuthenticated ? (
              <Stack 
                direction="row" 
                spacing={0} 
                sx={{ 
                  height: '100%',
                  '& > a': { 
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center'
                  }
                }}
              >
                <Button
                  component={Link}
                  to="/"
                  sx={{
                    color: 'white',
                    display: 'flex',
                    position: 'relative',
                    minWidth: '80px',
                    justifyContent: 'center',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      width: '0%',
                      height: '2px',
                      bottom: 10,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: 'white',
                      transition: 'width 0.3s ease-in-out'
                    },
                    '&:hover::after': {
                      width: '50%'
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  Home
                </Button>
                <Button
                  component={Link}
                  to="/about"
                  sx={{
                    color: 'white',
                    display: 'flex',
                    position: 'relative',
                    minWidth: '80px',
                    justifyContent: 'center',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      width: '0%',
                      height: '2px',
                      bottom: 10,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: 'white',
                      transition: 'width 0.3s ease-in-out'
                    },
                    '&:hover::after': {
                      width: '50%'
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  About
                </Button>
                <Button
                  component={Link}
                  to="/features"
                  sx={{
                    color: 'white',
                    display: 'flex',
                    position: 'relative',
                    minWidth: '80px',
                    justifyContent: 'center',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      width: '0%',
                      height: '2px',
                      bottom: 10,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: 'white',
                      transition: 'width 0.3s ease-in-out'
                    },
                    '&:hover::after': {
                      width: '50%'
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  Features
                </Button>
                <Button
                  component={Link}
                  to="/pricing"
                  sx={{
                    color: 'white',
                    display: 'flex',
                    position: 'relative',
                    minWidth: '80px',
                    justifyContent: 'center',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      width: '0%',
                      height: '2px',
                      bottom: 10,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: 'white',
                      transition: 'width 0.3s ease-in-out'
                    },
                    '&:hover::after': {
                      width: '50%'
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  Pricing
                </Button>
              </Stack>
            ) : (
              <Stack 
                direction="row" 
                spacing={0} 
                sx={{ 
                  height: '100%',
                  '& > a': { 
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center'
                  }
                }}
              >
                <Button
                  component={Link}
                  to="/dashboard"
                  sx={{
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    position: 'relative',
                    minWidth: '120px',
                    justifyContent: 'center',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      width: '0%',
                      height: '2px',
                      bottom: 10,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: 'white',
                      transition: 'width 0.3s ease-in-out'
                    },
                    '&:hover::after': {
                      width: '50%'
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                  startIcon={<DashboardIcon sx={{ width: 20, height: 20, display: 'block' }} />}
                >
                  Dashboard
                </Button>
                <Button
                  component={Link}
                  to="/exams"
                  sx={{
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    position: 'relative',
                    minWidth: '100px',
                    justifyContent: 'center',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      width: '0%',
                      height: '2px',
                      bottom: 10,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: 'white',
                      transition: 'width 0.3s ease-in-out'
                    },
                    '&:hover::after': {
                      width: '50%'
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                  startIcon={<AssignmentIcon sx={{ width: 20, height: 20, display: 'block' }} />}
                >
                  Exams
                </Button>
                <Button
                  component={Link}
                  to="/chat"
                  sx={{
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    position: 'relative',
                    minWidth: '120px',
                    justifyContent: 'center',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      width: '0%',
                      height: '2px',
                      bottom: 10,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: 'white',
                      transition: 'width 0.3s ease-in-out'
                    },
                    '&:hover::after': {
                      width: '50%'
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                  startIcon={<TipsAndUpdatesIcon sx={{ width: 20, height: 20, display: 'block' }} />}
                >
                  Ask AI Tutor
                </Button>
              </Stack>
            )}
          </Box>

          {/* Right-side actions with fixed dimensions */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            height: '64px',
            position: 'relative',
            zIndex: theme.zIndex.drawer + 2,
            '& > *': {
              flexShrink: 0,
              pointerEvents: 'auto'
            }
          }}>
            {/* Theme Toggle - Use both options */}
            <Box sx={{ 
              display: { xs: 'none', md: 'flex' }, 
              mr: 2,
              width: '60px', 
              height: '34px',
              flexShrink: 0,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <LightDarkModeToggle />
            </Box>
            <Box sx={{ 
              display: { xs: 'flex', md: 'none' },
              width: '40px',
              height: '40px',
              flexShrink: 0,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <ThemeToggleButton iconOnly={true} />
            </Box>

            {/* Only show notification bell and profile when logged in */}
            {isAuthenticated ? (
              <>
                {/* Notifications with fixed dimensions */}
                <Box sx={{ width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', mx: 1 }}>
                  <IconButton color="inherit" sx={{ width: '40px', height: '40px', p: 0 }}>
                    <NotificationsIcon sx={{ fontSize: '24px' }} />
                  </IconButton>
                </Box>

                {/* User Menu with fixed dimensions */}
                <Box sx={{ width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', ml: 1 }}>
                  <IconButton 
                    onClick={handleOpenUserMenu} 
                    sx={{ width: '40px', height: '40px', p: 0 }}
                  >
                    <Avatar 
                      alt={user?.name || "User"}
                      src={user?.avatar}
                      sx={{ 
                        width: 32, 
                        height: 32,
                        bgcolor: '#1a73e8',
                        fontSize: '14px'
                      }}
                    >
                      {user?.name?.charAt(0) || "U"}
                    </Avatar>
                  </IconButton>
                  {/* User Menu Dropdown */}
                  <Menu
                    sx={{ 
                      mt: '45px',
                      zIndex: theme.zIndex.drawer + 2,
                      '& .MuiPaper-root': {
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                        borderRadius: '8px',
                        minWidth: '200px'
                      }
                    }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    <MenuItem 
                      onClick={() => {
                        navigate('/profile');
                        handleCloseUserMenu();
                      }}
                    >
                      <ListItemIcon>
                        <PersonIcon fontSize="small" />
                      </ListItemIcon>
                      <Typography textAlign="center">Profile</Typography>
                    </MenuItem>
                    <MenuItem 
                      onClick={() => {
                        navigate('/dashboard');
                        handleCloseUserMenu();
                      }}
                    >
                      <ListItemIcon>
                        <DashboardIcon fontSize="small" />
                      </ListItemIcon>
                      <Typography textAlign="center">Dashboard</Typography>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                      <ListItemIcon>
                        <LogoutIcon fontSize="small" color="error" />
                      </ListItemIcon>
                      <Typography textAlign="center" color="error">Logout</Typography>
                    </MenuItem>
                  </Menu>
                </Box>
              </>
            ) : (
              // Add login/register buttons for non-authenticated users
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Button 
                  component={Link} 
                  to="/login"
                  sx={{ 
                    color: 'white', 
                    mr: 1,
                    fontSize: '0.875rem',
                    textTransform: 'none',
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  Log in
                </Button>
                <Button 
                  component={Link} 
                  to="/register"
                  variant="contained"
                  disableElevation
                  sx={{ 
                    bgcolor: 'white',
                    color: '#012a4a',
                    fontSize: '0.875rem',
                    textTransform: 'none',
                    fontWeight: 500,
                    px: 2,
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.9)',
                    }
                  }}
                >
                  Sign up
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileDrawerOpen}
        onClose={toggleMobileDrawer}
        PaperProps={{
          sx: { 
            width: '85%', 
            maxWidth: 300,
            borderRadius: 0,
            bgcolor: mode === 'dark' ? '#0a1929' : '#012a4a',
            color: 'white'
          }
        }}
      >
        <Box sx={{ py: 2, px: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Logo showText={true} />
          <IconButton onClick={toggleMobileDrawer} sx={{ color: 'white' }}>
            <MenuIcon />
          </IconButton>
        </Box>
        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
        <List sx={{ py: 1 }}>
          {isAuthenticated ? (
            // Authenticated Menu Items
            <>
              <ListItem component={Link} to="/dashboard" onClick={toggleMobileDrawer}>
                <ListItemIcon sx={{ color: 'white' }}>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Dashboard" 
                  primaryTypographyProps={{ 
                    fontWeight: 500,
                    color: 'white'
                  }} 
                />
              </ListItem>
              <ListItem component={Link} to="/exams" onClick={toggleMobileDrawer}>
                <ListItemIcon sx={{ color: 'white' }}>
                  <AssignmentIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Exams" 
                  primaryTypographyProps={{ 
                    fontWeight: 500,
                    color: 'white'
                  }} 
                />
              </ListItem>
              <ListItem component={Link} to="/chat" onClick={toggleMobileDrawer}>
                <ListItemIcon sx={{ color: 'white' }}>
                  <TipsAndUpdatesIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Ask AI Tutor" 
                  primaryTypographyProps={{ 
                    fontWeight: 500,
                    color: 'white'
                  }} 
                />
              </ListItem>
              <ListItem component={Link} to="/profile" onClick={toggleMobileDrawer}>
                <ListItemIcon sx={{ color: 'white' }}>
                  <AccountCircle />
                </ListItemIcon>
                <ListItemText 
                  primary="Profile" 
                  primaryTypographyProps={{ 
                    fontWeight: 500,
                    color: 'white'
                  }} 
                />
              </ListItem>
              <ListItem component={Link} to="/pricing" onClick={toggleMobileDrawer}>
                <ListItemIcon sx={{ color: 'white' }}>
                  <PaymentIcon />
                </ListItemIcon>
                <ListItemText primary="Pricing" primaryTypographyProps={{ color: 'white' }} />
              </ListItem>
              <ListItem component={Link} to="/about" onClick={toggleMobileDrawer}>
                <ListItemIcon sx={{ color: 'white' }}>
                  <InfoIcon />
                </ListItemIcon>
                <ListItemText primary="About" primaryTypographyProps={{ color: 'white' }} />
              </ListItem>
              <Divider sx={{ my: 1, bgcolor: 'rgba(255,255,255,0.1)' }} />
              <ListItem onClick={handleLogout}>
                <ListItemIcon sx={{ color: '#ff6b6b' }}>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Logout" 
                  primaryTypographyProps={{ 
                    fontWeight: 500,
                    color: '#ff6b6b'
                  }} 
                />
              </ListItem>
            </>
          ) : (
            // Unauthenticated Menu Items
            <>
              <ListItem component={Link} to="/" onClick={toggleMobileDrawer}>
                <ListItemIcon sx={{ color: 'white' }}>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Home" primaryTypographyProps={{ color: 'white' }} />
              </ListItem>
              <ListItem component={Link} to="/features" onClick={toggleMobileDrawer}>
                <ListItemIcon sx={{ color: 'white' }}>
                  <TipsAndUpdatesIcon />
                </ListItemIcon>
                <ListItemText primary="Features" primaryTypographyProps={{ color: 'white' }} />
              </ListItem>
              <ListItem component={Link} to="/pricing" onClick={toggleMobileDrawer}>
                <ListItemIcon sx={{ color: 'white' }}>
                  <PaymentIcon />
                </ListItemIcon>
                <ListItemText primary="Pricing" primaryTypographyProps={{ color: 'white' }} />
              </ListItem>
              <ListItem component={Link} to="/about" onClick={toggleMobileDrawer}>
                <ListItemIcon sx={{ color: 'white' }}>
                  <InfoIcon />
                </ListItemIcon>
                <ListItemText primary="About" primaryTypographyProps={{ color: 'white' }} />
              </ListItem>
              <Divider sx={{ my: 1, bgcolor: 'rgba(255,255,255,0.1)' }} />
              <ListItem component={Link} to="/login" onClick={toggleMobileDrawer}>
                <ListItemIcon sx={{ color: 'white' }}>
                  <LoginIcon />
                </ListItemIcon>
                <ListItemText primary="Log in" primaryTypographyProps={{ color: 'white' }} />
              </ListItem>
              <ListItem>
                <Button
                  fullWidth
                  variant="contained"
                  component={Link}
                  to="/register"
                  onClick={toggleMobileDrawer}
                  disableElevation
                  sx={{ 
                    mt: 1, 
                    py: 1,
                    bgcolor: 'white',
                    color: '#012a4a',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.9)',
                    }
                  }}
                >
                  Sign up
                </Button>
              </ListItem>
            </>
          )}
        </List>
      </Drawer>
    </AppBar>
  );
};

export default Header; 