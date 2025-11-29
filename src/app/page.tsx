import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Code, Server, TestTube, ArrowRight, Zap, Shield, Rocket, Sparkles, TrendingUp, Users, Star, CheckCircle2, Github, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function Home() {
  const categories = [
    {
      title: "Developer Tools",
      description: "JSON, API testing, regex, JWT, hashing, and more.",
      href: "/tools/dev",
      icon: Code,
      color: "text-violet-500",
      bgGradient: "from-violet-500/10 to-purple-500/10",
      borderColor: "hover:border-violet-500/50",
      hoverGlow: "group-hover:shadow-violet-500/20",
      tools: ["JSON Tools", "API Tester", "Regex", "JWT Decoder", "Hash Tools", "UUID Gen", "Minifiers"],
      count: 11
    },
    {
      title: "DevOps Tools",
      description: "K8s, CI/CD, logs, diagnostics, and infrastructure.",
      href: "/tools/devops",
      icon: Server,
      color: "text-pink-600",
      bgGradient: "from-pink-500/10 to-rose-500/10",
      borderColor: "hover:border-pink-500/50",
      hoverGlow: "group-hover:shadow-pink-500/20",
      tools: ["K8s Generator", "CI/CD Pipelines", "Log Parser"],
      count: 8
    },
    {
      title: "Tester Tools",
      description: "Test data, webhooks, performance, and browser testing.",
      href: "/tools/test",
      icon: TestTube,
      color: "text-orange-600",
      bgGradient: "from-orange-500/10 to-amber-500/10",
      borderColor: "hover:border-orange-500/50",
      hoverGlow: "group-hover:shadow-orange-500/20",
      tools: ["Test Data Gen", "Webhook Tester", "Performance", "Selectors"],
      count: 5
    },
  ]

  const features = [
    {
      icon: Shield,
      title: "Privacy First",
      description: "All tools run locally in your browser. Your data never leaves your machine.",
      gradient: "from-violet-500 to-purple-600",
      benefits: ["Zero data collection", "Client-side only", "100% secure"]
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Instant results with no server round-trips. Built for speed and efficiency.",
      gradient: "from-amber-500 to-orange-600",
      benefits: ["Sub-100ms response", "No network delay", "Optimized code"]
    },
    {
      icon: Rocket,
      title: "Always Available",
      description: "No rate limits, no sign-ups required. Use as much as you need, whenever you need.",
      gradient: "from-cyan-500 to-blue-600",
      benefits: ["Unlimited usage", "No registration", "24/7 available"]
    },
  ]

  const popularTools = [
    { name: "JSON Formatter", href: "/tools/dev/json", badge: "Most Used", icon: "📝" },
    { name: "API Tester", href: "/tools/dev/api-tester", icon: "🔌" },
    { name: "Regex Tester", href: "/tools/dev/regex", icon: "🔍" },
    { name: "JWT Decoder", href: "/tools/dev/jwt", badge: "Popular", icon: "🔐" },
    { name: "K8s Generator", href: "/tools/devops/k8s", icon: "☸️" },
    { name: "Test Data", href: "/tools/test/data", icon: "🗄️" },
  ]

  const testimonials = [
    { text: "Saves me hours every week", author: "Sarah Chen", role: "Full Stack Developer" },
    { text: "My go-to tool for API testing", author: "Mike Johnson", role: "DevOps Engineer" },
    { text: "Privacy-focused and lightning fast", author: "Alex Kumar", role: "Security Analyst" },
  ]

  const useCases = [
    {
      title: "API Development",
      description: "Test endpoints, format responses, and debug faster",
      tools: ["API Tester", "JSON Tools", "JWT Decoder"],
      gradient: "from-blue-500/10 to-cyan-500/10"
    },
    {
      title: "DevOps Automation",
      description: "Generate configs, parse logs, and manage infrastructure",
      tools: ["K8s Generator", "CI/CD", "Log Parser"],
      gradient: "from-pink-500/10 to-rose-500/10"
    },
    {
      title: "Quality Assurance",
      description: "Create test data, validate webhooks, and benchmark performance",
      tools: ["Test Data", "Webhooks", "Performance"],
      gradient: "from-orange-500/10 to-amber-500/10"
    },
  ]

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <div className="space-y-8 pt-8">
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10 text-sm font-medium text-primary border border-primary/20 animate-pulse">
          <Sparkles className="h-4 w-4" />
          <span>Essential Tools for Modern Development</span>
          <Badge variant="secondary" className="ml-2">New Tools Added</Badge>
        </div>
        
        <div className="space-y-6">
          <h1 className="text-5xl font-bold tracking-tight lg:text-7xl bg-gradient-to-br from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent leading-tight">
            DevStack Platform
          </h1>
          <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl leading-relaxed">
            A comprehensive suite of <span className="text-foreground font-semibold">24+ tools</span> for Developers, DevOps engineers, and Testers.
            Fast, secure, and privacy-focused. <span className="text-foreground font-semibold">All processing happens in your browser.</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-4 pt-4">
          <Link href="/tools/dev">
            <Button size="lg" className="font-semibold text-base px-8 py-6 shadow-lg hover:shadow-xl transition-all">
              Explore Tools
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="#popular">
            <Button size="lg" variant="outline" className="font-semibold text-base px-8 py-6 hover:bg-primary/5">
              Popular Tools
            </Button>
          </Link>
          <Link href="#categories">
            <Button size="lg" variant="ghost" className="font-semibold text-base px-8 py-6">
              View Categories
            </Button>
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Why DevStack?</h2>
          <p className="text-muted-foreground text-lg">Built for developers who value privacy, speed, and reliability</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <Card key={idx} className="border-2 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group relative overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              
              <CardHeader className="space-y-5 relative z-10">
                <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <div className="space-y-3">
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                  <div className="space-y-2 pt-2">
                    {feature.benefits.map((benefit, bidx) => (
                      <div key={bidx} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-muted-foreground">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* Use Cases */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Perfect For Your Workflow</h2>
          <p className="text-muted-foreground text-lg">Streamline your development process with purpose-built tools</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {useCases.map((useCase, idx) => (
            <Card key={idx} className="border-2 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
              <div className={`absolute inset-0 bg-gradient-to-br ${useCase.gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-300`} />
              
              <CardHeader className="relative z-10 space-y-4">
                <CardTitle className="text-xl">{useCase.title}</CardTitle>
                <CardDescription className="text-base">{useCase.description}</CardDescription>
                <div className="flex flex-wrap gap-2 pt-2">
                  {useCase.tools.map((tool) => (
                    <Badge key={tool} variant="secondary" className="text-xs">
                      {tool}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* Tool Categories */}
      <div id="categories" className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Explore Tools by Category</h2>
            <p className="text-muted-foreground text-lg">Everything you need, organized and ready to use</p>
          </div>
          <Badge variant="outline" className="text-base px-4 py-2">
            {categories.reduce((acc, cat) => acc + cat.count, 0)} tools
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link key={category.href} href={category.href} className="group">
              <Card className={`hover:shadow-2xl transition-all duration-300 cursor-pointer h-full border-2 ${category.borderColor} ${category.hoverGlow} hover:-translate-y-2 relative overflow-hidden`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${category.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                <CardHeader className="relative z-10 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${category.bgGradient} border-2 ${category.borderColor.replace('hover:', '')} flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      <category.icon className={`h-7 w-7 ${category.color}`} />
                    </div>
                    <ArrowRight className={`h-6 w-6 text-muted-foreground group-hover:translate-x-2 ${category.color.replace('text-', 'group-hover:text-')} transition-all duration-300`} />
                  </div>
                  
                  <div className="space-y-2">
                    <CardTitle className="text-2xl">
                      {category.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {category.description}
                    </CardDescription>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {category.tools.slice(0, 4).map((tool) => (
                      <span key={tool} className="text-xs bg-background/90 backdrop-blur-sm px-2.5 py-1.5 rounded-md border font-medium shadow-sm">
                        {tool}
                      </span>
                    ))}
                    {category.tools.length > 4 && (
                      <span className="text-xs text-muted-foreground px-2.5 py-1.5 font-medium">
                        +{category.tools.length - 4} more
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <span className={`text-sm font-bold ${category.color}`}>
                      {category.count} tools
                    </span>
                    <Badge variant="secondary" className="text-xs">Explore →</Badge>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Popular Tools */}
      <div id="popular" className="space-y-6 border-t pt-16">
        <div className="text-center space-y-2">
          <h3 className="text-3xl font-bold">Most Popular Tools</h3>
          <p className="text-muted-foreground text-lg">Quick access to our most frequently used tools</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {popularTools.map((tool) => (
            <Link key={tool.href} href={tool.href} className="group">
              <Card className="h-full border-2 hover:border-primary/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="p-5 space-y-3">
                  <div className="text-3xl">{tool.icon}</div>
                  <div className="space-y-2">
                    <CardTitle className="text-sm leading-tight group-hover:text-primary transition-colors">
                      {tool.name}
                    </CardTitle>
                    {tool.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {tool.badge}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y">
        <div className="space-y-3 text-center">
          <div className="text-5xl font-bold bg-gradient-to-br from-violet-600 to-purple-600 bg-clip-text text-transparent">
            24+
          </div>
          <div className="text-sm text-muted-foreground font-medium">Available Tools</div>
        </div>
        <div className="space-y-3 text-center">
          <div className="text-5xl font-bold bg-gradient-to-br from-pink-600 to-rose-600 bg-clip-text text-transparent">
            100%
          </div>
          <div className="text-sm text-muted-foreground font-medium">Privacy Protected</div>
        </div>
        <div className="space-y-3 text-center">
          <div className="text-5xl font-bold bg-gradient-to-br from-orange-600 to-amber-600 bg-clip-text text-transparent">
            0ms
          </div>
          <div className="text-sm text-muted-foreground font-medium">Server Latency</div>
        </div>
        <div className="space-y-3 text-center">
          <div className="text-5xl font-bold bg-gradient-to-br from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            ∞
          </div>
          <div className="text-sm text-muted-foreground font-medium">Usage Limits</div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border-2 border-primary/20 p-12 text-center space-y-6">
        <h2 className="text-4xl font-bold">Ready to boost your productivity?</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Start using DevStack today. No sign-up required, completely free, and always will be.
        </p>
        <div className="flex flex-wrap gap-4 justify-center pt-4">
          <Link href="/tools/dev">
            <Button size="lg" className="font-semibold text-base px-10 py-6 shadow-lg">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="#categories">
            <Button size="lg" variant="outline" className="font-semibold text-base px-10 py-6">
              Browse All Tools
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}