"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Code, Server, TestTube, Settings, Home } from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname()

    const routes = [
        {
            label: "Home",
            icon: Home,
            href: "/",
            color: "text-sky-500",
        },
        {
            label: "Developer Tools",
            icon: Code,
            href: "/tools/dev",
            color: "text-violet-500",
        },
        {
            label: "DevOps Tools",
            icon: Server,
            href: "/tools/devops",
            color: "text-pink-700",
        },
        {
            label: "Tester Tools",
            icon: TestTube,
            href: "/tools/test",
            color: "text-orange-700",
        },
    ]

    return (
        <div className={cn("pb-12 bg-background", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                        DevTools
                    </h2>
                    <div className="space-y-1">
                        {routes.map((route) => (
                            <Button
                                key={route.href}
                                variant={pathname === route.href ? "secondary" : "ghost"}
                                className="w-full justify-start"
                                asChild
                            >
                                <Link href={route.href}>
                                    <route.icon className={cn("mr-2 h-4 w-4", route.color)} />
                                    {route.label}
                                </Link>
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
