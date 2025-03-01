'use client'

import React, { useState } from 'react';
import {
    Box,
    Button,
    AppBar,
    Toolbar,
    Typography,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemButton,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import {
    LogoutOutlined,
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    Videocam as VideocamIcon,
    Analytics as AnalyticsIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    Store as StoreIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import Dashboard from '@/components/dashboard/Dashboard';
import UserManagement from '@/components/dashboard/UserManagement';
import VideoManagement from '@/components/dashboard/VideoManagement';
import Analytics from '@/components/dashboard/Analytics';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const drawerWidth = 240;

const menuItems = [
    { text: 'Overview', icon: <DashboardIcon />, index: 0 },
    { text: 'User Management', icon: <PeopleIcon />, index: 1 },
    { text: 'Video Management', icon: <VideocamIcon />, index: 2 },
    { text: 'Analytics', icon: <AnalyticsIcon />, index: 3 },
    { text: 'Showcase', icon: <StoreIcon />, index: 4, path: '/showcase' },
];

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`dashboard-tabpanel-${index}`}
            aria-labelledby={`dashboard-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box>
                    {children}
                </Box>
            )}
        </div>
    );
}

export default function DashboardPage() {
    const [value, setValue] = React.useState(0);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(true);
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleDrawerToggle = () => {
        if (isMobile) {
            setMobileOpen(!mobileOpen);
        } else {
            setIsDrawerOpen(!isDrawerOpen);
        }
    };

    const handleMenuItemClick = (index: number) => {
        if (menuItems[index].path) {
            router.push(menuItems[index].path);
            return;
        }
        setValue(index);
        if (isMobile) {
            setMobileOpen(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/auth/login');
    };

    const drawer = (
        <Box>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" noWrap component="div">
                    Menu
                </Typography>
                {!isMobile && (
                    <IconButton onClick={handleDrawerToggle}>
                        {isDrawerOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                )}
            </Toolbar>
            <List>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton
                            selected={value === item.index}
                            onClick={() => handleMenuItemClick(item.index)}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            {(isDrawerOpen || isMobile) && (
                                <ListItemText primary={item.text} />
                            )}
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar
                position="fixed"
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    bgcolor: 'background.paper',
                    color: 'text.primary',
                    width: { md: `calc(100% - ${isDrawerOpen ? drawerWidth : 64}px)` },
                    ml: { md: isDrawerOpen ? `${drawerWidth}px` : '64px' },
                    transition: theme.transitions.create(['width', 'margin-left'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        AYANA Wedding Admin
                    </Typography>
                    <Button
                        color="inherit"
                        onClick={handleLogout}
                        startIcon={<LogoutOutlined />}
                    >
                        Keluar
                    </Button>
                </Toolbar>
            </AppBar>

            <Box
                component="nav"
                sx={{
                    width: { md: isDrawerOpen ? drawerWidth : 64 },
                    flexShrink: { md: 0 },
                    transition: theme.transitions.create('width', {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                }}
            >
                {/* Mobile drawer */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                {/* Desktop drawer */}
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: isDrawerOpen ? drawerWidth : 64,
                            transition: theme.transitions.create('width', {
                                easing: theme.transitions.easing.sharp,
                                duration: theme.transitions.duration.leavingScreen,
                            }),
                            overflowX: 'hidden',
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { md: `calc(100% - ${isDrawerOpen ? drawerWidth : 64}px)` },
                    mt: '64px',
                    transition: theme.transitions.create(['width', 'margin-left'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                }}
            >
                <TabPanel value={value} index={0}>
                    <Dashboard />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <UserManagement />
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <VideoManagement />
                </TabPanel>
                <TabPanel value={value} index={3}>
                    <Analytics />
                </TabPanel>
            </Box>
        </Box>
    );
} 