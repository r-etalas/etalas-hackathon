# Dokumentasi Etalas Hackathon

## Daftar Isi

1. [Pendahuluan](#pendahuluan)
2. [Teknologi yang Digunakan](#teknologi-yang-digunakan)
3. [Arsitektur Aplikasi](#arsitektur-aplikasi)
4. [Fitur-fitur Utama](#fitur-fitur-utama)
5. [Panduan Instalasi](#panduan-instalasi)
6. [Deployment](#deployment)

## Pendahuluan

Etalas Hackathon adalah aplikasi web yang dikembangkan sebagai bagian dari hackathon. Aplikasi ini menyediakan platform modern dengan berbagai fitur yang dibangun menggunakan teknologi terkini.

**[>> Klik di sini untuk melihat cursor prompt yg di gunakan untuk membuat feature pada project ini pada Specstory <<](https://share.specstory.com/stories/ab67796e-d485-47bf-94ae-6c8ee0f895d3)**

## Teknologi yang Digunakan

- **Next.js**: Framework React untuk pengembangan web modern
- **TypeScript**: Bahasa pemrograman yang memberikan type safety
- **Material-UI (MUI)**: Library komponen UI untuk React
- **Supabase**: Backend-as-a-Service dengan PostgreSQL
- **Vercel**: Platform deployment

## Arsitektur Aplikasi

Aplikasi menggunakan arsitektur berbasis komponen dengan struktur direktori berikut:

    src/
    |-- app/              # Routing dan halaman aplikasi
    |-- components/       # Komponen yang dapat digunakan kembali
    |-- lib/             # Utilitas dan helper functions
    |-- db/              # Konfigurasi database
    |-- types/           # TypeScript type definitions
    |-- middleware.ts    # Middleware aplikasi

## Fitur-fitur Utama

### 1. Sistem Autentikasi

- Register
- Login
- Manajemen sesi pengguna
- Middleware keamanan

### 2. Dashboard

- Interface pengguna yang responsif
- Manajemen data
- Visualisasi informasi

### 3. Showcase

- Tampilan produk/layanan
- Interaksi pengguna
- Fitur pencarian dan filter

### 4. API Integration

- REST API endpoints
- Integrasi dengan Supabase
- Manajemen state

## Panduan Instalasi

### Prasyarat

- Node.js (versi terbaru)
- npm atau yarn
- Git

### Langkah-langkah Instalasi

1. Clone repositori:

   ```bash
   git clone https://github.com/r-etalas/etalas-hackathon.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Konfigurasi environment variables:

   - Buat file `.env.local`
   - Isi dengan kredensial yang diperlukan

4. Jalankan aplikasi:
   ```bash
   npm run dev
   ```

## Deployment

Aplikasi di-deploy menggunakan Vercel dengan langkah-langkah:

1. Push kode ke repository GitHub
2. Hubungkan repository dengan Vercel
3. Konfigurasi environment variables
4. Deploy otomatis setiap ada perubahan di branch main

## Pemeliharaan

- Regular updates dan patches
- Monitoring performa
- Backup database
- Penanganan error

## Kontak

Untuk informasi lebih lanjut, hubungi tim pengembang:

- Rifqy

## Lisensi

Proyek ini dilisensikan di bawah MIT License.
