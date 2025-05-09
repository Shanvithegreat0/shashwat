import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, CircularProgress, Grid, Divider } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import SchoolIcon from '@mui/icons-material/School';
import { format } from 'date-fns';

const ProgressTracker = () => {
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState([]);
  const [stats, setStats] = useState({
    totalAttempts: 0,
    averageScore: 0,
    bestScore: 0,
    recentProgress: 0, // positive = improvement, negative = decline
  });
  
  useEffect(() => {
    // In a real app, you'd fetch this from your API
    // For demo purposes, we'll use mock data
    const mockAssessments = [
      { 
        id: 1, 
        date: new Date('2023-01-05'), 
        score: 65, 
        totalMarks: 100,
        examName: 'Physics Mid-Term' 
      },
      { 
        id: 2, 
        date: new Date('2023-01-12'), 
        score: 72, 
        totalMarks: 100,
        examName: 'Chemistry Quiz' 
      },
      { 
        id: 3, 
        date: new Date('2023-01-26'), 
        score: 76, 
        totalMarks: 100,
        examName: 'Physics Final' 
      },
      { 
        id: 4, 
        date: new Date('2023-02-05'), 
        score: 84, 
        totalMarks: 100,
        examName: 'Chemistry Final' 
      },
    ];
    
    // Process the data
    const processed = mockAssessments.map(assessment => ({
      name: format(assessment.date, 'MMM d'),
      score: (assessment.score / assessment.totalMarks * 100).toFixed(1),
      examName: assessment.examName,
      fullDate: format(assessment.date, 'PP')
    }));
    
    // Calculate stats
    const totalAttempts = mockAssessments.length;
    const allScores = mockAssessments.map(a => a.score / a.totalMarks * 100);
    const averageScore = allScores.reduce((sum, score) => sum + score, 0) / totalAttempts;
    const bestScore = Math.max(...allScores);
    
    // Calculate recent progress (last two assessments)
    let recentProgress = 0;
    if (totalAttempts >= 2) {
      const lastScore = allScores[allScores.length - 1];
      const secondLastScore = allScores[allScores.length - 2];
      recentProgress = lastScore - secondLastScore;
    }
    
    setProgressData(processed);
    setStats({
      totalAttempts,
      averageScore: averageScore.toFixed(1),
      bestScore: bestScore.toFixed(1),
      recentProgress: recentProgress.toFixed(1)
    });
    setLoading(false);
  }, []);
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Card variant="outlined" sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          <TrendingUpIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
          Your Progress
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Box height={300}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={progressData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card 
              variant="outlined" 
              sx={{ 
                mb: 2, 
                bgcolor: 'primary.light', 
                color: 'primary.dark',
                height: 'calc(100% - 16px)'
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  <SchoolIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                  Progress Summary
                </Typography>
                
                <Divider sx={{ my: 1.5, borderColor: 'primary.main', opacity: 0.5 }} />
                
                <Box sx={{ my: 2 }}>
                  <Typography variant="body2" color="primary.dark">Total Assessments</Typography>
                  <Typography variant="h4" fontWeight="bold" color="primary.dark">
                    {stats.totalAttempts}
                  </Typography>
                </Box>
                
                <Box sx={{ my: 2 }}>
                  <Typography variant="body2" color="primary.dark">Average Score</Typography>
                  <Typography variant="h4" fontWeight="bold" color="primary.dark">
                    {stats.averageScore}%
                  </Typography>
                </Box>
                
                <Box sx={{ my: 2 }}>
                  <Typography variant="body2" color="primary.dark">Best Score</Typography>
                  <Typography variant="h4" fontWeight="bold" color="primary.dark">
                    {stats.bestScore}%
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                    <WorkspacePremiumIcon sx={{ fontSize: 16, mr: 0.5 }} />
                    Keep up the good work!
                  </Typography>
                </Box>
                
                <Box sx={{ my: 2 }}>
                  <Typography variant="body2" color="primary.dark">Recent Progress</Typography>
                  <Typography 
                    variant="h5" 
                    fontWeight="bold" 
                    color={parseFloat(stats.recentProgress) >= 0 ? 'success.main' : 'error.main'}
                  >
                    {parseFloat(stats.recentProgress) >= 0 ? '+' : ''}{stats.recentProgress}%
                  </Typography>
                  <Typography variant="caption" color={parseFloat(stats.recentProgress) >= 0 ? 'success.main' : 'error.main'}>
                    {parseFloat(stats.recentProgress) >= 0 
                      ? 'Improving! You\'re making progress.' 
                      : 'Keep practicing to improve your score.'}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ProgressTracker; 