"use client";

import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { CalendarIcon, FlagIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import TaskTable from "@/components/ui/TaskTable";

const mockTasks = [
    {
        id: 1,
        _id: "hjhjk",
        title: "Design login page",
        priority: "High",
        status: "In Progress",
        dueDate: "2024-06-10",
        avatar: "/avatar1.png",
    },
];

export default function DashboardPage() {
    const [selectedDate, setSelectedDate] = useState<Date>();

    return (
        <div className="p-6 space-y-6 h-screen overflow-scroll">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <p className="text-muted-foreground text-sm mb-1">Assigned to me</p>
                        <h2 className="text-2xl font-bold">8 Tasks</h2>
                        <p className="text-sm text-muted-foreground">Tasks currently assigned to you</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <p className="text-muted-foreground text-sm mb-1">Created by me</p>
                        <h2 className="text-2xl font-bold">5 Tasks</h2>
                        <p className="text-sm text-muted-foreground">Tasks you have created</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <p className="text-muted-foreground text-sm mb-1">Overdue</p>
                        <h2 className="text-2xl font-bold">2 Tasks</h2>
                        <p className="text-sm text-muted-foreground">Tasks past due date</p>
                    </CardContent>
                </Card>
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
                            {/* {selectedDate ? format(selectedDate, "yyyy-MM-dd") : "Any date"} */}
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
