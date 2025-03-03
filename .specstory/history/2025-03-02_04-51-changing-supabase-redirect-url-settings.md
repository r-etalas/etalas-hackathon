## SpecStory

## Changing Supabase Redirect URL Settings (3/2/2025, 4:51:25 AM)

_**User**_

@https://snykqejcwhyocrxwsctx.supabase.co/auth/v1/verify?token=pkce_cb81013b885a0da25a6b3a7baec75f4e5af604aff68d66b4f3da7ceb&type=signup&redirect_to=http://localhost:3000/auth/callback 
this is redirection link from supabase email, how can i change the value of the redirect_to into my prod url? and where supposed i find the setting on supabase web?

---

_**Assistant**_

Saya akan membantu Anda mengubah URL redirect untuk autentikasi Supabase dari localhost ke URL produksi.

Mari saya cari informasi terkini tentang konfigurasi URL redirect di Supabase.

---

_****_



---

_****_



Berdasarkan hasil pencarian, saya dapat menjelaskan cara mengubah URL redirect untuk autentikasi Supabase:

1. Untuk mengubah URL redirect ke URL produksi Anda, Anda perlu mengakses dashboard Supabase dengan langkah-langkah berikut:

   - Login ke dashboard Supabase
   - Pilih project Anda
   - Pergi ke menu Authentication -> URL Configuration
   - Di sana Anda akan menemukan dua pengaturan penting:
     1. **Site URL**: Ini adalah URL default untuk redirect. Atur ini ke URL produksi utama Anda.
     2. **Additional Redirect URLs**: Di sini Anda bisa menambahkan URL tambahan yang diizinkan untuk redirect.

2. Untuk kasus development dan production, Anda sebaiknya:
   - Atur Site URL ke URL produksi Anda
   - Tambahkan URL tambahan di "Additional Redirect URLs" seperti:
     - `http://localhost:3000/**` (untuk development)
     - URL produksi Anda

3. Jika Anda menggunakan Vercel, Anda juga bisa menambahkan:
   - `https://*-<team-or-account-slug>.vercel.app/**` (untuk preview deployments)

4. Pastikan untuk selalu menggunakan format URL yang lengkap dengan protokol (http:// atau https://) dan trailing slash (/) jika diperlukan.

Setelah mengonfigurasi URL-URL tersebut, sistem autentikasi Supabase akan mengizinkan redirect ke URL-URL yang telah Anda daftarkan.

Apakah Anda ingin saya membantu mengonfigurasi URL redirect untuk kasus spesifik Anda? Jika ya, mohon berikan URL produksi yang ingin Anda gunakan.

---

_**User**_

please help to update the readme to include this demo url @https://etalas-hackathon.vercel.app/auth/register 

---

_**Assistant**_

Saya akan mencari README yang ada terlebih dahulu dan kemudian memperbaruinya.

---

_****_

<details>
            <summary>Searched codebase "README.md" • **1** results</summary>
        
| File |
|------|
| `undefined` |

</details>

---

_****_



Mari saya lihat isi README saat ini:

---

_****_

Read file: README.md

---

_****_



Saya akan memperbarui README untuk menambahkan demo URL:

---

_****_

```diff
  
  Proyek ini adalah bagian dari hackathon yang bertujuan untuk mengembangkan solusi inovatif dalam bentuk aplikasi web.
+ 
+ ## Demo
+ 
+ Anda dapat mencoba aplikasi ini secara langsung di:
+ - [Etalas Hackathon Demo](https://etalas-hackathon.vercel.app/auth/register)
  
  ## Teknologi yang Digunakan
```

---

_****_



Saya telah memperbarui README.md dengan menambahkan bagian Demo yang berisi link ke aplikasi yang sudah di-deploy. Sekarang pengguna dapat dengan mudah mengakses demo aplikasi melalui link yang tercantum di README.

Apakah ada hal lain yang ingin Anda tambahkan ke README?

---

_**User**_

please, push that changes

---

_**Assistant**_

Saya akan membantu Anda untuk melakukan push perubahan ke repositori. Mari kita lakukan langkah-langkah commit dan push:

---

_****_

```bash
git status | cat
```

```
nilamsyambas@nilams-air etalas-hackathon % git status | cat
On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   README.md

no changes added to commit (use "git add" and/or "git commit -a")
nilamsyambas@nilams-air etalas-hackathon %
```

---

_****_



Mari kita tambahkan perubahan README.md ke staging area dan buat commit:

---

_****_

```bash
git add README.md
```

```
nilamsyambas@nilams-air etalas-hackathon % 

```

---

_****_

```bash
git commit -m "docs: menambahkan demo URL ke README"
```

```
nilamsyambas@nilams-air etalas-hackathon % git commit -m "docs: menambahkan demo URL ke README"
[main 77d3a8f] docs: menambahkan demo URL ke README
 1 file changed, 6 insertions(+)
nilamsyambas@nilams-air etalas-hackathon %
```

---

_****_



Sekarang mari kita push perubahan ke repositori remote:

---

_****_

```bash
git push origin main
```

```
nilamsyambas@nilams-air etalas-hackathon % git push origin main
Enumerating objects: 5, done.
Counting objects: 100% (5/5), done.
Delta compression using up to 8 threads
Compressing objects: 100% (3/3), done.
Writing objects: 100% (3/3), 422 bytes | 422.00 KiB/s, done.
Total 3 (delta 2), reused 0 (delta 0), pack-reused 0
remote: Resolving deltas: 100% (2/2), completed with 2 local objects.
To https://github.com/r-etalas/etalas-hackathon.git
   690ef50..77d3a8f  main -> main
nilamsyambas@nilams-air etalas-hackathon %
```

---

_****_



Perubahan telah berhasil di-push ke repositori! Sekarang README.md di repositori GitHub sudah diperbarui dengan demo URL. Ringkasan perubahan yang telah dilakukan:

1. Menambahkan bagian Demo ke README.md
2. Melakukan commit dengan pesan "docs: menambahkan demo URL ke README"
3. Berhasil push perubahan ke branch main

Apakah ada hal lain yang bisa saya bantu?

---



---

