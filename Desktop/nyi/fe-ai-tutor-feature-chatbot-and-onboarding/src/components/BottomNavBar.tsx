import { BottomNavigation, BottomNavigationAction, Box } from '@mui/material';
import React, { useState } from 'react'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ArticleIcon from '@mui/icons-material/Article';
import PostAddIcon from '@mui/icons-material/PostAdd';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { Link } from 'react-router';


const BottomNavBar = () => {
  const [value, setValue] = useState(0)
  return (
    <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50, display: { md: 'none' } }} >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction LinkComponent={Link} to="/" label="Posts" icon={<ArticleIcon />} />
        <BottomNavigationAction LinkComponent={Link} to="/calendar" label="Calendar" icon={<CalendarMonthIcon />} />
        <BottomNavigationAction LinkComponent={Link} to="/" label="Add Post" icon={<PostAddIcon />} />
        <BottomNavigationAction LinkComponent={Link} to="/profile" label="Profile" icon={<AccountBoxIcon />} />
      </BottomNavigation>
    </Box>
  )
}

export default BottomNavBar