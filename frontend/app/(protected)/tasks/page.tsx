'use client'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, FilterIcon, Flag, FlagIcon, PencilIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation"

export default function TasksPage() {
    const [date, setDate] = useState<Date | undefined>();
    const router = useRouter();
    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Tasks</h2>

            <div className="flex justify-between items-center mb-4">
                <Button className="bg-black text-white cursor-pointer" onClick={() => router.push('/tasks/create-task')}>New Task</Button>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-6">
                <Input placeholder="Search by title or description" className="col-span-1" />

                <div className="relative">
                    <Input placeholder="All statuses" className="pr-8" />
                    <FilterIcon className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>

                <div className="relative">
                    <Input placeholder="All priorities" className="pr-8" />
                    <FlagIcon className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                        >
                            <span>Any date</span>
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                    </PopoverContent>
                </Popover>
            </div>

            <Tabs defaultValue="assigned">
                <TabsList className="mb-4">
                    <TabsTrigger value="assigned">Assigned to Me</TabsTrigger>
                    <TabsTrigger value="created">Created by Me</TabsTrigger>
                    <TabsTrigger value="overdue">Overdue</TabsTrigger>
                </TabsList>
                <TabsContent value="assigned">
                    <div className="border rounded-lg">
                        <div className="grid grid-cols-6 gap-4 px-4 py-2 font-medium border-b">
                            <div className="col-span-2">Title</div>
                            <div>Status</div>
                            <div>Priority</div>
                            <div>Due Date</div>
                            <div className="text-right">Actions</div>
                        </div>
                        {[
                            {
                                title: "Design login page",
                                status: "In Progress",
                                priority: "High",
                                due: "2024-06-10",
                                avatar: "/avatar1.jpg"
                            },
                            {
                                title: "Update API docs",
                                status: "To Do",
                                priority: "Medium",
                                due: "2024-06-12",
                                avatar: "/avatar2.jpg"
                            },
                            {
                                title: "Fix bug #234",
                                status: "Overdue",
                                priority: "High",
                                due: "2024-06-01",
                                avatar: "/avatar3.jpg"
                            }
                        ].map((task, idx) => (
                            <div
                                key={idx}
                                className="grid grid-cols-6 gap-4 px-4 py-3 items-center border-b"
                            >
                                <div className="flex items-center col-span-2 gap-2">
                                    <Flag size={15} color={task.priority == "High" ? "red" : task.priority == "Low" ? "green" : "Yellow"} />
                                    <span>{task.title}</span>
                                </div>
                                <div>{task.priority}</div>
                                <div>{task.status}</div>
                                <div>{task.due}</div>
                                <div className="flex justify-end gap-2">
                                    <PencilIcon className="w-4 h-4 cursor-pointer" />
                                    <TrashIcon className="w-4 h-4 cursor-pointer" />
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
