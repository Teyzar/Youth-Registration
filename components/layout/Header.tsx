"use client"

import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box,
  Container,
  useTheme,
  useScrollTrigger
} from '@mui/material';

interface Props {
  window?: () => Window;
}

const Header = (props: Props) => {
  const theme = useTheme();
  
  // Add elevation on scroll
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: props.window ? props.window() : undefined,
  });

  return (
    <AppBar 
      position="fixed" 
      color="default" 
      elevation={trigger ? 4 : 0}
      sx={{
        backgroundColor: 'background.default',
        borderBottom: trigger ? 'none' : `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          <Typography
            variant="h6"
            component="h1"
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              cursor: 'pointer'
            }}
          >
            TLLC Youth
          </Typography>

          <Box sx={{ display: 'flex', gap: 4}}>
            <Button color="inherit" href="/">
              Home
            </Button>
            <Button color="inherit" href="/register">
              Register
            </Button>
            <Button color="inherit" href="/contact">
              Contact
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;