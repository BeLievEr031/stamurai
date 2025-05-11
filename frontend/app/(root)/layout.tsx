'use client'
import { useAuth } from '@/hooks/useAuth';
import { socket } from '@/http';
import { fetchNotification } from '@/http/api';
import { useAuthStore } from '@/store/useAuthStore'
import { useNotificationStore } from '@/store/useNotificationStore';
import { INotificationQuery } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

function RootLayout({ children }: {
    children: React.ReactNode
}) {
    const router = useRouter();
    const { user, setUser } = useAuthStore();
    const { fetchUser, selfLoading } = useAuth();
    const [pagination] = useState<INotificationQuery>({
        limit: "10",
        page: "1"
    });
    const { setNotification, setRealTimeNotification } = useNotificationStore();
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["notifications", pagination.limit, pagination.page],
        queryFn: () => fetchNotification(pagination),
    })
    useEffect(() => {
        async function fetchData() {
            const selfData = await fetchUser();
            setUser(selfData?.data?.data.user);
            socket.emit('register', selfData?.data?.data.user?.userid);
        }
        fetchData();

        socket.on('task-assigned', (data) => {
            setRealTimeNotification(data)
        });

        return () => {
            socket.off('task-assigned');
        };

    }, [fetchUser, setNotification, setUser])

    useEffect(() => {
        if (user !== undefined && user) {
            router.push("/dashboard")
        } else {
            router.push("/register")
        }
    }, [user, router])


    useEffect(() => {
        if (data?.data && data?.data.notification) {
            setNotification(data?.data.notification)
        }
    }, [data, data?.data, setNotification])

    if (selfLoading) {
        return <div>Loading...</div>
    }

    if (isLoading) {
        return <div>Loading..</div>
    }

    if (isError) {
        console.log(error.message);

    }

    return (
        <div>{children}</div>
    )
}

export default RootLayout