import { Avatar, IconButton, Menu, MenuItem, Stack, Typography } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux'
import { useLogoutMutation } from '../store/slices/apiServices';
import { useNavigate } from 'react-router';

const UserProfileComponent = () => {
    const user=useSelector(state=>state.auth.user);
    const initials=user?.name.slice(0,1);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();
    const [triggerLogout]=useLogoutMutation()

    const handleLogout=async()=>{
      try {
        await triggerLogout().unwrap()
        navigate('/login')
      } catch (error) {
        console.error(error)
      }
    }

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

  return (
    <div>
        <IconButton onClick={handleClick}>
        <Avatar sx={{ bgcolor: "#0099ff"}}>{initials}</Avatar>
        </IconButton>

        <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem >
        <Stack alignItems={'center'}>
             <Avatar  sx={{ bgcolor: "#0099ff",width:70,height:70,fontSize:30,fontWeight:600}}>{initials}</Avatar>
             <Typography>{user.name}</Typography>
             <Typography>{user.email}</Typography>
        </Stack>
        </MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </div>
  )
}

export default UserProfileComponent