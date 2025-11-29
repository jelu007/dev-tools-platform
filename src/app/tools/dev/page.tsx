import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { FileJson, Network, Regex, Key, Hash, Fingerprint, FileCode, GitCompare, FileMinus, ArrowRight, Sparkles, Code2, Zap, Lock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const tools = [
    {
        title: "JSON Tools",
        description: "Format, validate, diff, and convert JSON.",
        href: "/tools/dev/json",
        icon: FileJson,
        gradient: "from-blue-500 to-cyan-600",
        features: ["Format & beautify", "Validate syntax", "JSON to YAML"],
        badge: "Most Used",
        category: "Data Format"
    },
    {
        title: "API Request Tester",
        description: "Test HTTP requests with custom headers and body.",
        href: "/tools/dev/api-tester",
        icon: Network,
        gradient: "from-green-500 to-emerald-600",
        features: ["All HTTP methods", "Custom headers", "Response preview"],
        badge: "Popular",
        category: "API Testing"
    },
    {
        title: "Regex Tester",
        description: "Validate and explain regular expressions.",
        href: "/tools/dev/regex",
        icon: Regex,
        gradient: "from-orange-500 to-red-600",
        features: ["Live testing", "Match highlighting", "Explanation"],
        category: "Text Processing"
    },
    {
        title: "JWT Decoder",
        description: "Decode and inspect JWT tokens.",
        href: "/tools/dev/jwt",
        icon: Key,
        gradient: "from-purple-500 to-pink-600",
        features: ["Decode tokens", "Verify signature", "Claims viewer"],
        badge: "Popular",
        category: "Security"
    },
    {
        title: "Hash & Encode",
        description: "Base64, SHA, MD5, and HMAC tools.",
        href: "/tools/dev/hash",
        icon: Hash,
        gradient: "from-indigo-500 to-blue-600",
        features: ["Multiple algorithms", "Base64 encode", "HMAC support"],
        category: "Encoding"
    },
    {
        title: "UUID Generator",
        description: "Generate UUIDs, ULIDs, and NanoIDs.",
        href: "/tools/dev/uuid",
        icon: Fingerprint,
        gradient: "from-teal-500 to-cyan-600",
        features: ["UUID v4", "ULID", "NanoID"],
        category: "ID Generation"
    },
    {
        title: "Minifiers",
        description: "Minify HTML, CSS, JS, and optimize SVG.",
        href: "/tools/dev/minify",
        icon: FileCode,
        gradient: "from-yellow-500 to-orange-600",
        features: ["HTML/CSS/JS", "SVG optimizer", "Size reduction"],
        category: "Optimization"
    },
    {
        title: "Data Transformation",
        description: "YAML ⇄ JSON, CSV ⇄ JSON",
        href: "/tools/dev/data-transformation",
        icon: FileCode,
        gradient: "from-pink-500 to-rose-600",
        features: ["YAML to JSON", "CSV parser", "Bidirectional"],
        category: "Data Format"
    },
    {
        title: "OAuth Token Inspector",
        description: "Test OAuth flows and inspect token metadata.",
        href: "/tools/dev/oauth",
        icon: Key,
        gradient: "from-violet-500 to-purple-600",
        features: ["Token decode", "Flow testing", "Metadata view"],
        category: "Security"
    },
    {
        title: "Diff Checker",
        description: "Compare two texts and view differences clearly.",
        href: "/tools/dev/diff",
        icon: GitCompare,
        gradient: "from-slate-500 to-gray-600",
        features: ["Side-by-side", "Unified view", "Line numbers"],
        category: "Text Processing"
    },
    {
        title: "Git Ignore Generator",
        description: "Generate .gitignore files for common project types.",
        href: "/tools/dev/gitignore",
        icon: FileMinus,
        gradient: "from-red-500 to-pink-600",
        features: ["100+ templates", "Multi-select", "Custom rules"],
        badge: "New",
        category: "Development"
    },
]

const benefits = [
    {
        icon: Code2,
        title: "Developer First",
        description: "Built by developers, for developers"
    },
    {
        icon: Zap,
        title: "Instant Results",
        description: "Process data locally with zero latency"
    },
    {
        icon: Lock,
        title: "Privacy Protected",
        description: "All processing happens in your browser"
    }
]

const categories = [
    { name: "Data Format", count: 2, color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
    { name: "API Testing", count: 1, color: "bg-green-500/10 text-green-600 border-green-500/20" },
    { name: "Security", count: 2, color: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
    { name: "Text Processing", count: 2, color: "bg-orange-500/10 text-orange-600 border-orange-500/20" },
    { name: "Encoding", count: 1, color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20" },
]

const quickActions = [
    { label: "Format JSON", href: "/tools/dev/json", color: "bg-blue-500" },
    { label: "Test API", href: "/tools/dev/api-tester", color: "bg-green-500" },
    { label: "Decode JWT", href: "/tools/dev/jwt", color: "bg-purple-500" },
    { label: "Generate UUID", href: "/tools/dev/uuid", color: "bg-teal-500" },
]

export default function DevStackPage() {
    return (
        <div className="space-y-12">
            {/* Header Section */}
            <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-violet-500/10 text-sm font-medium text-violet-600 border border-violet-500/20">
                    <Sparkles className="h-4 w-4" />
                    <span>Code, APIs & Data Processing</span>
                </div>
                
                <div className="space-y-3">
                    <h1 className="text-4xl font-bold tracking-tight lg:text-5xl bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                        Developer Tools
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-3xl">
                        Essential utilities for JSON manipulation, API testing, regular expressions, JWT handling, 
                        encoding, and data transformation. Everything you need for modern development.
                    </p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3">
                {quickActions.map((action) => (
                    <Link key={action.href} href={action.href}>
                        <div className={`${action.color} text-white px-4 py-2 rounded-lg font-medium text-sm hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer`}>
                            {action.label}
                        </div>
                    </Link>
                ))}
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start space-x-3 p-4 rounded-lg bg-muted/30 border">
                        <div className={`h-10 w-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0`}>
                            <benefit.icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold mb-1">{benefit.title}</h3>
                            <p className="text-sm text-muted-foreground">{benefit.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Categories */}
            <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Browse by Category</h3>
                <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                        <div key={cat.name} className={`px-3 py-1.5 rounded-lg border text-sm font-medium ${cat.color}`}>
                            {cat.name} ({cat.count})
                        </div>
                    ))}
                </div>
            </div>

            {/* Tools Grid */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">All Tools</h2>
                    <span className="text-sm text-muted-foreground">{tools.length} tools available</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tools.map((tool) => (
                        <Link key={tool.href} href={tool.href} className="group">
                            <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer h-full border-2 hover:border-violet-500/50 hover:-translate-y-1 relative overflow-hidden">
                                {/* Gradient Overlay */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                                
                                <CardHeader className="relative z-10 space-y-4">
                                    {/* Badges Row */}
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
                                            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 group-hover:text-violet-600 transition-all duration-300" />
                                        </div>
                                    </div>

                                    {/* Category Tag */}
                                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                        {tool.category}
                                    </div>

                                    {/* Title and Description */}
                                    <div className="space-y-2">
                                        <CardTitle className="text-xl group-hover:text-violet-600 transition-colors">
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
                                                <div className="h-1.5 w-1.5 rounded-full bg-violet-500" />
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

            {/* Pro Tips Section */}
            <div className="border-t pt-8 space-y-6">
                <div className="rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20 p-6">
                    <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                            <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold">Pro Tips for Developers</h3>
                            <p className="text-muted-foreground">
                                Bookmark frequently used tools for quick access, use keyboard shortcuts when available, 
                                validate JSON before deployment, test APIs in development mode, and always check regex patterns 
                                with multiple test cases for reliability.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Common Workflows */}
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg border bg-card">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <FileJson className="h-4 w-4 text-violet-600" />
                            API Development
                        </h4>
                        <p className="text-sm text-muted-foreground mb-3">
                            Test API → Format JSON → Validate response
                        </p>
                        <div className="flex flex-wrap gap-1.5 text-xs">
                            <span className="px-2 py-1 bg-muted rounded">API Tester</span>
                            <span className="px-2 py-1 bg-muted rounded">JSON Tools</span>
                        </div>
                    </div>
                    
                    <div className="p-4 rounded-lg border bg-card">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <Key className="h-4 w-4 text-violet-600" />
                            Authentication
                        </h4>
                        <p className="text-sm text-muted-foreground mb-3">
                            Generate token → Decode JWT → Verify claims
                        </p>
                        <div className="flex flex-wrap gap-1.5 text-xs">
                            <span className="px-2 py-1 bg-muted rounded">JWT Decoder</span>
                            <span className="px-2 py-1 bg-muted rounded">OAuth Inspector</span>
                        </div>
                    </div>

                    <div className="p-4 rounded-lg border bg-card">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <FileCode className="h-4 w-4 text-violet-600" />
                            Data Processing
                        </h4>
                        <p className="text-sm text-muted-foreground mb-3">
                            Convert format → Minify code → Compare output
                        </p>
                        <div className="flex flex-wrap gap-1.5 text-xs">
                            <span className="px-2 py-1 bg-muted rounded">Transformation</span>
                            <span className="px-2 py-1 bg-muted rounded">Diff Checker</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}