## SpecStory

## Redirect Logic for HomePage to Login (3/2/2025, 2:05:26 PM)

_**User**_

add logic in HomePage to redirect into auth/login  if anyone visit this page 

---

_**Assistant**_

Saya akan membantu Anda menambahkan logika redirect ke halaman login jika ada yang mengunjungi HomePage. Pertama, mari kita periksa implementasi yang ada.

Saya akan menambahkan logika redirect menggunakan Next.js router dan menambahkan pengecekan status autentikasi. Untuk ini, kita perlu:
1. Mengimpor hooks yang diperlukan dari next/navigation
2. Menambahkan logika redirect di dalam komponen

Mari saya edit file tersebut:

---

_****_

```diff
  
  import { Box, Container, Typography, Button, Card, CardContent, Stack } from '@mui/material';
+ import { useRouter } from 'next/navigation';
+ import { useEffect } from 'react';
  
  export default function HomePage() {
+     const router = useRouter();
+ 
+     useEffect(() => {
+         // Disini Anda bisa menambahkan logika pengecekan autentikasi yang lebih kompleks
+         const isAuthenticated = false; // Ganti dengan logika autentikasi yang sebenarnya
+         
+         if (!isAuthenticated) {
+             router.push('/auth/login');
+         }
+     }, [router]);
+ 
      return (
          <Container maxWidth="lg">
```

---

_****_



Saya telah menambahkan logika redirect dengan beberapa perubahan penting:

1. Mengimpor `useRouter` dari 'next/navigation' untuk menangani navigasi
2. Mengimpor `useEffect` dari 'react' untuk menjalankan efek samping
3. Menambahkan logika pengecekan autentikasi dan redirect dalam `useEffect`

Beberapa catatan penting:
1. Saat ini, `isAuthenticated` di-set ke `false` sebagai contoh. Anda perlu menggantinya dengan logika autentikasi yang sebenarnya, misalnya:
   - Mengecek token di localStorage
   - Mengecek status autentikasi dari context
   - Mengecek session dari backend

2. Redirect akan terjadi secara otomatis ke '/auth/login' jika pengguna tidak terautentikasi

3. Effect ini akan dijalankan setiap kali komponen di-mount dan ketika `router` berubah

Apakah Anda ingin saya membantu mengimplementasikan logika autentikasi yang lebih spesifik sesuai dengan kebutuhan aplikasi Anda?

---



---

