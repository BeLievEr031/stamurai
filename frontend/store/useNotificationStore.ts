import { create } from 'zustand';

interface Notification {
    userid: string;
    title: string;
    description?: string;
    dueDate: Date;
    priority: string | 'low' | 'medium' | 'high';
    status: string | 'pending' | 'in-progress' | 'completed';
    assignerid?: string;
    createdAt: string
}

interface NotificationStore {
    notification: Notification[];
    setNotification: (notification: Notification) => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
    notification: [],
    setNotification: (newNotification) =>
        set((state) => ({
            notification: [...state.notification, newNotification],
        })),
}));
