import React from 'react';
import { CircularProgress, Box, Typography, LinearProgress } from '@mui/material';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
        {/* Custom Spinner */}
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-gray-200"></div>
          <div className="w-16 h-16 rounded-full border-4 border-blue-500 border-t-transparent animate-spin absolute top-0"></div>
        </div>
        
        {/* MUI Progress Indicators */}
        <Box sx={{ width: '200px', textAlign: 'center' }}>
          <CircularProgress color="primary" size={50} />
          <LinearProgress sx={{ mt: 2 }} />
          <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
            Loading...
          </Typography>
        </Box>
      </Box>
    </div>
  );
}
