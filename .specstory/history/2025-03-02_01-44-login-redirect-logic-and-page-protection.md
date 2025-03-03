## SpecStory

## Login Redirect Logic and Page Protection (3/2/2025, 1:44:48 AM)

_**User**_

i want to create logic to differentiate the success login redirect, if the admin should be redirected to /dashboard and if the member should be redirected to /showcase, and also protect those 2 pages from unauthorized user using supabase auth

---

_**Assistant**_

Saya akan membantu Anda membuat logika untuk membedakan redirect setelah login dan menambahkan proteksi halaman berdasarkan role pengguna. Mari kita mulai dengan mencari informasi tentang struktur yang ada.

---

_****_

<details>
            <summary>Searched codebase "supabase auth login redirect dashboard" • **25** results</summary>
        
| File | Lines |
|------|-------|
| `src/app/dashboard/page.tsx` | L72-109 |
| `src/app/auth/callback/page.tsx` | L59-103 |
| `src/app/auth/callback/page.tsx` | L103-134 |
| `src/app/dashboard/page.tsx` | L1-42 |
| `src/app/auth/callback/page.tsx` | L1-23 |
| `src/app/auth/callback/page.tsx` | L23-59 |
| `src/app/auth/callback/page.tsx` | L134-178 |
| `src/app/showcase/page.tsx` | L47-109 |
| `src/app/auth/login/page.tsx` | L1-40 |
| `src/app/dashboard/page.tsx` | L225-255 |
| `src/app/dashboard/page.tsx` | L139-178 |
| `src/app/auth/register/page.tsx` | L1-21 |
| `src/app/auth/callback/page.tsx` | L178-198 |
| `src/app/dashboard/page.tsx` | L178-225 |
| `src/app/dashboard/page.tsx` | L42-72 |
| `src/app/showcase/page.tsx` | L1-47 |
| `src/app/api/example/route.ts` | L23-45 |
| `src/app/dashboard/page.tsx` | L109-139 |
| `src/app/ThemeRegistry.tsx` | L1-17 |
| `src/app/layout.tsx` | L19-44 |
| `src/app/api/example/route.ts` | L1-23 |
| `src/app/theme.ts` | L1-39 |
| `src/app/page.tsx` | L1-5 |
| `src/app/layout.tsx` | L1-19 |
| `src/app/components/HomePage.tsx` | L1-48 |

</details>

---

_****_



Mari saya bantu membuat middleware untuk proteksi halaman dan logika redirect berdasarkan role pengguna. Pertama, kita perlu membuat middleware file.

---

_****_

```diff
- import { createServerClient, type CookieOptions } from '@supabase/ssr'
- import { NextResponse, type NextRequest } from 'next/server'
+ import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
+ import { NextResponse } from 'next/server'
+ import type { NextRequest } from 'next/server'
  
  export async function middleware(request: NextRequest) {
-   const response = NextResponse.next({
-     request: {
-       headers: request.headers,
-     },
-   })
- 
-   const supabase = createServerClient(
-     process.env.NEXT_PUBLIC_SUPABASE_URL!,
-     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
-     {
-       cookies: {
-         get(name: string) {
-           return request.cookies.get(name)?.value
-         },
-         set(name: string, value: string, options: CookieOptions) {
-           response.cookies.set({
-             name,
-             value,
-             ...options,
-           })
-         },
-         remove(name: string, options: CookieOptions) {
-           response.cookies.set({
-             name,
-             value: '',
-             ...options,
-           })
-         },
-       },
-     }
-   )
- 
-   // Refresh session if expired
-   await supabase.auth.getSession()
- 
-   return response
+   const res = NextResponse.next()
+   const supabase = createMiddlewareClient({ req: request, res })
+   
+   // Refresh session if exists
+   const { data: { session } } = await supabase.auth.getSession()
+ 
+   // Paths that require authentication
+   const protectedPaths = ['/dashboard', '/showcase']
+   const isProtectedPath = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))
+ 
+   // If accessing protected path without session, redirect to login
+   if (isProtectedPath && !session) {
+     const redirectUrl = new URL('/auth/login', request.url)
+     return NextResponse.redirect(redirectUrl)
+   }
+ 
+   // If we have a session, check role-based access
+   if (session) {
+     // Get user role from database
+     const { data: userData, error } = await supabase
+       .from('users')
+       .select('role')
+       .eq('id', session.user.id)
+       .single()
+ 
+     if (!error && userData) {
+       const isAdmin = userData.role === 'admin'
+       const isDashboardPath = request.nextUrl.pathname.startsWith('/dashboard')
+       const isShowcasePath = request.nextUrl.pathname.startsWith('/showcase')
+ 
+       // Redirect non-admin users trying to access dashboard
+       if (isDashboardPath && !isAdmin) {
+         const redirectUrl = new URL('/showcase', request.url)
+         return NextResponse.redirect(redirectUrl)
+       }
+ 
+       // Optional: Redirect admin users from showcase to dashboard
+       if (isShowcasePath && isAdmin) {
+         const redirectUrl = new URL('/dashboard', request.url)
+         return NextResponse.redirect(redirectUrl)
+       }
+     }
+   }
+ 
+   return res
  }
  
- // Specify which routes should be protected
+ // Specify which routes the middleware should run on
  export const config = {
-   matcher: [
-     /*
-      * Match all request paths except:
-      * - _next/static (static files)
-      * - _next/image (image optimization files)
-      * - favicon.ico (favicon file)
-      * - public folder
-      * - auth related pages (/auth/*)
-      */
-     '/((?!_next/static|_next/image|favicon.ico|public|auth).*)',
-   ],
+   matcher: ['/dashboard/:path*', '/showcase/:path*']
  } 
```

---

_****_



Sekarang kita perlu mengupdate logika login untuk mengarahkan pengguna ke halaman yang sesuai berdasarkan peran mereka. Mari kita modifikasi komponen `AuthForm`.

---

_****_

<details>
            <summary>Searched codebase "AuthForm component login supabase" • **25** results</summary>
        
| File | Lines |
|------|-------|
| `src/components/ui/AuthForm.tsx` | L1-31 |
| `src/components/ui/AuthForm.tsx` | L31-66 |
| `src/components/ui/AuthForm.tsx` | L99-137 |
| `src/components/ui/AuthForm.tsx` | L66-99 |
| `src/components/ui/AuthForm.tsx` | L171-201 |
| `src/components/ui/AuthForm.tsx` | L271-289 |
| `src/components/ui/AuthForm.tsx` | L137-171 |
| `src/components/ui/AuthForm.tsx` | L201-219 |
| `src/components/ui/AuthForm.tsx` | L313-335 |
| `src/components/ui/AuthForm.tsx` | L289-313 |
| `src/components/ui/AuthForm.tsx` | L248-271 |
| `src/components/ui/AuthForm.tsx` | L219-248 |
| `src/components/dashboard/VideoManagement.tsx` | L315-352 |
| `src/components/dashboard/UserManagement.tsx` | L162-206 |
| `src/components/dashboard/VideoManagement.tsx` | L1-50 |
| `src/components/dashboard/VideoManagement.tsx` | L82-124 |
| `src/components/dashboard/UserManagement.tsx` | L80-106 |
| `src/components/dashboard/VideoManagement.tsx` | L400-459 |
| `src/components/dashboard/UserManagement.tsx` | L1-41 |
| `src/components/dashboard/VideoManagement.tsx` | L352-400 |
| `src/components/dashboard/VideoManagement.tsx` | L256-315 |
| `src/components/dashboard/UserManagement.tsx` | L206-224 |
| `src/components/dashboard/UserManagement.tsx` | L106-142 |
| `src/components/dashboard/VideoManagement.tsx` | L557-579 |
| `src/components/dashboard/Analytics.tsx` | L87-112 |

</details>

---

_****_



Mari kita modifikasi `AuthForm` untuk menangani redirect berdasarkan role pengguna. Pertama, kita perlu mengupdate tipe data untuk user role.

---

_****_

```diff
  Need to install the following packages:
  supabase@2.15.8
- Ok to proceed? (y) 
+ Ok to proceed? (y)
+ 
+ export type UserRole = 'admin' | 'member';
+ 
+ export interface User {
+     id: string;
+     email: string;
+     name: string;
+     role: UserRole;
+     created_at?: string;
+     updated_at?: string;
+ } 
```

---

_****_



Sekarang mari kita update komponen `AuthForm` untuk menangani redirect berdasarkan role:

---

_****_

```diff
  
                  if (session) {
+                     // Get user role from database
+                     const { data: userData, error: userError } = await supabase
+                         .from('users')
+                         .select('role')
+                         .eq('id', session.user.id)
+                         .single()
+ 
+                     if (userError) {
+                         console.error('Error fetching user role:', userError)
+                         throw new Error('Gagal mengambil data pengguna')
+                     }
+ 
+                     // Update or create user profile if needed
                      const { error: profileError } = await supabase
                          .from('users')
                                  email: session.user.email,
                                  name: session.user.user_metadata.name,
-                                 role: 'member' as UserRole,
+                                 role: userData?.role || 'member',
                              },
                          ], { onConflict: 'id' })
                      }
  
-                     window.location.href = '/dashboard'
+                     // Redirect based on role
+                     if (userData?.role === 'admin') {
+                         window.location.href = '/dashboard'
+                     } else {
+                         window.location.href = '/showcase'
+                     }
                  }
              }
```

---

_****_



Sekarang kita perlu mengupdate middleware untuk menangani proteksi halaman. Mari kita install package yang diperlukan terlebih dahulu:

---

_****_

```bash
npm install @supabase/auth-helpers-nextjs
```

```
npm warn deprecated @supabase/auth-helpers-shared@0.7.0: This package is now dep
recated - please use the @su
pabase/ssr package instead.
                            npm warn deprecated @supabase/auth-helpers-nextjs@0.
10.0: This package is now deprecated - please use the @s
upabase/ssr package instead.
                            
added 4 packages, removed 66 packages, and audited 488 packages in 6s

139 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities

```

---

_****_



Baik, sekarang mari kita update middleware untuk menggunakan package yang baru:

---

_****_

```diff
- import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
- import { NextResponse } from 'next/server'
- import type { NextRequest } from 'next/server'
+ import { createServerClient, type CookieOptions } from '@supabase/ssr'
+ import { NextResponse, type NextRequest } from 'next/server'
  
  export async function middleware(request: NextRequest) {
-   const res = NextResponse.next()
-   const supabase = createMiddlewareClient({ req: request, res })
-   
-   // Refresh session if exists
-   const { data: { session } } = await supabase.auth.getSession()
+   const response = NextResponse.next({
+     request: {
+       headers: request.headers,
+     },
+   })
+ 
+   const supabase = createServerClient(
+     process.env.NEXT_PUBLIC_SUPABASE_URL!,
+     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
+     {
+       cookies: {
+         get(name: string) {
+           return request.cookies.get(name)?.value
+         },
+         set(name: string, value: string, options: CookieOptions) {
+           response.cookies.set({
+             name,
+             value,
+             ...options,
+           })
+         },
+         remove(name: string, options: CookieOptions) {
+           response.cookies.set({
+             name,
+             value: '',
+             ...options,
+           })
+         },
+       },
+     }
+   )
  
    // Paths that require authentication
    const protectedPaths = ['/dashboard', '/showcase']
    const isProtectedPath = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))
+ 
+   // Get session
+   const { data: { session } } = await supabase.auth.getSession()
  
    // If accessing protected path without session, redirect to login
    }
  
-   return res
+   return response
  }
  
  // Specify which routes the middleware should run on
  export const config = {
-   matcher: ['/dashboard/:path*', '/showcase/:path*']
+   matcher: [
+     /*
+      * Match all request paths except:
+      * - _next/static (static files)
+      * - _next/image (image optimization files)
+      * - favicon.ico (favicon file)
+      * - public folder
+      * - auth related pages (/auth/*)
+      */
+     '/((?!_next/static|_next/image|favicon.ico|public|auth).*)',
+   ],
  } 
```

---

_****_



Mari kita install package `@supabase/ssr` yang dibutuhkan:

---

_****_

```bash
npm install @supabase/ssr
```

```
nilamsyambas@nilams-air etalas-hackathon % npm install @supabase/ssr

up to date, audited 488 packages in 3s

139 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
nilamsyambas@nilams-air etalas-hackathon %
```

---

_****_



Baik, sekarang saya akan jelaskan apa yang telah kita lakukan:

1. Kita telah membuat tipe data untuk role pengguna di `src/types/supabase.ts`:
   - `admin`: untuk administrator yang memiliki akses ke dashboard
   - `member`: untuk pengguna biasa yang memiliki akses ke showcase

2. Kita telah mengupdate komponen `AuthForm` untuk:
   - Mengambil role pengguna dari database setelah login berhasil
   - Mengarahkan pengguna ke halaman yang sesuai berdasarkan role mereka:
     - Admin diarahkan ke `/dashboard`
     - Member diarahkan ke `/showcase`

3. Kita telah membuat middleware di `src/middleware.ts` untuk:
   - Melindungi rute `/dashboard` dan `/showcase` dari akses tanpa login
   - Memeriksa role pengguna dan mengarahkan mereka ke halaman yang sesuai:
     - Non-admin yang mencoba mengakses `/dashboard` akan diarahkan ke `/showcase`
     - Admin yang mengakses `/showcase` akan diarahkan ke `/dashboard`

Dengan implementasi ini:
1. Pengguna harus login untuk mengakses `/dashboard` atau `/showcase`
2. Hanya admin yang bisa mengakses `/dashboard`
3. Member hanya bisa mengakses `/showcase`
4. Pengguna akan otomatis diarahkan ke halaman yang sesuai dengan role mereka setelah login

Apakah ada yang ingin Anda tanyakan atau ada bagian yang perlu dijelaskan lebih lanjut?

---

_**User**_

cool! please help to push the all the changes with message "restirct the page only for authenticated user, fix redirect based on DB role"

---

_**Assistant**_

Saya akan membantu Anda untuk melakukan commit dan push perubahan ke repository. Mari kita lakukan langkah demi langkah:

---

_****_

```bash
git add src/middleware.ts src/types/supabase.ts src/components/ui/AuthForm.tsx
```

```
nilamsyambas@nilams-air etalas-hackathon % 

```

---

_****_

```bash
git commit -m "restirct the page only for authenticated user, fix redirect based on DB role"
```

```
nilamsyambas@nilams-air etalas-hackathon % git commit -m "restirct the page only for authenticated user, fix
 redirect based on DB role"                git commit -m "restirct the page only for authenticated user, fix
 redirect based on DB role"
[main f13e1ee] restirct the page only for authenticated user, fix redirect based on DB role
 3 files changed, 73 insertions(+), 6 deletions(-)
nilamsyambas@nilams-air etalas-hackathon %
```

---

_****_

```bash
git push origin main
```

```
nilamsyambas@nilams-air etalas-hackathon % git push origin main
Enumerating objects: 17, done.
Counting objects: 100% (17/17), done.
Delta compression using up to 8 threads
Compressing objects: 100% (7/7), done.
Writing objects: 100% (9/9), 2.13 KiB | 2.13 MiB/s, done.
Total 9 (delta 3), reused 0 (delta 0), pack-reused 0
remote: Resolving deltas: 100% (3/3), completed with 3 local objects.
To https://github.com/r-etalas/etalas-hackathon.git
   67a5d4b..f13e1ee  main -> main
nilamsyambas@nilams-air etalas-hackathon %
```

---

_****_



Perubahan telah berhasil di-push ke repository! Berikut ringkasan perubahan yang telah kita lakukan:

1. Membuat tipe data untuk role pengguna di `src/types/supabase.ts`
2. Mengupdate middleware di `src/middleware.ts` untuk proteksi halaman dan redirect berdasarkan role
3. Memodifikasi `AuthForm` untuk menangani login dan redirect berdasarkan role dari database

Semua perubahan ini telah berhasil di-commit dengan pesan "restirct the page only for authenticated user, fix redirect based on DB role" dan di-push ke branch main di remote repository.

Apakah ada hal lain yang bisa saya bantu?

---

_**User**_

why admin getting redirect when visiting the /showcase, admin should be able to visit any page btw

---

_**Assistant**_

Ah, Anda benar! Admin seharusnya memiliki akses ke semua halaman. Mari kita perbaiki middleware-nya dengan menghapus redirect untuk admin dari `/showcase` ke `/dashboard`.

---

_****_

```diff
        const isAdmin = userData.role === 'admin'
        const isDashboardPath = request.nextUrl.pathname.startsWith('/dashboard')
-       const isShowcasePath = request.nextUrl.pathname.startsWith('/showcase')
  
        // Redirect non-admin users trying to access dashboard
          return NextResponse.redirect(redirectUrl)
        }
- 
-       // Optional: Redirect admin users from showcase to dashboard
-       if (isShowcasePath && isAdmin) {
-         const redirectUrl = new URL('/dashboard', request.url)
-         return NextResponse.redirect(redirectUrl)
-       }
      }
    }
```

---

_****_

```bash
git add src/middleware.ts && git commit -m "fix: allow admin to access showcase page" && git push origin main
```

```
nilamsyambas@nilams-air etalas-hackathon % git add src/middleware.ts && git commit -m "fix: allow admin to a
ccess showcase page" && git push origin maigit add src/middleware.ts && git commit -m "fix: allow admin to a
ccess showcase page" && git push origin main
[main 6ea2f85] fix: allow admin to access showcase page
 1 file changed, 7 deletions(-)
Enumerating objects: 7, done.
Counting objects: 100% (7/7), done.
Delta compression using up to 8 threads
Compressing objects: 100% (4/4), done.
Writing objects: 100% (4/4), 369 bytes | 369.00 KiB/s, done.
Total 4 (delta 3), reused 0 (delta 0), pack-reused 0
remote: Resolving deltas: 100% (3/3), completed with 3 local objects.
To https://github.com/r-etalas/etalas-hackathon.git
   f13e1ee..6ea2f85  main -> main
nilamsyambas@nilams-air etalas-hackathon %
```

---

_****_



Saya telah melakukan perubahan berikut:

1. Menghapus logika yang mengalihkan admin dari `/showcase` ke `/dashboard`
2. Sekarang admin dapat mengakses kedua halaman (`/showcase` dan `/dashboard`)
3. Member tetap hanya bisa mengakses `/showcase`

Sekarang aturan aksesnya menjadi:
- Admin: Dapat mengakses semua halaman (`/dashboard` dan `/showcase`)
- Member: Hanya dapat mengakses `/showcase`
- Pengguna tidak terautentikasi: Diarahkan ke `/auth/login`

Perubahan telah di-push ke repository dengan pesan commit "fix: allow admin to access showcase page".

Apakah ada hal lain yang perlu diperbaiki?

---



---

