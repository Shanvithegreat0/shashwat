import { Box, Button, Card, CardContent, CardHeader, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, Grid2, Radio, RadioGroup, Stack, TextField, Toolbar, Typography, useMediaQuery, useTheme } from '@mui/material'
import { useFormik } from 'formik';
import { useState, useEffect, useRef, useCallback } from 'react';
import FeedbackComponent from './FeedbackComponent.jsx';
import { useCreateEvaluationMutation, useUpdateAssessmentByIdMutation } from '../../store/slices/apiServices.js';
import FullScreenLoader from './quizComponents/FullScreenLoader.jsx';
import { saveSession } from './index.jsx';
import { useNavigate, useParams, useLocation } from 'react-router';
import { useToast } from '../../components/Toasts/useToast.js';
import BreadCrumbs from '../../components/BreadCrumbs.jsx';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const QuizComponent = ({ type, questionData, setQuestionData, assessment }) => {
  console.log(assessment);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { examId } = useParams();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [openSubmit, setOpenSubmit] = useState(false);
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [triggerUpdateAssesmentById] = useUpdateAssessmentByIdMutation();
  const timerRef = useRef({
    intervalId: null,
    endTime: null
  });

  const [triggerEvaluation, { isLoading: evaluating }] = useCreateEvaluationMutation();
  const [loading, setLoading] = useState(false);
  const [markedForReview, setMarkedForReview] = useState(new Set());

  // Function to handle navigation prevention
  const preventNavigation = useCallback((e) => {
    e.preventDefault();
    setShowExitWarning(true);
    // Push a new history state to counteract the back button press
    window.history.pushState(null, null, location.pathname);
    // For beforeunload, return a string to show browser's standard confirmation dialog
    e.returnValue = '';
    return '';
  }, [location.pathname]);

  // Setup navigation blockage
  useEffect(() => {
    // Create a blocked state in history on mount
    window.history.pushState(null, null, location.pathname);
    
    // Add event listeners
    window.addEventListener('popstate', preventNavigation);
    window.addEventListener('beforeunload', preventNavigation);

    // Hide header and navigation
    const appHeader = document.querySelector('.MuiAppBar-root');
    const footer = document.querySelector('footer');
    const socialLinks = document.querySelectorAll('a[href*="facebook"], a[href*="twitter"], a[href*="linkedin"], a[href*="instagram"], a[href*="youtube"]');
    
    if (appHeader) {
      appHeader.style.display = 'none';
    }
    if (footer) {
      footer.style.display = 'none';
    }
    socialLinks.forEach(link => {
      link.style.display = 'none';
    });

    return () => {
      // Clean up event listeners when unmounting
      window.removeEventListener('popstate', preventNavigation);
      window.removeEventListener('beforeunload', preventNavigation);
      
      // Restore header and footer
      if (appHeader) {
        appHeader.style.display = 'flex';
      }
      if (footer) {
        footer.style.display = 'block';
      }
      socialLinks.forEach(link => {
        link.style.display = '';
      });
    };
  }, [preventNavigation]);

  // Additional effect to ensure popstate listener is always active
  // This effect runs when showExitWarning changes
  useEffect(() => {
    if (!showExitWarning) {
      // Re-establish history state and listeners after dialog is closed
      window.history.pushState(null, null, location.pathname);
      
      // Remove and re-add event listener to ensure it works after each interaction
      window.removeEventListener('popstate', preventNavigation);
      window.addEventListener('popstate', preventNavigation);
    }
  }, [showExitWarning, preventNavigation, location.pathname]);

  const handleTimerExpiration = useCallback(async () => {
    if (timerRef.current.intervalId) {
      clearInterval(timerRef.current.intervalId);
    }
    try {
      let body ={
        assessmentSlug: null,
        status:null,
      };
      console.log(assessment.slug);
      body.assessmentSlug= assessment.slug;
      body.status= 'complete';
      const { data } = await triggerUpdateAssesmentById(body);
      
      navigate(`/quiz/result/${assessment.slug}`,{ replace: true });
    } catch (error) {
      console.error('Error fetching assessment details:', error);
    }
  }, [assessment.slug, navigate]);

  const startTimer = useCallback(
    (createdAt, totalTime) => {
      if (timerRef.current.intervalId) {
        clearInterval(timerRef.current.intervalId);
      }

      const duration = totalTime * 60;
      const endTime = new Date(createdAt).getTime() + duration * 1000;

      // Set end time in ref
      timerRef.current.endTime = endTime;

      // Start new interval with less frequent updates
      timerRef.current.intervalId = setInterval(() => {
        const currentTime = new Date().getTime();
        const timeLeft = Math.max(
          0,
          Math.floor((endTime - currentTime) / 1000)
        );

        setRemainingTime(timeLeft);

        if (timeLeft <= 0) {
          handleTimerExpiration();
        }
      }, 1000);

      // Initial time set
      const initialTimeLeft = Math.max(
        0,
        Math.floor((endTime - new Date().getTime()) / 1000)
      );
      setRemainingTime(initialTimeLeft);
    },
    [handleTimerExpiration]
  );

  // Function to load answers from localStorage
  const loadAnswersFromLocalStorage = () => {
    try {
      const savedAnswers = localStorage.getItem(`assessment_${assessment._id}`);
      if (savedAnswers) {
        return JSON.parse(savedAnswers);
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
    return null;
  };

  const formik = useFormik({
    initialValues: {
      answer: ''
    },
    onSubmit: async (values) => {
      try {
        if (values.answer !== "") {
          const { res } = await triggerEvaluation({
            evaluationId: questionData[currentIndex]?._id,
            userAnswer: values.answer
          });

          setQuestionData((prevQuestions) => {
            const updatedQuestions = [...prevQuestions];
            updatedQuestions[currentIndex] = {
              ...updatedQuestions[currentIndex],
              userAnswer: values.answer,
              status: "answered",
            };

            saveSession(
              updatedQuestions,
              currentIndex,
              assessment._id,
              assessment.totalTime,
              new Date().toISOString(),
              false
            );

            return updatedQuestions;
          });

          if (currentIndex < questionData.length - 1) {
            setCurrentIndex((prev) => prev + 1);
            formik.resetForm();
          }

        } else {
          if (currentIndex < questionData.length - 1) {
            setCurrentIndex((prev) => prev + 1);
          }
        }
      } catch (e) {
        showToast({ message: e, type: "error" });
      }
    },
  });

  useEffect(() => {
    const savedAnswers = loadAnswersFromLocalStorage();

    formik.resetForm();

    if (savedAnswers &&
      savedAnswers.questions &&
      savedAnswers.questions[currentIndex] &&
      savedAnswers.questions[currentIndex].status === 'answered') {

      const userAnswer = savedAnswers.questions[currentIndex].userAnswer;
      console.log(`Loading saved answer for question ${currentIndex + 1}:`, userAnswer);
      formik.setFieldValue('answer', userAnswer);
    }
  }, [currentIndex, assessment._id]);

  useEffect(() => {
    if (assessment && assessment.startTime && assessment.totalTime) {
      startTimer(assessment.startTime, assessment.totalTime);
    }

    return () => {
      if (timerRef.current.intervalId) {
        clearInterval(timerRef.current.intervalId);
      }
    };
  }, [assessment, startTimer]);

  const input = questionData[currentIndex]?.baseQuestion?.options?.length === 0 ? (
    <TextField
      id="answer"
      name="answer"
      label="Answer"
      multiline
      rows={4}
      sx={{ mb: 3, backgroundColor: '#fff' }}
      value={formik.values.answer}
      onChange={formik.handleChange}
      fullWidth
    />
  ) : (
    <Stack>
      <FormControl>
        <RadioGroup
          name="answer"
          value={formik.values.answer}
          onChange={formik.handleChange}
        >
          {(questionData[currentIndex]?.baseQuestion?.options || 
            questionData[currentIndex]?.options || 
            []).map((option, index) => (
            <FormControlLabel
              key={index}
              control={<Radio />}
              value={option}
              label={option}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </Stack>
  );

  const handlePrevious = () => {
    setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    handleClickOpen();
  };

  const handleClose = async (userResponse) => {
    setOpenSubmit(false);
    if (userResponse === "Agree") {
      let body = {
        assessmentSlug: null,
        status: null,
      };
      console.log(assessment.slug);
      body.assessmentSlug = assessment.slug;
      body.status = 'complete';
      try {
        const { data } = await triggerUpdateAssesmentById(body);
        // Exit full screen mode if it's active
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        } else if (document.webkitFullscreenElement) {
          await document.webkitExitFullscreen();
        } else if (document.mozFullScreenElement) {
          await document.mozCancelFullScreen();
        } else if (document.msFullscreenElement) {
          await document.msExitFullscreen();
        }
        navigate(`/quiz/result/${assessment.slug}`, { replace: true });
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  const handleExitWarningClose = (resume) => {
    setShowExitWarning(false);
    if (!resume) {
      // If user confirms they want to exit, we need to save their current state first
      saveSession(
        questionData,
        currentIndex,
        assessment._id,
        assessment.totalTime,
        new Date().toISOString(),
        true // Marking as interrupted
      );
      // Then redirect to a safe page
      navigate('/exams', { replace: true });
    }
    // When resuming, the useEffect for showExitWarning change will re-establish the popstate listener
  };

  const handleClickOpen = () => {
    setOpenSubmit(true);
  };

  // Add function to handle marking for review
  const handleMarkForReview = () => {
    setQuestionData((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[currentIndex] = {
        ...updatedQuestions[currentIndex],
        markedForReview: !updatedQuestions[currentIndex]?.markedForReview
      };
      return updatedQuestions;
    });
    setMarkedForReview(prev => {
      const newSet = new Set(prev);
      if (newSet.has(currentIndex)) {
        newSet.delete(currentIndex);
      } else {
        newSet.add(currentIndex);
      }
      return newSet;
    });
  };

  // Add function to handle save and next
  const handleSaveAndNext = async () => {
    try {
      if (formik.values.answer) {
        const { res } = await triggerEvaluation({
          evaluationId: questionData[currentIndex]?._id,
          userAnswer: formik.values.answer
        });

        setQuestionData((prevQuestions) => {
          const updatedQuestions = [...prevQuestions];
          updatedQuestions[currentIndex] = {
            ...updatedQuestions[currentIndex],
            userAnswer: formik.values.answer,
            status: "answered"
          };

          saveSession(
            updatedQuestions,
            currentIndex,
            assessment._id,
            assessment.totalTime,
            new Date().toISOString(),
            false
          );

          return updatedQuestions;
        });
      }

      if (currentIndex < questionData.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        formik.resetForm();
      }
    } catch (e) {
      showToast({ message: e, type: "error" });
    }
  };

  return (
    <Box 
      component="main" 
      sx={{ 
        display: 'flex',
        m: 0,
        p: 0,
        minHeight: '100vh',
        maxHeight: '100vh',
        overflow: 'hidden',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: '#fff'
      }}
    >
      {loading && <FullScreenLoader message={'Submitting...'} />}
      {evaluating && <FullScreenLoader message={'Evaluating...'} />}

      <Grid2 
        size={{ xs: 12, sm: 9, lg: 9 }} 
        sx={{
          p: '20px',
          m: 0,
          height: '100vh',
          overflow: 'auto'
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3,
          bgcolor: '#fff'
        }}>
          <Typography 
            variant="h4" 
            sx={{ 
              color: '#012a4a',
              fontWeight: 700,
              fontSize: '2rem'
            }}
          >
            Mains
            </Typography>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              bgcolor: '#012a4a !important',
              color: 'white',
              px: 4,
              py: 1.5,
              borderRadius: 3,
              fontWeight: 600,
              letterSpacing: '0.5px',
              boxShadow: '0 4px 15px rgba(1,42,74,0.2)',
              '&:hover': {
                bgcolor: '#013a63 !important',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(1,42,74,0.3)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Submit Exam
          </Button>
        </Box>
        <Box height={'calc(100vh - 160px)'}>
          <Stack height={'100%'} justifyContent={'space-between'}>
            <Card variant="outlined" sx={{ 
              p: 2, 
              borderRadius: "8px",
              bgcolor: '#012a4a',
              color: 'white',
              mb: 3
            }} >
              <CardHeader 
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="h6" sx={{ color: 'white' }}>Question - {currentIndex + 1}</Typography>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.1)',
                        color: 'white',
                        px: 2,
                        py: 0.5,
                        borderRadius: 2,
                        fontSize: '0.9rem',
                        fontWeight: 500
                      }}
                    >
                      {questionData[currentIndex]?.baseQuestion?.subject}
                    </Typography>
                  </Box>
                } 
              />
              <CardContent>
                <Typography fontSize={'20px'} sx={{ color: 'white' }}>
                  {questionData[currentIndex]?.baseQuestion?.questionText || 
                   questionData[currentIndex]?.questionText || 
                   "Question not available. Please try refreshing the page."}
                </Typography>
              </CardContent>
            </Card>

            <Card variant="outlined" sx={{ p: 2, borderRadius: "8px", mb: 3 }}>
              <CardContent>
                <form onSubmit={formik.handleSubmit} style={{ marginBottom: 0 }}>
                {input}
                </form>
              </CardContent>
            </Card>

            <Box sx={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 'auto',
              mb: 2,
              gap: 2
            }}>
                  <Button 
                variant="contained"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                sx={{
                  bgcolor: '#012a4a',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  '&:hover': {
                    bgcolor: '#023e7d'
                  },
                  '&.Mui-disabled': {
                    bgcolor: '#e0e0e0',
                    color: '#9e9e9e'
                  }
                }}
                startIcon={<ArrowBackIcon />}
              >
                Previous
                  </Button>

              <Stack direction="row" spacing={2}>
                  <Button
                    variant="outlined"
                  onClick={handleMarkForReview}
                  sx={{
                    color: questionData[currentIndex]?.markedForReview ? '#FF9800' : '#012a4a',
                    borderColor: questionData[currentIndex]?.markedForReview ? '#FF9800' : '#012a4a',
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    '&:hover': {
                      bgcolor: 'rgba(1,42,74,0.04)'
                    }
                  }}
                    startIcon={questionData[currentIndex]?.markedForReview ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                >
                  {questionData[currentIndex]?.markedForReview ? 'Marked for Review' : 'Mark for Review'}
                </Button>

                <Button
                  variant="contained"
                  onClick={handleSaveAndNext}
                  sx={{
                    bgcolor: '#012a4a',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    '&:hover': {
                      bgcolor: '#023e7d'
                    }
                  }}
                >
                      Save & Next
                    </Button>
                </Stack>

              <Button
                variant="contained"
                onClick={handleNext}
                sx={{
                  bgcolor: '#012a4a',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  '&:hover': {
                    bgcolor: '#023e7d'
                  }
                }}
                endIcon={<ArrowForwardIcon />}
              >
                {currentIndex === questionData.length - 1 ? 'Next' : 'Next'}
              </Button>
            </Box>
          </Stack>
        </Box>
      </Grid2>
      <Grid2 size={{ xs: 12, sm: 3, lg: 3 }} height={'100vh'} sx={{ borderLeft: '1px solid rgba(0,0,0,0.12)' }}>
        <FeedbackComponent
          assessment={assessment}
          questionsData={questionData}
          currentIndex={currentIndex}
          remainingTime={remainingTime}
          setCurrentIndex={setCurrentIndex}
        />
      </Grid2>
      
      {/* Submit Confirmation Dialog */}
      <Dialog
        fullScreen={fullScreen}
        open={openSubmit}
        onClose={() => handleClose("Disagree")}
        aria-labelledby="submit-dialog-title"
      >
        <DialogTitle id="submit-dialog-title">
          {"Are you sure you want to submit the exam?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You will not be able to make any further changes after submission.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => handleClose("Disagree")}>
            No, Go Back
          </Button>
          <Button onClick={() => handleClose("Agree")} autoFocus>
            Yes, Submit
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Exit Warning Dialog */}
      <Dialog
        fullScreen={fullScreen}
        open={showExitWarning}
        onClose={() => handleExitWarningClose(true)}
        aria-labelledby="exit-dialog-title"
        disableEscapeKeyDown // Prevent closing with Escape key
      >
        <DialogTitle id="exit-dialog-title">
          {"Warning: Assessment in Progress"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You are attempting to leave this assessment. Your progress will be saved, but the assessment timer will continue. Would you like to resume the assessment or exit anyway?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleExitWarningClose(false)} color="warning">
            Exit Anyway
          </Button>
          <Button onClick={() => handleExitWarningClose(true)} color="primary" autoFocus>
            Resume Assessment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default QuizComponent;