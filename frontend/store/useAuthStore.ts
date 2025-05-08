// stores/useAuthStore.ts
import { create } from 'zustand';
interface User {
    userid: string;
    name: string;
    email: string;
    role: string;
}

interface AuthState {
    user: User | null;
    setUser: (user: User) => void;
    logout: () => void
}

export const useAuthStore = create<AuthState>(
    (set) => ({
        user: null,
        setUser: (user) => set({ user }),
        logout: () => set({ user: null }),
    })
);
