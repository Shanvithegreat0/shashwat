import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Container,
  Paper,
  IconButton,
  Stack,
  Card,
  CardActionArea,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Tooltip
} from '@mui/material';
import { 
  Add as AddIcon, 
  Send as SendIcon, 
  Close as CloseIcon,
  Minimize as MinimizeIcon,
  KeyboardArrowUp as ExpandIcon,
  TipsAndUpdates as TipsAndUpdatesIcon 
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { skipOnboarding, saveOnboardingData, getOnboardingData } from '../utils/userService';
import { 
  useGetChatHistoryQuery, 
  useSendChatMessageMutation, 
  useUpdateProfileMutation,
  useGetUserRecordsMutation,
  useGetDashboardMutation,
  useGetAllAssessmentsMutation 
} from '../store/slices/apiServices';
import ReactMarkdown from 'react-markdown';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import Header from '../components/Header';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('welcome');
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
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [suggestionsHidden, setSuggestionsHidden] = useState(false);

  const [updateProfile] = useUpdateProfileMutation();
  const [getUserRecords] = useGetUserRecordsMutation();
  const [getDashboard] = useGetDashboardMutation();
  const [getAllAssessments] = useGetAllAssessmentsMutation();
  
  const { data: chatHistoryData, isLoading: isLoadingChatHistory } = useGetChatHistoryQuery(undefined, {
    skip: !isOnboardingComplete
  });
  const [sendChatMessage] = useSendChatMessageMutation();

  // Check if onboarding is complete
  useEffect(() => {
    const onboardingData = localStorage.getItem('onboardingData');
    if (onboardingData) {
      const data = JSON.parse(onboardingData);
      setIsOnboardingComplete(data.completed === true);
      if (data.completed) {
        setUserChoices(data);
      }
    } else {
      setIsOnboardingComplete(false);
      setIsOnboarding(true);
    }
  }, []);

  // Initialize with welcome message or onboarding flow
  useEffect(() => {
    if (isOnboarding) {
      setMessages([{
        role: 'assistant',
        content: `Hi ${user?.name || 'there'}! 👋 I'm your AI JEE Tutor assistant. Let's set up your personalized learning experience. First, what is your current qualification?`,
        timestamp: new Date(),
        choices: ['10th', '11th', '12th', 'Dropout']
      }]);
      setStep('qualification');
    } else if (chatHistoryData?.data?.messages) {
      // Initialize with chat history from API
      setMessages(chatHistoryData.data.messages);
    }
  }, [isOnboarding, chatHistoryData]);

  // Initialize suggestions visibility from localStorage
  useEffect(() => {
    const savedPreference = localStorage.getItem('suggestionsHidden');
    if (savedPreference !== null) {
      setSuggestionsHidden(savedPreference === 'true');
    }
  }, []);

  const handleOnboardingChoice = async (choice) => {
    setLoading(true);
    try {
      switch (step) {
        case 'qualification':
          setUserChoices(prev => ({ ...prev, qualification: choice }));
          setMessages(prev => [...prev, 
            { role: 'user', content: choice },
            { 
              role: 'assistant', 
              content: 'When is your JEE exam scheduled?',
              requiresDate: true 
            }
          ]);
          setStep('examDate');
          break;

        case 'attempts':
          setUserChoices(prev => ({ ...prev, attempts: choice }));
          setMessages(prev => [...prev,
            { role: 'user', content: choice },
            { 
              role: 'assistant',
              content: 'Please rate your proficiency in each subject from 1 to 5:',
              requiresProficiency: true
            }
          ]);
          setStep('proficiency');
          break;

        default:
          break;
      }
    } catch (error) {
      console.error('Error in onboarding:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExamDateChange = (date) => {
    setExamDate(date);
  };

  const submitExamDate = () => {
    if (!examDate) return;
    
    setUserChoices(prev => ({ ...prev, examDate }));
    setMessages(prev => [...prev,
      { role: 'user', content: examDate.toLocaleDateString() },
      { 
        role: 'assistant',
        content: 'How many times have you attempted JEE before?',
        choices: ['First Time', 'Second Time', 'Third Time', 'More than 3 times']
      }
    ]);
    setStep('attempts');
  };

  const handleProficiencyRating = (subject, value) => {
    setUserChoices(prev => ({
      ...prev,
      proficiency: { ...prev.proficiency, [subject]: value }
    }));
  };

  const isAllProficienciesRated = () => {
    const { physics, chemistry, mathematics } = userChoices.proficiency;
    return physics > 0 && chemistry > 0 && mathematics > 0;
  };

  const submitProficiencyRatings = async () => {
    if (!isAllProficienciesRated()) return;

    try {
      setLoading(true);
      
      // Save onboarding data
      const onboardingData = {
        ...userChoices,
        completed: true
      };
      await saveOnboardingData(onboardingData);
      
      // Update user profile
      await updateProfile({
        qualification: userChoices.qualification,
        examDate: userChoices.examDate,
        attempts: userChoices.attempts,
        proficiency: userChoices.proficiency
      }).unwrap();

      setIsOnboardingComplete(true);
      setIsOnboarding(false);
      
      // Add completion message
      setMessages(prev => [...prev,
        {
          role: 'assistant',
          content: `Great! I've personalized your learning experience based on your inputs. Let me know what you'd like to focus on today!`
        }
      ]);
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    try {
      setLoading(true);
      // Add user message immediately
      const userMessage = {
        role: 'user',
        content: userInput.trim(),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);

      // Store user input and clear the field
      const messageToSend = userInput.trim();
      setUserInput('');

      // Check if we're in onboarding
      if (isOnboarding) {
        handleOnboardingChoice(messageToSend);
        return;
      }

      // Send message to API
      const response = await sendChatMessage(messageToSend).unwrap();
      
      if (response?.data?.response) {
        // Add AI response
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: response.data.response,
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      console.error('Error in chat message:', error);
      // Add error message to chat
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again later.',
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getContextBasedSuggestions = (lastAIMessage) => {
    const suggestions = [];
    const content = lastAIMessage?.content?.toLowerCase() || '';

    // Physics-related suggestions
    if (content.includes('physics') || 
        content.includes('mechanics') || 
        content.includes('thermodynamics') || 
        content.includes('electromagnetism') || 
        content.includes('optics')) {
      
      if (content.includes('mechanics')) {
        suggestions.push("Explain Newton's laws of motion");
        suggestions.push("Help me with rotational mechanics");
        suggestions.push("What are the key concepts in fluid mechanics?");
      } else if (content.includes('thermodynamics')) {
        suggestions.push("Explain the laws of thermodynamics");
        suggestions.push("Help me understand entropy");
        suggestions.push("What are the thermodynamic processes?");
      } else if (content.includes('electromagnetism')) {
        suggestions.push("Explain Coulomb's law");
        suggestions.push("Help me with electromagnetic induction");
        suggestions.push("What are Maxwell's equations?");
      } else if (content.includes('optics')) {
        suggestions.push("Explain reflection and refraction");
        suggestions.push("Help me understand lens formula");
        suggestions.push("What is wave optics?");
      } else {
        suggestions.push("Show me important physics formulas");
        suggestions.push("What topics should I focus on in physics?");
        suggestions.push("Give me practice problems in physics");
      }
    }

    // Chemistry-related suggestions
    else if (content.includes('chemistry') || 
             content.includes('organic') || 
             content.includes('inorganic') || 
             content.includes('physical chemistry')) {
      
      if (content.includes('organic')) {
        suggestions.push("Explain organic reaction mechanisms");
        suggestions.push("Help me with IUPAC nomenclature");
        suggestions.push("What are the important named reactions?");
      } else if (content.includes('inorganic')) {
        suggestions.push("Explain periodic trends");
        suggestions.push("Help me with chemical bonding");
        suggestions.push("What are coordination compounds?");
      } else if (content.includes('physical')) {
        suggestions.push("Explain chemical equilibrium");
        suggestions.push("Help me with electrochemistry");
        suggestions.push("What are the concepts in chemical kinetics?");
      } else {
        suggestions.push("Show me important chemical reactions");
        suggestions.push("What topics should I focus on in chemistry?");
        suggestions.push("Give me practice problems in chemistry");
      }
    }

    // Mathematics-related suggestions
    else if (content.includes('math') || 
             content.includes('calculus') || 
             content.includes('algebra') || 
             content.includes('geometry') || 
             content.includes('trigonometry')) {
      
      if (content.includes('calculus')) {
        suggestions.push("Explain differentiation techniques");
        suggestions.push("Help me with integration methods");
        suggestions.push("What are the applications of calculus?");
      } else if (content.includes('algebra')) {
        suggestions.push("Explain matrices and determinants");
        suggestions.push("Help me with complex numbers");
        suggestions.push("What are the concepts in vector algebra?");
      } else if (content.includes('geometry')) {
        suggestions.push("Explain conic sections");
        suggestions.push("Help me with 3D geometry");
        suggestions.push("What are the important geometric formulas?");
      } else if (content.includes('trigonometry')) {
        suggestions.push("Explain trigonometric identities");
        suggestions.push("Help me with inverse trigonometric functions");
        suggestions.push("What are the applications of trigonometry?");
      } else {
        suggestions.push("Show me important mathematical formulas");
        suggestions.push("What topics should I focus on in mathematics?");
        suggestions.push("Give me practice problems in mathematics");
      }
    }

    // Study plan related suggestions
    else if (content.includes('study plan') || content.includes('schedule')) {
      suggestions.push("How many hours should I study each subject?");
      suggestions.push("What should be my revision strategy?");
      suggestions.push("How to balance school and JEE preparation?");
    }

    // Test/Assessment related suggestions
    else if (content.includes('test') || content.includes('score') || content.includes('assessment')) {
      suggestions.push("How can I improve my test-taking speed?");
      suggestions.push("What are my weak areas based on the scores?");
      suggestions.push("Give me practice questions for improvement");
    }

    // Default suggestions if no specific context is found
    if (suggestions.length === 0) {
      return getPersonalizedSuggestions();
    }

    // Add one general suggestion at the end
    suggestions.push("Create a study plan for me");
    
    return suggestions;
  };

  const getPersonalizedSuggestions = () => {
    // Get the last AI message
    const lastAIMessage = messages.filter(msg => msg.role === 'assistant').pop();
    
    // If we have a last AI message, generate context-based suggestions
    if (lastAIMessage) {
      return getContextBasedSuggestions(lastAIMessage);
    }
    
    // If no last message or in onboarding, return default suggestions
    const suggestions = [];
    
    // If we have proficiency data from onboarding
    if (userChoices?.proficiency) {
      const subjects = Object.entries(userChoices.proficiency)
        .sort(([, a], [, b]) => a - b)
        .map(([subject]) => subject);
      
      if (subjects.length > 0 && subjects[0]) {
        const weakestSubject = subjects[0];
        const topicsBySubject = {
          physics: ['Mechanics', 'Thermodynamics', 'Electromagnetism', 'Optics', 'Modern Physics'],
          chemistry: ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry'],
          mathematics: ['Calculus', 'Algebra', 'Coordinate Geometry', 'Trigonometry', 'Statistics']
        };
        
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
    
    if (assessmentData) {
      suggestions.push('Show my assessment results');
      suggestions.push('What should I work on based on my test scores?');
    }
    
    return suggestions;
  };

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

  const toggleSuggestions = () => {
    const newValue = !suggestionsHidden;
    setSuggestionsHidden(newValue);
    localStorage.setItem('suggestionsHidden', newValue.toString());
  };

  const handleSuggestionSelect = (suggestion) => {
    setUserInput(suggestion);
  };

  // Add loading state for chat history
  if (!isOnboarding && isLoadingChatHistory) {
    return (
      <Box sx={{ 
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Typography>Loading chat history...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: 'background.default'
    }}>
      {/* Main Header */}
      <Header />

      {/* Chat Container - Adjust top margin to account for header height */}
      <Box sx={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        mt: '64px', // Height of the header
        overflow: 'hidden'
      }}>
       

        {/* Chat Messages */}
        <Box sx={{ 
          flex: 1,
          overflowY: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}>
          {messages.map((message, index) => (
            <Box
              key={index}
              sx={{
                alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '80%'
              }}
            >
              <Paper
                sx={{
                  p: 2,
                  bgcolor: message.role === 'user' ? 'primary.main' : 'background.paper',
                  color: message.role === 'user' ? 'primary.contrastText' : 'text.primary'
                }}
              >
                <ReactMarkdown>{message.content}</ReactMarkdown>
                
                {message.choices && (
                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    {message.choices.map((choice, idx) => (
                      <Button
                        key={idx}
                        variant="outlined"
                        size="small"
                        onClick={() => handleOnboardingChoice(choice)}
                        sx={{ 
                          color: message.role === 'user' ? 'primary.contrastText' : 'primary.main',
                          borderColor: message.role === 'user' ? 'primary.contrastText' : 'primary.main'
                        }}
                      >
                        {choice}
                      </Button>
                    ))}
                  </Stack>
                )}

                {message.requiresDate && (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Box sx={{ mt: 2 }}>
                      <DatePicker
                        label="Exam Date"
                        value={examDate}
                        onChange={handleExamDateChange}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                      />
                      <Button
                        variant="contained"
                        onClick={submitExamDate}
                        disabled={!examDate}
                        sx={{ mt: 1 }}
                      >
                        Submit
                      </Button>
                    </Box>
                  </LocalizationProvider>
                )}

                {message.requiresProficiency && (
                  <Box sx={{ mt: 2 }}>
                    <Stack spacing={2}>
                      {['physics', 'chemistry', 'mathematics'].map((subject) => (
                        <Box key={subject}>
                          <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            {subject.charAt(0).toUpperCase() + subject.slice(1)}
                          </Typography>
                          <Rating
                            value={userChoices.proficiency[subject]}
                            onChange={(event, value) => handleProficiencyRating(subject, value)}
                          />
                        </Box>
                      ))}
                    </Stack>
                    <Button
                      variant="contained"
                      onClick={submitProficiencyRatings}
                      disabled={!isAllProficienciesRated()}
                      sx={{ mt: 2 }}
                    >
                      Submit
                    </Button>
                  </Box>
                )}
              </Paper>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Box>

        {/* Input Area with Suggestions */}
        <Box sx={{ 
          p: 2, 
          bgcolor: 'background.paper',
          borderTop: 1,
          borderColor: 'divider'
        }}>
          <SuggestionChips 
            suggestions={getPersonalizedSuggestions()}
            onSelect={handleSuggestionSelect}
            isHidden={suggestionsHidden}
            onToggle={toggleSuggestions}
          />
          <Stack direction="row" spacing={1}>
            <IconButton size="small">
              <AddIcon />
            </IconButton>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your response or select an option above..."
              variant="outlined"
              disabled={loading}
            />
            <IconButton 
              onClick={handleSendMessage}
              disabled={loading || !userInput.trim()}
              color="primary"
            >
              <SendIcon />
            </IconButton>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatPage; 