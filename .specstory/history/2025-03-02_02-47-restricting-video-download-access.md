## SpecStory

## Restricting Video Download Access (3/2/2025, 2:47:05 AM)

_**User**_

can you help to restrict for user not to be abled to download the video

---

_**Assistant**_

Saya akan membantu Anda untuk membatasi pengguna agar tidak dapat mengunduh video. Mari saya cari terlebih dahulu file-file yang relevan dengan pemutaran video di proyek Anda.

---

_****_

<details>
            <summary>Searched codebase "video player component or video playback implementation" • **25** results</summary>
        
| File | Lines |
|------|-------|
| `src/components/dashboard/VideoManagement.tsx` | L1-50 |
| `src/components/dashboard/VideoManagement.tsx` | L646-682 |
| `src/app/showcase/page.tsx` | L335-366 |
| `src/app/showcase/page.tsx` | L366-400 |
| `src/app/showcase/page.tsx` | L298-335 |
| `src/components/dashboard/VideoManagement.tsx` | L500-527 |
| `src/components/dashboard/VideoManagement.tsx` | L58-71 |
| `src/components/dashboard/VideoManagement.tsx` | L527-563 |
| `src/components/dashboard/VideoManagement.tsx` | L50-58 |
| `src/app/showcase/page.tsx` | L1-48 |
| `src/components/dashboard/VideoManagement.tsx` | L71-82 |
| `src/components/dashboard/VideoManagement.tsx` | L585-614 |
| `src/components/dashboard/Dashboard.tsx` | L137-164 |
| `src/components/dashboard/VideoManagement.tsx` | L176-217 |
| `src/app/showcase/page.tsx` | L156-191 |
| `src/components/dashboard/VideoManagement.tsx` | L82-124 |
| `src/components/dashboard/VideoManagement.tsx` | L124-176 |
| `src/components/dashboard/VideoManagement.tsx` | L321-358 |
| `src/components/dashboard/VideoManagement.tsx` | L262-321 |
| `src/components/dashboard/VideoManagement.tsx` | L217-262 |
| `src/components/dashboard/VideoManagement.tsx` | L614-646 |
| `src/components/dashboard/VideoManagement.tsx` | L358-406 |
| `src/components/dashboard/VideoManagement.tsx` | L406-465 |
| `src/app/showcase/page.tsx` | L93-156 |
| `src/app/showcase/page.tsx` | L48-93 |

</details>

---

_****_



Saya melihat bahwa ada beberapa file yang menangani pemutaran video di aplikasi Anda. Untuk membatasi pengguna agar tidak dapat mengunduh video, kita perlu memodifikasi elemen `<video>` yang ada di beberapa tempat. Mari saya edit file-file tersebut untuk menambahkan atribut yang mencegah pengunduhan video.

Pertama, saya akan mengedit file `src/app/showcase/page.tsx`:

---

_****_

```diff
                              <video
                                  controls
+                                 controlsList="nodownload"
+                                 onContextMenu={(e) => e.preventDefault()}
                                  style={{ width: '100%', marginTop: '16px' }}
                                  src={selectedVideo.video_url}
```

---

_****_



Sekarang saya akan mengedit file `src/components/dashboard/VideoManagement.tsx`:

---

_****_

```diff
                              <video
                                  controls
+                                 controlsList="nodownload"
+                                 onContextMenu={(e) => e.preventDefault()}
                                  style={{ width: '100%' }}
                                  src={getVideoUrl(selectedVideo.video_path)}
```

---

_****_



Saya telah menambahkan dua fitur keamanan untuk mencegah pengunduhan video:

1. Atribut `controlsList="nodownload"` - Ini akan menyembunyikan tombol unduh bawaan dari kontrol video HTML5.
2. Event handler `onContextMenu={(e) => e.preventDefault()}` - Ini akan mencegah menu konteks kanan muncul saat pengguna mengklik kanan pada video, yang biasanya memiliki opsi "Save video as...".

Perlu diperhatikan bahwa meskipun kita telah menerapkan pembatasan ini, masih ada beberapa keterbatasan:

1. Ini adalah pembatasan di sisi klien (browser), yang berarti pengguna yang sangat teknis masih bisa menemukan cara untuk mengunduh video melalui alat pengembang browser atau alat pihak ketiga.
2. Browser mungkin masih menyimpan video dalam cache sementara saat pemutaran.

Untuk keamanan yang lebih kuat, Anda mungkin ingin mempertimbangkan langkah-langkah tambahan seperti:

1. Menggunakan DRM (Digital Rights Management)
2. Streaming video menggunakan protokol HLS atau DASH
3. Mengenkripsi video
4. Menggunakan layanan streaming video pihak ketiga yang menyediakan perlindungan konten

Apakah Anda ingin saya menjelaskan lebih detail tentang salah satu opsi tambahan tersebut?

---



---

