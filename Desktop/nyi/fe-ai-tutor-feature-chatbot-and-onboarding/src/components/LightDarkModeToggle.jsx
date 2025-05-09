import React from 'react';
import { styled } from '@mui/material/styles';
import { useTheme, Box } from '@mui/material';
import { useColorMode } from '../theme/ThemeContext';

// Styled components
const ToggleContainer = styled('div')(({ theme }) => ({
  position: 'relative',
  width: '60px',
  height: '34px',
  borderRadius: '17px',
  cursor: 'pointer',
  backgroundColor: theme.palette.mode === 'dark' ? '#4285f4' : '#e9e9e9',
  transition: 'background-color 0.3s ease-in-out',
  boxShadow: '0 2px 5px rgba(0,0,0,0.2) inset',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 6px',
  boxSizing: 'border-box',
  flexShrink: 0
}));

const Slider = styled('div')(({ theme }) => ({
  position: 'absolute',
  left: theme.palette.mode === 'dark' ? 'calc(100% - 30px)' : '4px',
  width: '26px',
  height: '26px',
  borderRadius: '50%',
  backgroundColor: '#fff',
  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  transition: 'left 0.3s ease-in-out, transform 0.3s ease-in-out',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&:hover': {
    transform: 'scale(1.05)'
  }
}));

const Moon = styled('div')({
  width: '12px',
  height: '12px',
  borderRadius: '50%',
  backgroundColor: '#4285f4',
  boxShadow: 'inset 3px -3px 0 0 #fff',
  transform: 'rotate(-30deg)',
  transition: 'all 0.3s ease'
});

const Sun = styled('div')({
  width: '14px',
  height: '14px',
  borderRadius: '50%',
  backgroundColor: '#ffeb3b',
  boxShadow: '0 0 4px 2px rgba(255, 235, 59, 0.3)',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,235,59,1) 0%, rgba(255,235,59,0.6) 100%)'
  }
});

const SunRays = styled('div')({
  position: 'absolute',
  width: '100%',
  height: '100%',
  borderRadius: '50%',
  animation: 'spin 8s linear infinite',
  '@keyframes spin': {
    '0%': {
      transform: 'rotate(0deg)'
    },
    '100%': {
      transform: 'rotate(360deg)'
    }
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    boxShadow: '0 0 0 2px rgba(255, 235, 59, 0.3)',
    width: '5px',
    height: '1px',
    top: '50%',
    left: '100%',
    transform: 'translateY(-50%)'
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    boxShadow: '0 0 0 2px rgba(255, 235, 59, 0.3)',
    width: '1px',
    height: '5px',
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)'
  }
});

const LightDarkModeToggle = () => {
  const theme = useTheme();
  const { toggleColorMode } = useColorMode();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Box sx={{ width: '60px', height: '34px' }}>
      <ToggleContainer onClick={toggleColorMode} role="button" aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}>
        {/* Sun icon */}
        <Box 
          sx={{ 
            opacity: isDarkMode ? 0.7 : 1,
            color: '#ffeb3b',
            display: 'flex',
            fontSize: '14px',
            width: '14px',
            height: '14px',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          
        </Box>
        
        {/* Moon icon */}
        <Box 
          sx={{ 
            opacity: isDarkMode ? 1 : 0.7,
            color: '#fff',
            display: 'flex',
            fontSize: '14px',
            width: '14px',
            height: '14px',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          
        </Box>
        
        {/* Slider */}
        <Slider>
          {isDarkMode ? <Moon /> : <Sun />}
        </Slider>
      </ToggleContainer>
    </Box>
  );
};

export default LightDarkModeToggle; 