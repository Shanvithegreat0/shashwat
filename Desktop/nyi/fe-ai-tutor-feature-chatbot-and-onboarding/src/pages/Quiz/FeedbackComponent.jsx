/* eslint-disable react/prop-types */
import { Paper, Box, Typography, Divider, Tabs, Tab, Button } from '@mui/material'
import { useState, useEffect } from 'react'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import BookmarkIcon from '@mui/icons-material/Bookmark'

const FeedbackComponent = ({assessment, questionsData, currentIndex, remainingTime, setCurrentIndex}) => {
  // Format time to HH:MM:SS
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    const pad = (num) => String(num).padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`;
  };

  // Group questions by subject and keep track of original indices
  const groupedQuestions = questionsData.reduce((acc, question, idx) => {
    const subject = question.baseQuestion?.subject || 'General';
    if (!acc[subject]) {
      acc[subject] = [];
    }
    acc[subject].push({ ...question, originalIndex: idx, markedForReview: question.markedForReview || false });
    return acc;
  }, {});

  // Get current question's subject
  const getCurrentSubject = () => {
    const currentQuestion = questionsData[currentIndex];
    return currentQuestion?.baseQuestion?.subject || Object.keys(groupedQuestions)[0] || '';
  };

  const [selectedTab, setSelectedTab] = useState(getCurrentSubject());

  // Update selected tab whenever current question changes
  useEffect(() => {
    setSelectedTab(getCurrentSubject());
  }, [currentIndex, questionsData]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    // Find the first question index of the selected subject
    const firstQuestionOfSubject = questionsData.findIndex(
      question => question.baseQuestion?.subject === newValue
    );
    if (firstQuestionOfSubject !== -1) {
      setCurrentIndex(firstQuestionOfSubject);
    }
  };

  const getQuestionColor = (question) => {
    if (question.originalIndex === currentIndex) {
      return "lightblue";
    }
    if (question.markedForReview) {
      return question.status === "answered" || question.userAnswer 
        ? "#9C27B0" // Purple for answered and marked for review
        : "#FF9800"; // Orange for unmarked but flagged for review
    }
    return question.status === "answered" || question.userAnswer
      ? "green"
      : "grey";
  };

  const QuestionCircle = ({ question, index }) => (
    <Box sx={{ position: 'relative' }}>
      <Box
        sx={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          backgroundColor: getQuestionColor(question),
          color: "white",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          m: 0.5,
          position: 'relative'
        }}
        onClick={() => setCurrentIndex(question.originalIndex)}
      >
        {index + 1}
        {question.markedForReview && (
          <BookmarkIcon 
            sx={{ 
              position: 'absolute',
              top: -8,
              right: -8,
              fontSize: '16px',
              color: '#FF9800'
            }}
          />
        )}
      </Box>
    </Box>
  );

  // Legend component for question status
  const Legend = () => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: 'grey' }} />
        <Typography variant="caption">Not Answered</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: 'green' }} />
        <Typography variant="caption">Answered</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: '#FF9800' }} />
        <Typography variant="caption">Marked for Review</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: '#9C27B0' }} />
        <Typography variant="caption">Answered & Marked for Review</Typography>
      </Box>
    </Box>
  );

  return (
    <Paper sx={{ height: '100vh', overflowY: 'auto' }}>
      {/* Timer Section */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          mb: 3,
          p: 2,
          bgcolor: '#012a4a',
          borderRadius: 3,
          boxShadow: '0 4px 15px rgba(1,42,74,0.2)'
        }}
      >
        <AccessTimeIcon sx={{ color: 'white', mr: 1 }} />
        <Typography variant="h6" sx={{ 
          color: 'white',
          fontWeight: 600,
          letterSpacing: '0.5px'
        }}>
          Time Remaining: {formatTime(remainingTime)}
        </Typography>
      </Box>

      {/* Subject Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#f8f9fa' }}>
        <Tabs 
          value={selectedTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ 
            '& .MuiTab-root': { 
              fontWeight: 'bold',
              fontSize: '0.9rem',
              textTransform: 'none',
              color: '#012a4a'
            },
            '& .Mui-selected': {
              color: '#012a4a !important'
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#012a4a'
            }
          }}
        >
          {Object.keys(groupedQuestions).map((subject) => (
            <Tab 
              key={subject} 
              label={`${subject} (${groupedQuestions[subject].length})`}
              value={subject}
            />
          ))}
        </Tabs>
      </Box>

      {/* Questions Grid */}
      <Box sx={{ p: 2, bgcolor: '#f8f9fa' }}>
        {selectedTab && groupedQuestions[selectedTab] && (
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(5, 1fr)', 
            gap: 1,
            p: 2,
            border: '1px solid rgba(1,42,74,0.1)',
            borderRadius: 1,
            bgcolor: 'white'
          }}>
            {groupedQuestions[selectedTab].map((question, idx) => (
              <QuestionCircle 
                key={`${selectedTab}-${idx}`}
                question={question} 
                index={idx} 
              />
            ))}
          </Box>
        )}
      </Box>

      {/* Legend */}
      <Box sx={{ px: 2, bgcolor: '#f8f9fa' }}>
        <Legend />
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Quiz Summary */}
      <Box sx={{ p: 2, bgcolor: '#f8f9fa' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1, color: '#012a4a' }}>
          Quiz Summary
        </Typography>
        <Box sx={{ bgcolor: 'white', p: 2, borderRadius: 1, border: '1px solid rgba(1,42,74,0.1)' }}>
          <Typography variant="body2" sx={{ mb: 1, color: '#012a4a' }}>
            Total Questions: {questionsData?.length || 0}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1, color: '#012a4a' }}>
            Answered: {questionsData?.filter(q => q.userAnswer || q.status === "answered")?.length || 0}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1, color: '#012a4a' }}>
            Marked for Review: {questionsData?.filter(q => q.markedForReview)?.length || 0}
          </Typography>
          <Typography variant="body2" sx={{ color: '#012a4a' }}>
            Not Answered: {questionsData?.filter(q => !q.userAnswer && q.status !== "answered")?.length || 0}
          </Typography>
        </Box>
      </Box>
    </Paper>
  )
}

export default FeedbackComponent