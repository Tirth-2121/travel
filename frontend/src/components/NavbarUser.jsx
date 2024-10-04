import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

function NavbarUser() {
    const { logout } = useAuthStore();
    const navigate = useNavigate();
    
    const [anchorEl, setAnchorEl] = React.useState(null);
    
    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        logout();
        window.location.href = '/';
    };

    const handleNavigation = (path) => {
        navigate(path);
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="static" color="primary">
            <Toolbar>
                <Typography variant="h6" onClick={() => handleNavigation('/')} style={{ cursor: 'pointer', flexGrow: 1 }}>
                    Travel
                </Typography>
                <Button color="inherit" onClick={() => handleNavigation('/my-trips')}>My Trip</Button>
                <Button color="inherit" onClick={() => handleNavigation('/favorite-packages')}>Favorite</Button>
                <Button color="inherit" onClick={() => handleNavigation('/gallery')}>Gallery</Button>
                <Button color="inherit" onClick={() => handleNavigation('/contact-us')}>Contact Us</Button>
                
                <IconButton color="inherit" onClick={handleMenuOpen}>
                    <FaUserCircle />
                </IconButton>
                
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={() => { handleNavigation('/profile'); handleMenuClose(); }}>My Profile</MenuItem>
                    <MenuItem onClick={() => { handleLogout(); handleMenuClose(); }}>Logout</MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
}

export default NavbarUser;
