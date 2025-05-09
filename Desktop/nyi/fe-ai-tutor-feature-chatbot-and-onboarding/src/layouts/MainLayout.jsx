import React from 'react';
import { Box, Toolbar, useTheme } from "@mui/material";
import { Outlet } from "react-router";
import Header from "../components/Header";
import ConditionalFooter from '../components/ConditionalFooter';
import ScrollToTop from "../components/ScrollToTop";

const MainLayout = () => {
  const theme = useTheme();

  return (
    <>
      {/* ScrollToTop component outside the main layout structure */}
      <ScrollToTop />
      
      <Box 
        sx={{ 
          minHeight: '100vh', 
          display: 'flex', 
          flexDirection: 'column',
          backgroundColor: theme.palette.background.default
        }}
      >
        <Header />
        <Toolbar />
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            pt: { xs: 2, sm: 3, md: 4 },
            px: { xs: 2, sm: 3, md: 4 },
            pb: { xs: 8, sm: 10, md: 12 },
            width: '100%',
            maxWidth: '100%',
            overflow: 'hidden'
          }}
        >
          <Outlet />
        </Box>
        <ConditionalFooter />
      </Box>
    </>
  );
};

export default MainLayout;
