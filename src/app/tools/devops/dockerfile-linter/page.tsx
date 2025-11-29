"use client"

import * as React from "react"
import { toast } from "sonner"
import { Copy, RotateCcw, Download, AlertCircle, AlertTriangle, Info, CheckCircle } from "lucide-react"

interface LintIssue {
    id: string
    line: number | string
    severity: "ERROR" | "WARNING" | "INFO"
    check: string
    message: string
    explanation: string
    recommendation: string
    references: string[]
}

function lintDockerfile(content: string): LintIssue[] {
    const issues: LintIssue[] = []
    const lines = content.split("\n")

    if (!content.trim()) {
        issues.push({
            id: "DL000",
            line: 0,
            severity: "ERROR",
            check: "EMPTY_INPUT",
            message: "Dockerfile content is empty or missing",
            explanation: "A valid Dockerfile must contain at least a FROM instruction",
            recommendation: "Provide Dockerfile content starting with FROM instruction",
            references: ["https://docs.docker.com/engine/reference/builder/"]
        })
        return issues
    }

    let hasFrom = false
    let hasCmd = false
    let hasEntrypoint = false
    let hasUser = false
    let hasHealthcheck = false
    let hasLabels = false
    let consecutiveRuns: number[] = []
    let lastWasRun = false

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()
        const lineNum = i + 1

        if (!line || line.startsWith("#")) {
            lastWasRun = false
            continue
        }

        const upperLine = line.toUpperCase()

        // Track consecutive RUNs for layer optimization
        if (upperLine.startsWith("RUN")) {
            if (!lastWasRun) consecutiveRuns = []
            consecutiveRuns.push(lineNum)
            lastWasRun = true
        } else {
            if (lastWasRun && consecutiveRuns.length > 1) {
                issues.push({
                    id: "DL006",
                    line: `${consecutiveRuns[0]}-${consecutiveRuns[consecutiveRuns.length - 1]}`,
                    severity: "INFO",
                    check: "REDUCE_LAYERS",
                    message: `${consecutiveRuns.length} consecutive RUN commands can be combined`,
                    explanation: "Multiple RUN commands create multiple layers, increasing image size",
                    recommendation: "Combine RUN commands with && to reduce layers:\nRUN cmd1 && \\\n    cmd2 && \\\n    cmd3",
                    references: ["https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#minimize-the-number-of-layers"]
                })
            }
            consecutiveRuns = []
            lastWasRun = false
        }

        // FROM check
        if (upperLine.startsWith("FROM")) {
            hasFrom = true
            const fromMatch = line.match(/^FROM\s+([^\s:]+)(?::([^\s]+))?/i)
            if (fromMatch) {
                const tag = fromMatch[2] || "latest"
                if (/latest|master|main/i.test(tag)) {
                    issues.push({
                        id: "DL002",
                        line: lineNum,
                        severity: "WARNING",
                        check: "FROM_CHECK",
                        message: `Base image uses unpinned '${tag}' tag`,
                        explanation: "Using 'latest' can cause unpredictable builds when upstream image changes",
                        recommendation: `Pin to specific version: FROM ${fromMatch[1]}:22.04 or FROM ${fromMatch[1]}@sha256:...`,
                        references: ["https://docs.docker.com/engine/reference/builder/#from"]
                    })
                }
            }
        }

        // CMD / ENTRYPOINT check (exec form)
        if (upperLine.startsWith("CMD")) {
            hasCmd = true
            if (!line.includes("[") || !line.includes("]")) {
                issues.push({
                    id: "DL014",
                    line: lineNum,
                    severity: "WARNING",
                    check: "SHELL_BEST_PRACTICE",
                    message: "CMD should use exec form (JSON array syntax)",
                    explanation: "Shell form prevents proper signal handling and can cause issues with process termination",
                    recommendation: 'Change to exec form: CMD ["executable", "param1", "param2"]',
                    references: ["https://docs.docker.com/engine/reference/builder/#cmd"]
                })
            }
        }

        if (upperLine.startsWith("ENTRYPOINT")) {
            hasEntrypoint = true
            if (!line.includes("[") || !line.includes("]")) {
                issues.push({
                    id: "DL014",
                    line: lineNum,
                    severity: "WARNING",
                    check: "SHELL_BEST_PRACTICE",
                    message: "ENTRYPOINT should use exec form (JSON array syntax)",
                    explanation: "Shell form prevents proper signal handling and can cause issues with process termination",
                    recommendation: 'Change to exec form: ENTRYPOINT ["executable", "param"]',
                    references: ["https://docs.docker.com/engine/reference/builder/#entrypoint"]
                })
            }
        }

        // RUN best practices
        if (upperLine.startsWith("RUN")) {
            // Check for apt-get
            if (/apt-get\s+install/i.test(line)) {
                if (!/--no-install-recommends/.test(line)) {
                    issues.push({
                        id: "DL005",
                        line: lineNum,
                        severity: "WARNING",
                        check: "APT_CLEANUP",
                        message: "apt-get install missing --no-install-recommends flag",
                        explanation: "Installing recommended packages increases image size unnecessarily",
                        recommendation: "Add --no-install-recommends flag: apt-get install -y --no-install-recommends package",
                        references: ["https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#run"]
                    })
                }
                if (!/rm -rf \/var\/lib\/apt\/lists/.test(line) && !/apt-get clean/.test(line)) {
                    issues.push({
                        id: "DL005",
                        line: lineNum,
                        severity: "WARNING",
                        check: "APT_CLEANUP",
                        message: "apt-get install missing cache cleanup",
                        explanation: "Package manager cache increases image size unnecessarily",
                        recommendation: "Add cleanup: && rm -rf /var/lib/apt/lists/*",
                        references: ["https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#run"]
                    })
                }
            }

            // Check for pinned versions
            if (/apt-get\s+install|yum\s+install|apk\s+add/i.test(line)) {
                const hasVersion = /[=:]\d+\./.test(line)
                if (!hasVersion) {
                    issues.push({
                        id: "DL004",
                        line: lineNum,
                        severity: "WARNING",
                        check: "PINNED_VERSIONS",
                        message: "Package installation without explicit version pinning",
                        explanation: "Unpinned packages can change between builds causing inconsistency",
                        recommendation: "Pin package versions: apt-get install -y package=version",
                        references: ["https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#run"]
                    })
                }
            }

            // Check for dangerous permissions
            if (/chmod\s+(777|a\+rwx)/i.test(line)) {
                issues.push({
                    id: "DL015",
                    line: lineNum,
                    severity: "WARNING",
                    check: "FILE_PERMISSIONS",
                    message: "Insecure file permissions detected (777 or world-writable)",
                    explanation: "World-writable permissions create security vulnerabilities",
                    recommendation: "Use least-privilege permissions: chmod 755 for directories, 644 for files",
                    references: ["https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#user"]
                })
            }

            // Check for service start commands
            if (/service\s+\w+\s+start/i.test(line)) {
                issues.push({
                    id: "DL018",
                    line: lineNum,
                    severity: "WARNING",
                    check: "LINTER_COMPLIANCE",
                    message: "Starting services at build time is discouraged",
                    explanation: "Services started in RUN don't persist; use CMD/ENTRYPOINT instead",
                    recommendation: "Move service start to CMD or ENTRYPOINT instruction",
                    references: ["https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#run"]
                })
            }
        }

        // Secret detection
        const secretPatterns = [
            { pattern: /AKIA[0-9A-Z]{16}/i, name: "AWS Access Key" },
            { pattern: /(password|passwd|pwd|secret|token|api[_-]?key)\s*=\s*["'][^"']+["']/i, name: "Hardcoded secret" },
            { pattern: /-----BEGIN (RSA |DSA )?PRIVATE KEY-----/i, name: "Private key" }
        ]

        for (const { pattern, name } of secretPatterns) {
            if (pattern.test(line)) {
                issues.push({
                    id: "DL008",
                    line: lineNum,
                    severity: "ERROR",
                    check: "SECRET_EXPOSURE",
                    message: `Potential ${name} detected in Dockerfile`,
                    explanation: "Hardcoded secrets in Dockerfiles are a critical security risk and will be in image history",
                    recommendation: "Use BuildKit secrets or runtime environment variables instead",
                    references: ["https://docs.docker.com/engine/swarm/secrets/"]
                })
            }
        }

        // EXPOSE port validation
        if (upperLine.startsWith("EXPOSE")) {
            const ports = line.substring(6).trim().split(/\s+/)
            for (const port of ports) {
                if (!/^\d+(?:\/tcp|\/udp)?$/.test(port)) {
                    issues.push({
                        id: "DL011",
                        line: lineNum,
                        severity: "ERROR",
                        check: "PORTS_EXPOSE",
                        message: `Invalid EXPOSE port '${port}' - must be numeric`,
                        explanation: "EXPOSE requires valid port numbers (1-65535)",
                        recommendation: "Use numeric port: EXPOSE 8080",
                        references: ["https://docs.docker.com/engine/reference/builder/#expose"]
                    })
                }
            }
        }

        // WORKDIR check
        if (upperLine.startsWith("WORKDIR")) {
            const path = line.substring(7).trim()
            if (!path.startsWith("/") && !path.startsWith("$")) {
                issues.push({
                    id: "DL018",
                    line: lineNum,
                    severity: "WARNING",
                    check: "LINTER_COMPLIANCE",
                    message: `WORKDIR should use absolute path, got '${path}'`,
                    explanation: "Relative paths in WORKDIR can cause confusion and unexpected behavior",
                    recommendation: "Use absolute path: WORKDIR /app",
                    references: ["https://docs.docker.com/engine/reference/builder/#workdir"]
                })
            }
        }

        // USER check
        if (upperLine.startsWith("USER")) {
            hasUser = true
            const user = line.substring(4).trim()
            if (user === "root" || user === "0") {
                issues.push({
                    id: "DL003",
                    line: lineNum,
                    severity: "WARNING",
                    check: "USER_PRIVILEGE",
                    message: "Container configured to run as root user",
                    explanation: "Running as root increases security risk if container is compromised",
                    recommendation: "Create and use non-root user:\nRUN useradd -m appuser\nUSER appuser",
                    references: ["https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#user"]
                })
            }
        }

        // ADD vs COPY
        if (upperLine.startsWith("ADD")) {
            if (!/(\.tar|\.tar\.gz|\.tgz|https?:\/\/)/.test(line)) {
                issues.push({
                    id: "DL010",
                    line: lineNum,
                    severity: "INFO",
                    check: "USE_OF_ADD",
                    message: "Consider using COPY instead of ADD",
                    explanation: "ADD has implicit tar extraction and URL fetching; COPY is more explicit",
                    recommendation: "Use COPY unless you need tar extraction or URL fetching",
                    references: ["https://docs.docker.com/engine/reference/builder/#add"]
                })
            }
        }

        // HEALTHCHECK
        if (upperLine.startsWith("HEALTHCHECK")) {
            hasHealthcheck = true
        }

        // LABEL
        if (upperLine.startsWith("LABEL")) {
            hasLabels = true
        }
    }

    // Check for missing FROM
    if (!hasFrom) {
        issues.push({
            id: "DL018",
            line: 1,
            severity: "ERROR",
            check: "LINTER_COMPLIANCE",
            message: "Missing FROM instruction - every Dockerfile must start with FROM",
            explanation: "FROM is mandatory and specifies the base image",
            recommendation: "Add FROM instruction: FROM ubuntu:22.04",
            references: ["https://docs.docker.com/engine/reference/builder/#from"]
        })
    }

    // Check for missing CMD/ENTRYPOINT
    if (!hasCmd && !hasEntrypoint) {
        issues.push({
            id: "DL018",
            line: lines.length,
            severity: "WARNING",
            check: "LINTER_COMPLIANCE",
            message: "No CMD or ENTRYPOINT - container will not have a default command",
            explanation: "Without CMD/ENTRYPOINT, container needs explicit command to run",
            recommendation: "Add CMD or ENTRYPOINT:\nCMD [\"executable\", \"param\"]",
            references: ["https://docs.docker.com/engine/reference/builder/#cmd"]
        })
    }

    // Check for missing USER
    if (!hasUser && hasFrom) {
        issues.push({
            id: "DL003",
            line: `${lines.length}`,
            severity: "WARNING",
            check: "USER_PRIVILEGE",
            message: "No USER instruction found - container will run as root",
            explanation: "Running as root increases security risk if container is compromised",
            recommendation: "Add before CMD:\nRUN useradd -m appuser\nUSER appuser",
            references: ["https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#user"]
        })
    }

    // Check for missing HEALTHCHECK
    if (!hasHealthcheck && hasFrom) {
        issues.push({
            id: "DL012",
            line: lines.length,
            severity: "INFO",
            check: "HEALTHCHECK",
            message: "Missing HEALTHCHECK instruction for service monitoring",
            explanation: "HEALTHCHECK helps orchestrators determine container health status",
            recommendation: "Add HEALTHCHECK:\nHEALTHCHECK --interval=30s --timeout=3s \\\n  CMD curl -f http://localhost/ || exit 1",
            references: ["https://docs.docker.com/engine/reference/builder/#healthcheck"]
        })
    }

    // Check for missing labels
    if (!hasLabels && hasFrom) {
        issues.push({
            id: "DL013",
            line: lines.length,
            severity: "INFO",
            check: "LABELS_METADATA",
            message: "Missing metadata labels for image documentation",
            explanation: "Labels help with image organization and provide important metadata",
            recommendation: 'Add standard labels:\nLABEL org.opencontainers.image.title="My App"\nLABEL org.opencontainers.image.version="1.0.0"',
            references: ["https://github.com/opencontainers/image-spec/blob/main/annotations.md"]
        })
    }

    return issues.sort((a, b) => {
        const severityOrder = { ERROR: 0, WARNING: 1, INFO: 2 }
        const severityDiff = severityOrder[a.severity] - severityOrder[b.severity]
        if (severityDiff !== 0) return severityDiff
        
        const aLine = typeof a.line === 'number' ? a.line : parseInt(a.line.split('-')[0])
        const bLine = typeof b.line === 'number' ? b.line : parseInt(b.line.split('-')[0])
        return aLine - bLine
    })
}

export default function DockerfileLinterPage() {
    const [dockerfile, setDockerfile] = React.useState("")
    const [issues, setIssues] = React.useState<LintIssue[]>([])
    const [autoLint, setAutoLint] = React.useState(true)

    const lint = React.useCallback(() => {
        const lintIssues = lintDockerfile(dockerfile)
        setIssues(lintIssues)
        if (lintIssues.length === 0) {
            toast.success("✅ No issues found - Dockerfile looks good!")
        } else {
            const errors = lintIssues.filter(i => i.severity === "ERROR").length
            const warnings = lintIssues.filter(i => i.severity === "WARNING").length
            toast.info(`Found ${errors} errors, ${warnings} warnings`)
        }
    }, [dockerfile])

    React.useEffect(() => {
        if (!autoLint) return
        const t = setTimeout(() => lint(), 300)
        return () => clearTimeout(t)
    }, [dockerfile, autoLint, lint])

    const errorCount = issues.filter((i) => i.severity === "ERROR").length
    const warningCount = issues.filter((i) => i.severity === "WARNING").length
    const infoCount = issues.filter((i) => i.severity === "INFO").length

    const downloadReport = () => {
        const report = `Dockerfile Lint Report
Generated: ${new Date().toISOString()}

Summary: ${errorCount} errors, ${warningCount} warnings, ${infoCount} info

Issues:
${issues.map(issue => `
[${issue.severity}] ${issue.id} - Line ${issue.line}
Check: ${issue.check}
Message: ${issue.message}
Explanation: ${issue.explanation}
Recommendation: ${issue.recommendation}
References: ${issue.references.join(", ")}
`).join("\n---\n")}
`
        const blob = new Blob([report], { type: "text/plain;charset=utf-8" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "dockerfile-lint-report.txt"
        document.body.appendChild(a)
        a.click()
        a.remove()
        URL.revokeObjectURL(url)
        toast.success("Report downloaded")
    }

    const copyReport = () => {
        const report = issues.map(issue => 
            `[${issue.severity}] ${issue.id} - Line ${issue.line}: ${issue.message}`
        ).join("\n")
        navigator.clipboard.writeText(report)
        toast.success("Report copied to clipboard")
    }

    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case "ERROR": return <AlertCircle className="w-4 h-4" />
            case "WARNING": return <AlertTriangle className="w-4 h-4" />
            case "INFO": return <Info className="w-4 h-4" />
            default: return null
        }
    }

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case "ERROR": return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 border-red-600"
            case "WARNING": return "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950 border-yellow-600"
            case "INFO": return "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 border-blue-600"
            default: return ""
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dockerfile Linter</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Validate Dockerfiles for security issues, best practices, and optimization opportunities
                    </p>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between">
                    <label className="inline-flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            checked={autoLint}
                            onChange={(e) => setAutoLint(e.target.checked)}
                            className="rounded"
                        />
                        <span className="text-gray-700 dark:text-gray-300">Auto-lint on change</span>
                    </label>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={lint}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
                        >
                            Lint Now
                        </button>
                        <button
                            onClick={() => {
                                setDockerfile("")
                                setIssues([])
                                toast.success("Cleared")
                            }}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                            <RotateCcw className="w-4 h-4 inline mr-2" />
                            Clear
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Dockerfile Editor */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Dockerfile Content
                        </label>
                        <textarea
                            value={dockerfile}
                            onChange={(e) => setDockerfile(e.target.value)}
                            className="w-full h-[600px] p-4 font-mono text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={`FROM ubuntu:22.04

RUN apt-get update && apt-get install -y \\
    curl \\
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY . .

RUN useradd -m appuser
USER appuser

HEALTHCHECK --interval=30s CMD curl -f http://localhost/ || exit 1

CMD ["./app"]`}
                            spellCheck={false}
                        />
                    </div>

                    {/* Issues Panel */}
                    <div className="flex flex-col">
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Issues ({issues.length})
                            </label>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={copyReport}
                                    className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                                    title="Copy report"
                                >
                                    <Copy className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={downloadReport}
                                    className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                                    title="Download report"
                                >
                                    <Download className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Summary Stats */}
                        <div className="flex gap-4 mb-4 p-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">{errorCount} errors</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">{warningCount} warnings</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">{infoCount} info</span>
                            </div>
                        </div>

                        {/* Issues List */}
                        <div className="overflow-auto h-[520px] border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 p-4">
                            {issues.length === 0 ? (
                                <div className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5" />
                                    <span>No issues found - Dockerfile follows best practices!</span>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {issues.map((issue, idx) => (
                                        <div
                                            key={idx}
                                            className={`text-sm p-3 rounded-lg border-l-4 ${getSeverityColor(issue.severity)}`}
                                        >
                                            <div className="flex items-start gap-2 mb-2">
                                                {getSeverityIcon(issue.severity)}
                                                <div className="flex-1">
                                                    <div className="font-semibold flex items-center gap-2">
                                                        <span>{issue.id}</span>
                                                        <span className="text-xs opacity-70">Line {issue.line}</span>
                                                    </div>
                                                    <div className="text-xs opacity-70 mt-0.5">{issue.check}</div>
                                                </div>
                                            </div>
                                            <div className="font-medium mb-1">{issue.message}</div>
                                            <div className="text-xs opacity-90 mb-2">{issue.explanation}</div>
                                            <div className="bg-black/5 dark:bg-white/5 rounded p-2 mb-2">
                                                <div className="text-xs font-mono whitespace-pre-wrap">{issue.recommendation}</div>
                                            </div>
                                            {issue.references?.length > 0 && (
                                                <div className="text-xs">
                                                    <span className="opacity-70">Reference: </span>
                                                    <a
                                                        href={issue.references[0]}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="underline hover:opacity-70"
                                                    >
                                                        {issue.references[0]?.replace?.('https://', '')}
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Best Practices Info */}
                <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">Comprehensive Validation Rules:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm text-blue-800 dark:text-blue-200">
                        <div>• Syntax validation</div>
                        <div>• Security vulnerabilities</div>
                        <div>• Version pinning</div>
                        <div>• Package manager cleanup</div>
                        <div>• Layer optimization</div>
                        <div>• User privilege checks</div>
                        <div>• Secret exposure detection</div>
                        <div>• File permissions audit</div>
                        <div>• Multi-stage build hints</div>
                        <div>• Health check recommendations</div>
                        <div>• Metadata labels</div>
                        <div>• CMD/ENTRYPOINT best practices</div>
                    </div>
                </div>
            </div>
        </div>
    )
}