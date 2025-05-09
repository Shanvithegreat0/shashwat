import { Box, useTheme } from '@mui/material'
import React from 'react'
import { Outlet } from 'react-router'
import Header from '../components/Header';

const AuthLayout = () => {
  const theme = useTheme();

  return (
    <Box sx={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      overflow: 'hidden',
      backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.light}20, ${theme.palette.secondary.light}30)`,
    }}>
      <Header />
      <Box sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        overflow: 'auto',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, sm: 3 }
      }}>
        <Outlet />
      </Box>
    </Box>
  )
}

export default AuthLayout