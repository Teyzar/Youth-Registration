'use client'
import { Box, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Grid2, Paper } from "@mui/material"

const Register = () => {
    return (
        <>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 6,
                minHeight: '100vh',
                width: '100%',
                paddingTop: '100px',
            }}>
                <Typography sx={{
                    fontSize: '2.8rem',
                    fontWeight: 'bold',
                    color: 'primary.main',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                    alignSelf: 'center',
                    mb: 5
                }}>
                    Youth Registration
                </Typography>
                
                <Paper elevation={5} sx={{ 
                    p: 4, 
                    width: '100%', 
                    maxWidth: '800px', 
                    minWidth: '320px',
                    borderRadius: 3,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(255,255,255,0.9)',
                }}>
                    <Grid2 container spacing={3}>
                        <Grid2 size={{xs: 12}}>
                            <TextField
                                fullWidth
                                label="Full Name"
                                variant="outlined"
                                required
                                size="small"
                                sx={{ backgroundColor: 'background.paper' }}
                            />
                        </Grid2>
                        
                        <Grid2 size={{xs: 12, sm: 6}}>
                            <TextField
                                fullWidth
                                label="Nickname"
                                variant="outlined"
                                size="small"
                                sx={{ backgroundColor: 'background.paper' }}
                            />
                        </Grid2>
                        
                        <Grid2 size={{xs: 12, sm: 6}}>
                            <TextField
                                fullWidth
                                label="Age"
                                type="number"
                                variant="outlined"
                                required
                                size="small"
                                InputProps={{ 
                                    inputProps: { min: 0 },
                                }}
                                sx={{ backgroundColor: 'background.paper' }}
                            />
                        </Grid2>
                        
                        <Grid2 size={{xs: 12}}>
                            <FormControl fullWidth required size="small">
                                <InputLabel>Gender</InputLabel>
                                <Select
                                    label="Gender"
                                    defaultValue=""
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
                                sx={{ backgroundColor: 'background.paper' }}
                            />
                        </Grid2>
                        
                        <Grid2 size={{xs: 12}}>
                            <TextField
                                fullWidth
                                label="Address"
                                variant="outlined"
                                required
                                multiline
                                rows={2}
                                size="small"
                                sx={{ backgroundColor: 'background.paper' }}
                            />
                        </Grid2>
                    </Grid2>
                </Paper>
            </Box>
        </>
    )
}

export default Register;