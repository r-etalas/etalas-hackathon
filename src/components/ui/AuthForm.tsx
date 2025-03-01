'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import type { UserRole } from '@/types/supabase'

type AuthFormProps = {
    type: 'login' | 'register'
}

export function AuthForm({ type }: AuthFormProps) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [message, setMessage] = useState<string | null>(null)
    const [lastAttempt, setLastAttempt] = useState<number>(0)

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Check if enough time has passed since last attempt
        const now = Date.now()
        if (now - lastAttempt < 12000) { // 12 seconds to be safe
            setError('Mohon tunggu beberapa detik sebelum mencoba lagi')
            return
        }

        setLoading(true)
        setError(null)
        setMessage(null)
        setLastAttempt(now)

        try {
            if (type === 'register') {
                console.log('Mencoba mendaftarkan user...')
                const { data: authData, error: authError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            name: name,
                            email: email,
                            role: 'member',
                        },
                        emailRedirectTo: `${window.location.origin}/auth/callback`
                    }
                })

                console.log('Hasil auth signup:', { authData, authError })

                if (authError) {
                    if (authError.message.includes('security purposes')) {
                        throw new Error('Mohon tunggu beberapa detik sebelum mencoba lagi')
                    }
                    throw authError
                }

                if (authData.user) {
                    console.log('Registrasi berhasil!')
                    setMessage(
                        'Registrasi berhasil! Silakan cek email Anda untuk verifikasi. ' +
                        'Setelah verifikasi email, Anda bisa login ke aplikasi.'
                    )

                    // Reset form
                    setEmail('')
                    setPassword('')
                    setName('')
                }
            } else {
                const { data: { session }, error: authError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })

                if (authError) {
                    if (authError.message.includes('security purposes')) {
                        throw new Error('Mohon tunggu beberapa detik sebelum mencoba lagi')
                    }
                    throw authError
                }

                if (session) {
                    // After successful login, create/update user profile
                    const { error: profileError } = await supabase
                        .from('users')
                        .upsert([
                            {
                                id: session.user.id,
                                email: session.user.email,
                                name: session.user.user_metadata.name,
                                role: 'member' as UserRole,
                            },
                        ], { onConflict: 'id' })

                    if (profileError) {
                        console.error('Error updating profile:', profileError)
                    }

                    window.location.href = '/dashboard'
                }
            }
        } catch (err) {
            console.error('Error dalam proses:', err)
            setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        {type === 'login' ? 'Masuk ke akun Anda' : 'Buat akun baru'}
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        {type === 'register' && (
                            <div>
                                <label htmlFor="name" className="sr-only">
                                    Nama
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Nama"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        )}
                        <div>
                            <label htmlFor="email-address" className="sr-only">
                                Alamat Email
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Alamat Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center">{error}</div>
                    )}

                    {message && (
                        <div className="text-green-500 text-sm text-center">{message}</div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            {loading ? (
                                'Memproses...'
                            ) : type === 'login' ? (
                                'Masuk'
                            ) : (
                                'Daftar'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
} 