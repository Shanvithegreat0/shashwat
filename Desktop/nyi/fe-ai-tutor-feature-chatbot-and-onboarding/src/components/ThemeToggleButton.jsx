import React from 'react';
import { 
  IconButton,
} from '@mui/material';
import { DarkMode, LightMode } from '@mui/icons-material';
import { useColorMode } from '../theme/ThemeContext';

/**
 * Theme toggle button component that displays either as an icon button or a full button with text
 * depending on available space
 */
const ThemeToggleButton = ({ sx = {} }) => {
  const { mode, toggleColorMode } = useColorMode();

  return (
    <IconButton
      onClick={toggleColorMode}
      color="inherit"
      aria-label={mode === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
      sx={{
        ...sx,
        color: 'inherit',
        transition: 'transform 0.3s',
        '&:hover': {
          transform: 'rotate(15deg)',
        },
      }}
    >
      {mode === 'dark' ? <LightMode /> : <DarkMode />}
    </IconButton>
  );
};

export default ThemeToggleButton; 