// stores/useAuthStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware'
interface User {
    userid: string;
    name: string;
    email: string;
    role: string;
}

interface AuthState {
    user: User | null;
    setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>(
    devtools((set) => ({
        user: null,
        setUser: (user) => set({ user }),
    }))
);
