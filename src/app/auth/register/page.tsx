'use client'

import { AuthForm } from '@/components/ui/AuthForm'
import Link from 'next/link'

export default function RegisterPage() {
    return (
        <div>
            <AuthForm type="register" />
            <p className="mt-4 text-center text-sm text-gray-600">
                Sudah punya akun?{' '}
                <Link
                    href="/auth/login"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                    Masuk di sini
                </Link>
            </p>
        </div>
    )
} 