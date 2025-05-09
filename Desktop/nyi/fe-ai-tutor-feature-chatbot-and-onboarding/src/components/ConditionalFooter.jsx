import React from 'react';
import { useLocation } from 'react-router-dom';
import Footer from './Footer';

/**
 * Conditionally renders the Footer component based on the current route.
 * The footer is not displayed on exam/quiz pages.
 */
const ConditionalFooter = () => {
  const location = useLocation();
  const path = location.pathname;
  
  // Don't show footer on quiz pages or specific secured routes
  const excludedPaths = [
    '/quiz/',
    '/assessment/',
    '/exam/',
  ];
  
  // Check if current path starts with any of the excluded paths
  const shouldShowFooter = !excludedPaths.some(excludedPath => 
    path.startsWith(excludedPath)
  );
  
  return shouldShowFooter ? <Footer /> : null;
};

export default ConditionalFooter; 