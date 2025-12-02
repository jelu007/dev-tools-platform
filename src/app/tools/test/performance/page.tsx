"use client"

import * as React from "react"
import { toast } from "sonner"
import { Play, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

interface BenchmarkResult {
    times: number[]
    min: number
    max: number
    avg: number
    p95: number
    p99: number
    total: number
}

export default function PerformancePage() {
    const [url, setUrl] = React.useState("https://jsonplaceholder.typicode.com/todos/1")
    const [requests, setRequests] = React.useState(10)
    const [warmup, setWarmup] = React.useState(true)
    const [running, setRunning] = React.useState(false)
    const [result, setResult] = React.useState<BenchmarkResult | null>(null)

    const runBenchmark = async () => {
        if (!url) {
            toast.error("Please enter a URL")
            return
        }

        setRunning(true)
        setResult(null)
        const times: number[] = []

        try {
            // Warm-up request to establish connection
            if (warmup) {
                await fetch(url)
            }

            for (let i = 0; i < requests; i++) {
                const start = performance.now()
                await fetch(url)
                const end = performance.now()
                times.push(end - start)
            }

            // Calculate statistics
            const sorted = [...times].sort((a, b) => a - b)
            const min = Math.min(...times)
            const max = Math.max(...times)
            const avg = times.reduce((a, b) => a + b, 0) / times.length
            const p95Index = Math.floor(sorted.length * 0.95)
            const p99Index = Math.floor(sorted.length * 0.99)
            const p95 = sorted[p95Index]
            const p99 = sorted[p99Index]
            const total = times.reduce((a, b) => a + b, 0)

            setResult({ times, min, max, avg, p95, p99, total })
            toast.success("Benchmark completed")
        } catch (e) {
            toast.error("Benchmark failed")
        } finally {
            setRunning(false)
        }
    }

    return (
        <div className="h-full flex flex-col space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Performance Tester</h2>
                <p className="text-muted-foreground">
                    Benchmark API response times with multiple requests.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>URL</Label>
                            <Input
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://api.example.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Number of Requests</Label>
                            <Input
                                type="number"
                                min={1}
                                max={10000}
                                value={requests}
                                onChange={(e) => setRequests(Math.min(10000, Math.max(1, parseInt(e.target.value) || 1)))}
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="warmup"
                                checked={warmup}
                                onChange={(e) => setWarmup(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300"
                            />
                            <label htmlFor="warmup" className="text-sm">
                                Warm-up request (excludes cold start)
                            </label>
                        </div>
                        <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded">
                            💡 The first request is often slower due to DNS resolution, TCP connection, and SSL handshake. Enable warm-up to get more accurate performance metrics.
                        </div>
                        <Button onClick={runBenchmark} disabled={running} className="w-full">
                            <Play className="mr-2 h-4 w-4" />
                            {running ? "Running..." : "Run Benchmark"}
                        </Button>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {result ? (
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <div className="space-y-1">
                                        <div className="text-sm text-muted-foreground">Min</div>
                                        <div className="text-2xl font-bold">{result.min.toFixed(2)}ms</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-sm text-muted-foreground">Max</div>
                                        <div className="text-2xl font-bold">{result.max.toFixed(2)}ms</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-sm text-muted-foreground">Average</div>
                                        <div className="text-2xl font-bold">{result.avg.toFixed(2)}ms</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-sm text-muted-foreground">P95</div>
                                        <div className="text-2xl font-bold">{result.p95.toFixed(2)}ms</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-sm text-muted-foreground">P99</div>
                                        <div className="text-2xl font-bold">{result.p99.toFixed(2)}ms</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-sm text-muted-foreground">Total</div>
                                        <div className="text-2xl font-bold">{result.total.toFixed(2)}ms</div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="text-sm font-medium">Individual Request Times</div>
                                    <div className="max-h-[300px] overflow-y-auto border rounded-md p-4 bg-muted/30 font-mono text-sm space-y-1">
                                        {result.times.map((time, i) => (
                                            <div key={i} className="flex justify-between">
                                                <span>Request {i + 1}:</span>
                                                <span className="font-semibold">{time.toFixed(2)}ms</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="text-sm font-medium">Visual Distribution</div>
                                    <div className="space-y-1">
                                        {result.times.map((time, i) => {
                                            const percentage = (time / result.max) * 100
                                            return (
                                                <div key={i} className="flex items-center space-x-2">
                                                    <span className="text-xs w-16 text-muted-foreground">Req {i + 1}</span>
                                                    <div className="flex-1 bg-muted rounded-full h-4 overflow-hidden">
                                                        <div
                                                            className="bg-primary h-full transition-all"
                                                            style={{ width: `${percentage}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs w-16 text-right font-mono">{time.toFixed(0)}ms</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-muted-foreground py-12">
                                Configure and run a benchmark to see results
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
