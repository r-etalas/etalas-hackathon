'use client';

import { useEffect, useState } from 'react';
import { PlayArrow } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { createBrowserClient } from '@supabase/ssr';
import { Session } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import {
    Typography,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Card,
    CardContent,
    CardMedia,
    Grid,
    Stack,
    Box,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    SelectChangeEvent,
} from '@mui/material';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import '@/lib/i18n';

interface WeddingVideo {
    id: string;
    title: string;
    description: string | null;
    video_path: string;
    video_filename: string;
    video_size: number;
    video_type: string;
    video_url: string;
    thumbnail_url: string | null;
    duration: number | null;
    created_at: string;
    updated_at: string;
    user_id: string;
}

const ShowcasePage = () => {
    const { t, i18n } = useTranslation();
    const router = useRouter();
    const [videos, setVideos] = useState<WeddingVideo[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLocation, setSelectedLocation] = useState<string>('');
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [selectedMonth, setSelectedMonth] = useState<string>('');
    const [selectedDuration, setSelectedDuration] = useState<string>('');
    const [session, setSession] = useState<Session | null>(null);
    const [selectedVideo, setSelectedVideo] = useState<WeddingVideo | null>(null);
    const [openDialog, setOpenDialog] = useState(false);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/auth/login');
    };

    useEffect(() => {
        const getUser = async () => {
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            setSession(currentUser);

            if (!currentUser) {
                router.push('/auth/login');
            }
        };

        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (!session) {
                router.push('/auth/login');
            }
        });

        return () => subscription.unsubscribe();
    }, [supabase.auth, router]);

    useEffect(() => {
        const fetchVideos = async () => {
            const { data, error } = await supabase
                .from('wedding_video')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching videos:', error);
                return;
            }

            setVideos(data || []);
        };

        fetchVideos();
    }, [supabase]);

    useEffect(() => {
        // Force a re-render when language changes
        const handleLanguageChange = () => {
            console.log('Current language:', i18n.language);
            console.log('Translation test:', {
                duration: t('showcase.filters.duration'),
                all: t('showcase.filters.durations.all'),
                short: t('showcase.filters.durations.short'),
                medium: t('showcase.filters.durations.medium'),
                long: t('showcase.filters.durations.long')
            });
            setSearchTerm(searchTerm);
        };

        i18n.on('languageChanged', handleLanguageChange);
        // Log on initial mount
        handleLanguageChange();

        return () => {
            i18n.off('languageChanged', handleLanguageChange);
        };
    }, [i18n, searchTerm, t]);

    const handleVideoClick = (video: WeddingVideo) => {
        setSelectedVideo(video);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedVideo(null);
    };

    const handleLocationChange = (event: SelectChangeEvent) => {
        setSelectedLocation(event.target.value);
    };

    const handleSizeChange = (event: SelectChangeEvent) => {
        setSelectedSize(event.target.value);
    };

    const handleMonthChange = (event: SelectChangeEvent) => {
        setSelectedMonth(event.target.value);
    };

    const handleDurationChange = (event: SelectChangeEvent) => {
        setSelectedDuration(event.target.value);
    };

    const getDurationInMinutes = (seconds: number | null): number => {
        if (!seconds) return 0;
        return Math.floor(seconds / 60);
    };

    const filteredVideos = videos.filter((video) => {
        const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (video.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
        const matchesLocation = !selectedLocation || video.description?.toLowerCase().includes(selectedLocation.toLowerCase());
        const matchesSize = !selectedSize || video.description?.toLowerCase().includes(selectedSize.toLowerCase());

        const videoMonth = new Date(video.created_at).toLocaleString(i18next.language, { month: 'long' });
        const matchesMonth = !selectedMonth || videoMonth === selectedMonth;

        const durationInMinutes = getDurationInMinutes(video.duration);
        const matchesDuration = !selectedDuration || (
            (selectedDuration === '0-5' && durationInMinutes >= 0 && durationInMinutes <= 5) ||
            (selectedDuration === '5-10' && durationInMinutes > 5 && durationInMinutes <= 10) ||
            (selectedDuration === '10+' && durationInMinutes > 10)
        );

        return matchesSearch && matchesLocation && matchesSize && matchesMonth && matchesDuration;
    });

    const formatDuration = (seconds: number | null) => {
        if (!seconds) return '0:00';
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <Box sx={{ p: 3, bgcolor: 'background.default', minHeight: '100vh' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    {t('showcase.title')}
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                    <LanguageSwitcher />
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleLogout}
                        size="small"
                    >
                        Logout
                    </Button>
                </Stack>
            </Box>

            <Stack spacing={3}>
                <Stack direction="row" spacing={2}>
                    <TextField
                        placeholder={t('showcase.filters.searchPlaceholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ width: 200 }}
                        size="small"
                    />

                    <FormControl sx={{ width: 200 }} size="small">
                        <InputLabel>
                            {t('showcase.filters.location')}
                        </InputLabel>
                        <Select
                            value={selectedLocation}
                            onChange={handleLocationChange}
                            label={t('showcase.filters.location')}
                        >
                            <MenuItem value="">{t('showcase.filters.allLocations')}</MenuItem>
                            <MenuItem value="Bali">Bali</MenuItem>
                            <MenuItem value="Jakarta">Jakarta</MenuItem>
                            <MenuItem value="Komodo">Komodo</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl sx={{ width: 200 }} size="small">
                        <InputLabel>
                            {t('showcase.filters.weddingSize')}
                        </InputLabel>
                        <Select
                            value={selectedSize}
                            onChange={handleSizeChange}
                            label={t('showcase.filters.weddingSize')}
                        >
                            <MenuItem value="">{t('showcase.filters.allSizes')}</MenuItem>
                            <MenuItem value="10-50">{t('showcase.filters.sizes.small')}</MenuItem>
                            <MenuItem value="50-100">{t('showcase.filters.sizes.medium')}</MenuItem>
                            <MenuItem value="100+">{t('showcase.filters.sizes.large')}</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl sx={{ width: 200 }} size="small">
                        <InputLabel>
                            {t('showcase.filters.month')}
                        </InputLabel>
                        <Select
                            value={selectedMonth}
                            onChange={handleMonthChange}
                            label={t('showcase.filters.month')}
                        >
                            <MenuItem value="">{t('showcase.filters.allMonths')}</MenuItem>
                            {Array.from({ length: 12 }, (_, i) => {
                                const month = new Date(0, i).toLocaleString(i18next.language, { month: 'long' });
                                return (
                                    <MenuItem key={month} value={month}>
                                        {month}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>

                    <FormControl sx={{ width: 200 }} size="small">
                        <InputLabel>
                            {t('showcase.filters.duration')}
                        </InputLabel>
                        <Select
                            value={selectedDuration}
                            onChange={handleDurationChange}
                            label={t('showcase.filters.duration')}
                        >
                            <MenuItem value="">
                                {t('showcase.filters.durations.all', 'All Durations')}
                            </MenuItem>
                            <MenuItem value="0-5">
                                {t('showcase.filters.durations.short', '0-5 minutes')}
                            </MenuItem>
                            <MenuItem value="5-10">
                                {t('showcase.filters.durations.medium', '5-10 minutes')}
                            </MenuItem>
                            <MenuItem value="10+">
                                {t('showcase.filters.durations.long', 'More than 10 minutes')}
                            </MenuItem>
                        </Select>
                    </FormControl>
                </Stack>

                <Grid container spacing={2}>
                    {filteredVideos.map((video) => (
                        <Grid item key={video.id} xs={12} sm={6} md={4}>
                            <Card
                                sx={{
                                    height: '100%',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s',
                                    '&:hover': {
                                        transform: 'scale(1.02)',
                                    },
                                }}
                                onClick={() => handleVideoClick(video)}
                            >
                                <Box sx={{ position: 'relative' }}>
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={video.thumbnail_url || '/placeholder-image.jpg'}
                                        alt={video.title}
                                        sx={{ objectFit: 'cover' }}
                                    />
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 10,
                                            right: 10,
                                            bgcolor: 'rgba(0, 0, 0, 0.6)',
                                            color: 'white',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '0.875rem',
                                        }}
                                    >
                                        {formatDuration(video.duration)}
                                    </Box>
                                    <IconButton
                                        sx={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            bgcolor: 'rgba(0, 0, 0, 0.6)',
                                            color: 'white',
                                            '&:hover': {
                                                bgcolor: 'rgba(0, 0, 0, 0.8)',
                                            },
                                        }}
                                    >
                                        <PlayArrow />
                                    </IconButton>
                                </Box>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {video.title}
                                    </Typography>
                                    {video.description && (
                                        <Typography variant="body2" color="text.secondary" noWrap>
                                            {video.description}
                                        </Typography>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Stack>

            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="md"
                fullWidth
            >
                {selectedVideo && (
                    <>
                        <DialogTitle>{selectedVideo.title}</DialogTitle>
                        <DialogContent>
                            <video
                                controls
                                controlsList="nodownload"
                                onContextMenu={(e) => e.preventDefault()}
                                style={{ width: '100%', marginTop: '16px' }}
                                src={selectedVideo.video_url}
                                poster={selectedVideo.thumbnail_url || undefined}
                            >
                                Your browser does not support the video tag.
                            </video>
                            {selectedVideo.description && (
                                <Typography sx={{ mt: 2 }}>
                                    {selectedVideo.description}
                                </Typography>
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDialog}>Close</Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Box>
    );
};

export default ShowcasePage; 