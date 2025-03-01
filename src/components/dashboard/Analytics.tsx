import React from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    useTheme,
} from '@mui/material';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
} from 'recharts';

// Data dummy untuk grafik
const loginData = [
    { date: '2024-02-25', logins: 45 },
    { date: '2024-02-26', logins: 52 },
    { date: '2024-02-27', logins: 49 },
    { date: '2024-02-28', logins: 63 },
    { date: '2024-02-29', logins: 58 },
    { date: '2024-03-01', logins: 71 },
    { date: '2024-03-02', logins: 68 },
];

const videoEngagementData = [
    { date: '2024-02-25', views: 156, watchTime: 432 },
    { date: '2024-02-26', views: 142, watchTime: 389 },
    { date: '2024-02-27', views: 164, watchTime: 456 },
    { date: '2024-02-28', views: 189, watchTime: 521 },
    { date: '2024-02-29', views: 201, watchTime: 578 },
    { date: '2024-03-01', views: 220, watchTime: 634 },
    { date: '2024-03-02', views: 245, watchTime: 698 },
];

const locationData = [
    { location: 'Bali', views: 450 },
    { location: 'Komodo', views: 280 },
    { location: 'Jakarta', views: 320 },
];

const Analytics: React.FC = () => {
    const theme = useTheme();

    const stats = [
        {
            title: 'Total Login Hari Ini',
            value: '71',
            change: '+15%',
            timeframe: 'vs kemarin',
        },
        {
            title: 'Total Views Hari Ini',
            value: '245',
            change: '+11%',
            timeframe: 'vs kemarin',
        },
        {
            title: 'Rata-rata Watch Time',
            value: '2.85',
            unit: 'menit',
            change: '+8%',
            timeframe: 'vs minggu lalu',
        },
        {
            title: 'Unique Visitors',
            value: '189',
            change: '+5%',
            timeframe: 'vs kemarin',
        },
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
                Analytics Dashboard
            </Typography>

            {/* Statistik Utama */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {stats.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    {stat.title}
                                </Typography>
                                <Typography variant="h4" component="div">
                                    {stat.value}
                                    {stat.unit && <span style={{ fontSize: '1rem' }}> {stat.unit}</span>}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color={stat.change.startsWith('+') ? 'success.main' : 'error.main'}
                                >
                                    {stat.change} {stat.timeframe}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Grafik Login Activity */}
            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Login Activity
                    </Typography>
                    <Box sx={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={loginData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="logins"
                                    stroke={theme.palette.primary.main}
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Box>
                </CardContent>
            </Card>

            {/* Grafik Video Engagement */}
            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Video Engagement
                    </Typography>
                    <Box sx={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={videoEngagementData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis yAxisId="left" />
                                <YAxis yAxisId="right" orientation="right" />
                                <Tooltip />
                                <Legend />
                                <Line
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="views"
                                    stroke={theme.palette.primary.main}
                                    activeDot={{ r: 8 }}
                                />
                                <Line
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey="watchTime"
                                    stroke={theme.palette.secondary.main}
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Box>
                </CardContent>
            </Card>

            {/* Grafik Location Views */}
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Views by Location
                    </Typography>
                    <Box sx={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={locationData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="location" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar
                                    dataKey="views"
                                    fill={theme.palette.primary.main}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Analytics; 