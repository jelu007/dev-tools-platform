"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Code, Server, TestTube, Home, Sparkles, Github, Twitter, Heart, ExternalLink, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname()

    const routes = [
        {
            label: "Home",
            icon: Home,
            href: "/",
            color: "text-sky-500",
            bgGradient: "from-sky-500/10 to-blue-500/10",
            badge: null
        },
        {
            label: "Developer Tools",
            icon: Code,
            href: "/tools/dev",
            color: "text-violet-500",
            bgGradient: "from-violet-500/10 to-purple-500/10",
            badge: "11",
            description: "JSON, API, Regex, JWT"
        },
        {
            label: "DevOps Tools",
            icon: Server,
            href: "/tools/devops",
            color: "text-pink-600",
            bgGradient: "from-pink-500/10 to-rose-500/10",
            badge: "8",
            description: "K8s, CI/CD, Docker"
        },
        {
            label: "Tester Tools",
            icon: TestTube,
            href: "/tools/test",
            color: "text-orange-600",
            bgGradient: "from-orange-500/10 to-amber-500/10",
            badge: "5",
            description: "Data, Webhooks, Performance"
        },
    ]

    const quickLinks = [
        { label: "JSON Formatter", href: "/tools/dev/json" },
        { label: "API Tester", href: "/tools/dev/api-tester" },
        { label: "JWT Decoder", href: "/tools/dev/jwt" },
        { label: "K8s Generator", href: "/tools/devops/k8s" },
    ]

    return (
        <div className={cn("pb-12 bg-background border-r", className)}>
            <ScrollArea className="h-full">
                <div className="space-y-6 py-6">
                    {/* Logo/Brand Section */}
                    <div className="px-6">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="h-10 w-10 rounded-lg overflow-hidden flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <Image src="/logo.png" alt="DevStack" width={40} height={40} priority />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                                    DevStack
                                </h2>
                                <p className="text-xs text-muted-foreground">Developer Tools</p>
                            </div>
                        </Link>
                    </div>

                    {/* Main Navigation */}
                    <div className="px-3">
                        <div className="space-y-1">
                            {routes.map((route) => {
                                const isActive = pathname === route.href || pathname.startsWith(route.href + "/")
                                return (
                                    <Button
                                        key={route.href}
                                        variant={isActive ? "secondary" : "ghost"}
                                        className={cn(
                                            "w-full justify-start h-auto py-3 px-3 group relative overflow-hidden transition-all duration-300",
                                            isActive && "bg-secondary shadow-sm"
                                        )}
                                        asChild
                                    >
                                        <Link href={route.href}>
                                            {/* Gradient overlay on hover */}
                                            {!isActive && (
                                                <div className={cn(
                                                    "absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                                                    route.bgGradient
                                                )} />
                                            )}
                                            
                                            <div className="relative z-10 flex items-center justify-between w-full">
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "h-9 w-9 rounded-lg flex items-center justify-center transition-all duration-300",
                                                        isActive 
                                                            ? `bg-gradient-to-br ${route.bgGradient} shadow-md` 
                                                            : "group-hover:scale-110"
                                                    )}>
                                                        <route.icon className={cn(
                                                            "h-4 w-4 transition-colors",
                                                            isActive ? route.color : "text-muted-foreground group-hover:" + route.color.split('-')[0] + "-" + route.color.split('-')[1]
                                                        )} />
                                                    </div>
                                                    <div className="text-left">
                                                        <div className="font-medium text-sm">{route.label}</div>
                                                        {route.description && (
                                                            <div className="text-xs text-muted-foreground">
                                                                {route.description}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center gap-2">
                                                    {route.badge && (
                                                        <Badge variant="secondary" className="text-xs px-1.5 py-0">
                                                            {route.badge}
                                                        </Badge>
                                                    )}
                                                    {isActive && (
                                                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    </Button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="px-3">
                        <div className="px-3 mb-2">
                            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Quick Access
                            </h3>
                        </div>
                        <div className="space-y-1">
                            {quickLinks.map((link) => (
                                <Button
                                    key={link.href}
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start text-xs h-8 px-3 text-muted-foreground hover:text-foreground"
                                    asChild
                                >
                                    <Link href={link.href}>
                                        <ChevronRight className="h-3 w-3 mr-2" />
                                        {link.label}
                                    </Link>
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Stats Card */}
                    <div className="mx-3 p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Total Tools</span>
                                <Badge variant="secondary" className="font-bold">24+</Badge>
                            </div>
                            <div className="space-y-1.5 text-xs text-muted-foreground">
                                <div className="flex justify-between">
                                    <span>Developer</span>
                                    <span className="font-medium text-foreground">11</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>DevOps</span>
                                    <span className="font-medium text-foreground">8</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tester</span>
                                    <span className="font-medium text-foreground">5</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feature Highlight */}
                    <div className="mx-3 p-4 rounded-lg bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20">
                        <div className="flex items-start gap-3">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                                <Sparkles className="h-4 w-4 text-white" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-sm font-semibold">100% Private</h4>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    All processing happens in your browser. Your data never leaves your machine.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 pt-4 border-t">
                        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                            <span>Made with</span>
                            <Heart className="h-3 w-3 fill-red-500 text-red-500" />
                            <span>for developers</span>
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    )
}