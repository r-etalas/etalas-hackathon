'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export function VerificationMessage() {
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

    if (!message) return null

    return (
        <div className="max-w-md mx-auto mt-4 p-4 rounded-md bg-green-50 text-green-700 text-center">
            {message}
        </div>
    )
} 