import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop ensures that the page scrolls to the top when navigating between routes
 * Includes additional handling to make sure it works consistently across different browsers
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  const scrolledRef = useRef(false);

  useEffect(() => {
    // Skip scroll if there is a hash in the URL (anchor link)
    if (hash) return;

    // Reset the scrolledRef when the route changes
    scrolledRef.current = false;

    const scrollToTop = () => {
      if (scrolledRef.current) return;
      
      // Try both methods for better cross-browser support
      try {
        // Smooth scroll for modern browsers with fallback
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
        
        // For Safari and older browsers
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
        
        scrolledRef.current = true;
      } catch (error) {
        // Fallback for older browsers
        window.scrollTo(0, 0);
      }
    };

    // Execute scroll with a small delay to ensure DOM is ready
    const timeoutId = setTimeout(scrollToTop, 100);
    
    return () => clearTimeout(timeoutId);
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop; 