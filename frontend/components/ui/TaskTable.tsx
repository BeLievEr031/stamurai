'use client'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Eye, FlagIcon, PencilIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

import React from 'react'
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTask } from "@/http/api";

interface Task {
    _id: string;
    id: string | number,
    title: string,
    priority: string,
    status: string,
    dueDate: string,
}

interface IProp {
    task: Task[]
}

function TaskTable({ task }: IProp) {
    const router = useRouter();
    const query = useQueryClient();
    const { mutate } = useMutation({
        mutationKey: ["delete-task"],
        mutationFn: deleteTask,
        onSuccess: () => {
            console.log("task deleted successfully.");
            query.invalidateQueries({ queryKey: ["fetch-tasks"] })
        }
    })
    return (
        <div className="mt-4">
            {/* Desktop Table */}
            <div className="hidden md:block rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[40%]">Task</TableHead>
                            <TableHead className="w-[20%]">Status</TableHead>
                            <TableHead className="w-[20%]">Due Date</TableHead>
                            <TableHead className="w-[20%] text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {task.map((task) => (
                            <TableRow key={task._id}>
                                <TableCell className="flex items-center gap-3">
                                    <FlagIcon className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <div className="font-medium">{task.title}</div>
                                        <div className="text-xs text-muted-foreground capitalize">{task.priority}</div>
                                    </div>
                                </TableCell>
                                <TableCell className="capitalize">{task.status}</TableCell>
                                <TableCell>
                                    {format(new Date(task.dueDate), 'MMMM dd, yyyy')}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button size="icon" variant="ghost" onClick={() => router.push(`/tasks/view-task/${task._id}`)}>
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                        <Button size="icon" variant="ghost" onClick={() => router.push(`/tasks/update-task?taskid=${task._id}`)}>
                                            <PencilIcon className="w-4 h-4" />
                                        </Button>
                                        <Button size="icon" variant="ghost" className="cursor-pointer" onClick={() => {
                                            mutate(task._id)
                                        }}>
                                            <TrashIcon className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
                {task.map((task) => (
                    <div key={task._id} className="border rounded-md p-4 shadow-sm bg-white">
                        <div className="flex items-center gap-2 mb-2">
                            <FlagIcon className="h-4 w-4 text-muted-foreground" />
                            <div className="font-medium text-base">{task.title}</div>
                        </div>
                        <div className="text-sm text-muted-foreground capitalize mb-1">
                            Priority: {task.priority}
                        </div>
                        <div className="text-sm mb-1 capitalize">
                            Status: {task.status}
                        </div>
                        <div className="text-sm mb-3">
                            Due: {format(new Date(task.dueDate), 'MMMM dd, yyyy')}
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button size="icon" variant="ghost" className="cursor-pointer" onClick={() => router.push(`/tasks/view-task/${task._id}`)}>
                                <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => router.push(`/tasks/update-task?taskid=${task._id}`)}>
                                <PencilIcon className="w-4 h-4" />
                            </Button>
                            <Button size="icon" variant="secondary" className="cursor-pointer" onClick={() => {
                                mutate(task._id)
                            }}>

                                <TrashIcon className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TaskTable;
