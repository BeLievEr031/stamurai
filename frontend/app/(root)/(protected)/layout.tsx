'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
    LayoutDashboard,
    ClipboardList,
    Users,
    Bell,
    // Settings,
    ChevronLeft,
    ChevronRight,
    LogOut
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { useMutation } from '@tanstack/react-query'
import { logout } from '@/http/api'
import { Badge } from '@/components/ui/badge'
import { useNotificationStore } from '@/store/useNotificationStore'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {

    const [collapsed, setCollapsed] = useState(false)
    const router = useRouter()
    const { user, logout: userLogout } = useAuthStore();
    const { notification } = useNotificationStore();
    useEffect(() => {
        console.log(user);
        if (!user) {
            router.push("/login")
        }
    }, [router, user])

    const { mutate } = useMutation({
        mutationKey: ['logout'],
        mutationFn: logout,
        onSuccess: () => {
            userLogout();
        }
    })

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div className={cn(
                "bg-white border-r transition-all duration-300 ease-in-out",
                collapsed ? "w-20" : "w-64"
            )}>
                <Link href={"/login"}>Login</Link>
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

                        <Link
                            href="/notification"
                            className={cn(
                                "flex items-center justify-between p-3 rounded-lg hover:bg-blue-100 transition-colors",
                                collapsed ? "justify-center" : "space-x-3"
                            )}
                        >
                            <div className={cn("flex items-center", collapsed ? "justify-center w-full" : "space-x-3")}>
                                <Bell className="text-gray-600" size={20} />
                                {!collapsed && <span className="text-gray-700 font-medium">Notifications</span>}
                            </div>

                            {notification.length > 0 && <Badge variant="destructive" className="ml-auto h-5 w-5 text-sm">
                                {notification.length}
                            </Badge>}
                        </Link>

                    </nav>

                    {/* Profile */}
                    {/* <div className={cn(
                        "mt-auto pt-4 border-t flex items-center",
                        collapsed ? "flex-col justify-center" : "space-x-3"
                    )}>
                        {!collapsed && (
                            <div>
                                <p className="font-medium">{user?.name}</p>
                            </div>
                        )}
                    </div> */}
                    <Button className='cursor-pointer' onClick={() => mutate()}>
                        <LogOut className="text-gray-600" size={20} />
                        {!collapsed && <span>Logout</span>}
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                {children}
            </div>
        </div>
    )
}