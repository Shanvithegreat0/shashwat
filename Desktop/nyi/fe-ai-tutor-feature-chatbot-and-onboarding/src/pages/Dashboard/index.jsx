import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container,
  Grid, 
  Paper, 
  Typography, 
  Card, 
  CardContent, 
  Divider, 
  Button, 
  Tabs, 
  Tab,
  Stack,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  Assessment as AssessmentIcon,
  Timeline as TimelineIcon,
  Psychology as PsychologyIcon,
  School as SchoolIcon,
  LocalFireDepartment as FireIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Assignment as AssignmentIcon,
  Book as BookIcon,
  Topic as TopicIcon,
  WatchLater as WatchLaterIcon,
  CalendarToday as CalendarTodayIcon,
  EmojiEvents as EmojiEventsIcon,
  Star as StarIcon,
  TipsAndUpdates as TipsAndUpdatesIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { PieChart } from '@mui/x-charts';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import MockTestPrompt from './MockTestPrompt';
import { useGetDashboardMutation, useGetAllAssessmentsMutation } from '../../store/slices/apiServices';

const Dashboard = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [studyPlan, setStudyPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMockTestPrompt, setShowMockTestPrompt] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [getDashboard] = useGetDashboardMutation();
  const [getAllAssessments] = useGetAllAssessmentsMutation();
  const [stats, setStats] = useState({
    totalAttempts: 0,
    averageScore: 0,
    completedAssessments: 0,
    streakDays: 0,
    subjectPerformance: [],
    upcomingAssessments: [],
    recentActivity: [],
    weakAreas: [],
    scoreProgression: []
  });

  // Fetch dashboard data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await getDashboard().unwrap();
        const dashboardData = response.data;
        if (dashboardData.isNewUser) {
          setIsNewUser(true);
          setShowMockTestPrompt(true);
        } else {
          setIsNewUser(false);
          setStats(prev => ({
            ...dashboardData.stats,
            scoreProgression: prev.scoreProgression // will be updated below
          }));
          setStudyPlan(dashboardData.studyPlan);
        }
        // Fetch attempts for 'mains' module for score progression
        const attemptsRes = await getAllAssessments(`?entityType=module&entitySlug=mains&page=1&limit=100`).unwrap();
        const attempts = attemptsRes?.data?.assessments || [];
        // Transform attempts to score progression data with attempt numbers
        const scoreProgression = attempts.map((attempt, idx) => ({
          attempt: `Attempt ${attempts.length - idx}`,
          scorePercentage: attempt.totalMarks && attempt.totalMarks > 0 ? Math.round((attempt.score / attempt.totalMarks) * 100) : 0
        })).reverse(); // reverse to show oldest first
        setStats(prev => ({
          ...prev,
          scoreProgression
        }));
      } catch (error) {
        console.error("Error fetching dashboard or attempts data:", error);
        setIsNewUser(false);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [getDashboard, getAllAssessments]);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleCloseMockTestPrompt = () => {
    setShowMockTestPrompt(false);
  };

  // Performance indicators calculation
  const getScoreColor = (score) => {
    if (score >= 85) return 'success.main';
    if (score >= 70) return 'warning.main';
    return 'error.main';
  };

  const getScoreBg = (score) => {
    if (score >= 85) return 'success.light';
    if (score >= 70) return 'warning.light';
    return 'error.light';
  };

  // Chart data
  const pieChartData = (stats.subjectPerformance || []).map(subject => ({
    id: subject.id,
    value: subject.attempts,
    label: subject.name,
    color: subject.color
  }));

  const barChartData = [
    { 
      data: (stats.subjectPerformance || []).map(subject => subject.score), 
      label: 'Average Score (%)' 
    }
  ];

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" disableGutters sx={{ mt: 0, mb: 8, pt: 0, px: 0 }}>
      {/* Mock Test Prompt for new users */}
      <MockTestPrompt open={showMockTestPrompt} onClose={handleCloseMockTestPrompt} />
      
      <Box sx={{ mb: 2, mt: 0, pt: 0 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          fontWeight="extrabold"
          sx={{ 
            fontSize: { xs: '2.8rem', md: '3.8rem', lg: '4.2rem' }, 
            fontFamily: 'Poppins, Inter, Roboto, Arial, sans-serif', 
            letterSpacing: '-1.5px', 
            lineHeight: 1.08,
            fontWeight: 800,
            color: '#012a4a'
          }}
        >
          Your Learning Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Track your performance, view your study plan, and monitor your progress
        </Typography>
      </Box>

      {isNewUser ? (
        // Empty Dashboard for new users
        <Box sx={{ my: 4 }}>
          <Alert severity="info" sx={{ mb: 3 }}>
            Your dashboard is currently empty. Take your first JEE Main mock test to start tracking your performance and get personalized study recommendations.
          </Alert>
          
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <AssessmentIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h5" gutterBottom fontWeight="bold">
                    Start Your Learning Journey
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Complete your first JEE Main mock test to populate your dashboard with personalized analytics and study recommendations.
                  </Typography>
                  <Button 
                    component={RouterLink}
                    to="/exams"
                    variant="contained" 
                    color="primary"
                    size="large"
                    startIcon={<AssessmentIcon />}
                    sx={{ mt: 2 }}
                  >
                    Take JEE Main Mock Test
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      ) : (
        // Regular Dashboard with data
        <React.Fragment>
          {/* 1. Charts Row */}
          <Box sx={{ display: 'flex', gap: 4, mb: 3, flexWrap: 'wrap', alignItems: 'flex-start' }}>
            {/* Score Progression Chart - left side, takes up more space and matches card grid height */}
            <Box sx={{ flex: 2, minWidth: 340, height: 360, display: 'flex', flexDirection: 'column', justifyContent: 'stretch' }}>
              <Card variant="outlined" sx={{ p: 2, mb: 0, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                  Score Progression
                </Typography>
                <Box sx={{ flex: 1, minHeight: 260, height: 'calc(100% - 40px)' }}>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={stats.scoreProgression}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="attempt" 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => {
                          const date = new Date(value);
                          return `${date.getDate()}/${date.getMonth() + 1}`;
                        }}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }} 
                        domain={[0, 100]} 
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="scorePercentage"
                        name="Score Percentage"
                        stroke="#2196f3"
                        strokeWidth={2}
                        dot={{
                          r: 4,
                          fill: "#2196f3",
                        }}
                        activeDot={{
                          r: 6,
                          fill: "#1976d2",
                          stroke: "#fff",
                          strokeWidth: 2,
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </Card>
            </Box>
            {/* Cards 2x2 grid - right side */}
            <Box sx={{ flex: 1, minWidth: 260, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 2, alignItems: 'stretch', height: 360 }}>
              {/* Card 1: Average Score */}
              <Card 
                sx={{ 
                  minHeight: 120,
                  borderRadius: 2.5,
                  background: '#fff',
                  boxShadow: '0 8px 32px 0 rgba(80,112,255,0.18)',
                  border: '1.5px solid #e0e7ef',
                  position: 'relative',
                  overflow: 'visible',
                  p: 0,
                  mb: 0.5,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  transition: 'box-shadow 0.2s',
                  '&:hover': {
                    boxShadow: '0 12px 36px 0 rgba(80,112,255,0.24)'
                  }
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: -22,
                    left: 18,
                    backgroundColor: 'primary.main',
                    borderRadius: '50%',
                    width: 44,
                    height: 44,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(25,118,210,0.18)',
                    border: '3px solid #fff',
                    zIndex: 2
                  }}
                >
                  <AssessmentIcon sx={{ fontSize: 24, color: '#fff' }} />
                  </Box>
                <CardContent sx={{ pt: 4, pb: 2, px: 2.5, textAlign: 'left', width: '100%' }}>
                  <Typography 
                    variant="subtitle2" 
                    fontWeight={700} 
                    sx={{ color: 'primary.main', mb: 0.5, fontSize: '1rem' }}
                  >
                    Average Score
                  </Typography>
                    <Typography 
                    variant="h4" 
                      component="div" 
                      fontWeight="bold" 
                      color={getScoreColor(stats.averageScore)}
                    sx={{ mb: 0.5, fontSize: '1.6rem' }}
                    >
                    {stats.averageScore}%
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={stats.averageScore} 
                      sx={{ 
                      height: 7, 
                      borderRadius: 3,
                      mb: 0.5,
                      bgcolor: 'rgba(0,0,0,0.07)'
                      }}
                    color={stats.averageScore >= 85 ? "success" : stats.averageScore >= 70 ? "warning" : "error"}
                  />
                  <Typography variant="caption" color="text.secondary">
                    Based on {stats.totalAttempts} attempts
                  </Typography>
                </CardContent>
              </Card>

              {/* Card 2: Assessments */}
              <Card 
                sx={{ 
                  minHeight: 120,
                  borderRadius: 2.5,
                  background: '#fff',
                  boxShadow: '0 8px 32px 0 rgba(0,184,217,0.14)',
                  border: '1.5px solid #e0e7ef',
                  position: 'relative',
                  overflow: 'visible',
                  p: 0,
                  mb: 0.5,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  transition: 'box-shadow 0.2s',
                  '&:hover': {
                    boxShadow: '0 12px 36px 0 rgba(0,184,217,0.22)'
                  }
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: -22,
                    left: 18,
                    backgroundColor: 'info.main',
                    borderRadius: '50%',
                    width: 44,
                    height: 44,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,184,217,0.18)',
                    border: '3px solid #fff',
                    zIndex: 2
                  }}
                >
                  <AssignmentIcon sx={{ fontSize: 24, color: '#fff' }} />
                  </Box>
                <CardContent sx={{ pt: 4, pb: 2, px: 2.5, textAlign: 'left', width: '100%' }}>
                  <Typography 
                    variant="subtitle2" 
                    fontWeight={700} 
                    sx={{ color: 'info.main', mb: 0.5, fontSize: '1rem' }}
                  >
                    Assessments
                  </Typography>
                    <Typography 
                    variant="h4" 
                      component="div" 
                      fontWeight="bold" 
                      color="info.main"
                    sx={{ mb: 0.5, fontSize: '1.6rem' }}
                    >
                    {stats.completedAssessments}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" gutterBottom>
                    Completed assessments
                  </Typography>
                    <Button 
                      component={RouterLink} 
                      to="/attempts/all" 
                    variant="contained"
                    fullWidth
                    color="info"
                    size="small"
                      endIcon={<TimelineIcon />}
                    sx={{ 
                      fontWeight: 600,
                      borderRadius: 2,
                      mt: 1,
                      background: 'linear-gradient(90deg, #00b8d9 0%, #36f3c9 100%)',
                      color: '#fff',
                      boxShadow: '0 2px 8px 0 rgba(0,184,217,0.10)',
                      '&:hover': {
                        background: 'linear-gradient(90deg, #36f3c9 0%, #00b8d9 100%)',
                        color: '#fff',
                      }
                    }}
                    >
                      View History
                    </Button>
                </CardContent>
              </Card>

              {/* Card 3: Daily Streak */}
              <Card 
                sx={{ 
                  minHeight: 120,
                  borderRadius: 2.5,
                  background: '#fff',
                  boxShadow: '0 8px 32px 0 rgba(255,138,101,0.14)',
                  border: '1.5px solid #e0e7ef',
                  position: 'relative',
                  overflow: 'visible',
                  p: 0,
                  mb: 0.5,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  transition: 'box-shadow 0.2s',
                  '&:hover': {
                    boxShadow: '0 12px 36px 0 rgba(255,138,101,0.22)'
                  }
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: -22,
                    left: 18,
                    backgroundColor: 'error.main',
                    borderRadius: '50%',
                    width: 44,
                    height: 44,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(255,138,101,0.18)',
                    border: '3px solid #fff',
                    zIndex: 2
                  }}
                >
                  <FireIcon sx={{ fontSize: 24, color: '#fff' }} />
                  </Box>
                <CardContent sx={{ pt: 4, pb: 2, px: 2.5, textAlign: 'left', width: '100%' }}>
                  <Typography 
                    variant="subtitle2" 
                    fontWeight={700} 
                    sx={{ color: 'error.main', mb: 0.5, fontSize: '1rem' }}
                  >
                    Daily Streak
                  </Typography>
                    <Typography 
                    variant="h4" 
                      component="div" 
                      fontWeight="bold" 
                      color="error.main"
                    sx={{ mb: 0.5, fontSize: '1.6rem' }}
                    >
                    {stats.streakDays} days
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Keep studying daily to maintain your streak!
                  </Typography>
                </CardContent>
              </Card>

              {/* Card 4: Study Focus */}
              <Card 
                sx={{ 
                  minHeight: 120,
                  borderRadius: 2.5,
                  background: '#fff',
                  boxShadow: '0 8px 32px 0 rgba(16,30,54,0.14)',
                  border: '1.5px solid #e0e7ef',
                  position: 'relative',
                  overflow: 'visible',
                  p: 0,
                  mb: 0.5,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  transition: 'box-shadow 0.2s',
                  '&:hover': {
                    boxShadow: '0 12px 36px 0 rgba(16,30,54,0.22)'
                  }
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: -22,
                    left: 18,
                    backgroundColor: '#012a4a',
                    borderRadius: '50%',
                    width: 44,
                    height: 44,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(1,42,74,0.18)',
                    border: '3px solid #fff',
                    zIndex: 2
                  }}
                >
                  <PsychologyIcon sx={{ fontSize: 24, color: '#fff' }} />
                  </Box>
                <CardContent sx={{ pt: 4, pb: 2, px: 2.5, textAlign: 'left', width: '100%' }}>
                  <Typography 
                    variant="subtitle2" 
                    fontWeight={700} 
                    sx={{ color: '#012a4a', mb: 0.5, fontSize: '1rem' }}
                  >
                    Study Focus
                  </Typography>
                  {stats.weakAreas.length > 0 ? (
                    <Typography variant="body2" color="primary.main" fontWeight={600}>
                          {stats.weakAreas[0].subject}
                      </Typography>
                  ) : (
                    <Typography variant="body2" color="primary.main" fontWeight={600}>
                      All Subjects
                        </Typography>
                  )}
                    <Button 
                      component={RouterLink} 
                      to="/exams" 
                    variant="contained"
                    fullWidth
                    size="small"
                      endIcon={<AssessmentIcon />}
                    sx={{ 
                      bgcolor: '#012a4a',
                      '&:hover': {
                        bgcolor: '#01396b'
                      },
                      fontWeight: 600,
                      borderRadius: 2,
                      mt: 1.5,
                      mb: 2,
                      color: '#fff',
                      boxShadow: '0 2px 8px 0 rgba(1,42,74,0.10)'
                    }}
                    >
                      Practice Now
                    </Button>
                </CardContent>
              </Card>
            </Box>
          </Box>

          {/* 2. Full-width Daily Streak Banner */}
          <Box sx={{ width: '100%', bgcolor: '#0a2540', color: '#fff', borderRadius: 3, boxShadow: 3, p: 3, mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Stack direction="row" alignItems="center" spacing={2}>
              <FireIcon sx={{ fontSize: 32, color: '#ff7043' }} />
              <Typography variant="h6" fontWeight={700}>
                Daily Streak: {stats.streakDays || 0} days
                </Typography>
              </Stack>
            <Button variant="contained" sx={{ bgcolor: '#ff7043', color: '#fff', fontWeight: 700, borderRadius: 3, px: 4, boxShadow: 2, minHeight: 48 }}>
              Maintain Streak
            </Button>
            </Box>

          {/* 3. Main Content Row (Recent Activity & Tabs) */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              {/* Recent Activity List */}
              <Paper sx={{ p: 0, boxShadow: 1, borderRadius: 2 }}>
                <List>
                  {stats.recentActivity.map((activity, index) => (
                    <React.Fragment key={activity.id}>
                      <ListItem
                        button
                        component={RouterLink}
                        to={activity.type === 'quiz' || activity.type === 'assessment' 
                          ? `/details/${activity.id}` 
                          : '#'}
                        sx={{ py: 2 }}
                      >
                        <ListItemIcon>
                          {activity.type === 'quiz' && (
                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                              <AssignmentIcon />
                            </Avatar>
                          )}
                          {activity.type === 'assessment' && (
                            <Avatar sx={{ bgcolor: 'success.main' }}>
                              <AssessmentIcon />
                            </Avatar>
                          )}
                          {activity.type === 'study' && (
                            <Avatar sx={{ bgcolor: 'info.main' }}>
                              <BookIcon />
                            </Avatar>
                          )}
                        </ListItemIcon>
                        <ListItemText 
                          primary={
                            <Typography variant="subtitle1" fontWeight={500}>
                              {activity.title}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="body2" color="text.secondary">
                              {activity.type === 'study' 
                                ? `Study session: ${activity.duration} minutes` 
                                : `Score: ${activity.score}%`} - {activity.date}
                            </Typography>
                          }
                        />
                        {activity.type !== 'study' && (
                          <Chip 
                            label={`${activity.score}%`} 
                            size="small"
                            sx={{ 
                              bgcolor: getScoreBg(activity.score),
                              color: getScoreColor(activity.score),
                              fontWeight: 'bold'
                            }}
                          />
                        )}
                      </ListItem>
                      {index < stats.recentActivity.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              {/* Full-width Tabbed Section: Study Plan & Subject Progress */}
              <Box sx={{ width: '100%', p: 0, m: 0 }}>
                <Paper sx={{ 
                  borderRadius: 2, 
                  overflow: 'hidden', 
                  boxShadow: '0 4px 20px rgba(1,42,74,0.1)',
                  mb: 4,
                  bgcolor: '#fff',
                  width: '100%',
                  p: 0,
                  m: 0
                }}>
                  <Box sx={{ p: 0, m: 0, width: '100%' }}>
                    <Tabs
                      value={currentTab}
                      onChange={handleTabChange}
                      sx={{
                        bgcolor: '#fff',
                        borderBottom: '1px solid rgba(1,42,74,0.1)',
                        '& .MuiTab-root': {
                          color: '#012a4a',
                          fontWeight: 600,
                          fontSize: '0.95rem',
                          textTransform: 'none',
                          minHeight: 56,
                          '&.Mui-selected': {
                            color: '#012a4a'
                          }
                        },
                        '& .MuiTabs-indicator': {
                          bgcolor: '#012a4a'
                        }
                      }}
                      variant="fullWidth"
                    >
                      <Tab 
                        label="Study Plan" 
                        icon={<BookIcon />} 
                        iconPosition="start"
                        sx={{ py: 2 }}
                      />
                      <Tab 
                        label="Subject Progress" 
                        icon={<TopicIcon />} 
                        iconPosition="start"
                        sx={{ py: 2 }}
                      />
                    </Tabs>
                  </Box>
                  <Box sx={{ p: 3, bgcolor: '#fff', width: '100%', m: 0 }}>
                    {/* Study Plan Tab */}
                    {currentTab === 0 && (
                      <Box>
                        <Grid container spacing={3}>
                          <Grid item xs={12}>
                            {/* Today's Study Goals */}
                            <Box mb={4}>
                              <Typography variant="h6" gutterBottom fontWeight={600} sx={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                color: '#012a4a',
                                mb: 3
                              }}>
                                <Box
                                  sx={{
                                    bgcolor: '#012a4a',
                                    borderRadius: '50%',
                                    width: 40,
                                    height: 40,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mr: 2,
                                    boxShadow: '0 4px 12px rgba(1,42,74,0.2)'
                                  }}
                                >
                                  <CalendarTodayIcon sx={{ color: '#fff' }} />
                                </Box>
                                Today's Study Goals
                              </Typography>
                              <Paper sx={{ 
                                p: 0, 
                                boxShadow: '0 4px 20px rgba(1,42,74,0.1)',
                                borderRadius: 2,
                                overflow: 'hidden',
                                border: '1px solid rgba(1,42,74,0.1)'
                              }}>
                                <List>
                                  {studyPlan.dailyGoals.map((goal, index) => (
                                    <React.Fragment key={goal.id}>
                                      <ListItem 
                                        sx={{ 
                                          py: 3,
                                          px: 3,
                                          transition: 'all 0.2s',
                                          '&:hover': {
                                            bgcolor: 'rgba(1,42,74,0.02)'
                                          },
                                          display: 'flex',
                                          alignItems: 'flex-start'
                                        }}
                                      >
                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', flex: 1 }}>
                                          <Box sx={{ mr: 2, mt: 0.5 }}>
                                          <Chip 
                                            label={goal.priority} 
                                            size="small"
                                              sx={{
                                                bgcolor: goal.priority === 'High' ? '#012a4a' : 
                                                       goal.priority === 'Medium' ? '#2563eb' : '#3b82f6',
                                                color: '#fff',
                                                fontWeight: 600,
                                                minWidth: 80,
                                                fontSize: '0.85rem'
                                              }}
                                            />
                                          </Box>
                                          <Box sx={{ flex: 1 }}>
                                            <Typography variant="subtitle1" fontWeight={600} color="#012a4a" gutterBottom>
                                              {goal.title}
                                            </Typography>
                                            <Stack direction="row" spacing={2} alignItems="center">
                                              <Chip 
                                                icon={<SchoolIcon sx={{ fontSize: '1rem !important' }} />}
                                                label={goal.subject}
                                                size="small"
                                                sx={{ 
                                                  bgcolor: 'rgba(1,42,74,0.08)',
                                                  color: '#012a4a',
                                                  '& .MuiChip-icon': {
                                                    color: '#012a4a'
                                                  }
                                                }}
                                              />
                                            <Typography variant="body2" color="text.secondary">
                                                {goal.duration} minutes
                                            </Typography>
                                            </Stack>
                                          </Box>
                                        <Button 
                                          variant="contained" 
                                            size="medium"
                                            sx={{
                                              bgcolor: '#012a4a',
                                              '&:hover': {
                                                bgcolor: '#01396b'
                                              },
                                              minWidth: 120,
                                              ml: 2,
                                              height: 40
                                            }}
                                          component={RouterLink}
                                          to={`/quiz?subject=${goal.subject}`}
                                        >
                                            Start Quiz
                                        </Button>
                                        </Box>
                                      </ListItem>
                                      {index < studyPlan.dailyGoals.length - 1 && (
                                        <Divider sx={{ 
                                          borderColor: 'rgba(1,42,74,0.1)',
                                          mx: 3
                                        }} />
                                      )}
                                    </React.Fragment>
                                  ))}
                                </List>
                              </Paper>
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>
                    )}

                    {/* Subject Progress Tab */}
                    {currentTab === 1 && (
                      <Grid container spacing={3} sx={{ width: '100%', m: 0 }}>
                        {stats.subjectPerformance.map((subject, idx) => (
                          <Grid item 
                            xs={12} 
                            sm={stats.subjectPerformance.length === 1 ? 12 : 6}
                            md={stats.subjectPerformance.length === 1 ? 12 : 4}
                            lg={stats.subjectPerformance.length === 1 ? 12 : 3}
                            key={subject.id}
                          >
                            <Card 
                              elevation={3}
                              sx={{
                                borderRadius: 2,
                                height: '100%',
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'transform 0.3s',
                                display: 'flex',
                                flexDirection: 'column',
                                '&:hover': {
                                  transform: 'translateY(-5px)',
                                  boxShadow: 5
                                }
                              }}
                            >
                              <Box sx={{ 
                                height: 8, 
                                width: '100%', 
                                bgcolor: subject.color 
                              }} />
                              
                              <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                  {subject.name}
                                </Typography>
                                
                                <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                                  <Typography variant="body2" color="text.secondary">
                                    Performance:
                                  </Typography>
                                  <Box sx={{ 
                                    px: 1, 
                                    py: 0.5, 
                                    borderRadius: 1, 
                                    bgcolor: getScoreBg(subject.score),
                                    color: getScoreColor(subject.score)
                                  }}>
                                    <Typography variant="body2" fontWeight="bold">
                                      {subject.score}%
                                    </Typography>
                                  </Box>
                                </Stack>
                                
                                <LinearProgress 
                                  variant="determinate" 
                                  value={subject.score} 
                                  sx={{ height: 8, borderRadius: 4, mb: 2 }}
                                  color={subject.score >= 85 ? "success" : subject.score >= 70 ? "warning" : "error"}
                                />
                                
                                <Stack direction="row" justifyContent="space-between" mb={2}>
                                  <Typography variant="body2" color="text.secondary">
                                    Attempts: <b>{subject.attempts}</b>
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Last: <b>{subject.lastAttemptDate}</b>
                                  </Typography>
                                </Stack>
                                
                                <Stack direction="row" spacing={1}>
                                  <Button 
                                    variant="outlined" 
                                    color="primary"
                                    fullWidth
                                    size="small"
                                    component={RouterLink}
                                    to={`/attempts/subject/${subject.slug}`}
                                  >
                                    History
                                  </Button>
                                  <Button 
                                    variant="contained" 
                                    color="primary"
                                    fullWidth
                                    size="small"
                                    component={RouterLink}
                                    to={`/quiz?subject=${subject.name}`}
                                  >
                                    Practice
                                  </Button>
                                </Stack>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    )}
                  </Box>
                </Paper>
              </Box>
            </Grid>
          </Grid>

          {/* Study Recommendations - Full Width Section */}
          {studyPlan && studyPlan.recommendations && studyPlan.recommendations.length > 0 && (
            <Box sx={{ width: '100%', bgcolor: '#f5faff', borderRadius: 3, boxShadow: 3, p: 4, mb: 4, mt: 2 }}>
              <Typography variant="h6" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', color: '#012a4a', mb: 3 }}>
                <TipsAndUpdatesIcon sx={{ mr: 1, color: 'primary.main', fontSize: 32 }} />
                Study Recommendations
              </Typography>
              <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(1,42,74,0.10)', bgcolor: 'white' }}>
                <ul style={{ margin: 0, paddingLeft: '1.5em' }}>
                  {studyPlan.recommendations.map((recommendation, index) => (
                    <li key={index} style={{ marginBottom: '1.2em', color: '#012a4a', fontSize: '1.08rem', lineHeight: 1.7 }}>
                      {recommendation}
                    </li>
                  ))}
                </ul>
              </Paper>
            </Box>
          )}

          {/* Achievements Section */}
          <Box mb={4}>
            <Typography variant="h5" component="h2" gutterBottom fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
              <EmojiEventsIcon sx={{ mr: 1 }} color="warning" /> Your Achievements
            </Typography>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Grid container spacing={2}>
                {[
                  { icon: <StarIcon />, title: '7-Day Streak', description: 'Studied for 7 consecutive days', achieved: true },
                  { icon: <AssignmentIcon />, title: 'Quiz Master', description: 'Scored over 90% in 5 quizzes', achieved: true },
                  { icon: <SchoolIcon />, title: 'Subject Expert', description: 'Mastered all topics in a subject', achieved: false },
                  { icon: <TimelineIcon />, title: 'Rapid Improver', description: 'Improved score by 20% in a week', achieved: false },
                ].map((achievement, index) => (
                  <Grid item xs={6} sm={3} key={index}>
                    <Box 
                      sx={{ 
                        textAlign: 'center', 
                        p: 2, 
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: achievement.achieved ? 'warning.main' : 'divider',
                        bgcolor: achievement.achieved ? 'warning.lighter' : 'background.default',
                        opacity: achievement.achieved ? 1 : 0.7,
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: achievement.achieved ? 'scale(1.05)' : 'none',
                        }
                      }}
                    >
                      <Avatar 
                        sx={{ 
                          mx: 'auto', 
                          mb: 1, 
                          bgcolor: achievement.achieved ? 'warning.main' : 'action.disabledBackground',
                          width: 48,
                          height: 48
                        }}
                      >
                        {achievement.icon}
                      </Avatar>
                      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        {achievement.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {achievement.description}
                      </Typography>
                      {achievement.achieved ? (
                        <Chip label="Achieved" size="small" color="warning" />
                      ) : (
                        <Chip label="In Progress" size="small" variant="outlined" />
                      )}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Box>
        </React.Fragment>
      )}
    </Container>
  );
};

export default Dashboard; 