import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import baseTheme from './index';

// Create theme context
const ColorModeContext = createContext({ 
  toggleColorMode: () => {},
  mode: 'light'
});

// Export the useColorMode hook
export const useColorMode = () => useContext(ColorModeContext);

export const ThemeContextProvider = ({ children }) => {
  // Try to get saved theme preference from localStorage or use system preference
  const getSavedTheme = () => {
    const savedTheme = localStorage.getItem('themeMode');
    if (savedTheme) {
      return savedTheme;
    }
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  };

  const [mode, setMode] = useState(getSavedTheme());

  // Save theme preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('themeMode', mode);
    
    // Update body class for global styling
    if (mode === 'dark') {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }
  }, [mode]);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      // Only change if user hasn't explicitly set a preference
      if (!localStorage.getItem('themeMode')) {
        setMode(e.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
      mode,
    }),
    [mode]
  );

  // Dark mode component overrides with better color theory principles
  const darkComponents = {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#0A1929', // Darker blue for background - aligned with edu platforms
          color: '#E2E8F0', // Slightly softer than pure white for reduced eye strain
          scrollbarColor: '#334155 #1E293B',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
            backgroundColor: '#1E293B',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#334155',
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: '#475569',
            },
          },
          // Global transition rule to ensure smooth color transitions without layout shifts
          '& *': {
            transition: 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
          }
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundColor: '#132F4C', // Lighter than the background for proper elevation
          backgroundImage: 'none',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.5), 0 1px 2px rgba(0, 0, 0, 0.6)',
          color: '#E2E8F0',
          transition: 'box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.6), 0 2px 4px rgba(0, 0, 0, 0.7)',
          },
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundColor: '#132F4C',
          backgroundImage: 'none',
          color: '#E2E8F0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.5), 0 1px 2px rgba(0, 0, 0, 0.6)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        },
        // Creating elevation levels with progressively lighter backgrounds
        elevation1: { backgroundColor: '#132F4C' },
        elevation2: { backgroundColor: '#173a5e' },
        elevation3: { backgroundColor: '#1c446c' },
        elevation4: { backgroundColor: '#204e79' },
        elevation6: { backgroundColor: '#255887' },
        elevation8: { backgroundColor: '#296294' },
        elevation12: { backgroundColor: '#2e6ca1' },
        elevation16: { backgroundColor: '#3275ae' },
        elevation24: { backgroundColor: '#377fbc' },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#01223d', // Darker version of the header color for dark mode
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          '&.MuiButton-contained': {
            backgroundColor: '#4285F4', // Consistent with light mode
            color: '#FFFFFF',
            '&:hover': {
              backgroundColor: '#2b74e8',
            },
          },
          '&.MuiButton-outlined': {
            borderColor: 'rgba(255, 255, 255, 0.3)',
            color: '#E2E8F0',
            '&:hover': {
              borderColor: 'rgba(255, 255, 255, 0.5)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            },
          },
          '&.MuiButton-text': {
            color: '#80b4ff', // Consistent with light theme's primary light
            '&:hover': {
              backgroundColor: 'rgba(128, 180, 255, 0.08)',
            },
          },
        },
        containedPrimary: {
          backgroundColor: '#4285F4', // Match light theme
          '&:hover': {
            backgroundColor: '#2b74e8',
          },
        },
        containedSecondary: {
          backgroundColor: '#7C3AED', // Consistent with light theme
          '&:hover': {
            backgroundColor: '#6D28D9',
          },
        },
        outlinedPrimary: {
          borderColor: '#4285F4',
          color: '#80b4ff',
          '&:hover': {
            borderColor: '#80b4ff',
            backgroundColor: 'rgba(66, 133, 244, 0.08)',
          },
        },
        outlinedSecondary: {
          borderColor: '#7C3AED',
          color: '#A78BFA',
          '&:hover': {
            borderColor: '#A78BFA',
            backgroundColor: 'rgba(124, 58, 237, 0.08)',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          backgroundColor: '#132F4C',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#E2E8F0',
        },
        head: {
          backgroundColor: '#0A1929',
          color: '#F8FAFC',
          fontWeight: 600,
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          backgroundColor: '#132F4C',
          color: '#E2E8F0',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#132F4C',
          backgroundImage: 'none',
          color: '#E2E8F0',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#132F4C',
          backgroundImage: 'none',
          color: '#E2E8F0',
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          backgroundColor: '#132F4C',
          backgroundImage: 'none',
          color: '#E2E8F0',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: '#132F4C',
          backgroundImage: 'none',
          color: '#E2E8F0',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.7), 0 4px 6px -2px rgba(0, 0, 0, 0.8)',
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          backgroundColor: '#132F4C',
          backgroundImage: 'none',
          color: '#E2E8F0',
        },
        option: {
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          },
          '&[aria-selected="true"]': {
            backgroundColor: 'rgba(66, 133, 244, 0.2)',
          },
          '&[aria-selected="true"]:hover': {
            backgroundColor: 'rgba(66, 133, 244, 0.3)',
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: '#132F4C',
          color: '#E2E8F0',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.2)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.3)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#4285F4',
            borderWidth: '2px',
          },
          '&.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: '#F87171', // Desaturated red for dark mode
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: '#E2E8F0',
        },
        h1: { color: '#F8FAFC' },
        h2: { color: '#F8FAFC' },
        h3: { color: '#F8FAFC' },
        h4: { color: '#F8FAFC' },
        h5: { color: '#F8FAFC' },
        h6: { color: '#F8FAFC' },
        subtitle1: { color: '#CBD5E1' },
        subtitle2: { color: '#CBD5E1' },
        body1: { color: '#E2E8F0' },
        body2: { color: '#E2E8F0' },
        caption: { color: '#94A3B8' },
        overline: { color: '#94A3B8' },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          color: '#E2E8F0',
          '&.MuiChip-colorPrimary': {
            backgroundColor: 'rgba(66, 133, 244, 0.2)',
            color: '#80b4ff',
          },
          '&.MuiChip-colorSecondary': {
            backgroundColor: 'rgba(124, 58, 237, 0.2)',
            color: '#A78BFA',
          },
        },
        filled: {
          '&.MuiChip-colorPrimary': {
            backgroundColor: '#4285F4',
            color: '#FFFFFF',
          },
          '&.MuiChip-colorSecondary': {
            backgroundColor: '#7C3AED',
            color: '#FFFFFF',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: '#4285F4',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: '#94A3B8',
          '&.Mui-selected': {
            color: '#80b4ff', // Matching primary.light
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          '& .MuiSwitch-track': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
          '& .Mui-checked + .MuiSwitch-track': {
            backgroundColor: 'rgba(66, 133, 244, 0.5)',
          },
          '& .MuiSwitch-thumb': {
            backgroundColor: '#94A3B8',
          },
          '& .Mui-checked .MuiSwitch-thumb': {
            backgroundColor: '#4285F4',
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
        },
        standardSuccess: {
          backgroundColor: 'rgba(16, 185, 129, 0.2)', // Desaturated for dark mode
          color: '#6EE7B7',
        },
        standardError: {
          backgroundColor: 'rgba(239, 68, 68, 0.2)', // Desaturated for dark mode
          color: '#FCA5A5',
        },
        standardWarning: {
          backgroundColor: 'rgba(245, 158, 11, 0.2)', // Desaturated for dark mode
          color: '#FCD34D',
        },
        standardInfo: {
          backgroundColor: 'rgba(66, 133, 244, 0.2)', // Matching primary
          color: '#80b4ff',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        },
        barColorPrimary: {
          backgroundColor: '#4285F4',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#80b4ff', // Primary light color
          '&:hover': {
            color: '#aaceff',
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: '#94A3B8',
          '&.Mui-checked': {
            color: '#4285F4',
          },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          color: '#94A3B8',
          '&.Mui-checked': {
            color: '#4285F4',
          },
        },
      },
    },
  };

  // Override theme with dark mode values
  const theme = useMemo(() => {
    return createTheme({
      ...baseTheme,
      palette: {
        ...baseTheme.palette,
        mode,
        ...(mode === 'dark' && {
          primary: {
            main: '#4285F4', // Consistent with light mode
            light: '#80b4ff',
            dark: '#1565C0',
            contrastText: '#FFFFFF',
          },
          secondary: {
            main: '#7C3AED', // Consistent with light mode
            light: '#A78BFA',
            dark: '#6D28D9',
            contrastText: '#FFFFFF',
          },
          error: {
            main: '#EF4444', // Desaturated red for better dark mode visibility
            light: '#F87171',
            dark: '#DC2626',
          },
          warning: {
            main: '#F59E0B', // Desaturated yellow for dark mode
            light: '#FBBF24',
            dark: '#D97706',
          },
          info: {
            main: '#4285F4', // Consistent with primary
            light: '#80b4ff',
            dark: '#1565C0',
          },
          success: {
            main: '#10B981', // Desaturated green for dark mode
            light: '#34D399',
            dark: '#059669',
          },
          background: {
            default: '#0A1929', // Dark blue background - better than pure black
            paper: '#132F4C', // Slightly lighter for surfaces
          },
          text: {
            primary: '#E2E8F0', // Slightly off-white for less eye strain
            secondary: '#94A3B8', // Softer secondary text
            disabled: '#64748B',
          },
          divider: 'rgba(255, 255, 255, 0.1)',
        }),
      },
      components: {
        ...baseTheme.components,
        ...(mode === 'dark' && darkComponents),
      },
    });
  }, [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}; 