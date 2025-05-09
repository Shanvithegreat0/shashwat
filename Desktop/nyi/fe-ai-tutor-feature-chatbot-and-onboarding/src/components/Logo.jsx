import { Box, Typography, useTheme } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import { Link } from 'react-router-dom';

const Logo = ({ variant = 'default', showText = true, to = null }) => {
  const theme = useTheme();
  
  // Size adjustments based on variant with fixed dimensions
  const getSize = () => {
    switch (variant) {
      case 'small':
        return {
          iconSize: 24,
          fontSize: '1.2rem',
          spacing: 1,
          boxSize: 28.8, // 24 * 1.2
          containerWidth: showText ? 110 : 28.8
        };
      case 'large':
        return {
          iconSize: 40,
          fontSize: '1.8rem',
          spacing: 1.5,
          boxSize: 48, // 40 * 1.2
          containerWidth: showText ? 165 : 48
        };
      default:
        return {
          iconSize: 32,
          fontSize: '1.4rem',
          spacing: 1.2,
          boxSize: 38.4, // 32 * 1.2
          containerWidth: showText ? 140 : 38.4
        };
    }
  };
  
  const { iconSize, fontSize, spacing, boxSize, containerWidth } = getSize();
  
  const LogoContent = (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: boxSize,
          height: boxSize,
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #1a73e8 0%, #4285f4 100%)',
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)',
          flexShrink: 0
        }}
      >
        <SchoolIcon
          sx={{
            color: '#fff',
            fontSize: iconSize
          }}
        />
      </Box>
      
      {showText && (
        <Typography
          variant="h6"
          component="span"
          sx={{
            fontWeight: 700,
            fontSize: fontSize,
            letterSpacing: '-0.5px',
            fontFamily: "'Google Sans', 'Roboto', sans-serif",
            color: '#fff',
            whiteSpace: 'nowrap',
            width: containerWidth - boxSize - spacing * 8,
            display: 'inline-block',
            textAlign: 'left',
            mt: 0.5,
            ml: 0.5,
            flexShrink: 0
          }}
        >
          AI<Box component="span" sx={{ color: '#4285f4', fontWeight: 700 }}>Tutor</Box>
        </Typography>
      )}
    </>
  );

  // Wrap in Link only if 'to' prop is provided
  return to ? (
    <Box
      component={Link}
      to={to}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing,
        textDecoration: 'none',
        color: 'inherit',
        height: boxSize,
        width: containerWidth,
        overflow: 'hidden'
      }}
    >
      {LogoContent}
    </Box>
  ) : (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing,
        color: 'inherit',
        height: boxSize,
        width: containerWidth,
        overflow: 'hidden'
      }}
    >
      {LogoContent}
    </Box>
  );
};

export default Logo; 