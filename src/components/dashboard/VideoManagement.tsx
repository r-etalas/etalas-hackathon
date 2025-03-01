import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    CardMedia,
    CardActions,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Chip,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
    Stack,
} from '@mui/material';
import {
    CloudUpload as CloudUploadIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Add as AddIcon,
} from '@mui/icons-material';

interface Video {
    id: string;
    title: string;
    thumbnail: string;
    location: string;
    venue: string;
    weddingSize: string;
    tags: string[];
    uploadDate: string;
    views: number;
}

const VideoManagement: React.FC = () => {
    const [videos, setVideos] = useState<Video[]>([
        {
            id: '1',
            title: 'Beautiful Wedding at AYANA Bali',
            thumbnail: '/thumbnail1.jpg',
            location: 'Bali',
            venue: 'SKY',
            weddingSize: 'Large',
            tags: ['beach', 'sunset', 'luxury'],
            uploadDate: '2024-03-01',
            views: 1250,
        },
        // Tambahkan data dummy lainnya di sini
    ]);

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
    const [newTag, setNewTag] = useState('');

    const locations = ['Bali', 'Komodo', 'Jakarta'];
    const venues = ['SKY', 'AYANA Villa', 'Ballroom'];
    const weddingSizes = ['Small', 'Medium', 'Large'];

    const handleAddVideo = () => {
        setSelectedVideo(null);
        setOpenDialog(true);
    };

    const handleEditVideo = (video: Video) => {
        setSelectedVideo(video);
        setOpenDialog(true);
    };

    const handleDeleteVideo = (videoId: string) => {
        setVideos(videos.filter(video => video.id !== videoId));
    };

    const handleAddTag = (videoId: string, tag: string) => {
        if (tag.trim()) {
            setVideos(videos.map(video => {
                if (video.id === videoId) {
                    return {
                        ...video,
                        tags: [...video.tags, tag.trim()]
                    };
                }
                return video;
            }));
            setNewTag('');
        }
    };

    const handleRemoveTag = (videoId: string, tagToRemove: string) => {
        setVideos(videos.map(video => {
            if (video.id === videoId) {
                return {
                    ...video,
                    tags: video.tags.filter(tag => tag !== tagToRemove)
                };
            }
            return video;
        }));
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5">Video Management</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddVideo}
                >
                    Upload New Video
                </Button>
            </Box>

            <Grid container spacing={3}>
                {videos.map((video) => (
                    <Grid item xs={12} sm={6} md={4} key={video.id}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="200"
                                image={video.thumbnail}
                                alt={video.title}
                            />
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {video.title}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Location: {video.location}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Venue: {video.venue}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Wedding Size: {video.weddingSize}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Views: {video.views}
                                </Typography>
                                <Box sx={{ mt: 2 }}>
                                    <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                                        {video.tags.map((tag, index) => (
                                            <Chip
                                                key={index}
                                                label={tag}
                                                onDelete={() => handleRemoveTag(video.id, tag)}
                                                size="small"
                                            />
                                        ))}
                                    </Stack>
                                </Box>
                            </CardContent>
                            <CardActions>
                                <IconButton onClick={() => handleEditVideo(video)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton onClick={() => handleDeleteVideo(video.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {selectedVideo ? 'Edit Video' : 'Upload New Video'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <TextField
                            label="Title"
                            defaultValue={selectedVideo?.title}
                            fullWidth
                        />

                        <FormControl fullWidth>
                            <InputLabel>Location</InputLabel>
                            <Select
                                defaultValue={selectedVideo?.location || ''}
                                label="Location"
                            >
                                {locations.map((location) => (
                                    <MenuItem key={location} value={location}>
                                        {location}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel>Venue</InputLabel>
                            <Select
                                defaultValue={selectedVideo?.venue || ''}
                                label="Venue"
                            >
                                {venues.map((venue) => (
                                    <MenuItem key={venue} value={venue}>
                                        {venue}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel>Wedding Size</InputLabel>
                            <Select
                                defaultValue={selectedVideo?.weddingSize || ''}
                                label="Wedding Size"
                            >
                                {weddingSizes.map((size) => (
                                    <MenuItem key={size} value={size}>
                                        {size}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {!selectedVideo && (
                            <Button
                                variant="outlined"
                                component="label"
                                startIcon={<CloudUploadIcon />}
                                fullWidth
                            >
                                Upload Video File
                                <input type="file" hidden accept="video/*" />
                            </Button>
                        )}

                        <Box>
                            <Typography variant="subtitle2" gutterBottom>
                                Tags
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <TextField
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    placeholder="Add a tag"
                                    size="small"
                                    fullWidth
                                />
                                <Button
                                    variant="contained"
                                    onClick={() => selectedVideo && handleAddTag(selectedVideo.id, newTag)}
                                >
                                    Add
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button variant="contained">Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default VideoManagement; 