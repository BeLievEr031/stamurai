import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { FlagIcon, PencilIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

import React from 'react'
import { format } from "date-fns";
import { useRouter } from "next/navigation";

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
    return (
        <div className="mt-4 rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[40%]">Task</TableHead>
                        <TableHead className="w-[20%]">Status</TableHead>
                        <TableHead className="w-[20%]">Due Date</TableHead>
                        <TableHead className="w-[20%] text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody key={Date.now()}>
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
                                {format(task.dueDate, 'MMMM dd, yyyy')}
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <Button size="icon" variant="ghost" className="cursor-pointer" onClick={() => router.push(`/tasks/update-task?taskid=${task._id}`)}>
                                        <PencilIcon className="w-4 h-4 cursor-pointer" />
                                    </Button>
                                    <Button size="icon" variant="ghost">
                                        <TrashIcon className="w-4 h-4 cursor-pointer" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default TaskTable
