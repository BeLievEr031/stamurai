/* eslint-disable @typescript-eslint/no-explicit-any */
import { loginUser, registerUser } from '@/http/api';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function useAuth() {
    const router = useRouter();

    const register = useMutation({
        mutationFn: registerUser,
        onSuccess: () => {
            toast.success('Registration successful');
            router.push('/login');
        },
        onError: (err: any) => {
            console.log(err?.response?.data?.message);

            toast.error(err?.response?.data?.message || 'Registration failed');
        },
    });

    const login = useMutation({
        mutationFn: loginUser,
        onSuccess: () => {
            toast.success('Login successful');
            router.push('/dashboard');
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
    };
}
