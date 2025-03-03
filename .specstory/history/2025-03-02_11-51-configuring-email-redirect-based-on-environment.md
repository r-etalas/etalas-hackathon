## SpecStory

## Configuring Email Redirect Based on Environment (3/2/2025, 11:51:55 AM)

_**User**_

i want to adjust emailRedirectTo to have value based on env, here is the example implementation from @https://supabase.com/docs/guides/auth/redirect-urls 
const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    'http://localhost:3000/'
  // Make sure to include `https://` when not localhost.
  url = url.startsWith('http') ? url : `https://${url}`
  // Make sure to include a trailing `/`.
  url = url.endsWith('/') ? url : `${url}/`
  return url
}

const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'github',
  options: {
    redirectTo: getURL(),
  },
})


---

_**Assistant**_

Saya akan membantu Anda mengimplementasikan fungsi `getURL` untuk mengatur `emailRedirectTo` berdasarkan environment variable. Mari kita cari file yang relevan terlebih dahulu.

---

_****_

<details>
            <summary>Searched codebase "signInWithOAuth or signInWithEmail" • **25** results</summary>
        
| File | Lines |
|------|-------|
| `src/components/ui/AuthForm.tsx` | L229-247 |
| `src/components/ui/AuthForm.tsx` | L1-30 |
| `src/components/ui/AuthForm.tsx` | L65-98 |
| `src/components/ui/AuthForm.tsx` | L98-127 |
| `src/components/ui/AuthForm.tsx` | L30-65 |
| `src/components/ui/AuthForm.tsx` | L299-317 |
| `src/components/ui/AuthForm.tsx` | L317-341 |
| `src/app/auth/callback/page.tsx` | L1-31 |
| `src/app/auth/callback/page.tsx` | L113-152 |
| `src/components/ui/AuthForm.tsx` | L165-199 |
| `src/components/ui/AuthForm.tsx` | L247-276 |
| `src/components/ui/AuthForm.tsx` | L199-229 |
| `src/components/ui/AuthForm.tsx` | L341-363 |
| `src/app/auth/callback/page.tsx` | L70-113 |
| `src/app/auth/callback/page.tsx` | L31-70 |
| `src/components/ui/AuthForm.tsx` | L276-299 |
| `src/app/auth/callback/page.tsx` | L152-172 |
| `src/app/auth/login/page.tsx` | L1-26 |
| `src/components/ui/AuthForm.tsx` | L127-165 |
| `src/app/showcase/page.tsx` | L48-99 |
| `src/app/auth/login/VerificationMessage.tsx` | L1-26 |
| `src/app/dashboard/page.tsx` | L72-109 |
| `src/app/auth/register/page.tsx` | L1-21 |
| `src/components/dashboard/UserManagement.tsx` | L141-187 |
| `src/middleware.ts` | L1-69 |

</details>

---

_****_



Berdasarkan hasil pencarian, saya melihat bahwa kita perlu mengimplementasikan fungsi `getURL` dan menggunakannya di beberapa tempat yang menggunakan `emailRedirectTo`. Mari kita buat file utilitas baru untuk fungsi `getURL` dan kemudian menggunakannya di tempat yang diperlukan.

Pertama, saya akan membuat file utilitas baru:

---

_****_

```diff
- 
+ export const getURL = () => {
+     let url =
+         process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
+         process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
+         'http://localhost:3000'
+     
+     // Make sure to include `https://` when not localhost.
+     url = url.includes('localhost') ? url : url.startsWith('http') ? url : `https://${url}`
+     
+     // Make sure to include a trailing `/`.
+     url = url.endsWith('/') ? url : `${url}/`
+     
+     return url
+ } 
```

---

_****_



Sekarang saya akan mengupdate komponen `AuthForm` untuk menggunakan fungsi `getURL` ini:

---

_****_

```diff
      VisibilityOff
  } from '@mui/icons-material'
+ import { getURL } from '@/utils/url'
  
  type AuthFormProps = {
                              role: 'member',
                          },
-                         emailRedirectTo: `${window.location.origin}/auth/callback`
+                         emailRedirectTo: `${getURL()}auth/callback`
                      }
                  })
```

---

_****_



Selanjutnya, saya akan mengupdate komponen `UserManagement` untuk menggunakan fungsi `getURL`:

---

_****_

```diff
  import { createBrowserClient } from '@supabase/ssr';
  import type { UserRole } from '@/types/supabase';
+ import { getURL } from '@/utils/url'
  
  interface User {
                              role: newUserData.role,
                          },
-                         emailRedirectTo: `${window.location.origin}/auth/callback`
+                         emailRedirectTo: `${getURL()}auth/callback`
                      }
                  });
```

---

_****_



Saya telah melakukan beberapa perubahan penting:

1. Membuat file utilitas baru `src/utils/url.ts` yang berisi fungsi `getURL` untuk mengelola URL redirect berdasarkan environment.

2. Mengupdate `AuthForm` dan `UserManagement` untuk menggunakan fungsi `getURL` ini daripada menggunakan `window.location.origin` secara langsung.

Fungsi `getURL` akan:
- Menggunakan `NEXT_PUBLIC_SITE_URL` jika tersedia (untuk production)
- Jatuh kembali ke `NEXT_PUBLIC_VERCEL_URL` jika di-deploy di Vercel
- Menggunakan `http://localhost:3000` sebagai fallback terakhir
- Memastikan URL menggunakan HTTPS kecuali untuk localhost
- Memastikan URL memiliki trailing slash

Untuk menggunakan ini dengan benar, Anda perlu:

1. Menambahkan environment variable yang diperlukan di file `.env.local`:
```
NEXT_PUBLIC_SITE_URL=https://your-production-url.com/
```

2. Jika menggunakan Vercel, `NEXT_PUBLIC_VERCEL_URL` akan diatur secara otomatis.

3. Untuk development lokal, akan menggunakan `http://localhost:3000` secara default.

Apakah ada yang perlu saya jelaskan lebih lanjut?

---



---

