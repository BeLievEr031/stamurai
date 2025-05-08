'use client'
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/useAuthStore'
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

function RootLayout({ children }: {
    children: React.ReactNode
}) {
    const router = useRouter();
    const { user, setUser } = useAuthStore();
    const { fetchUser, selfLoading } = useAuth();
    useEffect(() => {
        async function fetchData() {
            const selfData = await fetchUser();
            setUser(selfData?.data?.data.user);
        }
        fetchData();
    }, [fetchUser, setUser])

    useEffect(() => {
        if (user) {
            router.push("/dashboard")
        } else {
            router.push("/register")
        }
    }, [user, router])

    if (selfLoading) {
        return <div>Loading...</div>
    }

    return (
        <div>{children}</div>
    )
}

export default RootLayout