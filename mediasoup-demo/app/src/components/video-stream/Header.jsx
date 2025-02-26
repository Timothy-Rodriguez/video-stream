import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  Box,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/material/styles';
import { keyframes } from '@emotion/react';

// Pulse animation with white color
const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  }
`;

const HeaderButton = styled(Button)({
  color: '#fff',
  margin: '0 10px',
  padding: '8px 20px',
  borderRadius: '25px',
  backgroundColor: '#1976d2', // Solid blue
  '&:hover': {
    backgroundColor: '#2196f3', // Matching footer's hover color
    animation: `${pulse} 1.5s infinite`,
  },
});

// Styled button for mobile drawer
const MobileHeaderButton = styled(Button)({
  color: '#fff',
  width: '100%',
  padding: '10px 20px',
  borderRadius: '20px',
  backgroundColor: '#1976d2',
  margin: '5px 0',
  '&:hover': {
    backgroundColor: '#2196f3',
    animation: `${pulse} 1.5s infinite`,
  },
});

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = ['Home', 'About', 'Services', 'Contact'];

  const drawer = (
    <Box sx={{ width: 250, bgcolor: '#1976d2', height: '100%', p: 2 }}>
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <MobileHeaderButton>
              {item}
            </MobileHeaderButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            MyApp
          </Typography>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            {navItems.map((item) => (
              <HeaderButton key={item}>
                {item}
              </HeaderButton>
            ))}
          </Box>

          {/* Mobile Menu Button */}
          <IconButton
            color="inherit"
            edge="end"
            onClick={handleDrawerToggle}
            sx={{ display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{ display: { md: 'none' } }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Header;