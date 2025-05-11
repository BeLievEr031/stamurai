'use client'
import { useAuth } from '@/hooks/useAuth';
import { socket } from '@/http';
import { useAuthStore } from '@/store/useAuthStore'
import { useNotificationStore } from '@/store/useNotificationStore';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

function RootLayout({ children }: {
    children: React.ReactNode
}) {
    const router = useRouter();
    const { user, setUser } = useAuthStore();
    const { fetchUser, selfLoading } = useAuth();
    const { setNotification } = useNotificationStore();
    useEffect(() => {
        async function fetchData() {
            const selfData = await fetchUser();
            setUser(selfData?.data?.data.user);
            socket.emit('register', selfData?.data?.data.user?.userid);
        }
        fetchData();

        socket.on('task-assigned', (data) => {
            console.log(data);
            setNotification(data)
            // alert(`New Task from ${data.assignerId}: ${data.title}`);
        });

        return () => {
            socket.off('task-assigned');
        };

    }, [fetchUser, setUser])

    useEffect(() => {
        if (user !== undefined && user) {
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