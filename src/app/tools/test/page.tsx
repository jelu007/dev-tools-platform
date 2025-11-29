import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Webhook, Database, Timer, Code2, Globe, ArrowRight, Sparkles, CheckCircle2, Zap } from "lucide-react"
// If Badge exists elsewhere, update the path accordingly, for example:
import { Badge } from "@/components/ui/badge"
// If Badge does not exist, you can create a simple Badge component as a temporary fix:
//
// Uncomment below if you need a quick Badge component:
//
// import React from "react";
//
// export function Badge({ children, className, variant = "default" }: { children: React.ReactNode, className?: string, variant?: string }) {
//     return (
//         <span className={`inline-block px-2 py-0.5 rounded-full bg-gray-200 text-xs font-semibold ${className}`}>
//             {children}
//         </span>
//     );
// }

const tools = [
    {
        title: "Test Data Generator",
        description: "Generate fake data for testing.",
        href: "/tools/test/data",
        icon: Database,
        gradient: "from-blue-500 to-cyan-600",
        features: ["User profiles", "Addresses", "Custom schemas"],
        badge: "Popular"
    },
    {
        title: "Webhook Tester",
        description: "Test webhooks with temporary URLs.",
        href: "/tools/test/webhook",
        icon: Webhook,
        gradient: "from-purple-500 to-pink-600",
        features: ["Temporary URLs", "Request history", "Real-time logs"],
        badge: "New"
    },
    {
        title: "Performance Tester",
        description: "Benchmark API response times.",
        href: "/tools/test/performance",
        icon: Timer,
        gradient: "from-orange-500 to-red-600",
        features: ["Response times", "Throughput", "Latency analysis"]
    },
    {
        title: "XPath/CSS Tester",
        description: "Test XPath and CSS selectors.",
        href: "/tools/test/selectors",
        icon: Code2,
        gradient: "from-green-500 to-emerald-600",
        features: ["Live preview", "Syntax validation", "Match highlighting"]
    },
    {
        title: "Browser Inspector",
        description: "Inspect browser capabilities.",
        href: "/tools/test/browser",
        icon: Globe,
        gradient: "from-indigo-500 to-blue-600",
        features: ["User agent", "Features", "Screen info"]
    },
]

const benefits = [
    {
        icon: Zap,
        title: "Instant Testing",
        description: "Test in real-time without deployment"
    },
    {
        icon: CheckCircle2,
        title: "Quality Assurance",
        description: "Catch issues before production"
    },
    {
        icon: Sparkles,
        title: "Developer Friendly",
        description: "Intuitive interfaces for quick testing"
    }
]

export default function TestToolsPage() {
    return (
        <div className="space-y-12">
            {/* Header Section */}
            <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-orange-500/10 text-sm font-medium text-orange-600 border border-orange-500/20">
                    <Sparkles className="h-4 w-4" />
                    <span>Testing & Quality Assurance</span>
                </div>
                
                <div className="space-y-3">
                    <h1 className="text-4xl font-bold tracking-tight lg:text-5xl bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                        Tester Tools
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-3xl">
                        Comprehensive testing utilities for data generation, webhook testing, performance benchmarking, and browser inspection.
                    </p>
                </div>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start space-x-3 p-4 rounded-lg bg-muted/30 border">
                        <div className={`h-10 w-10 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center flex-shrink-0`}>
                            <benefit.icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold mb-1">{benefit.title}</h3>
                            <p className="text-sm text-muted-foreground">{benefit.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tools Grid */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Available Tools</h2>
                    <span className="text-sm text-muted-foreground">{tools.length} tools</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tools.map((tool) => (
                        <Link key={tool.href} href={tool.href} className="group">
                            <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer h-full border-2 hover:border-orange-500/50 hover:-translate-y-1 relative overflow-hidden">
                                {/* Gradient Overlay */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                                
                                <CardHeader className="relative z-10 space-y-4">
                                    {/* Icon and Badge Row */}
                                    <div className="flex items-start justify-between">
                                        <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                            <tool.icon className="h-6 w-6 text-white" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {tool.badge && (
                                                <Badge variant="secondary" className="text-xs font-semibold">
                                                    {tool.badge}
                                                </Badge>
                                            )}
                                            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 group-hover:text-orange-600 transition-all duration-300" />
                                        </div>
                                    </div>

                                    {/* Title and Description */}
                                    <div className="space-y-2">
                                        <CardTitle className="text-xl group-hover:text-orange-600 transition-colors">
                                            {tool.title}
                                        </CardTitle>
                                        <CardDescription className="text-base">
                                            {tool.description}
                                        </CardDescription>
                                    </div>

                                    {/* Features List */}
                                    <div className="pt-2 space-y-2">
                                        {tool.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                                                <span>{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardHeader>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Quick Tips */}
            <div className="border-t pt-8">
                <div className="rounded-xl bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-orange-500/20 p-6">
                    <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center flex-shrink-0">
                            <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold">Testing Best Practices</h3>
                            <p className="text-muted-foreground">
                                Use test data generators to create realistic datasets, validate webhooks before deployment, 
                                benchmark performance regularly, and test selectors in isolation to ensure reliability.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}