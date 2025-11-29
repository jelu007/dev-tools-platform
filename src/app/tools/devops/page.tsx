import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Ship, GitBranch, FileText, Activity, Terminal, Container, Cloud, AlertCircle, ArrowRight, Sparkles, Boxes, Workflow, Shield } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const tools = [
    {
        title: "K8s YAML Generator",
        description: "Generate Kubernetes manifests for Deployment, Service, etc.",
        href: "/tools/devops/k8s",
        icon: Ship,
        gradient: "from-blue-500 to-cyan-600",
        features: ["Deployments", "Services", "ConfigMaps"],
        badge: "Popular",
        category: "Container Orchestration"
    },
    {
        title: "CI/CD Pipeline",
        description: "Generate pipeline configs for GitHub, GitLab, etc.",
        href: "/tools/devops/cicd",
        icon: GitBranch,
        gradient: "from-purple-500 to-pink-600",
        features: ["GitHub Actions", "GitLab CI", "Jenkins"],
        badge: "New",
        category: "Automation"
    },
    {
        title: "Log Parser",
        description: "Parse and beautify logs.",
        href: "/tools/devops/logs",
        icon: FileText,
        gradient: "from-amber-500 to-orange-600",
        features: ["JSON logs", "Stack traces", "Filters"],
        category: "Monitoring"
    },
    {
        title: "HTTP Diagnostics",
        description: "Port checker, DNS lookup, Ping.",
        href: "/tools/devops/http",
        icon: Activity,
        gradient: "from-green-500 to-emerald-600",
        features: ["Port scan", "DNS lookup", "Latency test"],
        category: "Diagnostics"
    },
    {
        title: "Curl Converter",
        description: "Convert Curl commands to code.",
        href: "/tools/devops/curl",
        icon: Terminal,
        gradient: "from-slate-500 to-gray-600",
        features: ["Python", "JavaScript", "PHP"],
        category: "Code Generation"
    },
    {
        title: "Dockerfile Generator",
        description: "Generate optimized Dockerfiles.",
        href: "/tools/devops/docker",
        icon: Container,
        gradient: "from-sky-500 to-blue-600",
        features: ["Multi-stage", "Best practices", "Optimized"],
        badge: "Popular",
        category: "Containers"
    },
    {
        title: "Dockerfile Linter",
        description: "Validate Dockerfiles for common issues.",
        href: "/tools/devops/dockerfile-linter",
        icon: AlertCircle,
        gradient: "from-red-500 to-rose-600",
        features: ["Security checks", "Best practices", "Quick fixes"],
        category: "Containers"
    },
    {
        title: "Terraform Snippets",
        description: "Generate Terraform resource templates.",
        href: "/tools/devops/terraform",
        icon: Cloud,
        gradient: "from-violet-500 to-purple-600",
        features: ["AWS", "Azure", "GCP"],
        category: "Infrastructure"
    },
]

const benefits = [
    {
        icon: Boxes,
        title: "Infrastructure as Code",
        description: "Generate production-ready configs instantly"
    },
    {
        icon: Workflow,
        title: "Streamline Deployment",
        description: "Automate your DevOps workflows"
    },
    {
        icon: Shield,
        title: "Best Practices",
        description: "Follow industry standards and security"
    }
]

const categories = [
    { name: "Container Orchestration", count: 1, color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
    { name: "Automation", count: 1, color: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
    { name: "Containers", count: 2, color: "bg-sky-500/10 text-sky-600 border-sky-500/20" },
    { name: "Infrastructure", count: 1, color: "bg-violet-500/10 text-violet-600 border-violet-500/20" },
]

export default function DevOpsToolsPage() {
    return (
        <div className="space-y-12">
            {/* Header Section */}
            <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-pink-500/10 text-sm font-medium text-pink-600 border border-pink-500/20">
                    <Sparkles className="h-4 w-4" />
                    <span>Infrastructure & Automation</span>
                </div>
                
                <div className="space-y-3">
                    <h1 className="text-4xl font-bold tracking-tight lg:text-5xl bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                        DevOps Tools
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-3xl">
                        Powerful tools for Kubernetes, CI/CD pipelines, container management, infrastructure as code, and system diagnostics.
                    </p>
                </div>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start space-x-3 p-4 rounded-lg bg-muted/30 border">
                        <div className={`h-10 w-10 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center flex-shrink-0`}>
                            <benefit.icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold mb-1">{benefit.title}</h3>
                            <p className="text-sm text-muted-foreground">{benefit.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Categories Filter */}
            <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Categories</h3>
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
                    <h2 className="text-2xl font-bold">Available Tools</h2>
                    <span className="text-sm text-muted-foreground">{tools.length} tools</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tools.map((tool) => (
                        <Link key={tool.href} href={tool.href} className="group">
                            <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer h-full border-2 hover:border-pink-500/50 hover:-translate-y-1 relative overflow-hidden">
                                {/* Gradient Overlay */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                                
                                <CardHeader className="relative z-10 space-y-4">
                                    {/* Category Badge */}
                                    <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                                        {tool.badge && (
                                            <Badge variant="secondary" className="text-xs font-semibold">
                                                {tool.badge}
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Icon */}
                                    <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                        <tool.icon className="h-6 w-6 text-white" />
                                    </div>

                                    {/* Category Tag */}
                                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                        {tool.category}
                                    </div>

                                    {/* Title and Description */}
                                    <div className="space-y-2">
                                        <CardTitle className="text-xl group-hover:text-pink-600 transition-colors flex items-center justify-between">
                                            <span>{tool.title}</span>
                                            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 group-hover:text-pink-600 transition-all duration-300" />
                                        </CardTitle>
                                        <CardDescription className="text-base">
                                            {tool.description}
                                        </CardDescription>
                                    </div>

                                    {/* Features List */}
                                    <div className="pt-2 space-y-2">
                                        {tool.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <div className="h-1.5 w-1.5 rounded-full bg-pink-500" />
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

            {/* Quick Reference */}
            <div className="border-t pt-8 space-y-6">
                <div className="rounded-xl bg-gradient-to-br from-pink-500/10 to-rose-500/10 border border-pink-500/20 p-6">
                    <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center flex-shrink-0">
                            <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold">DevOps Best Practices</h3>
                            <p className="text-muted-foreground">
                                Use infrastructure as code for consistency, implement CI/CD for faster deployments, 
                                containerize applications for portability, monitor logs continuously, and always follow 
                                security best practices in your configurations.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Popular Workflows */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg border bg-card">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <GitBranch className="h-4 w-4 text-pink-600" />
                            Container Workflow
                        </h4>
                        <p className="text-sm text-muted-foreground mb-3">
                            Generate Dockerfile → Lint for issues → Deploy to K8s
                        </p>
                        <div className="flex gap-2 text-xs">
                            <span className="px-2 py-1 bg-muted rounded">Dockerfile Generator</span>
                            <span className="px-2 py-1 bg-muted rounded">K8s Generator</span>
                        </div>
                    </div>
                    
                    <div className="p-4 rounded-lg border bg-card">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <Cloud className="h-4 w-4 text-pink-600" />
                            Infrastructure Workflow
                        </h4>
                        <p className="text-sm text-muted-foreground mb-3">
                            Write Terraform → Set up CI/CD → Monitor with diagnostics
                        </p>
                        <div className="flex gap-2 text-xs">
                            <span className="px-2 py-1 bg-muted rounded">Terraform Snippets</span>
                            <span className="px-2 py-1 bg-muted rounded">HTTP Diagnostics</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}