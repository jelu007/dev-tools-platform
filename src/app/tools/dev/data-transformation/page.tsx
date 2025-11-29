import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { FileJson, FileCode, Hash, Code, Clock } from "lucide-react"

const tools = [
    {
        title: "YAML ⇄ JSON Converter",
        description: "Seamless conversion between both formats.",
        href: "/tools/dev/data-transformation/yaml-json",
        icon: FileJson,
    },
    {
        title: "CSV ⇄ JSON Converter",
        description: "Great for transforming datasets.",
        href: "/tools/dev/data-transformation/csv-json",
        icon: FileCode,
    }
]

export default function DataTransformationPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Data & Transformation Tools</h1>
            <p className="text-muted-foreground">Useful converters and generators for data manipulation.</p>

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
