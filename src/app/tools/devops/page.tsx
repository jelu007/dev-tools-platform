import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Ship, GitBranch, FileText, Activity, Terminal, Container, Cloud } from "lucide-react"

const tools = [
    {
        title: "K8s YAML Generator",
        description: "Generate Kubernetes manifests for Deployment, Service, etc.",
        href: "/tools/devops/k8s",
        icon: Ship,
    },
    {
        title: "CI/CD Pipeline",
        description: "Generate pipeline configs for GitHub, GitLab, etc.",
        href: "/tools/devops/cicd",
        icon: GitBranch,
    },
    {
        title: "Log Parser",
        description: "Parse and beautify logs.",
        href: "/tools/devops/logs",
        icon: FileText,
    },
    {
        title: "HTTP Diagnostics",
        description: "Port checker, DNS lookup, Ping.",
        href: "/tools/devops/http",
        icon: Activity,
    },
    {
        title: "Curl Converter",
        description: "Convert Curl commands to code.",
        href: "/tools/devops/curl",
        icon: Terminal,
    },
    {
        title: "Dockerfile Generator",
        description: "Generate optimized Dockerfiles.",
        href: "/tools/devops/docker",
        icon: Container,
    },
    {
        title: "Terraform Snippets",
        description: "Generate Terraform resource templates.",
        href: "/tools/devops/terraform",
        icon: Cloud,
    },
]

export default function DevOpsToolsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">DevOps Tools</h1>
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
