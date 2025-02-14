import React from 'react';
import { Box, LinearProgress } from '@mui/material';

export default function Loading() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <LinearProgress />
    </Box>
  );
}
