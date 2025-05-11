'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
    LayoutDashboard,
    ClipboardList,
    Users,
    Bell,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Menu
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useRouter, usePathname } from 'next/navigation'
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
    const [mobileOpen, setMobileOpen] = useState(false)
    const router = useRouter()
    const pathname = usePathname()

    const { user, logout: userLogout } = useAuthStore()
    const { notification } = useNotificationStore()

    useEffect(() => {
        if (!user) {
            router.push("/login")
        }
    }, [router, user])

    const { mutate } = useMutation({
        mutationKey: ['logout'],
        mutationFn: logout,
        onSuccess: () => {
            userLogout()
        }
    })

    const linkClass = (isActive: boolean) =>
        cn(
            "flex items-center p-3 rounded-lg hover:bg-blue-50",
            collapsed ? "justify-center" : "space-x-3",
            isActive && "bg-blue-100 text-blue-700 font-semibold"
        )

    const iconClass = (isActive: boolean) =>
        cn(isActive ? "text-blue-700" : "text-gray-600")

    const SidebarContent = (
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
                <Link href="/dashboard" className={linkClass(pathname === "/dashboard")} onClick={() => setMobileOpen(false)}>
                    <LayoutDashboard className={iconClass(pathname === "/dashboard")} size={20} />
                    {!collapsed && <span>Overview</span>}
                </Link>

                <Link href="/tasks" className={linkClass(pathname.startsWith("/tasks"))} onClick={() => setMobileOpen(false)}>
                    <ClipboardList className={iconClass(pathname.startsWith("/tasks"))} size={20} />
                    {!collapsed && <span>Tasks</span>}
                </Link>

                <Link href="/teams" className={linkClass(pathname === "/teams")} onClick={() => setMobileOpen(false)}>
                    <Users className={iconClass(pathname === "/teams")} size={20} />
                    {!collapsed && <span>Team</span>}
                </Link>

                <Link href="/notification" className={linkClass(pathname === "/notification")} onClick={() => setMobileOpen(false)}>
                    <div className={cn("flex items-center", collapsed ? "justify-center w-full" : "space-x-3")}>
                        <Bell className={iconClass(pathname === "/notification")} size={20} />
                        {!collapsed && <span className="text-gray-700 font-medium">Notifications</span>}
                    </div>
                    {notification.length > 0 && (
                        <Badge variant="destructive" className="ml-auto h-5 w-5 text-sm">
                            {notification.length}
                        </Badge>
                    )}
                </Link>
            </nav>

            {/* Logout */}
            <Button className='cursor-pointer mt-auto' onClick={() => {
                setMobileOpen(false)
                mutate()
            }}>
                <LogOut className="text-gray-600" size={20} />
                {!collapsed && <span className="ml-2">Logout</span>}
            </Button>
        </div>
    )

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Mobile Sidebar Backdrop */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed z-40 h-full bg-white border-r transition-all duration-300 ease-in-out",
                collapsed ? "w-20" : "w-64",
                mobileOpen ? "left-0" : "-left-full",
                "lg:static lg:left-0"
            )}>
                {SidebarContent}
            </aside>

            {/* Content */}
            <div className="flex-1 flex flex-col overflow-auto">
                {/* Top bar for mobile */}
                <div className="p-4 border-b bg-white lg:hidden flex items-center justify-between">
                    <Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)}>
                        <Menu size={24} />
                    </Button>
                    <h1 className="text-lg font-bold">TaskFlow</h1>
                    <div className="w-6" /> {/* spacer */}
                </div>

                {/* Main content */}
                <main className="flex-1 overflow-auto">{children}</main>
            </div>
        </div>
    )
}
