"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import { Copy } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Editor from "@monaco-editor/react"

export default function DockerfilePage() {
    const { theme } = useTheme()
    const [language, setLanguage] = React.useState("node")
    const [version, setVersion] = React.useState("20")
    const [port, setPort] = React.useState("3000")
    const [workdir, setWorkdir] = React.useState("/app")
    const [output, setOutput] = React.useState("")

    React.useEffect(() => {
        generateDockerfile()
    }, [language, version, port, workdir])

    const generateDockerfile = () => {
        let dockerfile = ""

        if (language === "node") {
            dockerfile = `# Node.js Dockerfile
FROM node:${version}-alpine

# Set working directory
WORKDIR ${workdir}

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Expose port
EXPOSE ${port}

# Set user for security
USER node

# Start application
CMD ["node", "index.js"]`
        } else if (language === "python") {
            dockerfile = `# Python Dockerfile
FROM python:${version}-slim

# Set working directory
WORKDIR ${workdir}

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE ${port}

# Run as non-root user
RUN useradd -m appuser
USER appuser

# Start application
CMD ["python", "app.py"]`
        } else if (language === "go") {
            dockerfile = `# Go Dockerfile (Multi-stage build)
FROM golang:${version}-alpine AS builder

WORKDIR ${workdir}

# Copy go mod files
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# Final stage
FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /root/

# Copy binary from builder
COPY --from=builder ${workdir}/main .

# Expose port
EXPOSE ${port}

# Run the application
CMD ["./main"]`
        } else if (language === "java") {
            dockerfile = `# Java Dockerfile (Multi-stage build)
FROM maven:3.9-eclipse-temurin-${version} AS builder

WORKDIR ${workdir}

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source and build
COPY src ./src
RUN mvn package -DskipTests

# Final stage
FROM eclipse-temurin:${version}-jre-alpine

WORKDIR ${workdir}

# Copy jar from builder
COPY --from=builder ${workdir}/target/*.jar app.jar

# Expose port
EXPOSE ${port}

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]`
        } else if (language === "rust") {
            dockerfile = `# Rust Dockerfile (Multi-stage build)
FROM rust:${version} AS builder

WORKDIR ${workdir}

# Copy manifests
COPY Cargo.toml Cargo.lock ./

# Build dependencies (cached layer)
RUN mkdir src && echo "fn main() {}" > src/main.rs
RUN cargo build --release
RUN rm -rf src

# Copy source and build
COPY src ./src
RUN cargo build --release

# Final stage
FROM debian:bookworm-slim

WORKDIR ${workdir}

# Copy binary from builder
COPY --from=builder ${workdir}/target/release/app .

# Expose port
EXPOSE ${port}

# Run the application
CMD ["./app"]`
        } else if (language === "php") {
            dockerfile = `# PHP Dockerfile
FROM php:${version}-fpm-alpine

# Install dependencies
RUN apk add --no-cache \\
    nginx \\
    supervisor

# Set working directory
WORKDIR ${workdir}

# Copy application code
COPY . .

# Install PHP extensions if needed
# RUN docker-php-ext-install pdo pdo_mysql

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE ${port}

# Start services
CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]`
        } else if (language === "ruby") {
            dockerfile = `# Ruby Dockerfile
FROM ruby:${version}-alpine

# Install dependencies
RUN apk add --no-cache build-base postgresql-dev

# Set working directory
WORKDIR ${workdir}

# Copy Gemfile
COPY Gemfile Gemfile.lock ./

# Install gems
RUN bundle install --without development test

# Copy application code
COPY . .

# Expose port
EXPOSE ${port}

# Start application
CMD ["rails", "server", "-b", "0.0.0.0"]`
        } else if (language === "erlang") {
            dockerfile = `# Erlang/OTP Dockerfile
FROM erlang:${version}-alpine

# Set working directory
WORKDIR ${workdir}

# Copy rebar config
COPY rebar.config rebar.lock ./

# Get dependencies
RUN rebar3 get-deps

# Copy application code
COPY . .

# Compile the application
RUN rebar3 compile

# Expose port
EXPOSE ${port}

# Start the application
CMD ["rebar3", "shell"]`
        }

        setOutput(dockerfile)
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        toast.success("Copied to clipboard")
    }

    return (
        <div className="h-full flex flex-col space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Dockerfile Generator</h2>
                <p className="text-muted-foreground">
                    Generate optimized Dockerfiles for various languages and frameworks.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Language/Runtime</Label>
                            <Select value={language} onValueChange={setLanguage}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="node">Node.js</SelectItem>
                                    <SelectItem value="python">Python</SelectItem>
                                    <SelectItem value="go">Go</SelectItem>
                                    <SelectItem value="java">Java</SelectItem>
                                    <SelectItem value="rust">Rust</SelectItem>
                                    <SelectItem value="php">PHP</SelectItem>
                                    <SelectItem value="ruby">Ruby</SelectItem>
                                    <SelectItem value="erlang">Erlang/OTP</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Version</Label>
                            <Input
                                value={version}
                                onChange={(e) => setVersion(e.target.value)}
                                placeholder="e.g., 20, 3.11, 1.21"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Port</Label>
                            <Input
                                type="number"
                                value={port}
                                onChange={(e) => setPort(e.target.value)}
                                placeholder="3000"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Working Directory</Label>
                            <Input
                                value={workdir}
                                onChange={(e) => setWorkdir(e.target.value)}
                                placeholder="/app"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2 flex flex-col h-[600px]">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Generated Dockerfile</CardTitle>
                        <Button variant="ghost" size="icon" onClick={() => copyToClipboard(output)}>
                            <Copy className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0 flex-1">
                        <Editor
                            height="100%"
                            defaultLanguage="dockerfile"
                            theme={theme === "dark" ? "vs-dark" : "light"}
                            value={output}
                            options={{ readOnly: true, minimap: { enabled: false }, fontSize: 14 }}
                        />
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-muted/30">
                <CardHeader>
                    <CardTitle className="text-sm">Best Practices Included</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                    <ul className="list-disc list-inside space-y-1">
                        <li>Multi-stage builds for compiled languages (Go, Java, Rust)</li>
                        <li>Alpine-based images for smaller size</li>
                        <li>Non-root user for security</li>
                        <li>Layer caching optimization</li>
                        <li>Production-only dependencies</li>
                        <li>.dockerignore recommended for node_modules, .git, etc.</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    )
}
