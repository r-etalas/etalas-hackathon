import React from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    useTheme,
} from '@mui/material';
import {
    People as PeopleIcon,
    Videocam as VideocamIcon,
    LocationOn as LocationIcon,
    TrendingUp as TrendingUpIcon,
    Person as PersonIcon,
    PlayArrow as PlayArrowIcon,
} from '@mui/icons-material';

const Dashboard: React.FC = () => {
    const theme = useTheme();

    const stats = [
        {
            title: 'Total Users',
            value: '47,033',
            icon: <PeopleIcon />,
            color: theme.palette.primary.main,
        },
        {
            title: 'Total Videos',
            value: '1,250',
            icon: <VideocamIcon />,
            color: theme.palette.secondary.main,
        },
        {
            title: 'Total Views',
            value: '61,344',
            icon: <TrendingUpIcon />,
            color: theme.palette.success.main,
        },
        {
            title: 'Active Locations',
            value: '3',
            icon: <LocationIcon />,
            color: theme.palette.warning.main,
        },
    ];

    const recentUsers = [
        { id: 1, name: 'John Doe', email: 'john@example.com', date: '2024-03-02' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', date: '2024-03-02' },
        { id: 3, name: 'Mike Johnson', email: 'mike@example.com', date: '2024-03-01' },
    ];

    const recentVideos = [
        { id: 1, title: 'Beautiful Wedding at AYANA Bali', views: 245, date: '2024-03-02' },
        { id: 2, title: 'Romantic Sunset Wedding in Komodo', views: 189, date: '2024-03-02' },
        { id: 3, title: 'Elegant Wedding at AYANA Jakarta', views: 156, date: '2024-03-01' },
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Welcome to AYANA Wedding Dashboard
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                Here&apos;s what&apos;s happening with your wedding videos platform
            </Typography>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {stats.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card>
                            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box
                                    sx={{
                                        backgroundColor: stat.color,
                                        borderRadius: '50%',
                                        p: 1,
                                        mr: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {React.cloneElement(stat.icon, {
                                        style: { color: 'white' },
                                    })}
                                </Box>
                                <Box>
                                    <Typography color="textSecondary" variant="body2">
                                        {stat.title}
                                    </Typography>
                                    <Typography variant="h5">
                                        {stat.value}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Recent Activity */}
            <Grid container spacing={3}>
                {/* Recent Users */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography variant="h6">Recent Users</Typography>
                                <Button color="primary">View All</Button>
                            </Box>
                            <List>
                                {recentUsers.map((user) => (
                                    <ListItem key={user.id}>
                                        <ListItemIcon>
                                            <PersonIcon />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={user.name}
                                            secondary={`${user.email} • ${user.date}`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Recent Videos */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography variant="h6">Recent Videos</Typography>
                                <Button color="primary">View All</Button>
                            </Box>
                            <List>
                                {recentVideos.map((video) => (
                                    <ListItem key={video.id}>
                                        <ListItemIcon>
                                            <PlayArrowIcon />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={video.title}
                                            secondary={`${video.views} views • ${video.date}`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard; 