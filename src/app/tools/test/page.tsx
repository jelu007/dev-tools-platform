import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Webhook, Database, Timer, Code2, Globe } from "lucide-react"

const tools = [
    {
        title: "Test Data Generator",
        description: "Generate fake data for testing.",
        href: "/tools/test/data",
        icon: Database,
    },
    {
        title: "Webhook Tester",
        description: "Test webhooks with temporary URLs.",
        href: "/tools/test/webhook",
        icon: Webhook,
    },
    {
        title: "Performance Tester",
        description: "Benchmark API response times.",
        href: "/tools/test/performance",
        icon: Timer,
    },
    {
        title: "XPath/CSS Tester",
        description: "Test XPath and CSS selectors.",
        href: "/tools/test/selectors",
        icon: Code2,
    },
    {
        title: "Browser Inspector",
        description: "Inspect browser capabilities.",
        href: "/tools/test/browser",
        icon: Globe,
    },
]

export default function TestToolsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Tester Tools</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tools.map((tool) => (
                    <Link key={tool.href} href={tool.href}>
                        <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
                            <CardHeader>
                                <tool.icon className="h-8 w-8 mb-2 text-primary" />
                                <CardTitle>{tool.title}</CardTitle>
                                <CardDescription>{tool.description}</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}
