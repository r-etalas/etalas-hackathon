import React, { useEffect, useState, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    useTheme,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
    Stack,
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

// Inisialisasi Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const locationData = [
    { location: 'Bali', views: 450 },
    { location: 'Komodo', views: 280 },
    { location: 'Jakarta', views: 320 },
];

interface LoginDataPoint {
    date: string;
    logins: number;
}

interface UserOption {
    id: string;
    name: string;
    email: string;
}

interface VideoPlayStats {
    video_title: string;
    total_plays: number;
    total_duration: number;
    completion_rate: number;
}

interface EngagementDataPoint {
    date: string;
    views: number;
    watchTime: number;
}

interface VideoPlay {
    video_id: string;
    play_duration: number;
    completed: boolean;
    wedding_video: {
        id: string;
        title: string;
    };
}

const Analytics: React.FC = () => {
    const theme = useTheme();
    const [loginData, setLoginData] = useState<LoginDataPoint[]>([]);
    const [selectedUser, setSelectedUser] = useState<string>('');
    const [selectedVideo, setSelectedVideo] = useState<string>('');
    const [users, setUsers] = useState<UserOption[]>([]);
    const [videoPlayData, setVideoPlayData] = useState<VideoPlayStats[]>([]);
    const [availableVideos, setAvailableVideos] = useState<Array<{ id: string; title: string }>>([]);
    const [engagementData, setEngagementData] = useState<EngagementDataPoint[]>([]);

    const fetchUsers = useCallback(async () => {
        try {
            const { data: usersList } = await supabase
                .from('users')
                .select('id, name, email')
                .order('name');

            setUsers(usersList || []);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }, []);

    const fetchLoginData = useCallback(async (userId?: string) => {
        try {
            const lastWeekDate = getLastWeekDate();
            console.log('Mengambil data login dari:', lastWeekDate);

            let query = supabase
                .from('auth_activity')
                .select('*')
                .gte('created_at', lastWeekDate)
                .order('created_at', { ascending: true });

            if (userId || selectedUser) {
                query = query.eq('user_id', userId || selectedUser);
            }

            const { data: loginHistory, error } = await query;

            if (error) {
                console.error('Error mengambil data login:', error);
                throw error;
            }

            console.log('Data login yang ditemukan:', loginHistory);

            if (!loginHistory || loginHistory.length === 0) {
                console.log('Tidak ada data login, menampilkan data kosong');
                setLoginData(generateEmptyData());
                return;
            }

            const processedData = processLoginHistoryData(loginHistory);
            setLoginData(processedData);

        } catch (error) {
            console.error('Error di fetchLoginData:', error);
            setLoginData(generateEmptyData());
        }
    }, [selectedUser]);

    const processLoginHistoryData = (loginHistory: { created_at: string }[]): LoginDataPoint[] => {
        // Buat map untuk menghitung login per hari
        const loginCountMap = new Map<string, number>();

        // Inisialisasi data 7 hari terakhir dengan nilai 0
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setHours(0, 0, 0, 0); // Reset waktu ke awal hari
            date.setDate(date.getDate() - (6 - i)); // Mulai dari 6 hari yang lalu
            return date.toISOString().split('T')[0];
        });

        // Set nilai awal 0 untuk semua tanggal
        last7Days.forEach(date => {
            loginCountMap.set(date, 0);
        });

        // Hitung jumlah login per hari
        loginHistory.forEach(login => {
            // Konversi ke timezone lokal dan ambil tanggal saja
            const loginDate = new Date(login.created_at);
            const dateStr = loginDate.toISOString().split('T')[0];

            // Hanya hitung jika tanggal ada dalam range 7 hari terakhir
            if (loginCountMap.has(dateStr)) {
                loginCountMap.set(dateStr, (loginCountMap.get(dateStr) || 0) + 1);
            }
        });

        console.log('Login count map:', Object.fromEntries(loginCountMap));

        // Konversi ke format yang dibutuhkan grafik
        const result = last7Days.map(date => ({
            date,
            logins: loginCountMap.get(date) || 0
        }));

        console.log('Final processed data:', result);
        return result;
    };

    const getLastWeekDate = () => {
        const date = new Date();
        date.setDate(date.getDate() - 7); // Ambil data 7 hari ke belakang dari hari ini
        const result = date.toISOString();
        console.log('Tanggal 7 hari yang lalu:', {
            date: result,
            originalDate: date.toString()
        });
        return result;
    };

    // Fungsi untuk menghasilkan data kosong (bukan dummy)
    const generateEmptyData = (): LoginDataPoint[] => {
        return Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            return {
                date: date.toISOString().split('T')[0],
                logins: 0
            };
        });
    };

    const fetchAvailableVideos = useCallback(async () => {
        try {
            const { data: videos, error } = await supabase
                .from('wedding_video')
                .select('id, title')
                .order('title');

            if (error) throw error;
            setAvailableVideos(videos || []);
        } catch (error) {
            console.error('Error fetching available videos:', error);
        }
    }, []);

    const fetchVideoPlayData = useCallback(async (userId?: string) => {
        try {
            console.log('Mengambil data pemutaran video');

            let query = supabase
                .from('video_plays')
                .select(`
                    video_id,
                    play_duration,
                    completed,
                    wedding_video (
                        id,
                        title
                    )
                `)
                .order('played_at', { ascending: false });

            if (userId || selectedUser) {
                query = query.eq('user_id', userId || selectedUser);
            }

            if (selectedVideo) {
                query = query.eq('video_id', selectedVideo);
            }

            const { data: playData, error } = await query;

            if (error) {
                throw error;
            }

            console.log('Data pemutaran yang ditemukan:', playData);

            if (!playData || playData.length === 0) {
                console.log('Tidak ada data pemutaran, menampilkan data kosong');
                setVideoPlayData([]);
                return;
            }

            // Proses data untuk mendapatkan statistik per video
            const videoStats = new Map<string, {
                title: string;
                plays: number;
                duration: number;
                completions: number;
            }>();

            (playData as unknown as VideoPlay[])?.forEach(play => {
                if (!play.wedding_video) return;
                const videoTitle = play.wedding_video.title || 'Unknown';
                const current = videoStats.get(videoTitle) || {
                    title: videoTitle,
                    plays: 0,
                    duration: 0,
                    completions: 0
                };

                current.plays += 1;
                current.duration += play.play_duration || 0;
                if (play.completed) current.completions += 1;

                videoStats.set(videoTitle, current);
            });

            const processedData: VideoPlayStats[] = Array.from(videoStats.values()).map(stat => ({
                video_title: stat.title,
                total_plays: stat.plays,
                total_duration: stat.duration,
                completion_rate: stat.plays > 0 ? (stat.completions / stat.plays) * 100 : 0
            }));

            console.log('Data pemutaran yang telah diproses:', processedData);
            setVideoPlayData(processedData);

        } catch (error) {
            console.error('Error di fetchVideoPlayData:', error);
            setVideoPlayData([]);
        }
    }, [selectedUser, selectedVideo]);

    const fetchEngagementData = useCallback(async () => {
        try {
            const lastWeekDate = getLastWeekDate();
            console.log('Mengambil data engagement dari:', lastWeekDate);

            // Buat query dasar
            let query = supabase
                .from('video_plays')
                .select('*, wedding_video!inner(*)')
                .gte('played_at', lastWeekDate);

            // Terapkan filter
            if (selectedUser && selectedUser !== '') {
                query = query.eq('user_id', selectedUser);
            }
            if (selectedVideo && selectedVideo !== '') {
                query = query.eq('video_id', selectedVideo);
            }

            // Jalankan query
            const { data, error } = await query;

            if (error) {
                throw error;
            }

            console.log('Data mentah:', data);

            // Proses data
            const groupedData = new Map<string, { views: number; watchTime: number }>();

            // Inisialisasi 7 hari terakhir
            for (let i = 6; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                const dateStr = date.toISOString().split('T')[0];
                groupedData.set(dateStr, { views: 0, watchTime: 0 });
            }

            // Hitung views dan watch time per hari
            data?.forEach(play => {
                const dateStr = new Date(play.played_at).toISOString().split('T')[0];
                if (groupedData.has(dateStr)) {
                    const current = groupedData.get(dateStr)!;
                    current.views += 1;
                    current.watchTime += play.play_duration || 0;
                }
            });

            // Format data untuk grafik
            const processedData = Array.from(groupedData.entries())
                .sort((a, b) => a[0].localeCompare(b[0]))
                .map(([date, stats]) => ({
                    date,
                    views: stats.views,
                    watchTime: Math.round(stats.watchTime / 60)
                }));

            console.log('Data yang diproses:', processedData);
            setEngagementData(processedData);

        } catch (error) {
            console.error('Error:', error);
            setEngagementData(generateEmptyEngagementData());
        }
    }, [selectedUser, selectedVideo]);

    // Fungsi helper untuk menghasilkan data engagement kosong
    const generateEmptyEngagementData = (): EngagementDataPoint[] => {
        return Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            return {
                date: date.toISOString().split('T')[0],
                views: 0,
                watchTime: 0
            };
        });
    };

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

    const handleUserChange = async (event: SelectChangeEvent<string>) => {
        const newSelectedUser = event.target.value;
        setSelectedUser(newSelectedUser);
        // Panggil semua fungsi fetch secara berurutan
        await Promise.all([
            fetchLoginData(newSelectedUser),
            fetchVideoPlayData(newSelectedUser),
            fetchEngagementData()
        ]);
    };

    const handleVideoChange = async (event: SelectChangeEvent<string>) => {
        const newSelectedVideo = event.target.value;
        setSelectedVideo(newSelectedVideo);
        // Panggil fungsi fetch yang relevan
        await Promise.all([
            fetchVideoPlayData(selectedUser),
            fetchEngagementData()
        ]);
    };

    useEffect(() => {
        fetchUsers();
        fetchLoginData();
        fetchAvailableVideos();
        fetchVideoPlayData();
        fetchEngagementData();

        // Set interval untuk memperbarui data setiap 5 menit
        const interval = setInterval(() => {
            fetchLoginData();
            fetchVideoPlayData();
            fetchEngagementData();
        }, 5 * 60 * 1000);

        return () => {
            clearInterval(interval);
        };
    }, [fetchLoginData, fetchVideoPlayData, fetchEngagementData, fetchUsers, fetchAvailableVideos]);

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5">
                    Analytics Dashboard
                </Typography>

                {/* Filters */}
                <Stack direction="row" spacing={2}>
                    <FormControl size="small" sx={{ minWidth: 200 }}>
                        <InputLabel>Filter by User</InputLabel>
                        <Select
                            value={selectedUser}
                            onChange={handleUserChange}
                            label="Filter by User"
                            sx={{ bgcolor: 'background.paper' }}
                        >
                            <MenuItem value="">Semua Pengguna</MenuItem>
                            {users.map((user) => (
                                <MenuItem key={user.id} value={user.id}>
                                    {user.name || user.email}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 200 }}>
                        <InputLabel>Filter by Video</InputLabel>
                        <Select
                            value={selectedVideo}
                            onChange={handleVideoChange}
                            label="Filter by Video"
                            sx={{ bgcolor: 'background.paper' }}
                        >
                            <MenuItem value="">Semua Video</MenuItem>
                            {availableVideos.map((video) => (
                                <MenuItem key={video.id} value={video.id}>
                                    {video.title}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Stack>
            </Box>

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
                            <LineChart data={engagementData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis
                                    yAxisId="left"
                                    label={{
                                        value: 'Jumlah Views',
                                        angle: -90,
                                        position: 'insideLeft'
                                    }}
                                />
                                <YAxis
                                    yAxisId="right"
                                    orientation="right"
                                    label={{
                                        value: 'Watch Time (menit)',
                                        angle: 90,
                                        position: 'insideRight'
                                    }}
                                />
                                <Tooltip />
                                <Legend />
                                <Line
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="views"
                                    stroke={theme.palette.primary.main}
                                    name="Total Views"
                                    activeDot={{ r: 8 }}
                                />
                                <Line
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey="watchTime"
                                    stroke={theme.palette.secondary.main}
                                    name="Watch Time (menit)"
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

            {/* Grafik Video Plays per User */}
            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Pemutaran Video per Pengguna
                    </Typography>
                    <Box sx={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={videoPlayData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="video_title" />
                                <YAxis yAxisId="left" label={{ value: 'Total Pemutaran', angle: -90, position: 'insideLeft' }} />
                                <YAxis yAxisId="right" orientation="right" label={{ value: 'Tingkat Penyelesaian (%)', angle: 90, position: 'insideRight' }} />
                                <Tooltip />
                                <Legend />
                                <Bar yAxisId="left" dataKey="total_plays" fill={theme.palette.primary.main} name="Total Pemutaran" />
                                <Bar yAxisId="right" dataKey="completion_rate" fill={theme.palette.secondary.main} name="Tingkat Penyelesaian" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Analytics; 