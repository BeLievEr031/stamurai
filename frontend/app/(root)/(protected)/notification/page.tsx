'use client';
import { ClipboardList, MessageCircle, } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useNotificationStore } from '@/store/useNotificationStore';

export default function NotificationPage() {
    const { notification: notifications } = useNotificationStore();
    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-4">Notifications</h1>
            <p className="text-gray-600 font-medium mb-4">Recent</p>

            <div className="space-y-6">
                {
                    notifications.map((notification, index) => {
                        return <div key={index}>
                            <div className="flex justify-between items-start">
                                <div className="flex space-x-3">
                                    <div className="bg-gray-100 p-2 rounded-full">
                                        <ClipboardList size={20} className="text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">Task assigned: {notification.title}</p>
                                        <p className="text-gray-500 text-sm">
                                            You were assigned a task • {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                        </p>
                                    </div>
                                </div>
                                <MessageCircle className="text-gray-400" size={18} />
                            </div>
                        </div>
                    })
                }


            </div>
        </div>
    );
}
