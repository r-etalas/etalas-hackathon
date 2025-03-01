'use client';

import { Box, Container, Typography, Button, Card, CardContent, Stack } from '@mui/material';

export default function HomePage() {
    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom>
                    Selamat Datang di Etalas
                </Typography>

                <Card sx={{ mb: 4 }}>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            Tentang Kami
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Etalas adalah platform inovatif yang menghubungkan penjual dan pembeli dalam satu ekosistem digital yang seamless.
                        </Typography>
                    </CardContent>
                </Card>

                <Stack direction="row" spacing={2}>
                    <Button variant="contained" color="primary">
                        Mulai Sekarang
                    </Button>
                    <Button variant="outlined" color="secondary">
                        Pelajari Lebih Lanjut
                    </Button>
                </Stack>

                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        Fitur Utama
                    </Typography>
                    <Stack spacing={2}>
                        {['Manajemen Inventori', 'Analisis Penjualan', 'Integrasi Payment Gateway'].map((feature) => (
                            <Card key={feature} sx={{ p: 2 }}>
                                <Typography variant="h6">{feature}</Typography>
                            </Card>
                        ))}
                    </Stack>
                </Box>
            </Box>
        </Container>
    );
} 