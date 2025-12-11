"use client"

import * as React from "react"
import { toast } from "sonner"
import { Play, Zap, Clock, Upload, FileJson } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface RequestResult {
    requestNumber: number
    duration: number
    status: number | null
    success: boolean
    error?: string
    arrayIndex?: number
}

interface BenchmarkResult {
    results: RequestResult[]
    min: number
    max: number
    avg: number
    p95: number
    p99: number
    total: number
    successCount: number
    failureCount: number
}

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE"
type ExecutionMode = "sequential" | "concurrent"
type DataSourceMode = "single" | "array"

export default function PerformancePage() {
    const [url, setUrl] = React.useState("https://jsonplaceholder.typicode.com/posts/1")
    const [method, setMethod] = React.useState<HttpMethod>("GET")
    const [requests, setRequests] = React.useState(10)
    const [executionMode, setExecutionMode] = React.useState<ExecutionMode>("sequential")
    const [warmup, setWarmup] = React.useState(true)
    const [running, setRunning] = React.useState(false)
    const [result, setResult] = React.useState<BenchmarkResult | null>(null)

    // Request configuration
    const [requestBody, setRequestBody] = React.useState('{\n  "title": "Test",\n  "body": "Test body",\n  "userId": 1\n}')
    const [queryParams, setQueryParams] = React.useState("")
    const [headers, setHeaders] = React.useState('{\n  "Content-Type": "application/json"\n}')

    // JSON Array data source
    const [dataSourceMode, setDataSourceMode] = React.useState<DataSourceMode>("single")
    const [jsonArrayData, setJsonArrayData] = React.useState<any[]>([])
    const [jsonArrayText, setJsonArrayText] = React.useState("")
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    const buildRequestUrl = () => {
        if (!queryParams.trim()) return url
        const separator = url.includes('?') ? '&' : '?'
        return `${url}${separator}${queryParams}`
    }

    const buildRequestOptions = (customBody?: string): RequestInit => {
        const options: RequestInit = {
            method,
        }

        // Add headers
        try {
            if (headers.trim()) {
                options.headers = JSON.parse(headers)
            }
        } catch (e) {
            // Use default headers if parsing fails
            options.headers = { "Content-Type": "application/json" }
        }

        // Add body for POST, PUT, DELETE
        if (method !== "GET") {
            const bodyToUse = customBody || requestBody
            if (bodyToUse.trim()) {
                try {
                    // Validate JSON
                    JSON.parse(bodyToUse)
                    options.body = bodyToUse
                } catch (e) {
                    // Invalid JSON, will be caught in runBenchmark
                }
            }
        }

        return options
    }

    const getRequestBodyForIndex = (requestIndex: number): string | undefined => {
        if (dataSourceMode === "single" || jsonArrayData.length === 0) {
            return undefined
        }

        const arrayIndex = requestIndex % jsonArrayData.length
        return JSON.stringify(jsonArrayData[arrayIndex])
    }

    const executeSingleRequest = async (requestNumber: number): Promise<RequestResult> => {
        const start = performance.now()
        const requestIndex = requestNumber - 1
        const customBody = getRequestBodyForIndex(requestIndex)
        const arrayIndex = dataSourceMode === "array" && jsonArrayData.length > 0
            ? requestIndex % jsonArrayData.length
            : undefined

        try {
            const response = await fetch(buildRequestUrl(), buildRequestOptions(customBody))
            const end = performance.now()

            return {
                requestNumber,
                duration: end - start,
                status: response.status,
                success: response.ok,
                arrayIndex,
            }
        } catch (error) {
            const end = performance.now()
            return {
                requestNumber,
                duration: end - start,
                status: null,
                success: false,
                error: error instanceof Error ? error.message : "Unknown error",
                arrayIndex,
            }
        }
    }

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (e) => {
            try {
                const text = e.target?.result as string
                const data = JSON.parse(text)

                if (!Array.isArray(data)) {
                    toast.error("JSON file must contain an array")
                    return
                }

                if (data.length === 0) {
                    toast.error("JSON array is empty")
                    return
                }

                setJsonArrayData(data)
                setJsonArrayText(JSON.stringify(data, null, 2))
                toast.success(`Loaded ${data.length} items from file`)
            } catch (error) {
                toast.error("Invalid JSON file")
            }
        }
        reader.readAsText(file)
    }

    const handleJsonArrayPaste = (text: string) => {
        setJsonArrayText(text)

        if (!text.trim()) {
            setJsonArrayData([])
            return
        }

        try {
            const data = JSON.parse(text)

            if (!Array.isArray(data)) {
                toast.error("JSON must be an array")
                setJsonArrayData([])
                return
            }

            if (data.length === 0) {
                toast.error("JSON array is empty")
                setJsonArrayData([])
                return
            }

            setJsonArrayData(data)
            toast.success(`Loaded ${data.length} items`)
        } catch (error) {
            // Don't show error while typing
            setJsonArrayData([])
        }
    }

    const clearJsonData = () => {
        setJsonArrayData([])
        setJsonArrayText("")
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
        toast.success("JSON data cleared")
    }

    const runBenchmark = async () => {
        if (!url) {
            toast.error("Please enter a URL")
            return
        }

        // Validate JSON body for non-GET requests
        if (method !== "GET" && requestBody.trim()) {
            try {
                JSON.parse(requestBody)
            } catch (e) {
                toast.error("Invalid JSON in request body")
                return
            }
        }

        // Validate headers JSON
        if (headers.trim()) {
            try {
                JSON.parse(headers)
            } catch (e) {
                toast.error("Invalid JSON in headers")
                return
            }
        }

        if (requests === 0) {
            toast.error("Number of requests must be greater than 0")
            return
        }

        setRunning(true)
        setResult(null)

        try {
            // Warm-up request to establish connection
            if (warmup) {
                await fetch(buildRequestUrl(), buildRequestOptions())
            }

            let results: RequestResult[] = []

            if (executionMode === "concurrent") {
                // Execute all requests concurrently
                const promises = Array.from({ length: requests }, (_, i) =>
                    executeSingleRequest(i + 1)
                )
                results = await Promise.all(promises)
            } else {
                // Execute requests sequentially
                for (let i = 0; i < requests; i++) {
                    const result = await executeSingleRequest(i + 1)
                    results.push(result)
                }
            }

            // Calculate statistics
            const successfulResults = results.filter(r => r.success)
            const times = results.map(r => r.duration)
            const sorted = [...times].sort((a, b) => a - b)

            const min = Math.min(...times)
            const max = Math.max(...times)
            const avg = times.reduce((a, b) => a + b, 0) / times.length
            const p95Index = Math.floor(sorted.length * 0.95)
            const p99Index = Math.floor(sorted.length * 0.99)
            const p95 = sorted[p95Index] || sorted[sorted.length - 1]
            const p99 = sorted[p99Index] || sorted[sorted.length - 1]
            const total = times.reduce((a, b) => a + b, 0)

            setResult({
                results,
                min,
                max,
                avg,
                p95,
                p99,
                total,
                successCount: successfulResults.length,
                failureCount: results.length - successfulResults.length,
            })

            toast.success(`Benchmark completed: ${successfulResults.length}/${results.length} successful`)
        } catch (e) {
            toast.error("Benchmark failed: " + (e instanceof Error ? e.message : "Unknown error"))
        } finally {
            setRunning(false)
        }
    }

    return (
        <div className="h-full flex flex-col space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">API Load Tester</h2>
                <p className="text-muted-foreground">
                    Send 0-5000 requests concurrently or sequentially with full HTTP method support.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>HTTP Method</Label>
                            <Select value={method} onValueChange={(v) => setMethod(v as HttpMethod)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="GET">GET</SelectItem>
                                    <SelectItem value="POST">POST</SelectItem>
                                    <SelectItem value="PUT">PUT</SelectItem>
                                    <SelectItem value="DELETE">DELETE</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>URL</Label>
                            <Input
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://api.example.com/endpoint"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Query Parameters (optional)</Label>
                            <Input
                                value={queryParams}
                                onChange={(e) => setQueryParams(e.target.value)}
                                placeholder="key1=value1&key2=value2"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Number of Requests (0-5000)</Label>
                            <Input
                                type="number"
                                min={0}
                                max={5000}
                                value={requests}
                                onChange={(e) => setRequests(Math.min(5000, Math.max(0, parseInt(e.target.value) || 0)))}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Execution Mode</Label>
                            <Select value={executionMode} onValueChange={(v) => setExecutionMode(v as ExecutionMode)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="sequential">
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            Sequential (one by one)
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="concurrent">
                                        <div className="flex items-center gap-2">
                                            <Zap className="h-4 w-4" />
                                            Concurrent (parallel)
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
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

                        <Tabs defaultValue="body" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="body">Request Body</TabsTrigger>
                                <TabsTrigger value="headers">Headers</TabsTrigger>
                            </TabsList>
                            <TabsContent value="body" className="space-y-4">
                                <div className="space-y-3">
                                    <Label className="text-sm font-medium">Data Source</Label>
                                    <RadioGroup
                                        value={dataSourceMode}
                                        onValueChange={(v) => setDataSourceMode(v as DataSourceMode)}
                                        disabled={method === "GET"}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="single" id="single" />
                                            <label htmlFor="single" className="text-sm cursor-pointer">
                                                Single Body (same for all requests)
                                            </label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="array" id="array" />
                                            <label htmlFor="array" className="text-sm cursor-pointer">
                                                JSON Array (different body per request)
                                            </label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                {dataSourceMode === "single" ? (
                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground">
                                            JSON Body (for POST, PUT, DELETE)
                                        </Label>
                                        <Textarea
                                            value={requestBody}
                                            onChange={(e) => setRequestBody(e.target.value)}
                                            placeholder='{"key": "value"}'
                                            className="font-mono text-xs min-h-[120px]"
                                            disabled={method === "GET"}
                                        />
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="space-y-2">
                                            <Label className="text-sm flex items-center gap-2">
                                                <Upload className="h-4 w-4" />
                                                Upload JSON File
                                            </Label>
                                            <Input
                                                ref={fileInputRef}
                                                type="file"
                                                accept=".json"
                                                onChange={handleFileUpload}
                                                disabled={method === "GET"}
                                                className="cursor-pointer"
                                            />
                                        </div>

                                        <div className="text-center text-xs text-muted-foreground">OR</div>

                                        <div className="space-y-2">
                                            <Label className="text-sm flex items-center gap-2">
                                                <FileJson className="h-4 w-4" />
                                                Paste JSON Array
                                            </Label>
                                            <Textarea
                                                value={jsonArrayText}
                                                onChange={(e) => handleJsonArrayPaste(e.target.value)}
                                                placeholder='[{"name": "User 1"}, {"name": "User 2"}]'
                                                className="font-mono text-xs min-h-[120px]"
                                                disabled={method === "GET"}
                                            />
                                        </div>

                                        {jsonArrayData.length > 0 && (
                                            <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                                                <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                                                    ✓ {jsonArrayData.length} items loaded
                                                </span>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={clearJsonData}
                                                    className="h-7"
                                                >
                                                    Clear
                                                </Button>
                                            </div>
                                        )}

                                        <div className="text-xs text-muted-foreground p-2 bg-muted/50 rounded">
                                            <strong>Note:</strong> Each array item will be used as the request body.
                                            If you have 100 items and send 100 requests, each request uses a different item.
                                        </div>
                                    </div>
                                )}
                            </TabsContent>
                            <TabsContent value="headers" className="space-y-2">
                                <Label className="text-xs text-muted-foreground">
                                    Custom Headers (JSON)
                                </Label>
                                <Textarea
                                    value={headers}
                                    onChange={(e) => setHeaders(e.target.value)}
                                    placeholder='{"Authorization": "Bearer token"}'
                                    className="font-mono text-xs min-h-[120px]"
                                />
                            </TabsContent>
                        </Tabs>

                        <Button onClick={runBenchmark} disabled={running} className="w-full">
                            <Play className="mr-2 h-4 w-4" />
                            {running ? "Running..." : "Run Load Test"}
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
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="space-y-1">
                                        <div className="text-sm text-muted-foreground">Success Rate</div>
                                        <div className="text-2xl font-bold">
                                            {result.successCount}/{result.results.length}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-sm text-muted-foreground">Average</div>
                                        <div className="text-2xl font-bold">{result.avg.toFixed(2)}ms</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-sm text-muted-foreground">Min</div>
                                        <div className="text-2xl font-bold">{result.min.toFixed(2)}ms</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-sm text-muted-foreground">Max</div>
                                        <div className="text-2xl font-bold">{result.max.toFixed(2)}ms</div>
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
                                        <div className="text-sm text-muted-foreground">Total Time</div>
                                        <div className="text-2xl font-bold">{result.total.toFixed(2)}ms</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-sm text-muted-foreground">Mode</div>
                                        <div className="text-lg font-bold capitalize">{executionMode}</div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="text-sm font-medium">Individual Request Results</div>
                                    <div className="max-h-[300px] overflow-y-auto border rounded-md p-4 bg-muted/30 font-mono text-sm space-y-1">
                                        {result.results.map((req) => (
                                            <div key={req.requestNumber} className="flex justify-between items-center">
                                                <span>
                                                    Request {req.requestNumber}:
                                                    {req.arrayIndex !== undefined && (
                                                        <span className="text-xs text-blue-600 dark:text-blue-400 ml-2">
                                                            [Array[{req.arrayIndex}]]
                                                        </span>
                                                    )}
                                                </span>
                                                <div className="flex items-center gap-3">
                                                    {req.success ? (
                                                        <>
                                                            <span className="text-xs text-green-600 dark:text-green-400">
                                                                {req.status}
                                                            </span>
                                                            <span className="font-semibold">{req.duration.toFixed(2)}ms</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span className="text-xs text-red-600 dark:text-red-400">
                                                                {req.status || "ERR"}
                                                            </span>
                                                            <span className="font-semibold text-red-600 dark:text-red-400">
                                                                {req.error || "Failed"}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="text-sm font-medium">Visual Distribution</div>
                                    <div className="space-y-1 max-h-[300px] overflow-y-auto">
                                        {result.results.map((req) => {
                                            const percentage = (req.duration / result.max) * 100
                                            return (
                                                <div key={req.requestNumber} className="flex items-center space-x-2">
                                                    <span className="text-xs w-16 text-muted-foreground">
                                                        Req {req.requestNumber}
                                                    </span>
                                                    <div className="flex-1 bg-muted rounded-full h-4 overflow-hidden">
                                                        <div
                                                            className={`h-full transition-all ${req.success ? "bg-primary" : "bg-red-500"
                                                                }`}
                                                            style={{ width: `${percentage}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs w-16 text-right font-mono">
                                                        {req.duration.toFixed(0)}ms
                                                    </span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-muted-foreground py-12">
                                Configure and run a load test to see results
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
