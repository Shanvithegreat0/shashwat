import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Box,
  Card,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  Grid,
  Rating,
  FormGroup,
  FormHelperText,
  Slider,
  Autocomplete,
  Paper,
  LinearProgress,
  Divider,
  Stack,
  IconButton
} from '@mui/material';
import { 
  Check as CheckIcon, 
  School as SchoolIcon,
  Book as BookIcon,
  AssessmentOutlined as AssessmentIcon,
  BarChart as BarChartIcon,
  Flag as FlagIcon,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { saveOnboardingData } from '../../utils/userService';

// Sample data for dropdowns
const EXAMS = ['JEE'];

const SUBJECTS = [
  'Mathematics', 'Physics', 'Chemistry'];

const TOPICS_BY_SUBJECT = {
  'Mathematics': ['Algebra', 'Geometry', 'Calculus', 'Statistics', 'Trigonometry', 'Number Theory', 'Probability'],
  'Physics': ['Mechanics', 'Thermodynamics', 'Optics', 'Electricity', 'Magnetism', 'Modern Physics', 'Wave Motion'],
  'Chemistry': ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Analytical Chemistry'],
  };

const STUDY_HOURS_OPTIONS = [
  { value: '<1', label: 'Less than 1 hour' },
  { value: '1-2', label: '1-2 hours' },
  { value: '2-4', label: '2-4 hours' },
  { value: '4-6', label: '4-6 hours' },
  { value: '>6', label: 'More than 6 hours' }
];

const PROFICIENCY_LEVELS = [
  { value: 1, label: 'Beginner' },
  { value: 2, label: 'Elementary' },
  { value: 3, label: 'Intermediate' },
  { value: 4, label: 'Advanced' },
  { value: 5, label: 'Expert' }
];

const GOALS = [
  'Improve overall score',
  'Master difficult topics',
  'Complete syllabus on time',
  'Strengthen weak areas',
  'Improve speed and accuracy',
  'Practice through mock tests',
  'Learn effective techniques',
  'Get personalized feedback'
];

const USER_TYPES = [
  { id: '10th', label: '10th Standard'},
  { id: '11th', label: '11th Standard'},
  { id: '12th', label: '12th Standard'},
  { id: 'dropout', label: 'Dropout'},

];

const Onboarding = ({ inModal = false, onComplete }) => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);
  
  // Form state
  const [formData, setFormData] = useState({
    userType: '',
    name: '',
    email: '',
    targetExam: '',
    examDate: null,
    subjects: [],
    selectedTopics: {},
    weakTopics: {},
    studyHoursPerDay: '',
    learningStyle: '',
    proficiencyLevels: {},
    goals: [],
    additionalNotes: ''
  });
  
  // Form validation
  const [errors, setErrors] = useState({});
  
  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear errors when field is updated
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const handleUserTypeChange = (userType) => {
    setFormData({
      ...formData,
      userType
    });
    
    if (errors.userType) {
      setErrors({
        ...errors,
        userType: null
      });
    }
  };
  
  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      examDate: date
    });
  };
  
  const handleExamChange = (e) => {
    setFormData({
      ...formData,
      targetExam: e.target.value
    });
  };
  
  const handleSubjectChange = (e) => {
    const selectedSubjects = e.target.value;
    
    // Initialize selected and weak topics for new subjects
    const updatedSelectedTopics = { ...formData.selectedTopics };
    const updatedWeakTopics = { ...formData.weakTopics };
    
    selectedSubjects.forEach(subject => {
      if (!formData.subjects.includes(subject)) {
        updatedSelectedTopics[subject] = [];
        updatedWeakTopics[subject] = [];
      }
    });
    
    // Remove topics for subjects no longer selected
    formData.subjects.forEach(subject => {
      if (!selectedSubjects.includes(subject)) {
        delete updatedSelectedTopics[subject];
        delete updatedWeakTopics[subject];
      }
    });
    
    setFormData({
      ...formData,
      subjects: selectedSubjects,
      selectedTopics: updatedSelectedTopics,
      weakTopics: updatedWeakTopics
    });
  };
  
  const handleTopicChange = (subject, topics) => {
    setFormData({
      ...formData,
      selectedTopics: {
        ...formData.selectedTopics,
        [subject]: topics
      }
    });
  };
  
  const handleWeakTopicChange = (subject, topics) => {
    setFormData({
      ...formData,
      weakTopics: {
        ...formData.weakTopics,
        [subject]: topics
      }
    });
  };
  
  const handleProficiencyChange = (subject, level) => {
    setFormData({
      ...formData,
      proficiencyLevels: {
        ...formData.proficiencyLevels,
        [subject]: level
      }
    });
  };
  
  const handleGoalChange = (e, goal) => {
    const { checked } = e.target;
    if (checked) {
      setFormData({
        ...formData,
        goals: [...formData.goals, goal]
      });
    } else {
      setFormData({
        ...formData,
        goals: formData.goals.filter(g => g !== goal)
      });
    }
  };
  
  const handleLearningStyleChange = (e) => {
    setFormData({
      ...formData,
      learningStyle: e.target.value
    });
  };
  
  // Validate current step
  const validateStep = () => {
    let stepErrors = {};
    let isValid = true;
    
    switch (activeStep) {
      case 0: // User Type
        if (!formData.userType) {
          stepErrors.userType = 'Please select an option';
          isValid = false;
        }
        break;
      case 1: // Basic Information
        if (!formData.name.trim()) {
          stepErrors.name = 'Name is required';
          isValid = false;
        }
        if (!formData.email.trim()) {
          stepErrors.email = 'Email is required';
          isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          stepErrors.email = 'Email is invalid';
          isValid = false;
        }
        break;
      case 2: // Exam Details
        if (!formData.targetExam) {
          stepErrors.targetExam = 'Please select a target exam';
          isValid = false;
        }
        break;
      case 3: // Subject Selection
        if (formData.subjects.length === 0) {
          stepErrors.subjects = 'Please select at least one subject';
          isValid = false;
        }
        break;
      case 4: // Topic Selection and Proficiency
        // Check if at least one topic is selected for each subject
        formData.subjects.forEach(subject => {
          if (!formData.selectedTopics[subject] || formData.selectedTopics[subject].length === 0) {
            stepErrors[`selectedTopics-${subject}`] = `Please select at least one topic for ${subject}`;
            isValid = false;
          }
        });
        break;
      case 5: // Study Goals and Preferences
        if (!formData.studyHoursPerDay) {
          stepErrors.studyHoursPerDay = 'Please select your study hours';
          isValid = false;
        }
        if (formData.goals.length === 0) {
          stepErrors.goals = 'Please select at least one goal';
          isValid = false;
        }
        break;
      default:
        break;
    }
    
    setErrors(stepErrors);
    return isValid;
  };
  
  // Navigation functions
  const handleNext = () => {
    if (validateStep()) {
      const newStep = activeStep + 1;
      setActiveStep(newStep);
      setProgress((newStep / 6) * 100);
    }
  };
  
  const handleBack = () => {
    const newStep = activeStep - 1;
    setActiveStep(newStep);
    setProgress((newStep / 6) * 100);
  };
  
  const handleSubmit = async () => {
    // Save to localStorage (In a real app, you would save to your backend)
    try {
      const result = await saveOnboardingData(formData);
      if (result.success) {
        if (onComplete) {
          onComplete();
        } else {
          // Navigate to home/dashboard
          navigate('/exams');
        }
      } else {
        // Show error message
        console.error('Failed to save onboarding data');
      }
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      // Show error message to user
    }
  };
  
  // Define steps
  const steps = [
    'User Type',
    'Basic Information',
    'Exam Details',
    'Subject Selection',
    'Topic Knowledge',
    'Study Preferences'
  ];
  
  // Step icons
  const stepIcons = [
    <SchoolIcon />,
    <SchoolIcon />,
    <AssessmentIcon />,
    <BookIcon />,
    <BarChartIcon />,
    <FlagIcon />
  ];

  // User Type content
  const getUserTypeContent = () => {
    return (
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        py: 3,
        px: 3
      }}>
        <Box 
          component="img" 
          src="/assets/icons/robot.png" 
          alt="AI Tutor" 
          sx={{ width: 48, height: 48, mb: 3 }}
        />
        
        <Typography 
          variant="h5" 
          component="h1" 
          textAlign="center"
          fontWeight="500" 
          gutterBottom
          sx={{ mb: 4 }}
        >
          What is your highest level of education?
        </Typography>
        
        <Box sx={{ width: '100%', maxWidth: 450 }}>
          {USER_TYPES.map((type) => (
            <Card 
              key={type.id}
              onClick={() => handleUserTypeChange(type.id)}
              variant="outlined"
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 2.5,
                mb: 2,
                cursor: 'pointer',
                borderColor: formData.userType === type.id ? 'primary.main' : 'divider',
                borderWidth: formData.userType === type.id ? 2 : 1,
                borderRadius: 1,
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'background.paper'
                }
              }}
            >
              <Box sx={{ fontSize: '2rem', mr: 2 }}>{type.icon}</Box>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                {type.label}
              </Typography>
              <Radio
                checked={formData.userType === type.id}
                onChange={() => {}}
                value={type.id}
                name="user-type-radio"
                sx={{ 
                  '& .MuiSvgIcon-root': {
                    fontSize: 24,
                  },
                }}
              />
            </Card>
          ))}
          
          {errors.userType && (
            <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
              {errors.userType}
            </Typography>
          )}
        </Box>
      </Box>
    );
  };
  
  // Render step content
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return getUserTypeContent();
      case 1:
        return (
          <Card sx={{ p: 3, borderRadius: 2, boxShadow: inModal ? 'none' : undefined }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Let's get to know you better
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  required
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
                  required
                />
              </Grid>
            </Grid>
          </Card>
        );
      case 2:
        return (
          <Card sx={{ p: 3, borderRadius: 2, boxShadow: inModal ? 'none' : undefined }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Tell us about your exam goals
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth error={!!errors.targetExam} required>
                  <InputLabel id="target-exam-label">Target Exam</InputLabel>
                  <Select
                    labelId="target-exam-label"
                    name="targetExam"
                    value={formData.targetExam}
                    onChange={handleExamChange}
                    label="Target Exam"
                  >
                    {EXAMS.map((exam) => (
                      <MenuItem key={exam} value={exam}>{exam}</MenuItem>
                    ))}
                  </Select>
                  {errors.targetExam && <FormHelperText>{errors.targetExam}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Exam Date (if scheduled)"
                    value={formData.examDate}
                    onChange={handleDateChange}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </Card>
        );
      case 3:
        return (
          <Card sx={{ p: 3, borderRadius: 2, boxShadow: inModal ? 'none' : undefined }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Select the subjects you want to study
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth error={!!errors.subjects} required>
                  <InputLabel id="subjects-label">Subjects</InputLabel>
                  <Select
                    labelId="subjects-label"
                    multiple
                    name="subjects"
                    value={formData.subjects}
                    onChange={handleSubjectChange}
                    input={<OutlinedInput label="Subjects" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                  >
                    {SUBJECTS.map((subject) => (
                      <MenuItem key={subject} value={subject}>{subject}</MenuItem>
                    ))}
                  </Select>
                  {errors.subjects && <FormHelperText>{errors.subjects}</FormHelperText>}
                </FormControl>
              </Grid>
              {formData.subjects.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="subtitle1" mt={2} mb={1}>
                    Rate your proficiency in each subject:
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    {formData.subjects.map((subject) => (
                      <Grid item xs={12} key={subject} sx={{ mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body1" sx={{ width: '30%', minWidth: 150 }}>
                            {subject}:
                          </Typography>
                          <Rating
                            name={`rating-${subject}`}
                            value={formData.proficiencyLevels[subject] || 0}
                            onChange={(e, newValue) => handleProficiencyChange(subject, newValue)}
                            precision={1}
                            size="large"
                          />
                          <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                            {formData.proficiencyLevels[subject] ? 
                              PROFICIENCY_LEVELS.find(level => level.value === formData.proficiencyLevels[subject])?.label : 
                              'Not rated'}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Card>
        );
      case 4:
        return (
          <Card sx={{ p: 3, borderRadius: 2, boxShadow: inModal ? 'none' : undefined }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Select topics to study and identify weak areas
            </Typography>
            
            {formData.subjects.map((subject) => (
              <Box key={subject} mb={4}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  {subject}
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FormControl 
                      fullWidth 
                      error={!!errors[`selectedTopics-${subject}`]}
                    >
                      <Typography variant="body2" mb={1}>
                        Topics to study:
                      </Typography>
                      <Autocomplete
                        multiple
                        options={TOPICS_BY_SUBJECT[subject] || []}
                        value={formData.selectedTopics[subject] || []}
                        onChange={(e, newValue) => handleTopicChange(subject, newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder="Select topics"
                          />
                        )}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip
                              label={option}
                              {...getTagProps({ index })}
                              key={option}
                            />
                          ))
                        }
                      />
                      {errors[`selectedTopics-${subject}`] && (
                        <FormHelperText>{errors[`selectedTopics-${subject}`]}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <Typography variant="body2" mb={1}>
                        Weak areas (optional):
                      </Typography>
                      <Autocomplete
                        multiple
                        options={(formData.selectedTopics[subject] || []).filter(
                          topic => !(formData.weakTopics[subject] || []).includes(topic)
                        )}
                        value={formData.weakTopics[subject] || []}
                        onChange={(e, newValue) => handleWeakTopicChange(subject, newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder="Select weak topics"
                          />
                        )}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip
                              label={option}
                              {...getTagProps({ index })}
                              key={option}
                              color="error"
                              variant="outlined"
                            />
                          ))
                        }
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                
                <Divider sx={{ mt: 2, mb: 2 }} />
              </Box>
            ))}
          </Card>
        );
      case 5:
        return (
          <Card sx={{ p: 3, borderRadius: 2, boxShadow: inModal ? 'none' : undefined }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Study preferences and goals
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth error={!!errors.studyHoursPerDay} required>
                  <InputLabel id="study-hours-label">How many hours can you study per day?</InputLabel>
                  <Select
                    labelId="study-hours-label"
                    name="studyHoursPerDay"
                    value={formData.studyHoursPerDay}
                    onChange={handleChange}
                    label="How many hours can you study per day?"
                  >
                    {STUDY_HOURS_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                    ))}
                  </Select>
                  {errors.studyHoursPerDay && <FormHelperText>{errors.studyHoursPerDay}</FormHelperText>}
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <FormControl component="fieldset" error={!!errors.goals} required>
                  <Typography variant="subtitle1" gutterBottom>
                    Select your study goals:
                  </Typography>
                  <FormGroup>
                    {GOALS.map((goal) => (
                      <FormControlLabel
                        key={goal}
                        control={
                          <Checkbox
                            checked={formData.goals.includes(goal)}
                            onChange={(e) => handleGoalChange(e, goal)}
                          />
                        }
                        label={goal}
                      />
                    ))}
                  </FormGroup>
                  {errors.goals && <FormHelperText>{errors.goals}</FormHelperText>}
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Additional notes or requirements (optional)"
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleChange}
                  multiline
                  rows={4}
                />
              </Grid>
            </Grid>
          </Card>
        );
      default:
        return 'Unknown step';
    }
  };
  
  return (
    <Box sx={{ 
      padding: inModal ? 0 : 3, 
      bgcolor: inModal ? 'transparent' : '#f5f7ff',
      minHeight: inModal ? 'auto' : '100vh'
    }}>
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        {!inModal && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Personalize Your Learning Experience
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Complete the following steps to tailor your study plan and quizzes to your needs.
            </Typography>
          </Box>
        )}
        
        {inModal ? (
          <Box sx={{ mb: 3, mt: 3, textAlign: 'center' }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Personalize Your Learning Experience
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Complete the following steps to tailor your study plan and quizzes to your needs.
            </Typography>
          </Box>
        ) : null}
        
        <Paper 
          sx={{ 
            p: 2, 
            mb: 3, 
            borderRadius: 2,
            boxShadow: inModal ? 'none' : undefined,
            bgcolor: inModal ? 'transparent' : undefined
          }}
        >
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ mb: 2, height: 8, borderRadius: 5 }}
          />
          
          {!inModal && (
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel
                    StepIconProps={{
                      icon: stepIcons[index]
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          )}
          
          {inModal && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              px: 1
            }}>
              {steps.map((label, index) => (
                <Box 
                  key={label} 
                  sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    opacity: activeStep === index ? 1 : 0.5,
                    transition: 'opacity 0.3s'
                  }}
                >
                  <Box 
                    sx={{ 
                      bgcolor: activeStep >= index ? 'primary.main' : 'divider',
                      color: 'white',
                      width: 30,
                      height: 30,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px'
                    }}
                  >
                    {activeStep > index ? <CheckIcon fontSize="small" /> : index + 1}
                  </Box>
                  {activeStep === index && (
                    <Typography variant="caption" sx={{ mt: 1, display: { xs: 'none', sm: 'block' } }}>
                      {label}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          )}
        </Paper>
        
        <Box sx={{ mt: 2, mb: 3 }}>
          {getStepContent(activeStep)}
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, mb: 2 }}>
          <Button
            variant="outlined"
            onClick={handleBack}
            disabled={activeStep === 0}
            startIcon={<ArrowBackIcon />}
            sx={{ display: inModal && activeStep === 0 ? 'none' : 'flex' }}
          >
            Back
          </Button>
          
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              endIcon={<SaveIcon />}
              sx={{ ml: activeStep === 0 ? 'auto' : 0 }}
            >
              Complete Setup
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              endIcon={<ArrowForwardIcon />}
              disabled={activeStep === 0 && !formData.userType}
              sx={{ 
                ml: activeStep === 0 ? 'auto' : 0,
                px: activeStep === 0 ? 4 : undefined,
                ...(activeStep === 0 && inModal ? {
                  bgcolor: '#ff9800',
                  '&:hover': {
                    bgcolor: '#f57c00'
                  }
                } : {})
              }}
            >
              {activeStep === 0 ? 'Next' : 'Continue'}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Onboarding; 