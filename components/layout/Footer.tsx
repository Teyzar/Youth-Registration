import { Box, Typography } from '@mui/material'


const Footer = () => {
    return (
        <Box component="footer"       sx={{
            width: '100%',
            marginTop: 'auto',
          }}>
      <Box
        sx={{
          background: 'background.default',
          color: "white",
          padding: "1rem 2rem",
          mt: "auto",
          marginTop: "2rem",
          boxShadow: '0 -10px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography>
            Footer
        </Typography>
      </Box>
        </Box>
    )
}

export default Footer;