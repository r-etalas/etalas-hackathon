'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { Snackbar, Alert } from '@mui/material'
import type { UserRole } from '@/types/supabase'

export default function AuthCallbackPage() {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [message, setMessage] = useState('')
    const [severity, setSeverity] = useState<'success' | 'error'>('success')

    useEffect(() => {
        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        const handleEmailVerification = async () => {
            try {
                // Get the current session first
                const { data: { user }, error: userError } = await supabase.auth.getUser()

                if (userError) {
                    console.error('Session error:', userError)
                    throw userError
                }

                console.log('Initial session check:', user)

                // If we have a session, the email is verified
                if (user) {
                    try {
                        // Validate required user data
                        if (!user.id || !user.email) {
                            throw new Error('Missing required user data')
                        }

                        // Log user data before creating profile
                        console.log('User data:', {
                            id: user.id,
                            email: user.email,
                            metadata: user.user_metadata,
                        })

                        // Check if user already exists and get their role
                        const { data: existingUser, error: checkError } = await supabase
                            .from('users')
                            .select('id, role')
                            .eq('id', user.id)
                            .single()

                        if (checkError && checkError.code !== 'PGRST116') { // PGRST116 means no rows returned
                            console.error('Error checking existing user:', checkError)
                            throw checkError
                        }

                        if (existingUser) {
                            console.log('User already exists:', existingUser)
                            setMessage('Profil sudah ada, melanjutkan ke halaman utama...')
                            setSeverity('success')
                            setOpen(true)

                            // Redirect based on role
                            const redirectPath = existingUser.role === 'admin' ? '/dashboard' : '/showcase'
                            setTimeout(() => router.push(redirectPath), 2000)
                            return
                        }

                        // Prepare profile data
                        const profileData = {
                            id: user.id,
                            email: user.email,
                            name: user.user_metadata.name || user.email?.split('@')[0] || 'User',
                            role: 'member' as UserRole
                        }

                        console.log('Attempting to create profile with data:', profileData)

                        // Create user profile
                        const { data: newUser, error: insertError } = await supabase
                            .from('users')
                            .insert([profileData])
                            .select()
                            .single()

                        if (insertError) {
                            console.error('Error creating profile:', insertError)
                            throw insertError
                        }

                        console.log('Profile created successfully:', newUser)

                        setMessage('Email berhasil diverifikasi dan profil dibuat!')
                        setSeverity('success')
                        setOpen(true)

                        // Redirect to showcase for new users (they are always members by default)
                        console.log('Starting redirect countdown...')
                        setTimeout(() => {
                            console.log('Redirecting to showcase...')
                            router.push('/showcase')
                        }, 2000)
                    } catch (error) {
                        console.error('Error in profile creation:', error)
                        setMessage('Gagal membuat profil. Mohon hubungi admin.')
                        setSeverity('error')
                        setOpen(true)
                        setTimeout(() => router.push('/auth/register'), 2000)
                    }
                } else {
                    // If no session, try to exchange the token
                    const { searchParams } = new URL(window.location.href)
                    console.log('URL Parameters:', Object.fromEntries(searchParams.entries()))

                    // Try to sign in with the PKCE code
                    const code = searchParams.get('code')

                    if (code) {
                        const { error } = await supabase.auth.exchangeCodeForSession(code)
                        if (error) {
                            console.error('Code exchange error:', error)
                            throw error
                        }

                        // Refresh the page to handle the new session
                        window.location.reload()
                    } else {
                        throw new Error('No code or session found')
                    }
                }
            } catch (error) {
                console.error('Verification error:', error)
                setMessage('Gagal memverifikasi email. Silakan coba lagi.')
                setSeverity('error')
                setOpen(true)

                setTimeout(() => {
                    console.log('Redirecting to register page...')
                    router.push('/auth/register')
                }, 2000)
            }
        }

        handleEmailVerification()
    }, [router])

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <h2 className="text-2xl font-semibold mb-4">Memverifikasi Email...</h2>
                <p className="text-gray-600">Mohon tunggu sebentar.</p>
            </div>
            <Snackbar
                open={open}
                autoHideDuration={2000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleClose} severity={severity}>
                    {message}
                </Alert>
            </Snackbar>
        </div>
    )
} 