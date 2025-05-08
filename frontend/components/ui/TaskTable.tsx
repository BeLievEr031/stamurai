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

interface Task {
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
                <TableBody>
                    {task.map((task) => (
                        <TableRow key={task.id}>
                            <TableCell className="flex items-center gap-3">
                                <FlagIcon className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <div className="font-medium">{task.title}</div>
                                    <div className="text-xs text-muted-foreground">{task.priority}</div>
                                </div>
                            </TableCell>
                            <TableCell>{task.status}</TableCell>
                            <TableCell>{task.dueDate}</TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <Button size="icon" variant="ghost">
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
