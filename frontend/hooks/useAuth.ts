/* eslint-disable @typescript-eslint/no-explicit-any */
import { loginUser, registerUser, self } from '@/http/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function useAuth() {
    const router = useRouter();
    const { setUser } = useAuthStore();
    const { data: selfData, refetch, isLoading: selfLoading } = useQuery({
        queryKey: ['self'],
        queryFn: self,
        retry: false,
        enabled: false
    })

    const register = useMutation({
        mutationFn: registerUser,
        onSuccess: () => {
            toast.success('Registration successful');
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || 'Registration failed');
        },
    });

    const login = useMutation({
        mutationFn: loginUser,
        onSuccess: async () => {
            const updatedSelfData = await refetch();
            setUser(updatedSelfData?.data?.data?.user)
            toast.success('Login successful');
            router.push("/dashboard")
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || 'Login failed');
        },
    });

    return {
        register: register.mutate,
        registerStatus: register.status,
        login: login.mutate,
        loginStatus: login.status,
        userData: selfData,
        fetchUser: refetch,
        selfLoading
    };
}
