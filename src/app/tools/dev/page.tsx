import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { FileJson, Network, Regex, Key, Hash, Fingerprint, FileCode } from "lucide-react"

const tools = [
    {
        title: "JSON Tools",
        description: "Format, validate, diff, and convert JSON.",
        href: "/tools/dev/json",
        icon: FileJson,
    },
    {
        title: "API Request Tester",
        description: "Test HTTP requests with custom headers and body.",
        href: "/tools/dev/api-tester",
        icon: Network,
    },
    {
        title: "Regex Tester",
        description: "Validate and explain regular expressions.",
        href: "/tools/dev/regex",
        icon: Regex,
    },
    {
        title: "JWT Decoder",
        description: "Decode and inspect JWT tokens.",
        href: "/tools/dev/jwt",
        icon: Key,
    },
    {
        title: "Hash & Encode",
        description: "Base64, SHA, MD5, and HMAC tools.",
        href: "/tools/dev/hash",
        icon: Hash,
    },
    {
        title: "UUID Generator",
        description: "Generate UUIDs, ULIDs, and NanoIDs.",
        href: "/tools/dev/uuid",
        icon: Fingerprint,
    },
    {
        title: "Minifiers",
        description: "Minify HTML, CSS, JS, and optimize SVG.",
        href: "/tools/dev/minify",
        icon: FileCode,
    },
]

export default function DevToolsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Developer Tools</h1>
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
