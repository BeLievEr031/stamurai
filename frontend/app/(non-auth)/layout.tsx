'use client'
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

function NonAuth({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const { user } = useAuthStore();

    useEffect(() => {
        if (user) {
            router.push("/dashboard")
            return;
        }
    }, [router, user])

    return (
        <>
            {children}
        </>
    )
}

export default NonAuth;