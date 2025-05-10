/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
'use client';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getSingleTask, updateTask } from '@/http/api';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

// Zod Schema
const taskSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().min(5, 'Description must be at least 5 characters').max(500),
    assignerid: z.string().optional(),
    dueDate: z.preprocess(
        (value) => {
            if (typeof value === 'string' || value instanceof Date) {
                const date = new Date(value);
                return isNaN(date.getTime()) ? undefined : date;
            }

            // return undefined;
            const date = new Date(value as string);
            return isNaN(date.getTime()) ? undefined : date;
        },
        z.date({ required_error: 'Due date is required', invalid_type_error: 'Invalid date format' })
    ),
    priority: z.string(),
    status: z.string(),
});

// type TaskFormValues = z.infer<typeof taskSchema>;


type TaskFormValues = {
    title: string;
    description: string;
    assignerid: string;
    dueDate: Date | unknown | null | undefined;
    priority: string;
    status: string;
};

export default function UpdateTask() {
    const router = useRouter();
    const { user } = useAuthStore();
    const searchParam = useSearchParams();
    const taskid = searchParam.get('taskid');

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['single-task', taskid],
        queryFn: () => getSingleTask(taskid || ''),
        enabled: !!taskid,
    });

    const { mutate } = useMutation({
        mutationKey: ['update-task'],
        mutationFn: updateTask,
        onSuccess: () => {
            router.push('/tasks');
        },
    });

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<TaskFormValues>({
        resolver: zodResolver(taskSchema),
    });

    useEffect(() => {
        if (data?.data.task) {
            const task = data.data.task;

            setValue('title', task.title || '');
            setValue('description', task.description || '');
            setValue('assignerid', task.assignerid || '');
            setValue('priority', task.priority?.toLowerCase() || 'low');
            setValue('status', task.status?.toLowerCase() || 'pending');

            // Format dueDate to YYYY-MM-DD string
            if (task.dueDate) {
                const date = new Date(task.dueDate);
                date.setMinutes(date.getMinutes() - date.getTimezoneOffset()); // Normalize to local date
                const formatted = date.toISOString().split('T')[0]; // "YYYY-MM-DD"
                setValue('dueDate', formatted); // Set Date object as required by schema
            }
        }
    }, [data?.data.task, setValue]);

    function onSubmit(formData: TaskFormValues) {
        if (taskid && user?.userid) {
            const updatedData = {
                ...formData,
                userid: user.userid,
            };
            mutate({
                taskid,
                data: updatedData,
            });
        }
    }

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>{error.message}</div>;

    return (
        <div className="max-w-3xl mx-auto pt-10">
            <h1 className="text-3xl font-semibold mb-6 text-gray-800">Update Task</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Title */}
                <div>
                    <label className="block font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        {...register('title')}
                        className="w-full p-3 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter task title"
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                </div>

                {/* Description */}
                <div>
                    <label className="block font-medium text-gray-700">Description</label>
                    <textarea
                        rows={4}
                        {...register('description')}
                        className="w-full p-3 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Describe the task"
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                </div>

                <div className='grid grid-cols-2 gap-2'>

                    {/* Assigner ID */}
                    <div>
                        <label className="block font-medium text-gray-700">Assigner ID</label>
                        <input
                            type="text"
                            {...register('assignerid')}
                            className="w-full p-3 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter assigner ID"
                        />
                        {errors.assignerid && <p className="text-red-500 text-sm mt-1">{errors.assignerid.message}</p>}
                    </div>

                    {/* Due Date */}
                    <div>
                        <label className="block font-medium text-gray-700">Due Date</label>
                        <input
                            type="date"
                            {...register('dueDate')}
                            className="w-full p-3 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.dueDate && <p className="text-red-500 text-sm mt-1">{errors.dueDate.message}</p>}
                    </div>

                    {/* Priority */}
                    <div>
                        <label className="block font-medium text-gray-700">Priority</label>
                        <select
                            {...register('priority')}
                            className="w-full p-3 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                        {errors.priority && <p className="text-red-500 text-sm mt-1">{errors.priority.message}</p>}
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block font-medium text-gray-700">Status</label>
                        <select
                            {...register('status')}
                            className="w-full p-3 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                        {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>}
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 mt-6">
                    <button
                        type="submit"
                        className="w-full sm:w-auto py-3 px-6 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition-colors"
                    >
                        Update Task
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push('/tasks')}
                        className="w-full sm:w-auto py-3 px-6 bg-gray-200 text-gray-700 font-semibold rounded-md shadow-md hover:bg-gray-300 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
