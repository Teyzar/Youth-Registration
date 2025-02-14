'use client'
import { Box, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Grid2, Paper, Button, CircularProgress } from "@mui/material"
import { useForm } from "react-hook-form";
import { useState } from 'react';
import { RegistrationFormData } from "@/types";
import SnackBar from "@/components/common/SnackBar";
import { registerCamper } from "@/lib/api/data";

const Register = () => {

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });
    const {register, handleSubmit, reset, setValue, watch} = useForm<RegistrationFormData>();

    // Watch the values to use them in the Select components
    const genderValue = watch('gender');
    const tshirtValue = watch('tshirt_paid');
    const paymentValue = watch('payment');

    const handleFormSubmit = async (formData: RegistrationFormData) => {
        setIsSubmitting(true);
        try {
            const response = await registerCamper(formData, 'POST');
            console.log(response)
            if (response.status === 200) {
                reset(); // Reset form state
                setValue('gender', '');
                setValue('tshirt_paid', null);
                setNotification({
                    open: true,
                    message: 'Registration successful!',
                    severity: 'success'
                });
            } else {
                setNotification({
                    open: true,
                    message: response.error,
                    severity: 'error'
                });
            }
        } catch (error) {
            setNotification({
                open: true,
                message: 'Registration failed. Please try again.',
                severity: 'error'
            });
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleCloseNotification = () => {
        setNotification(prev => ({ ...prev, open: false }));
    };

    return (
        <>
            <SnackBar notification={notification} handleCloseNotification={handleCloseNotification}/>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'start',
                // minHeight: '100vh',
            }}>
                <Paper elevation={1} sx={{ 
                    p: 4, 
                    width: '100%',
                    borderRadius: 3,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                }}>
                    <Typography sx={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        color: 'primary.main',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                        alignSelf: 'start',
                        mb: 5
                    }}>
                        Youth Registration
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
                        <Grid2 container spacing={3}>
                            <Grid2 size={{xs: 12}}>
                                <TextField
                                    fullWidth
                                    label="Full Name"
                                    variant="outlined"
                                    required
                                    size="small"
                                    {...register('name')}
                                    sx={{ backgroundColor: 'background.paper' }}
                                />
                            </Grid2>
                            
                            <Grid2 size={{xs: 12, sm: 6}}>
                                <TextField
                                    fullWidth
                                    label="Nickname"
                                    variant="outlined"
                                    size="small"
                                    {...register('nickname')}
                                    sx={{ backgroundColor: 'background.paper' }}
                                />
                            </Grid2>
                            
                            <Grid2 size={{xs: 12, sm: 6}}>
                                <TextField
                                    fullWidth
                                    label="Birthdate"
                                    type="date"
                                    variant="outlined"
                                    required
                                    size="small"
                                    InputLabelProps={{ shrink: true }}
                                    {...register('birthdate')}
                                    sx={{ backgroundColor: 'background.paper' }}
                                />
                            </Grid2>
                            
                            <Grid2 size={{xs: 12}}>
                                <FormControl fullWidth required size="small">
                                    <InputLabel>Gender</InputLabel>
                                    <Select
                                        label="Gender"
                                        value={genderValue || ''}
                                        {...register('gender')}
                                        sx={{ backgroundColor: 'background.paper' }}
                                    >
                                        <MenuItem value="male">Male</MenuItem>
                                        <MenuItem value="female">Female</MenuItem>
                                        <MenuItem value="other">Other</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid2>
                            
                            <Grid2 size={{xs: 12}}>
                                <TextField
                                    fullWidth
                                    label="Contact Number"
                                    variant="outlined"
                                    required
                                    size="small"
                                    {...register('contact_number')}
                                    sx={{ backgroundColor: 'background.paper' }}
                                />
                            </Grid2>

                            <Grid2 size={{xs: 12, sm: 6}}>
                                <TextField
                                    fullWidth
                                    label="Payment"
                                    type="number"
                                    variant="outlined"
                                    size="small"
                                    value={paymentValue ? parseInt(paymentValue.toString()) : 0 }
                                    {...register('payment')}
                                    sx={{ backgroundColor: 'background.paper' }}
                                />
                            </Grid2>

                            <Grid2 size={{xs: 12, sm: 6}}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>T-Shirt Paid</InputLabel>
                                    <Select
                                        label="T-Shirt Paid"
                                        value={tshirtValue || 'No'}
                                        {...register('tshirt_paid')}
                                        sx={{ backgroundColor: 'background.paper' }}
                                    >
                                        <MenuItem value="yes">Yes</MenuItem>
                                        <MenuItem value="no">No</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid2>

                            <Grid2 size={{xs: 12}}>
                                <TextField
                                    fullWidth
                                    label="Remarks"
                                    variant="outlined"
                                    multiline   
                                    rows={2}
                                    size="small"
                                    {...register('remarks')}
                                    sx={{ backgroundColor: 'background.paper' }}
                                />
                            </Grid2>
                        </Grid2>

                        <Box sx={{ display: 'flex', justifyContent: 'end', mt: 2 }}>
                            <Button 
                                type="submit" 
                                variant="contained" 
                                color="primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                                        Submitting...
                                    </>
                                ) : 'Submit'}
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </>
    )
}

export default Register;