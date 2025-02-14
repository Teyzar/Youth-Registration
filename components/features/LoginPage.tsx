'use client'

import {
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Box,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from 'react';
import { useRouter } from 'next/navigation'
import { LoginFormData } from '@/types/login.types';

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(8),
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}))

async function handleLogin(formData: LoginFormData) {
  const response = await fetch('/api/login', {
    method: 'POST',
    body: JSON.stringify(formData),
  });
  return await response.json();
}

export default function LoginPage() {
  const { register, handleSubmit } = useForm<LoginFormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<LoginFormData>();
  const router = useRouter();

  const handleFormSubmit: SubmitHandler<LoginFormData> = async (formData) => {
    setIsSubmitting(true);
    try {
      const response = await handleLogin(formData);
      if (response.message === "Login successful") {
        router.push('/');
        router.refresh();
      } else {
        setErrors({
          email: response.message,
          password: response.message
        });
      }
    } catch {
      setErrors({
        email: 'An error occurred during login',
        password: 'An error occurred during login'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box>
      <StyledPaper elevation={3}>
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          Welcome back
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Please sign in to your account
        </Typography>

        <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
    
          <TextField
              fullWidth
              error={!!errors?.email}
              helperText={errors?.email}
              label="Email"
              variant="outlined"
              required
              size="small"
            {...register('email')}
            sx={{ backgroundColor: 'background.paper' }}
          />
          <TextField
            fullWidth
            error={!!errors?.password}
            helperText={errors?.password}
            type="password"
            label="Password"
            variant="outlined"
            required
            size="small"
            {...register('password')}
            sx={{ backgroundColor: 'background.paper', mt: 2 }}
          />
          <Box sx={{ mt: 2 }}>
              <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary"
                  fullWidth
                  disabled={isSubmitting}
              >
                  {isSubmitting ? (
                      <>
                          <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                          Signing In...
                      </>
                  ) : 'Sign In'}
              </Button>
          </Box>
        </Box>
      </StyledPaper>
    </Box>
  )
}
