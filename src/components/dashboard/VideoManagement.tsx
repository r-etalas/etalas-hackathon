'use client'

import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    IconButton,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Stack,
    Alert,
    CircularProgress,
    LinearProgress,
    Card,
    CardMedia,
} from '@mui/material';
import {
    Delete as DeleteIcon,
    Edit as EditIcon,
    Add as AddIcon,
    CloudUpload as CloudUploadIcon,
    PlayArrow as PlayArrowIcon,
} from '@mui/icons-material';
import { createBrowserClient } from '@supabase/ssr';

interface WeddingVideo {
    id: string;
    title: string;
    description: string | null;
    video_path: string;
    video_filename: string;
    video_size: number;
    video_type: string;
    thumbnail_url: string | null;
    duration: number | null;
    created_at: string;
    updated_at: string;
    user_id: string;
}

interface VideoFormData {
    title: string;
    description: string;
    video_file: File | null;
    thumbnail_url: string;
    duration: string;
}

interface VideoDataType {
    title: string;
    description: string | null;
    video_path?: string;
    video_filename?: string;
    video_size?: number;
    video_type?: string;
    video_url?: string;
    thumbnail_url?: string | null;
    duration: number | null;
    user_id: string;
}

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

const resetFormData = (): VideoFormData => ({
    title: '',
    description: '',
    video_file: null,
    thumbnail_url: '',
    duration: '',
});

export default function VideoManagement() {
    const [videos, setVideos] = useState<WeddingVideo[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [previewDialog, setPreviewDialog] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<WeddingVideo | null>(null);
    const [formData, setFormData] = useState<VideoFormData>({
        title: '',
        description: '',
        video_file: null,
        thumbnail_url: '',
        duration: '',
    });
    const [editingId, setEditingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const fetchVideos = async () => {
        const { data, error } = await supabase
            .from('wedding_video')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            setError('Gagal mengambil data video');
            return;
        }

        setVideos(data || []);
    };

    useEffect(() => {
        fetchVideos();
    }, []);

    const handleOpenDialog = (video?: WeddingVideo) => {
        if (video) {
            setFormData({
                title: video.title,
                description: video.description || '',
                video_file: null,
                thumbnail_url: video.thumbnail_url || '',
                duration: video.duration?.toString() || '',
            });
            setEditingId(video.id);
        } else {
            setFormData({
                title: '',
                description: '',
                video_file: null,
                thumbnail_url: '',
                duration: '',
            });
            setEditingId(null);
        }
        setOpenDialog(true);
    };

    const handleOpenPreview = (video: WeddingVideo) => {
        setSelectedVideo(video);
        setPreviewDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setError(null);
        setSuccess(null);
        setUploadProgress(0);
        setFormData(resetFormData());
        setEditingId(null);
    };

    const handleClosePreview = () => {
        setPreviewDialog(false);
        setSelectedVideo(null);
    };

    const validateVideoFile = (file: File): string | null => {
        if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
            return 'Format file tidak didukung. Gunakan MP4, WebM, atau QuickTime.';
        }
        if (file.size > MAX_FILE_SIZE) {
            return 'Ukuran file terlalu besar. Maksimal 500MB.';
        }
        return null;
    };

    const generateThumbnail = async (file: File): Promise<string> => {
        // Check session first
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            throw new Error('Anda harus login terlebih dahulu');
        }

        return new Promise((resolve, reject) => {
            const video = document.createElement('video');
            const canvas = document.createElement('canvas');
            const url = URL.createObjectURL(file);

            video.src = url;
            video.crossOrigin = 'anonymous';

            video.onerror = (e) => {
                URL.revokeObjectURL(url);
                reject(new Error(`Gagal memuat video: ${e}`));
            };

            video.onloadedmetadata = () => {
                try {
                    canvas.width = 320;  // thumbnail width
                    canvas.height = Math.floor(video.videoHeight * (320 / video.videoWidth));
                    video.width = canvas.width;
                    video.height = canvas.height;
                } catch (error) {
                    URL.revokeObjectURL(url);
                    reject(new Error(`Error saat mengatur dimensi: ${error}`));
                }
            };

            video.onloadeddata = () => {
                try {
                    video.currentTime = 1;
                } catch (error) {
                    URL.revokeObjectURL(url);
                    reject(new Error(`Error saat mengatur currentTime: ${error}`));
                }
            };

            video.onseeked = async () => {
                try {
                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        throw new Error('Gagal membuat context canvas');
                    }
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                    const blob = await new Promise<Blob>((resolve, reject) => {
                        canvas.toBlob((b) => {
                            if (b) resolve(b);
                            else reject(new Error('Gagal mengkonversi canvas ke blob'));
                        }, 'image/jpeg', 0.7);
                    });

                    const fileName = `thumbnail_${Date.now()}_${session.user.id}.jpg`;
                    const { data: uploadData, error: uploadError } = await supabase.storage
                        .from('videos')
                        .upload(`thumbnails/${fileName}`, blob, {
                            contentType: 'image/jpeg',
                            cacheControl: '3600',
                            upsert: true // mengizinkan overwrite jika file sudah ada
                        });

                    if (uploadError) {
                        if (uploadError.message.includes('row-level security')) {
                            throw new Error('Tidak memiliki izin untuk mengupload thumbnail. Silakan cek kembali login Anda.');
                        }
                        throw new Error(`Gagal mengupload thumbnail: ${uploadError.message}`);
                    }

                    const { data: { publicUrl } } = supabase.storage
                        .from('videos')
                        .getPublicUrl(`thumbnails/${fileName}`);

                    URL.revokeObjectURL(url);
                    resolve(publicUrl);
                } catch (error) {
                    URL.revokeObjectURL(url);
                    reject(error);
                }
            };
        });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const error = validateVideoFile(file);
            if (error) {
                setError(error);
                return;
            }
            setFormData({ ...formData, video_file: file });
            setError(null);

            try {
                setUploading(true);
                const thumbnailUrl = await generateThumbnail(file);
                setFormData(prev => ({ ...prev, thumbnail_url: thumbnailUrl }));
            } catch (error) {
                console.error('Error generating thumbnail:', error);
                setError('Gagal membuat thumbnail dari video');
            } finally {
                setUploading(false);
            }
        }
    };

    const uploadVideo = async (file: File) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `wedding-videos/${fileName}`;

        try {
            const { error: uploadError } = await supabase.storage
                .from('videos')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false,
                });

            if (uploadError) {
                console.error('Upload error:', uploadError);
                throw new Error('Gagal mengupload video');
            }

            const { data: { publicUrl } } = supabase.storage
                .from('videos')
                .getPublicUrl(filePath);

            return {
                path: filePath,
                filename: file.name,
                size: file.size,
                type: file.type,
                url: publicUrl
            };
        } catch (uploadError) {
            console.error('Upload error:', uploadError);
            throw new Error('Gagal mengupload video');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setUploading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                throw new Error('Anda harus login terlebih dahulu');
            }

            let videoInfo = null;
            if (formData.video_file) {
                videoInfo = await uploadVideo(formData.video_file);
            }

            if (!videoInfo && !editingId) {
                throw new Error('File video harus diupload');
            }

            const videoData: VideoDataType = {
                title: formData.title,
                description: formData.description || null,
                thumbnail_url: formData.thumbnail_url || null,
                duration: formData.duration ? parseInt(formData.duration) : null,
                user_id: user.id,
            };

            if (videoInfo) {
                videoData.video_path = videoInfo.path;
                videoData.video_filename = videoInfo.filename;
                videoData.video_size = videoInfo.size;
                videoData.video_type = videoInfo.type;
                videoData.video_url = videoInfo.url;
            }

            if (editingId) {
                const { data: existingVideo, error: checkError } = await supabase
                    .from('wedding_video')
                    .select('user_id, video_url, video_path, video_filename, video_size, video_type')
                    .eq('id', editingId)
                    .single();

                if (checkError) {
                    throw new Error('Gagal memverifikasi kepemilikan video');
                }

                if (existingVideo.user_id !== user.id) {
                    throw new Error('Anda tidak memiliki izin untuk mengupdate video ini');
                }

                if (!videoInfo) {
                    videoData.video_url = existingVideo.video_url;
                    videoData.video_path = existingVideo.video_path;
                    videoData.video_filename = existingVideo.video_filename;
                    videoData.video_size = existingVideo.video_size;
                    videoData.video_type = existingVideo.video_type;
                }

                const { error: updateError } = await supabase
                    .from('wedding_video')
                    .update(videoData)
                    .eq('id', editingId)
                    .eq('user_id', user.id);

                if (updateError) {
                    console.error('Update error:', updateError);
                    throw new Error(`Gagal mengupdate video: ${updateError.message}`);
                }
                setSuccess('Video berhasil diupdate');
            } else {
                const { error: insertError } = await supabase
                    .from('wedding_video')
                    .insert([videoData]);

                if (insertError) {
                    console.error('Insert error:', insertError);
                    throw new Error(`Gagal menambahkan video: ${insertError.message}`);
                }
                setSuccess('Video berhasil ditambahkan');
            }

            await fetchVideos();
            setFormData(resetFormData());
            setEditingId(null);
            handleCloseDialog();
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Terjadi kesalahan yang tidak diketahui');
            }
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus video ini?')) {
            try {
                const { data: video, error: fetchError } = await supabase
                    .from('wedding_video')
                    .select('video_path')
                    .eq('id', id)
                    .single();

                if (fetchError) throw new Error('Gagal mengambil info video');

                if (video?.video_path) {
                    const { error: storageError } = await supabase.storage
                        .from('videos')
                        .remove([video.video_path]);

                    if (storageError) throw new Error('Gagal menghapus file video');
                }

                const { error: deleteError } = await supabase
                    .from('wedding_video')
                    .delete()
                    .eq('id', id);

                if (deleteError) throw new Error('Gagal menghapus data video');

                await fetchVideos();
                setSuccess('Video berhasil dihapus');
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError('Terjadi kesalahan yang tidak diketahui');
                }
            }
        }
    };

    const getVideoUrl = (path: string) => {
        const { data } = supabase.storage
            .from('videos')
            .getPublicUrl(path);
        return data.publicUrl;
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5" component="h2">
                    Manajemen Video Pernikahan
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                >
                    Tambah Video
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    {success}
                </Alert>
            )}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Judul</TableCell>
                            <TableCell>Deskripsi</TableCell>
                            <TableCell>Video</TableCell>
                            <TableCell>Thumbnail</TableCell>
                            <TableCell>Ukuran</TableCell>
                            <TableCell>Durasi (detik)</TableCell>
                            <TableCell>Aksi</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {videos.map((video) => (
                            <TableRow key={video.id}>
                                <TableCell>{video.title}</TableCell>
                                <TableCell>{video.description}</TableCell>
                                <TableCell>
                                    <Button
                                        startIcon={<PlayArrowIcon />}
                                        onClick={() => handleOpenPreview(video)}
                                    >
                                        {video.video_filename}
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    {video.thumbnail_url && (
                                        <img
                                            src={video.thumbnail_url}
                                            alt={video.title}
                                            style={{
                                                width: '50px',
                                                height: '50px',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    )}
                                </TableCell>
                                <TableCell>{formatFileSize(video.video_size)}</TableCell>
                                <TableCell>{video.duration}</TableCell>
                                <TableCell>
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleOpenDialog(video)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        onClick={() => handleDelete(video.id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Form Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingId ? 'Edit Video' : 'Tambah Video Baru'}
                </DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        <Stack spacing={2}>
                            <TextField
                                fullWidth
                                label="Judul"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                            <TextField
                                fullWidth
                                label="Deskripsi"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                multiline
                                rows={3}
                            />
                            <Box>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="video/*"
                                    style={{ display: 'none' }}
                                    onChange={handleFileChange}
                                />
                                <Button
                                    variant="outlined"
                                    startIcon={<CloudUploadIcon />}
                                    onClick={() => fileInputRef.current?.click()}
                                    fullWidth
                                >
                                    {formData.video_file
                                        ? formData.video_file.name
                                        : editingId
                                            ? 'Ganti Video (Opsional)'
                                            : 'Pilih Video'}
                                </Button>
                                {uploading && (
                                    <Box sx={{ mt: 1 }}>
                                        <LinearProgress variant="determinate" value={uploadProgress} />
                                        <Typography variant="body2" color="textSecondary" align="center">
                                            Mengupload: {Math.round(uploadProgress)}%
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                            <TextField
                                fullWidth
                                label="URL Thumbnail (Opsional)"
                                value={formData.thumbnail_url}
                                onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                                helperText="Masukkan URL gambar untuk thumbnail video"
                            />
                            <TextField
                                fullWidth
                                label="Durasi (detik)"
                                type="number"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                            />
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Batal</Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={uploading || (!editingId && !formData.video_file)}
                        >
                            {uploading ? (
                                <CircularProgress size={24} />
                            ) : editingId ? 'Update' : 'Simpan'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Preview Dialog */}
            <Dialog
                open={previewDialog}
                onClose={handleClosePreview}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    {selectedVideo?.title}
                </DialogTitle>
                <DialogContent>
                    {selectedVideo && (
                        <Box sx={{ width: '100%', mt: 2 }}>
                            <video
                                controls
                                style={{ width: '100%' }}
                                src={getVideoUrl(selectedVideo.video_path)}
                                poster={selectedVideo.thumbnail_url || undefined}
                            >
                                Browser Anda tidak mendukung pemutaran video.
                            </video>
                            <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                                Nama File: {selectedVideo.video_filename}<br />
                                Ukuran: {formatFileSize(selectedVideo.video_size)}<br />
                                Tipe: {selectedVideo.video_type}<br />
                                {selectedVideo.duration && `Durasi: ${selectedVideo.duration} detik`}
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClosePreview}>Tutup</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
} 