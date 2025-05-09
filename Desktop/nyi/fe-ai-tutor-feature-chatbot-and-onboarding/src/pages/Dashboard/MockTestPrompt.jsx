import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  Box 
} from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { Link as RouterLink } from 'react-router-dom';

const MockTestPrompt = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <AssessmentIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
          <Typography variant="h6">Welcome to Your Dashboard</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          We notice you're new here! To get started, we recommend taking a JEE Main mock test to help us understand your current level and provide personalized recommendations.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Your dashboard will be populated with performance analytics and a customized study plan after you complete your first assessment.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          I'll do it later
        </Button>
        <Button 
          component={RouterLink}
          to="/exams"
          variant="contained" 
          color="primary"
          onClick={onClose}
          startIcon={<AssessmentIcon />}
          autoFocus
        >
          Take JEE Main Mock Test
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MockTestPrompt; 