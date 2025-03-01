'use client';

import { useEffect, useState } from 'react';
import { PlayArrow } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation();
    const router = useRouter();
    const [videos, setVideos] = useState<WeddingVideo[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLocation, setSelectedLocation] = useState<string>('');
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [selectedMonth, setSelectedMonth] = useState<string>('');
    const [session, setSession] = useState<Session | null>(null);
    const [selectedVideo, setSelectedVideo] = useState<WeddingVideo | null>(null);
    const [openDialog, setOpenDialog] = useState(false);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        const getSession = async () => {
            const { data: { session: currentSession } } = await supabase.auth.getSession();
            setSession(currentSession);

            if (!currentSession) {
                router.push('/auth/login');
            }
        };

        getSession();

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

    const filteredVideos = videos.filter((video) => {
        const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (video.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
        const matchesLocation = !selectedLocation || video.description?.toLowerCase().includes(selectedLocation.toLowerCase());
        const matchesSize = !selectedSize || video.description?.toLowerCase().includes(selectedSize.toLowerCase());
        const matchesMonth = !selectedMonth || new Date(video.created_at).toLocaleString('default', { month: 'long' }) === selectedMonth;

        return matchesSearch && matchesLocation && matchesSize && matchesMonth;
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
                <LanguageSwitcher />
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
                            <MenuItem value="">All Locations</MenuItem>
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
                            <MenuItem value="">All Sizes</MenuItem>
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
                            <MenuItem value="">All Months</MenuItem>
                            {Array.from({ length: 12 }, (_, i) => {
                                const month = new Date(0, i).toLocaleString('default', { month: 'long' });
                                return (
                                    <MenuItem key={month} value={month}>
                                        {month}
                                    </MenuItem>
                                );
                            })}
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