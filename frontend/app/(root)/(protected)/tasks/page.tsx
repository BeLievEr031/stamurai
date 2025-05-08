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
import { IPagination } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { getTasks } from "@/http/api";

// const mockTasks = [
//     {
//         id: 1,
//         title: "Design login page",
//         priority: "High",
//         status: "In Progress",
//         dueDate: "2024-06-10",
//         avatar: "/avatar1.png",
//     },
//     {
//         id: 2,
//         title: "Update API docs",
//         priority: "Medium",
//         status: "To Do",
//         dueDate: "2024-06-12",
//         avatar: "/avatar2.png",
//     },
//     {
//         id: 3,
//         title: "Fix bug #234",
//         priority: "High",
//         status: "Overdue",
//         dueDate: "2024-06-01",
//         avatar: "/avatar3.png",
//     },
//     {
//         id: 4,
//         title: "Fix bug #234",
//         priority: "High",
//         status: "Overdue",
//         dueDate: "2024-06-01",
//         avatar: "/avatar3.png",
//     },
//     {
//         id: 5,
//         title: "Fix bug #234",
//         priority: "High",
//         status: "Overdue",
//         dueDate: "2024-06-01",
//         avatar: "/avatar3.png",
//     },
//     {
//         id: 6,
//         title: "Fix bug #234",
//         priority: "High",
//         status: "Overdue",
//         dueDate: "2024-06-01",
//         avatar: "/avatar3.png",
//     },
// ];

export default function TasksPage() {
    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState<Date>();
    const [pagination, setPagination] = useState<IPagination>({
        page: "1",
        limit: "20",
        title: "",
        description: "",
        dueData: "",
        priority: "all",
        status: "all",
        tab: "all"
    });

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["fetch-tasks", pagination],
        queryFn: () => getTasks(pagination),
    })

    if (isLoading) {
        return <div>loading</div>
    }

    if (isError) {
        return <div>{error.message}</div>
    }


    return (
        <div className="p-6 space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Tasks</h2>

            <div className="flex justify-between items-center mb-4">
                <Button className="bg-black text-white cursor-pointer" onClick={() => router.push('/tasks/create-task')}>New Task</Button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input placeholder="Search by title or description" />

                <Select onValueChange={(value) => {
                    setPagination({ ...pagination, status: value })
                }}
                    value={pagination.status}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                </Select>

                <Select onValueChange={(value) => {
                    setPagination({ ...pagination, priority: value })
                }}
                    value={pagination.priority}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="All priorities" />
                        <FlagIcon className="ml-2 h-4 w-4 text-muted-foreground" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                </Select>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="justify-start">

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
            <Tabs defaultValue="all" value={pagination.tab}
                onValueChange={(value) => setPagination({ ...pagination, tab: value })}
            >
                <TabsList className="mt-4">
                    <TabsTrigger value="all">All Task</TabsTrigger>
                    <TabsTrigger value="assigned">Assigned to Me</TabsTrigger>
                    <TabsTrigger value="created">Created by Me</TabsTrigger>
                    <TabsTrigger value="overdue">Overdue</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="p-2 text-xl font-semibold">
                    {data?.data && data?.data.task.tasks.length > 0 ? <TaskTable task={data?.data.task.tasks} /> : "No task found here."}
                </TabsContent>

                <TabsContent value="assigned" className="p-2 text-xl font-semibold">
                    {data?.data && data?.data.task.tasks.length > 0 ? <TaskTable task={data?.data.task.tasks} /> : "No task found here."}
                </TabsContent>

                <TabsContent value="created" className="p-2 text-xl font-semibold">
                    {data?.data && data?.data.task.tasks.length > 0 ? <TaskTable task={data?.data.task.tasks} /> : "No task found here."}

                </TabsContent>

                <TabsContent value="overdue" className="p-2 text-xl font-semibold">
                    {data?.data && data?.data.task.tasks.length > 0 ? <TaskTable task={data?.data.task.tasks} /> : "No task found here."}
                </TabsContent>
            </Tabs>
        </div>
    );
}
