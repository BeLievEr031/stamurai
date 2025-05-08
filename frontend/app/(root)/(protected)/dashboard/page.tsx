"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getStat } from "@/http/api";
export default function DashboardPage() {
    const { data } = useQuery({
        queryKey: ['get-stat'],
        queryFn: getStat
    })

    return (
        <div className="p-6 space-y-6 h-screen overflow-scroll">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <p className="text-muted-foreground text-sm mb-1">Assigned to me</p>
                        <h2 className="text-2xl font-bold">{data?.data.stat && data?.data.stat.assignedToMe} Tasks</h2>
                        <p className="text-sm text-muted-foreground">Tasks currently assigned to you</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <p className="text-muted-foreground text-sm mb-1">Created by me</p>
                        <h2 className="text-2xl font-bold">{data?.data.stat && data?.data.stat.createdByMe} Tasks</h2>
                        <p className="text-sm text-muted-foreground">Tasks you have created</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <p className="text-muted-foreground text-sm mb-1">Overdue</p>
                        <h2 className="text-2xl font-bold">{data?.data.stat && data?.data.stat.overdue} Tasks</h2>
                        <p className="text-sm text-muted-foreground">Tasks past due date</p>
                    </CardContent>
                </Card>
            </div>

        </div >

    );
}
