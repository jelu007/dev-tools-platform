import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Code, Server, TestTube, ArrowRight, Zap, Shield, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  const categories = [
    {
      title: "Developer Tools",
      description: "JSON, API testing, regex, JWT, hashing, and more.",
      href: "/tools/dev",
      icon: Code,
      color: "text-violet-500",
      tools: ["JSON Tools", "API Tester", "Regex", "JWT Decoder", "Hash Tools", "UUID Gen", "Minifiers"]
    },
    {
      title: "DevOps Tools",
      description: "K8s, CI/CD, logs, diagnostics, and infrastructure.",
      href: "/tools/devops",
      icon: Server,
      color: "text-pink-700",
      tools: ["K8s Generator", "CI/CD Pipelines", "Log Parser"]
    },
    {
      title: "Tester Tools",
      description: "Test data, webhooks, performance, and browser testing.",
      href: "/tools/test",
      icon: TestTube,
      color: "text-orange-700",
      tools: ["Test Data Gen", "Webhook Tester", "Performance", "Selectors"]
    },
  ]

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Zap className="h-4 w-4" />
          <span>Essential Tools for Modern Development</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
          DevTools Platform
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          A comprehensive suite of tools for Developers, DevOps engineers, and Testers.
          Fast, secure, and privacy-focused. All processing happens in your browser.
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-2">
          <CardHeader>
            <Shield className="h-8 w-8 mb-2 text-primary" />
            <CardTitle className="text-lg">Privacy First</CardTitle>
            <CardDescription>
              All tools run locally in your browser. Your data never leaves your machine.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="border-2">
          <CardHeader>
            <Zap className="h-8 w-8 mb-2 text-primary" />
            <CardTitle className="text-lg">Lightning Fast</CardTitle>
            <CardDescription>
              Instant results with no server round-trips. Built for speed and efficiency.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="border-2">
          <CardHeader>
            <Rocket className="h-8 w-8 mb-2 text-primary" />
            <CardTitle className="text-lg">Always Available</CardTitle>
            <CardDescription>
              No rate limits, no sign-ups required. Use as much as you need, whenever you need.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Tool Categories */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Explore Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link key={category.href} href={category.href}>
              <Card className="hover:bg-muted/50 transition-all cursor-pointer h-full border-2 hover:border-primary/50">
                <CardHeader>
                  <category.icon className={`h-10 w-10 mb-3 ${category.color}`} />
                  <CardTitle className="flex items-center justify-between">
                    {category.title}
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </CardTitle>
                  <CardDescription className="text-base">
                    {category.description}
                  </CardDescription>
                  <div className="pt-4 flex flex-wrap gap-2">
                    {category.tools.map((tool) => (
                      <span key={tool} className="text-xs bg-muted px-2 py-1 rounded-md">
                        {tool}
                      </span>
                    ))}
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Access */}
      <div className="space-y-4 border-t pt-8">
        <h3 className="text-lg font-semibold">Popular Tools</h3>
        <div className="flex flex-wrap gap-2">
          <Link href="/tools/dev/json">
            <Button variant="outline">JSON Formatter</Button>
          </Link>
          <Link href="/tools/dev/api-tester">
            <Button variant="outline">API Tester</Button>
          </Link>
          <Link href="/tools/dev/regex">
            <Button variant="outline">Regex Tester</Button>
          </Link>
          <Link href="/tools/dev/jwt">
            <Button variant="outline">JWT Decoder</Button>
          </Link>
          <Link href="/tools/devops/k8s">
            <Button variant="outline">K8s Generator</Button>
          </Link>
          <Link href="/tools/test/data">
            <Button variant="outline">Test Data</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
