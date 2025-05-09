import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Paper, 
  Avatar, 
  Typography, 
  TextField, 
  IconButton, 
  Button, 
  Fade, 
  CircularProgress,
  Stack,
  Tooltip,
  Card,
  CardContent,
  Divider,
  Chip,
  Grid,
  Rating,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  LinearProgress,
  Fab
} from '@mui/material';
import { 
  Send as SendIcon, 
  Close as CloseIcon,
  Minimize as MinimizeIcon,
  KeyboardArrowUp as ExpandIcon,
  School as SchoolIcon,
  StarBorder as StarBorderIcon,
  CheckCircle as CorrectIcon,
  Cancel as IncorrectIcon,
  TrendingUp as ImprovementIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { skipOnboarding, saveOnboardingData, getOnboardingData } from '../utils/userService';
import { useGetChatHistoryQuery, useSendChatMessageMutation, useUpdateProfileMutation, useGetUserRecordsMutation, useGetDashboardMutation, useGetAllAssessmentsMutation } from '../store/slices/apiServices';
import ReactMarkdown from 'react-markdown';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

const ChatbotUI = ({ 
  isOpen, 
  isMinimized, 
  onClose, 
  onMinimize,
  onMaximize,
  isRequired = false,
  initialMessages = [],
  onNewMessage,
}) => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('welcome'); // welcome, qualification, examDate, attempts, proficiency, goals, complete
  const [userChoices, setUserChoices] = useState({
    qualification: '',
    examDate: null,
    attempts: '',
    proficiency: {
      physics: 0,
      chemistry: 0,
      mathematics: 0
    },
    goals: []
  });
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [examDate, setExamDate] = useState(null);
  const [assessmentData, setAssessmentData] = useState(null);
  const [showingAssessment, setShowingAssessment] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  
  const [updateProfile] = useUpdateProfileMutation();
  const [getUserRecords, { isLoading: isLoadingUserRecords }] = useGetUserRecordsMutation();
  const [getDashboard, { isLoading: isLoadingDashboard }] = useGetDashboardMutation();
  const [getAllAssessments, { isLoading: isLoadingAssessments }] = useGetAllAssessmentsMutation();
  
  // Chat functionality
  const { data: chatHistoryData, isLoading: isLoadingChatHistory } = useGetChatHistoryQuery(undefined, {
    skip: !isOnboardingComplete
  });
  const [sendChatMessage] = useSendChatMessageMutation();
  
  // Add state to store user preferences
  const [userPreferences, setUserPreferences] = useState(null);
  
  // Add state to track if suggestions are hidden
  const [suggestionsHidden, setSuggestionsHidden] = useState(false);
  
  // Add state to track if there are more older messages
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  
  // Check if onboarding is already complete
  useEffect(() => {
    const onboardingData = localStorage.getItem('onboardingData');
    if (onboardingData) {
      const data = JSON.parse(onboardingData);
      setIsOnboardingComplete(data.completed === true);
      
      // Load user preferences from onboarding data
      if (data.completed) {
        setUserPreferences(data);
      }
    } else {
      setIsOnboardingComplete(false);
      setIsOnboarding(true);
    }
  }, []);

  // Initialize suggestions visibility from localStorage
  useEffect(() => {
    const savedPreference = localStorage.getItem('suggestionsHidden');
    if (savedPreference !== null) {
      setSuggestionsHidden(savedPreference === 'true');
    }
  }, []);

  // Update hasMoreMessages state when initialMessages changes
  useEffect(() => {
    if (initialMessages && initialMessages.length > 15) {
      setHasMoreMessages(true);
    } else {
      setHasMoreMessages(false);
    }
  }, [initialMessages]);

  // Function to create personalized welcome message
  const getPersonalizedWelcomeMessage = () => {
    let welcomeMsg = `Hi ${user?.name || 'there'}! 👋 I'm your AI JEE Tutor assistant.`;
    
    // Add personalized greeting based on user data
    if (userPreferences) {
      if (userPreferences.qualification) {
        welcomeMsg += ` As a ${userPreferences.qualification} student,`;
      }
      
      if (userPreferences.examDate) {
        const examDate = new Date(userPreferences.examDate);
        if (!isNaN(examDate.getTime())) {
          const diffTime = Math.abs(examDate - new Date());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          welcomeMsg += ` with ${diffDays} days left for your JEE exam,`;
        }
      }
      
      // Add personalized focus areas based on proficiency
      if (userPreferences.proficiency) {
        const weakestSubject = Object.entries(userPreferences.proficiency)
          .reduce((lowest, [subject, rating]) => 
            rating < lowest.rating ? { subject, rating } : lowest, 
            { subject: null, rating: 6 }
          );
        
        if (weakestSubject.subject && weakestSubject.rating < 4) {
          welcomeMsg += ` I'll help you improve your ${weakestSubject.subject} skills specifically.`;
        } else {
          welcomeMsg += ` I'll help you achieve your JEE goals.`;
        }
      } else {
        welcomeMsg += ` I'll help you with your JEE preparation.`;
      }
    } else {
      welcomeMsg += ` How can I help you with your JEE preparation today?`;
    }
    
    welcomeMsg += `\n\nYou can ask me to:\n- Show your assessment results and performance\n- Explain topics you're struggling with\n- Create a personalized study plan\n- Provide practice questions and explanations`;
    
    return welcomeMsg;
  };

  // Initialize with welcome message or onboarding flow
  useEffect(() => {
    if (isOnboarding) {
      // Start onboarding flow
      setMessages([{
        sender: 'bot',
        text: `Hi ${user?.name || 'there'}! 👋 I'm your AI JEE Tutor assistant. Let's set up your personalized learning experience. First, what is your current qualification?`,
        timestamp: new Date(),
        choices: [
          '10th',
          '11th',
          '12th',
          'Dropout'
        ]
      }]);
      setStep('qualification');
    } else if (initialMessages && initialMessages.length > 0) {
      // Only show the most recent 10 messages for a more focused view
      const recentMessages = initialMessages.slice(-10);
      
      setMessages(recentMessages.map(msg => ({
          sender: msg.role === 'user' ? 'user' : 'bot',
          text: msg.content,
          timestamp: new Date(msg.timestamp)
        })));
      } else {
      // Default welcome message with personalization
        setMessages([{
          sender: 'bot',
        text: getPersonalizedWelcomeMessage(),
          timestamp: new Date()
        }]);
      }
  }, [initialMessages, user, isOnboarding, userPreferences]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Also scroll to bottom when chat is opened
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      // Use setTimeout to ensure the scrolling happens after rendering
      setTimeout(() => {
        messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
      }, 100);
    }
  }, [isOpen]);

  // Listen for pre-fill message event
  useEffect(() => {
    const handleSetInputEvent = (event) => {
      if (event.detail && event.detail.message) {
        setUserInput(event.detail.message);
      }
    };
    
    window.addEventListener('setChatbotInput', handleSetInputEvent);
    
    return () => {
      window.removeEventListener('setChatbotInput', handleSetInputEvent);
    };
  }, []);

  // Handle onboarding choice selection
  const handleOnboardingChoice = async (choice) => {
    // Add user message to chat
    const newUserMessage = {
      sender: 'user',
      text: choice,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setLoading(true);
    
    // Update user choices based on current step
    let nextStep = step;
    let botResponse = '';
    const updatedChoices = { ...userChoices };
    
    switch(step) {
      case 'qualification':
        updatedChoices.qualification = choice;
        nextStep = 'examDate';
        botResponse = `Great! When is your JEE exam date? Please select or enter the date.`;
        break;
        
      case 'examDate':
        try {
          // If choice is a date string, parse it
          const dateObj = new Date(choice);
          if (isNaN(dateObj.getTime())) {
            // Invalid date, use the date picker value
            updatedChoices.examDate = examDate ? examDate.toISOString() : null;
          } else {
            updatedChoices.examDate = dateObj.toISOString();
          }
        } catch (e) {
          updatedChoices.examDate = examDate ? examDate.toISOString() : null;
        }
        
        nextStep = 'attempts';
        botResponse = `How many attempts have you already taken for JEE?`;
        break;
        
      case 'attempts':
        updatedChoices.attempts = choice;
        nextStep = 'proficiency';
        botResponse = `Please rate your proficiency in each subject (from 1-5):
        
Physics: 
Chemistry: 
Mathematics:`;
        break;
        
      case 'proficiency':
        // Extract proficiency ratings from input or use pre-set values
        if (updatedChoices.proficiency.physics === 0 || 
            updatedChoices.proficiency.chemistry === 0 || 
            updatedChoices.proficiency.mathematics === 0) {
          // If no ratings have been set yet, parse from text
          try {
            const text = choice.toLowerCase();
            const physicsMatch = text.match(/physics\s*:?\s*(\d+)/);
            const chemistryMatch = text.match(/chemistry\s*:?\s*(\d+)/);
            const mathsMatch = text.match(/math(?:ematics)?\s*:?\s*(\d+)/);
            
            if (physicsMatch) updatedChoices.proficiency.physics = parseInt(physicsMatch[1]);
            if (chemistryMatch) updatedChoices.proficiency.chemistry = parseInt(chemistryMatch[1]);
            if (mathsMatch) updatedChoices.proficiency.mathematics = parseInt(mathsMatch[1]);
          } catch (e) {
            console.error("Error parsing proficiency:", e);
          }
        }
        
        nextStep = 'goals';
        botResponse = `Lastly, what are your primary goals for JEE preparation?`;
        break;
        
      case 'goals':
        updatedChoices.goals = choice.split(/,|;/).map(g => g.trim());
        nextStep = 'complete';
        botResponse = `Thank you for sharing your information! I've set up your personalized learning experience:
        
• Qualification: ${updatedChoices.qualification}
• Exam Date: ${updatedChoices.examDate ? new Date(updatedChoices.examDate).toLocaleDateString() : 'Not specified'}
• Previous Attempts: ${updatedChoices.attempts}
• Proficiency Levels:
  - Physics: ${updatedChoices.proficiency.physics}/5
  - Chemistry: ${updatedChoices.proficiency.chemistry}/5
  - Mathematics: ${updatedChoices.proficiency.mathematics}/5
• Goals: ${updatedChoices.goals.join(', ')}

How can I help you with your JEE preparation today? You can ask me to show your assessment results, explain difficult concepts, or create a study plan based on your needs.`;
        
        // Save onboarding data
        await saveOnboardingData(updatedChoices);
        setIsOnboardingComplete(true);
        setIsOnboarding(false);
        
        // Update user profile
        try {
          await updateProfile({
            preferences: {
              qualification: updatedChoices.qualification,
              examDate: updatedChoices.examDate,
              attempts: updatedChoices.attempts,
              proficiency: updatedChoices.proficiency,
              goals: updatedChoices.goals
            }
          });
        } catch (error) {
          console.error('Error updating profile:', error);
        }
        break;
    }
    
    setUserChoices(updatedChoices);
    setStep(nextStep);
    
    // Add bot response with choices if needed
    const newBotMessage = {
      sender: 'bot',
      text: botResponse,
      timestamp: new Date()
    };
    
    // Add custom UI elements based on next step
    if (nextStep === 'examDate') {
      newBotMessage.customUI = 'datePicker';
    } else if (nextStep === 'attempts') {
      newBotMessage.choices = ['0', '1', '2', '3+'];
    } else if (nextStep === 'proficiency') {
      newBotMessage.customUI = 'proficiencyRating';
    } else if (nextStep === 'goals') {
      newBotMessage.choices = [
        'Improve weak areas',
        'Clear concepts',
        'Practice more problems',
        'Improve speed and accuracy',
        'Get into a top college',
        'Beat the competition',
        'Qualify the cutoff'
      ];
    }
    
    setLoading(false);
    setMessages(prev => [...prev, newBotMessage]);
  };

  // Handle proficiency rating
  const handleProficiencyRating = (subject, value) => {
    setUserChoices(prev => ({
      ...prev,
      proficiency: {
        ...prev.proficiency,
        [subject]: value
      }
    }));
  };

  // Check if all proficiencies are rated
  const isAllProficienciesRated = () => {
    return userChoices.proficiency.physics > 0 && 
           userChoices.proficiency.chemistry > 0 && 
           userChoices.proficiency.mathematics > 0;
  };

  // Submit proficiency ratings
  const submitProficiencyRatings = () => {
    const ratingsText = `Physics: ${userChoices.proficiency.physics}, Chemistry: ${userChoices.proficiency.chemistry}, Mathematics: ${userChoices.proficiency.mathematics}`;
    handleOnboardingChoice(ratingsText);
  };

  // Handle exam date selection
  const handleExamDateChange = (date) => {
    setExamDate(date);
  };

  // Submit exam date
  const submitExamDate = () => {
    if (examDate) {
      handleOnboardingChoice(examDate.toISOString());
    } else {
      handleOnboardingChoice("Not specified");
    }
  };

  // Create a function to get personalized context
  const getPersonalizedContext = () => {
    let context = '### USER CONTEXT (AI Assistant: Use this information to personalize your responses)\n';
    
    // Add user info if available
    if (user?.name) {
      context += `User Name: ${user.name}\n`;
    }
    
    // Add preferences if available
    if (userPreferences) {
      if (userPreferences.qualification) {
        context += `Education Level: ${userPreferences.qualification} standard\n`;
      }
      
      if (userPreferences.attempts) {
        context += `JEE Attempts: ${userPreferences.attempts}\n`;
      }
      
      if (userPreferences.examDate) {
        const examDate = new Date(userPreferences.examDate);
        if (!isNaN(examDate.getTime())) {
          const diffTime = Math.abs(examDate - new Date());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          context += `JEE Exam Date: ${examDate.toLocaleDateString()} (${diffDays} days remaining)\n`;
        }
      }
      
      if (userPreferences.proficiency) {
        context += 'Subject Proficiency (Self-rated):\n';
        if (userPreferences.proficiency.physics) {
          context += `- Physics: ${userPreferences.proficiency.physics}/5\n`;
        }
        if (userPreferences.proficiency.chemistry) {
          context += `- Chemistry: ${userPreferences.proficiency.chemistry}/5\n`;
        }
        if (userPreferences.proficiency.mathematics) {
          context += `- Mathematics: ${userPreferences.proficiency.mathematics}/5\n`;
        }
      }
      
      if (userPreferences.goals && userPreferences.goals.length > 0) {
        context += `Goals: ${userPreferences.goals.join(', ')}\n`;
      }
    }
    
    // Add assessment data context if available
    if (assessmentData) {
      context += '\n### ASSESSMENT DATA\n';
      if (assessmentData.currentAssessment) {
        context += `Latest assessment score: ${assessmentData.currentAssessment.score}/${assessmentData.currentAssessment.totalMarks}\n`;
        
        if (assessmentData.currentAssessment.subjectWiseAnalysis) {
          context += 'Subject-wise performance:\n';
          Object.entries(assessmentData.currentAssessment.subjectWiseAnalysis).forEach(([subject, data]) => {
            context += `- ${subject}: ${data.score}/${data.totalMarks} (${Math.round(data.percentage)}%)\n`;
          });
        }
      }
      
      if (assessmentData.userHistory && assessmentData.userHistory.recentPerformance && assessmentData.userHistory.recentPerformance.length > 0) {
        context += `Total Assessments Completed: ${assessmentData.userHistory.recentPerformance.length}\n`;
        
        // Add trend information
        if (assessmentData.userHistory.recentPerformance.length > 1) {
          const latest = assessmentData.userHistory.recentPerformance[0];
          const previous = assessmentData.userHistory.recentPerformance[1];
          
          if (latest && previous) {
            const trend = latest.percentage > previous.percentage ? 'improving' : 
                         latest.percentage < previous.percentage ? 'declining' : 'stable';
            context += `Performance Trend: ${trend}\n`;
          }
        }
      }
    }
    
    context += '\n### INSTRUCTION FOR AI TUTOR\n';
    context += 'Use the above context to personalize your responses. Reference the user\'s profile details when relevant, but don\'t explicitly state "Based on your profile..." or similar phrases that expose how you\'re using this data. Make your responses feel naturally personalized.\n\n';
    
    return context.trim();
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    
    // If in onboarding mode, treat as a choice
    if (isOnboarding) {
      handleOnboardingChoice(userInput.trim());
      return;
    }
    
    // Add user message to chat
    const userMessage = {
      sender: 'user',
      text: userInput.trim(),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setLoading(true);

    // Improve assessment keywords to include more variations
    const assessmentKeywords = [
      'assessment', 'test', 'result', 'score', 'performance',
      'how did i do', 'exam results', 'my progress', 'how am i doing',
      'show my scores', 'analysis', 'evaluation', 'marks', 'grade',
      'mock test', 'practice exam', 'quiz', 'attempt', 'last test',
      'jee score', 'my performance', 'my marks', 'percentage'
    ];
    
    // More robust regex pattern matching
    const assessmentPatterns = [
      /(?:my|show|check|view|get|see|what|how).*(?:score|test|exam|assessment|result|performance|report|mark|grade)/i,
      /(?:how|what).*(?:did|was|were|am|is|are).*(?:i|my)/i,
      /(?:latest|recent|last|previous).*(?:score|test|exam|assessment|result)/i,
      /(?:assessment|test|exam|quiz).*(?:summary|report|analysis|details)/i
    ];

    // Check if it's an assessment query
    const isAssessmentQuery = assessmentKeywords.some(keyword => 
      userInput.toLowerCase().includes(keyword)
    );

    // More robust regex pattern matching
    const isPatternMatch = assessmentPatterns.some(pattern => 
      userInput.toLowerCase().match(pattern)
    );

    if (isAssessmentQuery || isPatternMatch) {
      const data = await fetchAssessmentData();
      
      if (data) {
        // Add bot response with assessment data
        const assessmentBotMessage = {
          sender: 'bot',
          text: "Here's your assessment summary based on your recent tests:",
          timestamp: new Date(),
          customUI: 'assessment',
          assessmentData: data
        };
        
        setMessages(prev => [...prev, assessmentBotMessage]);
        setShowingAssessment(true);
        setLoading(false);

        // Notify parent of new message if chat is closed
        if (onNewMessage) {
          onNewMessage();
        }

        return;
      }
    }

    try {
      // Check if we can personalize the message
      const personalizedContext = getPersonalizedContext();
      
      // For API, create an enhanced message with context
      let enhancedUserMessage = userInput.trim();
      
      // If we have personalized context, prepend it to the message for the API only
      if (personalizedContext) {
        console.log('Adding personalized context to message for AI');
        enhancedUserMessage = `${personalizedContext}\n\n### IS_REGULAR_MESSAGE: true\n\nUser's message: ${userInput.trim()}`;
      }
      
      // Send personalized message to API
      const response = await sendChatMessage(enhancedUserMessage).unwrap();
      
      if (response && response.success) {
        // Add bot response to chat
        const apiResponseMessage = {
          sender: 'bot',
          text: response.data.response,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, apiResponseMessage]);
        
        // Notify parent of new message if chat is closed
        if (onNewMessage) {
          onNewMessage();
              }
            } else {
        // Handle error response
        const errorMessage = {
          sender: 'bot',
          text: 'Sorry, I encountered an error processing your request. Please try again.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error sending chat message:', error);
      // Show error message
      const errorMessage = {
        sender: 'bot',
        text: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
    
    // Alt+S to toggle suggestions
    if (e.key === 's' && e.altKey) {
      e.preventDefault();
      toggleSuggestions();
    }
  };

  // Function to fetch assessment data
  const fetchAssessmentData = async () => {
    try {
      // Get user dashboard data
      const dashboardResult = await getDashboard().unwrap();
      console.log('Dashboard API response:', dashboardResult);
      
      if (dashboardResult?.success) {
        setAssessmentData(dashboardResult.data);
        return dashboardResult.data;
      }
      
      // Fallback to user records if dashboard doesn't work
      const recordsResult = await getUserRecords().unwrap();
      console.log('User Records API response:', recordsResult);
      
      // Handle different response formats
      let records = [];
      if (recordsResult?.data?.data && Array.isArray(recordsResult.data.data)) {
        records = recordsResult.data.data;
      } else if (recordsResult?.data && Array.isArray(recordsResult.data)) {
        records = recordsResult.data;
      } else if (recordsResult?.data) {
        // Try to extract records from whatever structure is returned
        const possibleData = recordsResult.data.data || recordsResult.data.records || recordsResult.data;
        if (Array.isArray(possibleData)) {
          records = possibleData;
        }
      }
      
      if (records.length > 0) {
        // Format records into a structured format similar to dashboard data
        // Find the most recent assessment
        const latestRecord = records[0]; // Assuming records are sorted by date desc
        
        // Create current assessment details
        const currentAssessment = {
          id: latestRecord.id,
          slug: latestRecord.id,
          name: `${latestRecord.exam?.name || 'JEE'} ${latestRecord.examModule?.name || 'Main'} Assessment`,
          exam: latestRecord.exam,
          examModule: latestRecord.examModule,
          subject: latestRecord.subject,
          score: latestRecord.totalScore || 0,
          totalMarks: latestRecord.totalMarks || 0,
          attemptNo: latestRecord.attempt || 1
        };
        
        // Format all records into the recentPerformance array
        const formattedData = {
          currentAssessment: currentAssessment,
          userHistory: {
            totalAssessments: records.length,
            recentPerformance: records.map(record => ({
              id: record.id,
              exam: record.exam?.name || 'JEE',
              examModule: record.examModule?.name || 'Main',
              subject: record.subject?.name,
              score: record.totalScore || 0,
              totalMarks: record.totalMarks || 0,
              highestScore: record.highestScore || 0,
              attempt: record.attempt || 1,
              averageScore: record.averageScore || 0,
              createdAt: record.createdAt || new Date().toISOString()
            }))
          }
        };
        
        setAssessmentData(formattedData);
        return formattedData;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching assessment data:', error);
      return null;
    }
  };

  // Pre-fetch assessment data and user preferences when component mounts
  useEffect(() => {
    if (isOnboardingComplete && !isOnboarding) {
      // Fetch assessment data silently in the background
      const loadData = async () => {
        try {
          const data = await fetchAssessmentData();
          if (data) {
            console.log('Assessment data prefetched successfully');
          }
          
          // Fetch user preferences if not already loaded
          if (!userPreferences) {
            const onboardingData = getOnboardingData();
            if (onboardingData && onboardingData.completed) {
              setUserPreferences(onboardingData);
              console.log('User preferences loaded:', onboardingData);
            }
          }
        } catch (error) {
          console.error('Error prefetching data:', error);
        }
      };
      
      loadData();
    }
  }, [isOnboardingComplete, isOnboarding, userPreferences]);

  // Function to generate personalized topic suggestions
  const getPersonalizedSuggestions = () => {
    const suggestions = [];
    
    // If we have proficiency data, suggest topics based on weakest areas
    if (userPreferences?.proficiency) {
      const subjects = Object.entries(userPreferences.proficiency)
        .sort(([, a], [, b]) => a - b)  // Sort by proficiency rating (lowest first)
        .map(([subject]) => subject);
      
      if (subjects.length > 0 && subjects[0]) {
        const weakestSubject = subjects[0];
        
        // Subject-specific topic suggestions
        const topicsBySubject = {
          physics: ['Mechanics', 'Thermodynamics', 'Electromagnetism', 'Optics', 'Modern Physics'],
          chemistry: ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry'],
          mathematics: ['Calculus', 'Algebra', 'Coordinate Geometry', 'Trigonometry', 'Statistics']
        };
        
        // Add suggestions for weakest subject
        if (topicsBySubject[weakestSubject]) {
          const topics = topicsBySubject[weakestSubject];
          topics.slice(0, 2).forEach(topic => {
            suggestions.push(`Help me understand ${topic} in ${weakestSubject}`);
          });
        }
      }
    }
    
    // Add general suggestions
    suggestions.push('Create a study plan for the next week');
    suggestions.push('What are the most important topics for JEE?');
    
    // If assessment data is available, add assessment-related suggestions
    if (assessmentData) {
      suggestions.push('Show my assessment results');
      suggestions.push('What should I work on based on my test scores?');
    }
    
    return suggestions;
  };

  // Add the SuggestionChips component
  const SuggestionChips = ({ suggestions, onSelect, isHidden, onToggle }) => {
    return (
      <Box sx={{ mt: 2, mb: 1, position: 'relative' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            Suggested questions:
          </Typography>
          <IconButton 
            size="small" 
            onClick={onToggle}
            sx={{ padding: 0, ml: 1 }}
            aria-label={isHidden ? "Show suggestions" : "Hide suggestions"}
          >
            {isHidden ? 
              <ExpandIcon fontSize="small" /> : 
              <MinimizeIcon fontSize="small" />
            }
          </IconButton>
        </Box>
        
        {!isHidden && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {suggestions.map((suggestion, index) => (
              <Chip
                key={index}
                label={suggestion}
                variant="outlined"
                size="small"
                onClick={() => onSelect(suggestion)}
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'primary.light',
                    color: 'white'
                  }
                }}
              />
            ))}
          </Box>
        )}
      </Box>
    );
  };

  // Toggle suggestions visibility
  const toggleSuggestions = () => {
    const newValue = !suggestionsHidden;
    setSuggestionsHidden(newValue);
    localStorage.setItem('suggestionsHidden', newValue.toString());
  };

  // Function to scroll to the bottom of the chat
  const scrollToBottom = (behavior = 'smooth') => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior });
    } else if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  // Scroll to bottom when chat is opened
  useEffect(() => {
    if (isOpen) {
      // Use setTimeout to ensure the scrolling happens after rendering
      setTimeout(() => {
        scrollToBottom('auto');
      }, 100);
    }
  }, [isOpen]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  // Handle window resize to maintain proper scrolling
  useEffect(() => {
    const handleResize = () => {
      if (isOpen) {
        setTimeout(() => {
          scrollToBottom('auto');
        }, 100);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);

  // If minimized, show only the maximize button
  if (isMinimized) {
    return (
      <Box 
        position="fixed" 
        bottom={16} 
        right={16} 
        zIndex={1050}
        display="flex"
        justifyContent="flex-end"
      >
          <Button
            variant="contained"
            color="primary"
            onClick={onMaximize}
          startIcon={<SchoolIcon />}
          sx={{ borderRadius: '24px', px: 2 }}
          >
            AI Tutor
          </Button>
      </Box>
    );
  }

  // If not open, don't render anything
  if (!isOpen) return null;

  return (
    <Fade in={isOpen}>
      <Paper
        elevation={8}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          width: { xs: 'calc(100% - 40px)', sm: 400 },
          height: { xs: 'calc(100% - 120px)', sm: 600 },
          maxHeight: 600,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 2,
          overflow: 'hidden',
          zIndex: 1050,
          boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
        }}
      >
        {/* Header */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          px={2}
          py={1.5}
          bgcolor="primary.main"
          color="white"
        >
          <Box display="flex" alignItems="center">
            <Avatar 
              sx={{ 
              bgcolor: 'white', 
                color: 'primary.main',
                width: 32, 
                height: 32, 
                mr: 1 
              }}
            >
              <SchoolIcon fontSize="small" />
            </Avatar>
            <Typography variant="h6" fontWeight="medium">
              AI JEE Tutor
            </Typography>
          </Box>
          <Box>
            <IconButton 
              color="inherit"
              size="small" 
              onClick={onMinimize} 
              sx={{ mr: 1 }}
            >
              <MinimizeIcon />
            </IconButton>
            <IconButton 
              color="inherit"
              size="small" 
              onClick={onClose} 
              disabled={isRequired || isOnboarding}
              sx={{ opacity: (isRequired || isOnboarding) ? 0.5 : 1 }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Messages container */}
        <Box
          ref={messagesContainerRef}
          sx={{
            flex: 1,
            overflowY: 'auto',
            p: 2,
            bgcolor: '#f5f5f5',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Show indicator for older messages if they exist */}
          {hasMoreMessages && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mb: 2,
              opacity: 0.8
            }}>
              <Chip
                label="View Full History"
                size="small"
                color="primary"
                variant="outlined"
                onClick={() => {
                  console.log('View full history clicked');
                }}
                sx={{ fontSize: '0.75rem' }}
              />
            </Box>
          )}
          
          {/* If there are messages from history, show a separator */}
          {initialMessages && initialMessages.length > 0 && messages.length > 1 && (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              mb: 2,
              mt: hasMoreMessages ? 0 : 1
            }}>
              <Divider sx={{ flex: 1, mr: 1 }} />
              <Typography variant="caption" color="text.secondary">
                Recent Conversation
              </Typography>
              <Divider sx={{ flex: 1, ml: 1 }} />
            </Box>
          )}
          
          {messages.map((message, i) => (
            <Box
              key={i}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: message.sender === 'user' ? 'flex-end' : 'flex-start',
                mb: 2,
                maxWidth: '85%',
                alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <Card
                variant="outlined"
                sx={{
                  bgcolor: message.sender === 'user' ? 'primary.main' : 'white',
                  color: message.sender === 'user' ? 'white' : 'text.primary',
                  borderRadius: 2,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  overflow: 'hidden',
                  width: '100%',
                }}
              >
                <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                  {message.sender === 'user' ? (
                    <Typography variant="body1">{message.text}</Typography>
                  ) : (
                    <>
                    <ReactMarkdown
                      components={{
                        p: (props) => <Typography variant="body1" gutterBottom {...props} />,
                        h1: (props) => <Typography variant="h5" gutterBottom {...props} />,
                        h2: (props) => <Typography variant="h6" gutterBottom {...props} />,
                        h3: (props) => <Typography variant="subtitle1" gutterBottom fontWeight="bold" {...props} />,
                        ul: (props) => <Box component="ul" pl={2} {...props} />,
                        ol: (props) => <Box component="ol" pl={2} {...props} />,
                        li: (props) => <Typography component="li" variant="body1" gutterBottom {...props} />,
                        pre: (props) => (
                          <Box
                            component="pre"
                            sx={{
                              bgcolor: 'rgba(0, 0, 0, 0.04)',
                              p: 1.5,
                              borderRadius: 1,
                              overflowX: 'auto',
                              my: 1.5,
                            }}
                            {...props}
                          />
                        ),
                        code: (props) => (
                          <Box
                            component="code"
                        sx={{ 
                              bgcolor: 'rgba(0, 0, 0, 0.04)',
                              p: 0.3,
                              borderRadius: 0.5,
                              fontFamily: 'monospace',
                            }}
                            {...props}
                          />
                        ),
                      }}
                    >
                      {message.text}
                    </ReactMarkdown>
                      
                      {/* Show choice buttons during onboarding */}
                      {message.choices && (
                        <Grid container spacing={1} sx={{ mt: 1 }}>
                          {message.choices.map((choice, idx) => (
                            <Grid item key={idx}>
                              <Chip 
                                label={choice}
                                onClick={() => handleOnboardingChoice(choice)}
                                color="primary"
                                variant="outlined"
                                sx={{ mt: 1, cursor: 'pointer' }}
                              />
                            </Grid>
                          ))}
                        </Grid>
                      )}

                      {/* Custom UI for date picker */}
                      {message.customUI === 'datePicker' && (
                        <Box sx={{ mt: 2 }}>
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                              label="JEE Exam Date"
                              value={examDate}
                              onChange={handleExamDateChange}
                              renderInput={(params) => <TextField {...params} fullWidth />}
                              minDate={new Date()}
                            />
                            <Button 
                              variant="contained" 
                              color="primary" 
                              onClick={submitExamDate}
                              sx={{ mt: 1 }}
                            >
                              Confirm Date
                            </Button>
                          </LocalizationProvider>
                        </Box>
                      )}

                      {/* Custom UI for proficiency rating */}
                      {message.customUI === 'proficiencyRating' && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>Physics</Typography>
                          <Rating
                            name="physics-rating"
                            value={userChoices.proficiency.physics}
                            onChange={(e, newValue) => handleProficiencyRating('physics', newValue)}
                            precision={1}
                            size="large"
                            emptyIcon={<StarBorderIcon fontSize="inherit" />}
                          />
                          
                          <Typography variant="subtitle2" gutterBottom sx={{ mt: 1 }}>Chemistry</Typography>
                          <Rating
                            name="chemistry-rating"
                            value={userChoices.proficiency.chemistry}
                            onChange={(e, newValue) => handleProficiencyRating('chemistry', newValue)}
                            precision={1}
                            size="large"
                            emptyIcon={<StarBorderIcon fontSize="inherit" />}
                          />
                          
                          <Typography variant="subtitle2" gutterBottom sx={{ mt: 1 }}>Mathematics</Typography>
                          <Rating
                            name="mathematics-rating"
                            value={userChoices.proficiency.mathematics}
                            onChange={(e, newValue) => handleProficiencyRating('mathematics', newValue)}
                            precision={1}
                            size="large"
                            emptyIcon={<StarBorderIcon fontSize="inherit" />}
                          />
                          
                          <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={submitProficiencyRatings}
                            disabled={!isAllProficienciesRated()}
                            sx={{ mt: 2 }}
                          >
                            Confirm Ratings
                          </Button>
                        </Box>
                      )}

                      {/* Custom UI for assessment summary */}
                      {message.customUI === 'assessment' && message.assessmentData && (
                        <Box sx={{ mt: 2, width: '100%' }}>
                          {/* Overall Performance */}
                          <Card variant="outlined" sx={{ mb: 2, borderRadius: 2 }}>
                            <CardContent>
                              <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                <AssessmentIcon fontSize="small" sx={{ mr: 1 }} />
                                Assessment Summary
                              </Typography>
                              
                              {message.assessmentData.currentAssessment ? (
                                <>
                                  <Typography variant="body2" color="text.secondary">
                                    {message.assessmentData.currentAssessment.name || 'Latest Assessment'}
                                  </Typography>
                                  
                                  <Box sx={{ mt: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                      <Typography variant="h6" fontWeight="bold">
                                        {Math.round((message.assessmentData.currentAssessment.score / message.assessmentData.currentAssessment.totalMarks) * 100)}%
                                      </Typography>
                                      <Chip 
                                        size="small"
                                        label={
                                          Math.round((message.assessmentData.currentAssessment.score / message.assessmentData.currentAssessment.totalMarks) * 100) >= 75 ? 'Excellent' : 
                                          Math.round((message.assessmentData.currentAssessment.score / message.assessmentData.currentAssessment.totalMarks) * 100) >= 50 ? 'Good' : 'Needs Improvement'
                                        }
                                        color={
                                          Math.round((message.assessmentData.currentAssessment.score / message.assessmentData.currentAssessment.totalMarks) * 100) >= 75 ? 'success' : 
                                          Math.round((message.assessmentData.currentAssessment.score / message.assessmentData.currentAssessment.totalMarks) * 100) >= 50 ? 'warning' : 'error'
                                        }
                                      />
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">
                                      Score: {message.assessmentData.currentAssessment.score} / {message.assessmentData.currentAssessment.totalMarks}
                                    </Typography>
                                    
                                    <LinearProgress
                                      variant="determinate"
                                      value={Math.round((message.assessmentData.currentAssessment.score / message.assessmentData.currentAssessment.totalMarks) * 100)}
                                      color={
                                        Math.round((message.assessmentData.currentAssessment.score / message.assessmentData.currentAssessment.totalMarks) * 100) >= 75 ? 'success' : 
                                        Math.round((message.assessmentData.currentAssessment.score / message.assessmentData.currentAssessment.totalMarks) * 100) >= 50 ? 'warning' : 'error'
                                      }
                                      sx={{ mt: 1, height: 8, borderRadius: 5 }}
                                    />
                                  </Box>
                                </>
                              ) : (
                                <Typography variant="body2" color="text.secondary">
                                  No recent assessment data available
                                </Typography>
                              )}
                              
                              {/* Subject Performance */}
                              {message.assessmentData.currentAssessment?.evaluations && (
                                <Box sx={{ mt: 2 }}>
                                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                    Subject Performance
                                  </Typography>
                                  
                                  {(() => {
                                    // Calculate subject-wise performance
                                    const subjectPerformance = {};
                                    message.assessmentData.currentAssessment.evaluations.forEach(evaluation => {
                                      const subject = evaluation.subject?.name || 'Unknown';
                                      if (!subjectPerformance[subject]) {
                                        subjectPerformance[subject] = {
                                          total: 0,
                                          correct: 0
                                        };
                                      }
                                      
                                      subjectPerformance[subject].total += 1;
                                      if (evaluation.userAnswer === evaluation.correctAnswer) {
                                        subjectPerformance[subject].correct += 1;
                                      }
                                    });
                                    
                                    return Object.entries(subjectPerformance).map(([subject, data], index) => {
                                      const percentage = Math.round((data.correct / data.total) * 100);
                                      return (
                                        <Box key={subject} sx={{ mb: index < Object.keys(subjectPerformance).length - 1 ? 1.5 : 0 }}>
                                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                            <Typography variant="body2">{subject}</Typography>
                                            <Typography variant="body2" fontWeight="medium">
                                              {data.correct}/{data.total} ({percentage}%)
                                            </Typography>
                                          </Box>
                                          <LinearProgress 
                                            variant="determinate" 
                                            value={percentage} 
                                            color={percentage >= 75 ? 'success' : percentage >= 50 ? 'warning' : 'error'}
                                            sx={{ height: 6, borderRadius: 3 }}
                                          />
                                        </Box>
                                      );
                                    });
                                  })()}
                                </Box>
                              )}
                            </CardContent>
                          </Card>
                          
                          {/* Areas for Improvement */}
                          {message.assessmentData.currentAssessment?.evaluations && (
                            <Card variant="outlined" sx={{ borderRadius: 2 }}>
                              <CardContent>
                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                  <ImprovementIcon fontSize="small" sx={{ mr: 1 }} />
                                  Areas for Improvement
                                </Typography>
                                
                                <Box sx={{ mt: 1 }}>
                                  {message.assessmentData.currentAssessment.evaluations
                                    .filter(evaluation => evaluation.userAnswer !== evaluation.correctAnswer)
                                    .slice(0, 3)
                                    .map((evaluation, index) => (
                                      <Box key={index} sx={{ mb: index < 2 ? 1.5 : 0 }}>
                                        <Typography variant="body2" fontWeight="medium">
                                          {evaluation.topic || 'Topic'}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem' }}>
                                          {evaluation.questionText?.length > 60 ? 
                                            `${evaluation.questionText.substring(0, 60)}...` : 
                                            evaluation.questionText}
                                        </Typography>
                                      </Box>
                                    ))}
                                    
                                  {message.assessmentData.currentAssessment.evaluations.filter(evaluation => evaluation.userAnswer !== evaluation.correctAnswer).length === 0 && (
                                    <Typography variant="body2" color="text.secondary">
                                      Great job! No major improvement areas.
                                    </Typography>
                                  )}
                                </Box>
                              </CardContent>
                            </Card>
                          )}
                          
                          {/* Performance History */}
                          {message.assessmentData.userHistory?.recentPerformance?.length > 0 && (
                            <Card variant="outlined" sx={{ mt: 2, borderRadius: 2 }}>
                              <CardContent>
                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                  Recent Performance
                                </Typography>
                                
                                {message.assessmentData.userHistory.recentPerformance.slice(0, 3).map((record, index) => (
                                  <Box key={index} sx={{ mb: index < 2 ? 1.5 : 0, display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2">
                                      {record.subject || record.examModule || 'Assessment'} (Attempt {record.attempt})
                                    </Typography>
                                    <Chip
                                      size="small"
                                      label={`${Math.round((record.score / record.totalMarks) * 100)}%`}
                                      color={
                                        Math.round((record.score / record.totalMarks) * 100) >= 75 ? 'success' : 
                                        Math.round((record.score / record.totalMarks) * 100) >= 50 ? 'warning' : 'error'
                                      }
                                      variant="outlined"
                                    />
                                  </Box>
                                ))}
                              </CardContent>
                            </Card>
                          )}
                        </Box>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Typography>
            </Box>
          ))}
          
          {loading && (
            <Box display="flex" justifyContent="flex-start" mb={2}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  p: 2, 
                  bgcolor: 'white',
                  borderRadius: 2,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}
              >
                <CircularProgress size={20} thickness={4} />
                <Typography variant="body2" sx={{ ml: 1 }}>Thinking...</Typography>
              </Box>
            </Box>
          )}
          
          <div ref={messagesEndRef} />
        </Box>

        {/* Input field */}
        <Box
          sx={{
            p: 2,
            pb: suggestionsHidden ? 2 : 1.5,
            pt: suggestionsHidden ? 1.5 : 2,
            bgcolor: 'white',
            borderTop: '1px solid rgba(0, 0, 0, 0.12)',
            transition: 'padding 0.2s ease'
          }}
        >
          {/* Suggestions section */}
          {!isOnboarding && userPreferences && (
            suggestionsHidden ? (
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'flex-end', 
                  mb: 1, 
                  cursor: 'pointer' 
                }}
                onClick={toggleSuggestions}
              >
                <Chip
                  size="small"
                  variant="outlined"
                  icon={<ExpandIcon fontSize="small" />}
                  label="Show suggestions"
                  onClick={toggleSuggestions}
                  sx={{ fontSize: '0.7rem' }}
                />
              </Box>
            ) : (
              <SuggestionChips 
                suggestions={getPersonalizedSuggestions()}
                onSelect={(suggestion) => {
                  // Set the user input and send the message immediately with a delay to ensure state is updated
                  setUserInput(suggestion);
                  // Use requestAnimationFrame for better timing than setTimeout
                  requestAnimationFrame(() => {
                    // Create a copy of the suggestion for handleSendMessage to use
                    const currentSuggestion = suggestion;
                    // Directly call handleSendMessage without letting it grab userInput from state
                    if (currentSuggestion.trim()) {
                      // Create user message object
                      const userMessage = {
                        sender: 'user',
                        text: currentSuggestion.trim(),
                        timestamp: new Date()
                      };
                      
                      // Add to messages
                      setMessages(prev => [...prev, userMessage]);
                      setUserInput('');
                      setLoading(true);
                      
                      // Get personalized context
                      const personalizedContext = getPersonalizedContext();
                      
                      // Create enhanced message for API only - add a special flag to indicate this is a suggested question
                      // This flag will be used by the backend to handle suggested questions differently
                      let enhancedUserMessage = currentSuggestion.trim();
                      if (personalizedContext) {
                        enhancedUserMessage = `${personalizedContext}\n\n### IS_SUGGESTED_QUESTION: true\n\nUser's message: ${currentSuggestion.trim()}`;
                      }
                      
                      // Send to API
                      sendChatMessage(enhancedUserMessage)
                        .unwrap()
                        .then(response => {
                          if (response && response.success) {
                            const apiResponseMessage = {
                              sender: 'bot',
                              text: response.data.response,
                              timestamp: new Date()
                            };
                            
                            setMessages(prev => [...prev, apiResponseMessage]);
                            
                            if (onNewMessage) {
                              onNewMessage();
                            }
                          } else {
                            // Handle error
                            const errorMessage = {
                              sender: 'bot',
                              text: 'Sorry, I encountered an error processing your request. Please try again.',
                              timestamp: new Date()
                            };
                            setMessages(prev => [...prev, errorMessage]);
                          }
                        })
                        .catch(error => {
                          console.error('Error sending chat message:', error);
                          const errorMessage = {
                            sender: 'bot',
                            text: 'Sorry, I encountered an error processing your request. Please try again.',
                            timestamp: new Date()
                          };
                          setMessages(prev => [...prev, errorMessage]);
                        })
                        .finally(() => {
                          setLoading(false);
                        });
                    }
                  });
                }}
                isHidden={suggestionsHidden}
                onToggle={toggleSuggestions}
              />
            )
          )}
          
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            sx={{
              display: 'flex',
              alignItems: 'center',
          }}
        >
          <TextField
            fullWidth
              placeholder={isOnboarding ? "Type your response or select an option above..." : "Ask anything about JEE..."}
            variant="outlined"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyPress}
              multiline
              maxRows={3}
              size="small"
            sx={{
                mr: 1,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
          <IconButton 
            color="primary" 
            onClick={handleSendMessage}
              disabled={!userInput.trim() || loading}
            sx={{
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
                '&.Mui-disabled': {
                  bgcolor: 'action.disabledBackground',
                  color: 'action.disabled',
                },
              }}
            >
              <SendIcon />
          </IconButton>
          </Box>
        </Box>
      </Paper>
    </Fade>
  );
};

export default ChatbotUI; 