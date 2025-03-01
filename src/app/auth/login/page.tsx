'use client'

import { Suspense } from 'react'
import { AuthForm } from '@/components/ui/AuthForm'
import Link from 'next/link'
import { VerificationMessage } from './VerificationMessage'

export default function LoginPage() {
    return (
        <div>
            <Suspense fallback={null}>
                <VerificationMessage />
            </Suspense>
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