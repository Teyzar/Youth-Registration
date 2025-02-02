'use client'
import { Box, Grid, Card, CardContent, Typography } from "@mui/material";
import { motion } from "framer-motion";
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

export default function Home() {
    // Example data - replace with your actual data
    const stats = [
        { title: "Total Campers", value: "248", icon: <PeopleIcon sx={{ fontSize: 40 }}/>, color: "#4caf50" },
        { title: "Total Money", value: "$24,560", icon: <AttachMoneyIcon sx={{ fontSize: 40 }}/>, color: "#2196f3" },
        { title: "Total Extra", value: "$1,556", icon: <ShoppingCartIcon sx={{ fontSize: 40 }}/>, color: "#ff9800" },
        { title: "Fully Paid", value: "156", icon: <CheckCircleIcon sx={{ fontSize: 40 }}/>, color: "#4caf50" },
        { title: "Unpaid", value: "92", icon: <ErrorIcon sx={{ fontSize: 40 }}/>, color: "#f50057" },
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 4 }}>Dashboard Overview</Typography>
            <Grid container spacing={3}>
                {stats.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                            <Card
                                sx={{
                                    height: '100%',
                                    transition: 'transform 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: 4,
                                    },
                                }}
                            >
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Box>
                                            <Typography color="textSecondary" gutterBottom>
                                                {stat.title}
                                            </Typography>
                                            <Typography variant="h4" component="div">
                                                {stat.value}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ color: stat.color }}>
                                            {stat.icon}
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}