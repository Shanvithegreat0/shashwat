import React, { useState, useEffect } from 'react';
import { Box, Fab, Badge, CircularProgress, Button } from '@mui/material';
import { School as SchoolIcon } from '@mui/icons-material';
import ChatbotUI from './ChatbotUI';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useGetChatHistoryQuery } from '../store/slices/apiServices';

// This component manages the chatbot UI visibility and state
const ChatbotManager = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [newMessage, setNewMessage] = useState(false);
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  
  const { data: chatHistoryData, isLoading: isLoadingChatHistory } = useGetChatHistoryQuery(undefined, {
    skip: !user // Only load chat history if user is logged in
  });
  
  // Check if onboarding is complete to determine if chat should be required or optional
  const onboardingComplete = localStorage.getItem('onboardingData')
    ? JSON.parse(localStorage.getItem('onboardingData')).completed
    : false;
  
  // Specific pages where chatbot should be auto-opened or hidden
  const isOnboardingPage = location.pathname === '/welcome' || location.pathname === '/onboarding';
  const isGettingStartedPage = location.pathname === '/getting-started';
  const isPracticePage = location.pathname.includes('/practice/');
  const shouldRequireChatbot = isGettingStartedPage && !onboardingComplete;
  const shouldHideChatbot = isPracticePage || location.pathname.includes('/quiz/') || location.pathname.includes('/exam/');
  
  useEffect(() => {
    // Auto-open chat for new users who haven't completed onboarding
    if (user && !onboardingComplete && !isOnboardingPage) {
      setIsOpen(true);
      setMinimized(false);
    }
    
    // Auto-open chat on getting started page if onboarding is not complete
    if (shouldRequireChatbot) {
      setIsOpen(true);
      setMinimized(false);
    }
    
    // Auto-hide chat on practice/quiz pages
    if (shouldHideChatbot) {
      setIsOpen(false);
    }
    
    // Listen for events to open the chatbot
    const handleOpenChatEvent = () => {
      setIsOpen(true);
      setMinimized(false);
    };
    
    window.addEventListener('openChatbot', handleOpenChatEvent);
    
    return () => {
      window.removeEventListener('openChatbot', handleOpenChatEvent);
    };
  }, [location.pathname, onboardingComplete, shouldRequireChatbot, shouldHideChatbot, user]);
  
  const handleToggle = () => {
    if (minimized) {
      setMinimized(false);
      return;
    }
    setIsOpen(!isOpen);
    if (!isOpen) {
      setNewMessage(false);
    }
  };
  
  const handleMinimize = () => {
    setMinimized(true);
  };
  
  const handleClose = () => {
    // Don't allow closing if onboarding isn't complete
    if (onboardingComplete || isOnboardingPage) {
      setIsOpen(false);
    }
  };
  
  // Don't render chatbot on specific pages
  if (shouldHideChatbot) {
    return null;
  }
  
  if (isLoadingChatHistory) {
    return (
      <Box position="fixed" bottom={16} right={16} zIndex={1000}>
        <CircularProgress size={24} />
      </Box>
    );
  }
  
  return (
    <>
      {/* Chatbot UI */}
      <ChatbotUI
        isOpen={isOpen}
        isMinimized={minimized}
        onClose={handleClose}
        onMinimize={handleMinimize}
        onMaximize={() => setMinimized(false)}
        isRequired={!onboardingComplete && !isOnboardingPage}
        initialMessages={chatHistoryData?.data?.messages || []}
        onNewMessage={() => setNewMessage(true)}
      />
      
      {/* Chat button (hidden when chat is open) */}
      {!isOpen && (
        <Box position="fixed" bottom={16} right={16} zIndex={1000}>
          <Badge color="error" variant="dot" invisible={!newMessage}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SchoolIcon />}
              onClick={handleToggle}
              sx={{ borderRadius: '24px', px: 2 }}
            >
              AI Tutor
            </Button>
          </Badge>
        </Box>
      )}
    </>
  );
};

export default ChatbotManager; 