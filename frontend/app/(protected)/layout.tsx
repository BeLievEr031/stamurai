'use client'
import { useState } from 'react'
import Link from 'next/link'
import {
    LayoutDashboard,
    ClipboardList,
    Users,
    Bell,
    // Settings,
    ChevronLeft,
    ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [collapsed, setCollapsed] = useState(false)

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div className={cn(
                "bg-white border-r transition-all duration-300 ease-in-out",
                collapsed ? "w-20" : "w-64"
            )}>
                <div className="flex flex-col h-full p-4">
                    {/* Logo */}
                    <div className="flex items-center justify-between mb-8">
                        {!collapsed && <h1 className="text-xl font-bold text-blue-600">TaskFlow</h1>}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setCollapsed(!collapsed)}
                            className="p-1"
                        >
                            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                        </Button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-2">
                        <Link href="/dashboard" className={cn(
                            "flex items-center p-3 rounded-lg hover:bg-blue-50",
                            collapsed ? "justify-center" : "space-x-3"
                        )}>
                            <LayoutDashboard className="text-blue-600" size={20} />
                            {!collapsed && <span>Overview</span>}
                        </Link>

                        <Link href="/tasks" className={cn(
                            "flex items-center p-3 rounded-lg hover:bg-blue-50",
                            collapsed ? "justify-center" : "space-x-3"
                        )}>
                            <ClipboardList className="text-gray-600" size={20} />
                            {!collapsed && <span>Tasks</span>}
                        </Link>

                        <Link href="/teams" className={cn(
                            "flex items-center p-3 rounded-lg hover:bg-blue-50",
                            collapsed ? "justify-center" : "space-x-3"
                        )}>
                            <Users className="text-gray-600" size={20} />
                            {!collapsed && <span>Team</span>}
                        </Link>

                        <Link href="/dashboard/notifications" className={cn(
                            "flex items-center p-3 rounded-lg hover:bg-blue-50",
                            collapsed ? "justify-center" : "space-x-3"
                        )}>
                            <Bell className="text-gray-600" size={20} />
                            {!collapsed && <span>Notifications</span>}
                        </Link>
                    </nav>

                    {/* Profile */}
                    <div className={cn(
                        "mt-auto pt-4 border-t flex items-center",
                        collapsed ? "flex-col justify-center" : "space-x-3"
                    )}>
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                            AM
                        </div>
                        {!collapsed && (
                            <div>
                                <p className="font-medium">Alex Morgan</p>
                                <p className="text-xs text-gray-500">Product Manager</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                {children}
            </div>
        </div>
    )
}