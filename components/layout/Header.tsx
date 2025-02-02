"use client"

import { 
  AppBar, 
  Toolbar, 
  Typography,
  Box,
  useTheme,
  useScrollTrigger,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import { ContactPage, Logout, Home, Person } from '@mui/icons-material';

interface Props {
  window?: () => Window;
  isAuthenticated: boolean;
}

const Header = ({isAuthenticated, ...props}: Props) => {
  const theme = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // Add elevation on scroll
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: props.window ? props.window() : undefined,
  });

  if (!isAuthenticated) {
    return null;
  }

  const menuItems = [
    { icon: <Home />, text: 'Home', href: '/' },
    { icon: <Home />, text: 'Campers', href: '/campers' },
    { icon: <Person />, text: 'Register', href: '/registration' },
    { icon: <ContactPage />, text: 'Contact', href: '/contact' },
  ];

  const logoutItem = { icon: <Logout />, text: 'Logout', href: '/api/logout' };

  const drawer = (
    <Box sx={{ width: 250, height: '100%', display: 'flex', flexDirection: 'column' }} role="presentation">
      <List>
        {menuItems.map((item) => (
          <ListItem
            key={item.text} 
            component="a" 
            href={item.href}
            onClick={() => setDrawerOpen(false)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <List sx={{ marginTop: 'auto' }}>
        <ListItem
          component="a" 
          href={logoutItem.href}
          onClick={() => setDrawerOpen(false)}
        >
          <ListItemIcon>{logoutItem.icon}</ListItemIcon>
          <ListItemText primary={logoutItem.text} />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="fixed" 
        color="default" 
        elevation={trigger ? 4 : 0}
        sx={{
          backgroundColor: 'background.default',
          borderBottom: trigger ? 'none' : `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box>
          <Toolbar sx={{ justifyContent: 'flex-start' }}>
            <Typography
              variant="h6"
              component="h1"
              sx={{
                fontWeight: 700,
                color: 'primary.main',
                cursor: 'pointer',
              }}
            >
              CrossBearers Youth
            </Typography>

            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={() => setDrawerOpen(true)}
              sx={{ 
                display: { md: 'none' }, 
                ml: 'auto'
              }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Box>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Header;