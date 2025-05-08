'use client'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, FlagIcon, } from "lucide-react";
import { useState } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import TaskTable from "@/components/ui/TaskTable";
import { useRouter } from "next/navigation";

const mockTasks = [
    {
        id: 1,
        title: "Design login page",
        priority: "High",
        status: "In Progress",
        dueDate: "2024-06-10",
        avatar: "/avatar1.png",
    },
    {
        id: 2,
        title: "Update API docs",
        priority: "Medium",
        status: "To Do",
        dueDate: "2024-06-12",
        avatar: "/avatar2.png",
    },
    {
        id: 3,
        title: "Fix bug #234",
        priority: "High",
        status: "Overdue",
        dueDate: "2024-06-01",
        avatar: "/avatar3.png",
    },
    {
        id: 4,
        title: "Fix bug #234",
        priority: "High",
        status: "Overdue",
        dueDate: "2024-06-01",
        avatar: "/avatar3.png",
    },
    {
        id: 5,
        title: "Fix bug #234",
        priority: "High",
        status: "Overdue",
        dueDate: "2024-06-01",
        avatar: "/avatar3.png",
    },
    {
        id: 6,
        title: "Fix bug #234",
        priority: "High",
        status: "Overdue",
        dueDate: "2024-06-01",
        avatar: "/avatar3.png",
    },
];

export default function TasksPage() {
    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState<Date>();

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Tasks</h2>

            <div className="flex justify-between items-center mb-4">
                <Button className="bg-black text-white cursor-pointer" onClick={() => router.push('/tasks/create-task')}>New Task</Button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input placeholder="Search by title or description" />

                <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                </Select>

                <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="All priorities" />
                        <FlagIcon className="ml-2 h-4 w-4 text-muted-foreground" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                </Select>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="justify-start">
                            {/* {selectedDate ? format(selectedDate, "yyyy-MM-dd") : "Any date"}
                             */}
                            Any Date
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                    </PopoverContent>
                </Popover>
            </div>

            {/* Tabs and Tasks */}
            <Tabs defaultValue="assigned">
                <TabsList className="mt-4">
                    <TabsTrigger value="assigned">Assigned to Me</TabsTrigger>
                    <TabsTrigger value="created">Created by Me</TabsTrigger>
                    <TabsTrigger value="overdue">Overdue</TabsTrigger>
                </TabsList>

                <TabsContent value="assigned">
                    <TaskTable task={mockTasks} />
                </TabsContent>

                <TabsContent value="created">
                    <p className="text-muted-foreground mt-4">Created tasks go here...</p>
                </TabsContent>

                <TabsContent value="overdue">
                    <p className="text-muted-foreground mt-4">Overdue tasks go here...</p>
                </TabsContent>
            </Tabs>
        </div>
    );
}
