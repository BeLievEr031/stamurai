import { create } from 'zustand';

interface Notification {
    taskid: {
        userid: string;
        title: string;
        description?: string;
        dueDate: Date;
        priority: string | 'low' | 'medium' | 'high';
        status: string | 'pending' | 'in-progress' | 'completed';
        assignerid?: string;
        createdAt: string
    };
    createdAt: string
}

interface NotificationStore {
    notification: Notification[];
    setNotification: (notification: Notification[]) => void;
    setRealTimeNotification: (notification: Notification) => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
    notification: [],
    setNotification: (newNotification) =>
        set(() => ({
            notification: [...newNotification],
        })),
    setRealTimeNotification: (newNotification) =>
        set((state) => ({
            notification: [...state.notification, newNotification],
        })),
}));
