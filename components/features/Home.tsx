'use client'

import { Box, Grid, Card, CardContent, Typography, Skeleton } from "@mui/material";
import { motion } from "framer-motion";
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { getCampers } from '@/lib/api';
import { useState, useEffect } from "react";
import TableData  from "@/types/table.interface";

const Home = () => {
    const [campers, setCampers] = useState<TableData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCampers()
            .then(setCampers)
            .finally(() => setLoading(false));
    }, []);

    const totalMoney = campers.reduce((acc, camper) => acc + camper.payment, 0).toLocaleString('en-US', { style: 'currency', currency: 'PHP' });
    const totalExtra = campers.reduce((acc, camper) => acc + camper.extra, 0).toLocaleString('en-US', { style: 'currency', currency: 'PHP' });
    const totalFullyPaid = campers.filter(camper => camper.status === 'FP').length;
    const totalUnpaid = campers.filter(camper => camper.status === 'DP').length;
    
    const stats = [
        { title: "Total Campers", value: campers.length, icon: <PeopleIcon sx={{ fontSize: 25 }}/>, color: "#4caf50" },
        { title: "Total Money", value: totalMoney, icon: <AttachMoneyIcon sx={{ fontSize: 25 }}/>, color: "#2196f3" },
        { title: "Total Extra", value: totalExtra, icon: <ShoppingCartIcon sx={{ fontSize: 25 }}/>, color: "#ff9800" },
        { title: "Fully Paid", value: totalFullyPaid, icon: <CheckCircleIcon sx={{ fontSize: 25 }}/>, color: "#4caf50" },
        { title: "Unpaid", value: totalUnpaid, icon: <ErrorIcon sx={{ fontSize: 25 }}/>, color: "#f50057" },
    ];

    return (
        <Box sx={{width: '100%'}}>
            <Typography variant="h4" sx={{ mb: 4 }}>Dashboard Overview</Typography>
            <Grid container spacing={4}>
                {loading ? (
                    // Skeleton loading state
                    [...Array(5)].map((_, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Card>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Box>
                                            <Skeleton width={100} height={20} sx={{ mb: 1 }} />
                                            <Skeleton width={60} height={40} />
                                        </Box>
                                        <Skeleton variant="circular" width={40} height={40} />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    stats.map((stat, index) => (
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
                    ))
                )}
            </Grid>
        </Box>
    );
}

export default Home;