'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { AuthForm } from '@/components/ui/AuthForm'
import Link from 'next/link'

export default function LoginPage() {
    const [message, setMessage] = useState<string | null>(null)
    const searchParams = useSearchParams()

    useEffect(() => {
        const verified = searchParams.get('verified')
        if (verified === 'true') {
            setMessage('Email berhasil diverifikasi! Silakan login.')
        } else if (verified === 'false') {
            setMessage('Gagal memverifikasi email. Silakan coba lagi atau hubungi support.')
        }
    }, [searchParams])

    return (
        <div>
            {message && (
                <div className="max-w-md mx-auto mt-4 p-4 rounded-md bg-green-50 text-green-700 text-center">
                    {message}
                </div>
            )}
            <AuthForm type="login" />
            <p className="mt-4 text-center text-sm text-gray-600">
                Belum punya akun?{' '}
                <Link
                    href="/auth/register"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                    Daftar di sini
                </Link>
            </p>
        </div>
    )
} 