import { createTheme } from '@mui/material/styles';

// Enhanced color palette based on modern LMS platforms and color theory
// These colors have been selected for better accessibility and visual hierarchy
const baseTheme = createTheme({
  palette: {
    primary: {
      main: '#4285F4', // Aligned with the blue seen in the screenshots
      light: '#80b4ff',
      dark: '#1565C0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#7C3AED', // Purple - commonly used in educational platforms
      light: '#A78BFA',
      dark: '#5B21B6',
      contrastText: '#ffffff',
    },
    error: {
      main: '#EF4444', // More accessible red
      light: '#FCA5A5',
      dark: '#B91C1C',
    },
    warning: {
      main: '#F59E0B', // Improved warning yellow for better visibility
      light: '#FCD34D',
      dark: '#D97706',
    },
    info: {
      main: '#4285F4', // Matched with primary for consistency
      light: '#80b4ff',
      dark: '#1565C0',
    },
    success: {
      main: '#10B981', // Modern green tone
      light: '#6EE7B7',
      dark: '#047857',
    },
    background: {
      default: '#F8FAFC', // Slightly cooler white for reduced eye strain
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0F172A', // Darker for better readability
      secondary: '#475569', // Softer secondary text
      disabled: '#94A3B8',
    },
    divider: 'rgba(0, 0, 0, 0.08)',
    // Custom colors for previously hardcoded values
    custom: {
      // Feature icons colors
      featureIcons: {
        ai: '#4285F4',
        analytics: '#EA4335',
        time: '#FBBC05',
        assessment: '#34A853',
        performance: '#4285F4',
        expert: '#8E44AD',
        device: '#1ABC9C',
        security: '#E74C3C',
        updates: '#F39C12',
        cloud: '#3498DB',
        comparative: '#16A085',
        library: '#27AE60',
      },
      // Gradient colors
      gradients: {
        primaryLight: 'linear-gradient(90deg, #80b4ff 0%, #4285F4 100%)',
        primaryDark: 'linear-gradient(90deg, #1565C0 0%, #4285F4 100%)',
        darkBg: 'linear-gradient(135deg, #0A1929 0%, #132F4C 100%)',
        lightBg: 'linear-gradient(135deg, #F0F7FF 0%, #DCEEFB 100%)',
        darkReversed: 'linear-gradient(135deg, #132F4C 0%, #0A1929 100%)',
        blueGradient: 'linear-gradient(135deg, #4285F4 0%, #1565C0 100%)',
        buttonGradient: 'linear-gradient(135deg, #4285F4 0%, #2563EB 100%)',
      },
      // Background colors
      backgrounds: {
        darkBlue: '#0A1929',
        lightBlue: '#F0F7FF',
      },
      // Other colors
      highlightBlue: '#0099ff',
      // Box shadows
      shadows: {
        card: '0 3px 10px rgba(0,0,0,0.1)',
        cardHover: '0 6px 20px rgba(0,0,0,0.15)',
        cardLarge: '0 20px 40px rgba(0,0,0,0.15)',
        small: '0 4px 14px rgba(0,0,0,0.1)',
        medium: '0 8px 24px rgba(0,0,0,0.1)',
        large: '0 12px 30px rgba(0,0,0,0.15)',
        xlarge: '0 15px 35px rgba(0,0,0,0.1)',
        darkSmall: '0 8px 32px rgba(0,0,0,0.2)',
        darkMedium: '0 12px 40px rgba(0,0,0,0.25)',
        textShadow: '0 2px 10px rgba(0,0,0,0.1)',
      },
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.2,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.2,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.2,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.2,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.57,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.43,
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 600,
      lineHeight: 1.75,
      textTransform: 'none',
      letterSpacing: '0.01em',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.66,
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 500,
      lineHeight: 2.66,
      textTransform: 'uppercase',
      letterSpacing: '0.08333em',
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0px 1px 2px rgba(15, 23, 42, 0.06), 0px 1px 3px rgba(15, 23, 42, 0.1)',
    '0px 1px 5px rgba(15, 23, 42, 0.05), 0px 1px 8px rgba(15, 23, 42, 0.1)',
    '0px 2px 4px -1px rgba(15, 23, 42, 0.06), 0px 4px 6px -1px rgba(15, 23, 42, 0.1)',
    '0px 3px 5px -1px rgba(15, 23, 42, 0.06), 0px 6px 10px -1px rgba(15, 23, 42, 0.1)',
    '0px 4px 5px -2px rgba(15, 23, 42, 0.06), 0px 7px 10px 1px rgba(15, 23, 42, 0.1)',
    '0px 5px 6px -3px rgba(15, 23, 42, 0.06), 0px 9px 12px 1px rgba(15, 23, 42, 0.1)',
    '0px 6px 7px -4px rgba(15, 23, 42, 0.06), 0px 11px 14px 1px rgba(15, 23, 42, 0.1)',
    '0px 7px 8px -4px rgba(15, 23, 42, 0.06), 0px 13px 16px 2px rgba(15, 23, 42, 0.1)',
    '0px 8px 9px -5px rgba(15, 23, 42, 0.06), 0px 15px 18px 2px rgba(15, 23, 42, 0.1)',
    '0px 9px 10px -6px rgba(15, 23, 42, 0.06), 0px 17px 20px 2px rgba(15, 23, 42, 0.1)',
    '0px 10px 11px -6px rgba(15, 23, 42, 0.06), 0px 19px 22px 2px rgba(15, 23, 42, 0.1)',
    '0px 11px 12px -7px rgba(15, 23, 42, 0.06), 0px 21px 24px 2px rgba(15, 23, 42, 0.1)',
    '0px 12px 13px -7px rgba(15, 23, 42, 0.06), 0px 23px 26px 2px rgba(15, 23, 42, 0.1)',
    '0px 13px 14px -8px rgba(15, 23, 42, 0.06), 0px 25px 28px 2px rgba(15, 23, 42, 0.1)',
    '0px 14px 15px -8px rgba(15, 23, 42, 0.06), 0px 27px 30px 2px rgba(15, 23, 42, 0.1)',
    '0px 15px 16px -9px rgba(15, 23, 42, 0.06), 0px 29px 32px 2px rgba(15, 23, 42, 0.1)',
    '0px 16px 17px -9px rgba(15, 23, 42, 0.06), 0px 31px 34px 2px rgba(15, 23, 42, 0.1)',
    '0px 17px 18px -10px rgba(15, 23, 42, 0.06), 0px 33px 36px 2px rgba(15, 23, 42, 0.1)',
    '0px 18px 19px -10px rgba(15, 23, 42, 0.06), 0px 35px 38px 2px rgba(15, 23, 42, 0.1)',
    '0px 19px 20px -11px rgba(15, 23, 42, 0.06), 0px 37px 40px 2px rgba(15, 23, 42, 0.1)',
    '0px 20px 21px -11px rgba(15, 23, 42, 0.06), 0px 39px 42px 2px rgba(15, 23, 42, 0.1)',
    '0px 21px 22px -12px rgba(15, 23, 42, 0.06), 0px 41px 44px 2px rgba(15, 23, 42, 0.1)',
    '0px 22px 23px -12px rgba(15, 23, 42, 0.06), 0px 43px 46px 2px rgba(15, 23, 42, 0.1)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
          padding: '8px 18px',
          transition: 'all 0.2s ease-in-out',
        },
        contained: {
          boxShadow: '0 1px 2px rgba(15, 23, 42, 0.1)',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(15, 23, 42, 0.15)',
            transform: 'translateY(-1px)',
          },
        },
        outlined: {
          borderColor: 'rgba(15, 23, 42, 0.2)',
          '&:hover': {
            backgroundColor: 'rgba(66, 133, 244, 0.04)',
          },
        },
        text: {
          '&:hover': {
            backgroundColor: 'rgba(66, 133, 244, 0.04)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.1), 0 1px 2px rgba(15, 23, 42, 0.06)',
          borderRadius: '12px',
          overflow: 'hidden',
          transition: 'box-shadow 0.3s ease, transform 0.3s ease',
          '&:hover': {
            boxShadow: '0 10px 15px -3px rgba(15, 23, 42, 0.1), 0 4px 6px -2px rgba(15, 23, 42, 0.05)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '24px',
          '&:last-child': {
            paddingBottom: '24px',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
        },
        elevation1: {
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.1), 0 1px 2px rgba(15, 23, 42, 0.06)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            transition: 'border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            '&.Mui-focused': {
              boxShadow: '0 0 0 3px rgba(66, 133, 244, 0.1)',
            },
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(15, 23, 42, 0.3)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#4285F4',
            borderWidth: '2px',
          },
        },
        notchedOutline: {
          borderColor: 'rgba(15, 23, 42, 0.2)',
          transition: 'border-color 0.2s ease-in-out',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 2px rgba(15, 23, 42, 0.1)',
          backgroundColor: '#012a4a', // Match the header background in screenshots
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: '3px',
          borderRadius: '3px 3px 0 0',
          backgroundColor: '#4285F4',
        },
        root: {
          '& .MuiTab-root.Mui-selected': {
            color: '#4285F4',
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          minWidth: 'auto',
          padding: '12px 16px',
          transition: 'color 0.2s ease-in-out',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: '8px',
          boxShadow: '0 10px 15px -3px rgba(15, 23, 42, 0.1), 0 4px 6px -2px rgba(15, 23, 42, 0.05)',
          marginTop: '4px',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          padding: '10px 16px',
          transition: 'background-color 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: 'rgba(15, 23, 42, 0.04)',
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
          height: '6px',
          backgroundColor: 'rgba(66, 133, 244, 0.1)',
        },
        bar: {
          borderRadius: '4px',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          fontWeight: 500,
          alignItems: 'center',
        },
        standardSuccess: {
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          color: '#047857',
        },
        standardError: {
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          color: '#B91C1C',
        },
        standardWarning: {
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          color: '#D97706',
        },
        standardInfo: {
          backgroundColor: 'rgba(66, 133, 244, 0.1)',
          color: '#1565C0',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          fontWeight: 500,
          '&.MuiChip-colorPrimary': {
            backgroundColor: 'rgba(66, 133, 244, 0.1)',
            color: '#1565C0',
          },
          '&.MuiChip-colorSecondary': {
            backgroundColor: 'rgba(124, 58, 237, 0.1)',
            color: '#5B21B6',
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
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(15, 23, 42, 0.1)',
        },
      },
    },
  },
});

export default baseTheme; 