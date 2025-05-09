import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Avatar,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Card,
  CardContent,
  Chip,
  Stack,
  IconButton,
  Tab,
  Tabs,
  Badge,
  CircularProgress,
  Input,
  Tooltip
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  School as SchoolIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Settings as SettingsIcon,
  Assignment as AssignmentIcon,
  EmojiEvents as EmojiEventsIcon,
  History as HistoryIcon,
  AddAPhoto as AddAPhotoIcon
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { useGetUserDetailsQuery, useGetUserRecordsMutation, useGetDashboardMutation, useUpdateProfileMutation } from '../../store/slices/apiServices';
import { loginSuccess, markUserVerified } from '../../store/slices/auth';
import { useToast } from '../../components/Toasts/useToast';

// This function ensures user is always marked as verified in localStorage and Redux
const ensureUserVerified = (dispatch) => {
  try {
    // Update Redux store to mark user as verified
    dispatch(markUserVerified());
    
    // Also ensure localStorage is updated
    const storedUserStr = localStorage.getItem('user');
    if (storedUserStr) {
      const userData = JSON.parse(storedUserStr);
      if (!userData.verified) {
        userData.verified = true;
        localStorage.setItem('user', JSON.stringify(userData));
      }
    }
  } catch (err) {
    console.error('Error ensuring user verified:', err);
  }
};

const Profile = () => {
  const dispatch = useDispatch();
  
  // Call the function immediately to ensure user is marked as verified
  ensureUserVerified(dispatch);
  
  const { user } = useSelector((state) => state.auth);
  const { data: userDetails, isLoading: userLoading } = useGetUserDetailsQuery();
  const [getUserRecords] = useGetUserRecordsMutation();
  const [getDashboard] = useGetDashboardMutation();
  const [updateProfile] = useUpdateProfileMutation();
  const { showToast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    institution: '',
    bio: '',
    profileImage: ''
  });

  // Add state for file upload
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const [stats, setStats] = useState({
    quizzesTaken: 0,
    averageScore: 0,
    timeSpent: 0,
    achievements: [],
    recentActivity: []
  });

  // Fetch user data and stats
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Always load user data from localStorage first
        let userData = null;
        try {
          const storedUserStr = localStorage.getItem('user');
          if (storedUserStr) {
            userData = JSON.parse(storedUserStr);
        
            // Set profile data from localStorage
            if (userData) {
              setProfileData({
                name: userData.name || '',
                email: userData.email || '',
                institution: userData.institution || '',
                bio: userData.bio || '',
                profileImage: userData.profilePicture?.url || ''
              });
            }
          }
        } catch (err) {
          console.error('Error loading user from localStorage:', err);
        }
        
        // If localStorage failed, fall back to Redux state
        if (!userData && user) {
          setProfileData({
            name: user.name || '',
            email: user.email || '',
            institution: user.institution || '',
            bio: user.bio || '',
            profileImage: user.profilePicture?.url || ''
          });
        }

        // Load dashboard stats (this doesn't affect profile data)
        try {
          const dashboardResponse = await getDashboard().unwrap();
        if (dashboardResponse?.data) {
          const dashData = dashboardResponse.data;
          setStats({
            quizzesTaken: dashData.stats?.totalAttempts || 0,
            averageScore: dashData.stats?.averageScore || 0,
            timeSpent: dashData.stats?.totalTimeSpent || 0,
            achievements: dashData.achievements || [],
            recentActivity: dashData.stats?.recentActivity || []
          });
        }
        } catch (err) {
          console.error('Error loading dashboard data:', err);
        }
      } catch (error) {
        console.error('Error in fetchUserData:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]); // Only depend on Redux user state

  const handleTabChange = (event, newValue) => {
    if (newValue >= 0 && newValue <= 1) {
    setCurrentTab(newValue);
    }
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    // Get the most up-to-date user data, preferring Redux store data if available
    const userData = user || userDetails?.data;
    if (userData) {
      setProfileData({
        name: userData.name || '',
        email: userData.email || '',
        institution: userData.institution || '',
        bio: userData.bio || '',
        profileImage: userData.profilePicture?.url || ''
      });
    }
    setEditMode(false);
  };

  // Add image upload handler
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview URL
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
        
        // Update profile data with the new image preview
        setProfileData(prev => ({
          ...prev,
          profileImage: fileReader.result
        }));
      };
      fileReader.readAsDataURL(file);
    }
  };

  // Update handleSave to include the profile image
  const handleSave = async () => {
    try {
      setLoading(true);
      
      const storedUserStr = localStorage.getItem('user') || '{}';
      let storedUser = {};
      
      try {
        storedUser = JSON.parse(storedUserStr);
      } catch (err) {
        console.error('Error parsing stored user:', err);
      }
      
      // Create updated user with new profile data including image
      const updatedUser = {
        ...storedUser,
        name: profileData.name,
        institution: profileData.institution,
        bio: profileData.bio,
        verified: true,
        // Add profile image to the saved data
        profilePicture: {
          url: profileData.profileImage
        }
      };
      
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update Redux store
      dispatch(loginSuccess({ user: updatedUser }));
      
      // Mark as verified
      dispatch(markUserVerified());
      
      // Call update API
      await updateProfile({
        name: profileData.name,
        institution: profileData.institution,
        bio: profileData.bio
        // In a real implementation, you would upload the image to a server here
      }).unwrap();
      
      // Success message
        showToast({
          message: 'Profile updated successfully',
          type: 'success'
        });
      
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast({
        message: 'Something went wrong. Please try again.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add the missing handleProfilePictureClick function
  const handleProfilePictureClick = (e) => {
    if (e) {
      e.stopPropagation(); // Always stop propagation
    }
    
    try {
      if (editMode) {
        // If in edit mode, trigger the hidden file input
        const fileInput = document.getElementById('profile-picture-upload');
        if (fileInput) {
          fileInput.click();
        } else {
          console.error('Profile picture upload input not found');
          // Show an error message if needed
          showToast({
            message: 'Failed to open file selector. Please try again.',
            type: 'error'
          });
        }
      } else {
        // If not in edit mode, enter edit mode first
        setEditMode(true);
        // Use setTimeout to ensure the file input exists after the edit mode changes
        setTimeout(() => {
          const fileInput = document.getElementById('profile-picture-upload');
          if (fileInput) {
            fileInput.click();
          }
        }, 150);
      }
    } catch (error) {
      console.error('Error opening profile picture selector:', error);
      showToast({
        message: 'Something went wrong. Please try again.',
        type: 'error'
      });
    }
  };

  if (loading || userLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* Hidden file input element for profile picture uploads */}
      <Input 
        id="profile-picture-upload" 
        type="file" 
        sx={{ display: 'none' }} 
        onChange={handleFileChange}
        accept="image/*"
      />
    
      <Grid container spacing={4}>
        {/* Profile Summary */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  editMode ? (
                    <Tooltip title="Change profile picture" placement="top" arrow>
                      <label htmlFor="profile-picture-upload">
                        <IconButton 
                          size="small" 
                          sx={{ bgcolor: 'primary.main', color: 'white' }}
                          component="span"
                        >
                          <AddAPhotoIcon fontSize="small" />
                    </IconButton>
                      </label>
                    </Tooltip>
                  ) : null
                }
              >
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 4, position: 'relative' }}>
                  <IconButton 
                    sx={{ 
                      position: 'absolute', 
                      bottom: 0, 
                      right: 0,
                      zIndex: 2,
                      backgroundColor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      },
                    }}
                    onClick={handleProfilePictureClick}
                  >
                    <EditIcon />
                  </IconButton>
                  <Box 
                    sx={{ 
                      position: 'relative',
                      width: 120,
                      height: 120,
                      cursor: editMode ? 'pointer' : 'default',
                      '&:hover': editMode ? {
                        '& .overlay': {
                          opacity: 1,
                        },
                      } : {},
                    }}
                    onClick={editMode ? handleProfilePictureClick : undefined}
                  >
                    <Avatar
                      src={profileData.profileImage || user?.avatar}
                      alt={user?.name}
                      sx={{ 
                        width: 120,
                        height: 120,
                        border: '4px solid',
                        borderColor: 'primary.main',
                      }}
                    >
                      {user?.name?.charAt(0) || 'U'}
                    </Avatar>
                  </Box>
                </Box>
              </Badge>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {profileData.name}
              </Typography>
              <Chip 
                label="Premium Student" 
                color="primary" 
                variant="outlined"
                sx={{ mb: 1 }}
              />
              <Typography variant="body2" color="text.secondary" textAlign="center">
                {profileData.bio}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <List>
              <ListItem>
                <ListItemIcon>
                  <EmailIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Email" 
                  secondary={profileData.email} 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <SchoolIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Institution" 
                  secondary={profileData.institution} 
                />
              </ListItem>
            </List>

            <Divider sx={{ my: 2 }} />
          </Paper>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: 3, height: '100%' }}>
            <Box sx={{ p: 0 }}>
              <Tabs
                value={currentTab}
                onChange={handleTabChange}
                textColor="primary"
                indicatorColor="primary"
                variant="fullWidth"
              >
                <Tab label="Overview" icon={<AssignmentIcon />} iconPosition="start" />
                <Tab label="Account Settings" icon={<SettingsIcon />} iconPosition="start" />
              </Tabs>
            </Box>

            {/* Tab Content */}
            <Box sx={{ p: 3 }}>
              {/* Overview Tab */}
              {currentTab === 0 && (
                <Box>
                  <Grid container spacing={3}>
                    {/* Stats Cards */}
                    <Grid item xs={12} sm={4}>
                      <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 2 }}>
                        <CardContent sx={{ p: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Quizzes Taken
                          </Typography>
                          <Typography variant="h4" fontWeight="bold" color="primary.main">
                            {stats.quizzesTaken}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Total assessments completed
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 2 }}>
                        <CardContent sx={{ p: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Average Score
                          </Typography>
                          <Typography variant="h4" fontWeight="bold" color="success.main">
                            {stats.averageScore}%
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Across all assessments
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 2 }}>
                        <CardContent sx={{ p: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Study Time
                          </Typography>
                          <Typography variant="h4" fontWeight="bold" color="info.main">
                            {stats.timeSpent} hrs
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Total time spent studying
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>

                  {/* Recent Activity */}
                  <Box mt={4}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <HistoryIcon sx={{ mr: 1 }} /> Recent Activity
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    <List>
                      {stats.recentActivity.map((activity, index) => (
                        <React.Fragment key={activity.id}>
                          <ListItem sx={{ px: 1, py: 1.5 }}>
                            <ListItemIcon>
                              <Avatar 
                                sx={{ 
                                  bgcolor: 
                                    activity.type === 'quiz' ? 'primary.main' : 
                                    activity.type === 'assessment' ? 'success.main' : 'info.main'
                                }}
                              >
                                {activity.type === 'quiz' ? 'Q' : activity.type === 'assessment' ? 'A' : 'P'}
                              </Avatar>
                            </ListItemIcon>
                            <ListItemText 
                              primary={activity.title}
                              secondary={
                                <React.Fragment>
                                  <Typography variant="body2" component="span" color="text.secondary">
                                    {activity.date}
                                  </Typography>
                                  {activity.score && (
                                    <Chip
                                      label={`${activity.score}%`}
                                      size="small"
                                      sx={{ ml: 1 }}
                                      color={
                                        activity.score >= 90 ? 'success' : 
                                        activity.score >= 70 ? 'primary' : 'warning'
                                      }
                                    />
                                  )}
                                </React.Fragment>
                              }
                            />
                            <Button size="small" variant="outlined">View</Button>
                          </ListItem>
                          {index < stats.recentActivity.length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  </Box>

                  {/* Achievements */}
                  <Box mt={4}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <EmojiEventsIcon sx={{ mr: 1 }} /> Achievements
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    <Grid container spacing={2}>
                      {stats.achievements.map((achievement) => (
                        <Grid item xs={12} sm={4} key={achievement.id}>
                          <Paper 
                            sx={{ 
                              p: 2, 
                              display: 'flex', 
                              flexDirection: 'column', 
                              alignItems: 'center', 
                              borderRadius: 2,
                              border: '1px solid',
                              borderColor: 'primary.light',
                              bgcolor: 'primary.lighter',
                              height: '100%'
                            }}
                          >
                            <EmojiEventsIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                            <Typography variant="subtitle1" fontWeight="bold" align="center">
                              {achievement.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" align="center">
                              Earned on {achievement.date}
                            </Typography>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Box>
              )}

              {/* Account Settings Tab */}
              {currentTab === 1 && (
                <Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Personal Information
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Full Name"
                        name="name"
                        value={profileData.name}
                        onChange={handleChange}
                        disabled={!editMode}
                        fullWidth
                        variant="outlined"
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Email Address"
                        name="email"
                        value={profileData.email}
                        onChange={handleChange}
                        disabled={true}
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        helperText="Email cannot be changed as it's used for login"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Institution"
                        name="institution"
                        value={profileData.institution}
                        onChange={handleChange}
                        disabled={!editMode}
                        fullWidth
                        variant="outlined"
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Bio"
                        name="bio"
                        value={profileData.bio}
                        onChange={handleChange}
                        disabled={!editMode}
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        {!editMode ? (
                          <Button
                            variant="contained"
                            startIcon={<EditIcon />}
                            onClick={handleEdit}
                            sx={{ minWidth: 150 }}
                          >
                            Edit Profile
                          </Button>
                        ) : (
                          <Stack direction="row" spacing={2}>
                            <Button
                        variant="outlined"
                              startIcon={<CancelIcon />}
                              onClick={handleCancel}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="contained"
                              startIcon={<SaveIcon />}
                              onClick={handleSave}
                              color="success"
                            >
                              Save
                            </Button>
                          </Stack>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
