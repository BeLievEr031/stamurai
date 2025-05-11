'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ClipboardList, Calendar, Flag, Loader2, User, FileText } from 'lucide-react';
import { getSingleTask } from '@/http/api';

export default function ViewTaskPage() {
    const { taskid } = useParams();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['view-single-task', taskid],
        queryFn: () => getSingleTask(taskid as string || ''),
        enabled: !!taskid,
    });

    if (isLoading)
        return (
            <div className="flex items-center justify-center h-60">
                <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
        );

    if (isError || error)
        return <p className="text-red-500 text-center">Error loading task.</p>;

    const task = data?.data.task;

    return (
        <div className="max-w-4xl mx-auto px-6 py-10 bg-white mt-20">
            <h1 className="text-4xl font-bold text-gray-800 mb-8">Task Details</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700 text-lg">
                <DetailItem icon={<ClipboardList className="text-blue-600" />} label="Title" value={task.title} />
                <DetailItem icon={<FileText className="text-blue-600" />} label="Description" value={task.description} />
                <DetailItem icon={<Calendar className="text-blue-600" />} label="Due Date" value={new Date(task.dueDate).toLocaleDateString()} />
                <DetailItem icon={<Flag className="text-blue-600" />} label="Priority" value={task.priority} />
                <DetailItem icon={<ClipboardList className="text-blue-600" />} label="Status" value={task.status} />
                <DetailItem icon={<User className="text-blue-600" />} label="Assigned By" value={task.assignerid} />
            </div>
        </div>
    );
}

function DetailItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-start gap-4">
            {icon}
            <div>
                <p className="font-medium text-gray-600">{label}:</p>
                <p className="text-gray-900 break-words">{value}</p>
            </div>
        </div>
    );
}
