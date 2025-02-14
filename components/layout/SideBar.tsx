"use client"

import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  Paper,
} from '@mui/material';
import { Logout, Home, People, AppRegistrationRounded } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

interface Props {
  isAuthenticated: boolean;
}

const SideBar = ({ isAuthenticated }: Props) => {
  const theme = useTheme();
  const router = useRouter();

  if (!isAuthenticated) {
    return null;
  }

  const menuItems = [
    { icon: <Home />, text: 'Home', href: '/' },
    { icon: <People  />, text: 'Campers', href: '/campers' },
    { icon: <AppRegistrationRounded />, text: 'Register', href: '/registration' }
  ];

  const logoutItem = { icon: <Logout />, text: 'Logout', href: '/api/logout' };

  return (
    <Paper
      component="aside"
      elevation={0}
      sx={{
        width: 250,
        height: '100vh',
        position: 'relative',
        top: 0,
        left: 0,
        borderRight: `1px solid ${theme.palette.divider}`,
        backgroundColor: 'background.default',
        display: { xs: 'none', md: 'block' }, // Hide on mobile, show on desktop
        pt: 8, // Add padding top to account for the header
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)' }}>
        <List>
          {menuItems.map((item) => (
            <ListItem
              key={item.text}
              component="a"
              href={item.href}
              sx={{
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
        <List sx={{ marginTop: 'auto' }}>
          <ListItem
            component="button"
            onClick={ async () => {
              const res = await fetch('/api/logout');
              if (res.ok) {
                router.refresh();
              }
            }}
            sx={{
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <ListItemIcon>{logoutItem.icon}</ListItemIcon>
            <ListItemText primary={logoutItem.text} />
          </ListItem>
        </List>
      </Box>
    </Paper>
  );
};

export default SideBar;
