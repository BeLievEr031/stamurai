"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getStat } from "@/http/api";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
export default function DashboardPage() {
    const { data } = useQuery({
        queryKey: ['get-stat'],
        queryFn: getStat
    })


    const stat = {
        assignedToMe: data?.data.stat.assignedToMe || 0,
        createdByMe: data?.data.stat.createdByMe || 0,
        overdue: data?.data.stat.overdue || 0,
    };

    const graphData = {
        labels: ['Assigned To Me', 'Created By Me', 'Overdue'],
        datasets: [
            {
                label: 'Task Statistics',
                data: [stat.assignedToMe, stat.createdByMe, stat.overdue],
                backgroundColor: ['#3b82f6', '#10b981', '#ef4444'],
                borderRadius: 8,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Task Overview',
                font: { size: 20 },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                },
            },
        },
    };

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
            <div className="max-w-3xl mt-20 bg-white p-6">
                <Bar data={graphData} options={options} />
            </div>
        </div >

    );
}
