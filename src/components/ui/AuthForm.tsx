'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import {
    Box,
    TextField,
    Button,
    Typography,
    Checkbox,
    FormControlLabel,
    Link,
    IconButton,
    InputAdornment,
    Paper,
    Container,
    Stack,
    Alert
} from '@mui/material'
import {
    Person,
    Email,
    Lock,
    Visibility,
    VisibilityOff
} from '@mui/icons-material'

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
    const [agreeToTerms, setAgreeToTerms] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (type === 'register' && !agreeToTerms) {
            setError('Anda harus menyetujui Syarat & Ketentuan untuk melanjutkan')
            return
        }

        const now = Date.now()
        if (now - lastAttempt < 12000) {
            setError('Mohon tunggu beberapa detik sebelum mencoba lagi')
            return
        }

        setLoading(true)
        setError(null)
        setMessage(null)
        setLastAttempt(now)

        try {
            if (type === 'register') {
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

                if (authError) {
                    if (authError.message.includes('security purposes')) {
                        throw new Error('Mohon tunggu beberapa detik sebelum mencoba lagi')
                    }
                    throw authError
                }

                if (authData.user) {
                    setMessage(
                        'Registrasi berhasil! Silakan cek email Anda untuk verifikasi. ' +
                        'Setelah verifikasi email, Anda bisa login ke aplikasi.'
                    )
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
                    try {
                        // Get user role from database
                        const { data: userData, error: userError } = await supabase
                            .from('users')
                            .select('role, name')
                            .eq('id', session.user.id)
                            .single()

                        if (userError) {
                            console.error('Error fetching user role:', userError)
                            throw new Error('Gagal mengambil data pengguna')
                        }

                        // Only update if data is different
                        const currentName = userData?.name || session.user.user_metadata.name
                        const currentRole = userData?.role || 'member'

                        if (currentName !== session.user.user_metadata.name || !userData) {
                            const { error: profileError } = await supabase
                                .from('users')
                                .upsert({
                                    id: session.user.id,
                                    email: session.user.email,
                                    name: currentName,
                                    role: currentRole,
                                    updated_at: new Date().toISOString()
                                })

                            if (profileError) {
                                console.error('Error updating profile:', profileError)
                                // Continue with redirect even if profile update fails
                            }
                        }

                        // Redirect based on role
                        if (userData?.role === 'admin') {
                            window.location.href = '/dashboard'
                        } else {
                            window.location.href = '/showcase'
                        }
                    } catch (error) {
                        console.error('Error in profile update:', error)
                        // Continue with redirect even if there's an error
                        window.location.href = '/showcase'
                    }
                }
            }
        } catch (error) {
            console.error('Auth error:', error)
            setError(error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(to bottom right, #E0F7FA, #E1F5FE)',
                py: 6,
                px: 2
            }}
        >
            <Container maxWidth="lg">
                <Paper
                    elevation={24}
                    sx={{
                        borderRadius: 4,
                        overflow: 'hidden',
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }
                    }}
                >
                    {/* Form Section */}
                    <Box sx={{ p: 4, display: 'flex', flexDirection: 'column' }}>
                        <Typography
                            variant="h4"
                            component="h1"
                            align="center"
                            fontWeight="bold"
                            sx={{ mb: 4 }}
                        >
                            Hello, friend!
                        </Typography>

                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 3,
                                flexGrow: 1
                            }}
                        >
                            <Stack spacing={2}>
                                {type === 'register' && (
                                    <TextField
                                        fullWidth
                                        required
                                        id="name"
                                        name="name"
                                        label="Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Person />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                )}

                                <TextField
                                    fullWidth
                                    required
                                    id="email"
                                    name="email"
                                    type="email"
                                    label="E-mail"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Email />
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    required
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    label="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Lock />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Stack>

                            {type === 'register' && (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={agreeToTerms}
                                            onChange={(e) => setAgreeToTerms(e.target.checked)}
                                            color="primary"
                                        />
                                    }
                                    label={
                                        <Typography variant="body2">
                                            I&apos;ve read and agree to{' '}
                                            <Link href="#" underline="hover">
                                                Terms & Conditions
                                            </Link>
                                        </Typography>
                                    }
                                />
                            )}

                            {error && <Alert severity="error">{error}</Alert>}
                            {message && <Alert severity="success">{message}</Alert>}

                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                disabled={loading || (type === 'register' && !agreeToTerms)}
                                sx={{
                                    mt: 2,
                                    py: 1.5,
                                    background: 'linear-gradient(to right, #4FC3F7, #2196F3)',
                                    borderRadius: 3,
                                    '&:hover': {
                                        background: 'linear-gradient(to right, #29B6F6, #1E88E5)',
                                    }
                                }}
                            >
                                {loading ? 'Processing...' : type === 'login' ? 'Sign in' : 'CREATE ACCOUNT'}
                            </Button>

                            <Box sx={{ textAlign: 'center', mt: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                    {type === 'login' ? (
                                        <>
                                            Don&apos;t have an account?{' '}
                                            <Link href="/auth/register" underline="hover">
                                                Sign up
                                            </Link>
                                        </>
                                    ) : (
                                        <>
                                            Already have an account?{' '}
                                            <Link href="/auth/login" underline="hover">
                                                Sign in
                                            </Link>
                                        </>
                                    )}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/* Welcome Section */}
                    <Box
                        sx={{
                            display: { xs: 'none', md: 'flex' },
                            flexDirection: 'column',
                            justifyContent: 'center',
                            p: 4,
                            background: 'linear-gradient(to bottom right, #4FC3F7, #2196F3)',
                            color: 'white'
                        }}
                    >
                        <Typography variant="h3" component="h2" fontWeight="bold" sx={{ mb: 2 }}>
                            Glad to see You!
                        </Typography>
                        <Typography variant="h6" sx={{ opacity: 0.9 }}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </Box>
    )
} 