"use client"

import * as React from "react"
import { toast } from "sonner"
import { Play, Globe, Network, Activity } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function HttpDiagnosticsPage() {
    const [httpUrl, setHttpUrl] = React.useState("https://www.google.com")
    const [httpResult, setHttpResult] = React.useState<any>(null)
    const [httpLoading, setHttpLoading] = React.useState(false)

    const [dnsHost, setDnsHost] = React.useState("google.com")
    const [dnsResult, setDnsResult] = React.useState<any>(null)
    const [dnsLoading, setDnsLoading] = React.useState(false)

    const [pingHost, setPingHost] = React.useState("google.com")
    const [pingResult, setPingResult] = React.useState<any>(null)
    const [pingLoading, setPingLoading] = React.useState(false)

    const testHttp = async () => {
        setHttpLoading(true)
        setHttpResult(null)
        try {
            const start = performance.now()

            // Use the proxy to avoid CORS issues
            const response = await fetch("/api/proxy", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    url: httpUrl,
                    method: "HEAD",
                    headers: {},
                }),
            })

            const end = performance.now()
            const data = await response.json()

            if (data.error) {
                setHttpResult({
                    error: data.error,
                    ok: false
                })
            } else {
                setHttpResult({
                    status: data.status,
                    statusText: data.statusText,
                    headers: data.headers,
                    time: (end - start).toFixed(2),
                    ok: data.status >= 200 && data.status < 300
                })
            }

            toast.success("HTTP check completed")
        } catch (e: any) {
            setHttpResult({
                error: e.message,
                ok: false
            })
            toast.error("HTTP check failed")
        } finally {
            setHttpLoading(false)
        }
    }

    const testDns = async () => {
        setDnsLoading(true)
        setDnsResult(null)
        try {
            // Browser DNS lookup simulation using fetch
            const start = performance.now()
            await fetch(`https://${dnsHost}`, { method: 'HEAD', mode: 'no-cors' })
            const end = performance.now()

            setDnsResult({
                host: dnsHost,
                resolved: true,
                time: (end - start).toFixed(2),
                message: "DNS resolution successful (browser-based check)"
            })
            toast.success("DNS lookup completed")
        } catch (e: any) {
            setDnsResult({
                host: dnsHost,
                resolved: false,
                error: e.message
            })
            toast.error("DNS lookup failed")
        } finally {
            setDnsLoading(false)
        }
    }

    const testPing = async () => {
        setPingLoading(true)
        setPingResult(null)
        try {
            const times: number[] = []
            for (let i = 0; i < 4; i++) {
                const start = performance.now()
                await fetch(`https://${pingHost}`, { method: 'HEAD', mode: 'no-cors' })
                const end = performance.now()
                times.push(end - start)
            }

            const avg = times.reduce((a, b) => a + b, 0) / times.length
            const min = Math.min(...times)
            const max = Math.max(...times)

            setPingResult({
                host: pingHost,
                times,
                avg: avg.toFixed(2),
                min: min.toFixed(2),
                max: max.toFixed(2),
                success: true
            })
            toast.success("Ping test completed")
        } catch (e: any) {
            setPingResult({
                host: pingHost,
                error: e.message,
                success: false
            })
            toast.error("Ping test failed")
        } finally {
            setPingLoading(false)
        }
    }

    return (
        <div className="h-full flex flex-col space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">HTTP/Port Diagnostics</h2>
                <p className="text-muted-foreground">
                    Test HTTP connectivity, DNS resolution, and network latency.
                </p>
            </div>

            <Tabs defaultValue="http" className="flex-1">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="http">HTTP Inspector</TabsTrigger>
                    <TabsTrigger value="dns">DNS Lookup</TabsTrigger>
                    <TabsTrigger value="ping">Ping Test</TabsTrigger>
                </TabsList>

                <TabsContent value="http" className="space-y-4 mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Globe className="mr-2 h-5 w-5" />
                                    HTTP Request
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>URL</Label>
                                    <Input
                                        value={httpUrl}
                                        onChange={(e) => setHttpUrl(e.target.value)}
                                        placeholder="https://example.com"
                                    />
                                </div>
                                <Button onClick={testHttp} disabled={httpLoading} className="w-full">
                                    <Play className="mr-2 h-4 w-4" />
                                    {httpLoading ? "Testing..." : "Test HTTP"}
                                </Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Results</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {httpResult ? (
                                    httpResult.error ? (
                                        <div className="text-red-500 p-4 bg-red-50 dark:bg-red-900/20 rounded">
                                            <div className="font-semibold mb-2">Error</div>
                                            <div className="text-sm">{httpResult.error}</div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <div className="text-sm text-muted-foreground">Status</div>
                                                    <div className={`text-2xl font-bold ${httpResult.ok ? 'text-green-500' : 'text-red-500'}`}>
                                                        {httpResult.status}
                                                    </div>
                                                    <div className="text-sm">{httpResult.statusText}</div>
                                                </div>
                                                <div>
                                                    <div className="text-sm text-muted-foreground">Response Time</div>
                                                    <div className="text-2xl font-bold">{httpResult.time}ms</div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold mb-2">Headers</div>
                                                <div className="max-h-[200px] overflow-y-auto border rounded p-2 bg-muted/30 font-mono text-xs">
                                                    {Object.entries(httpResult.headers).map(([key, value]) => (
                                                        <div key={key} className="py-1">
                                                            <span className="text-primary">{key}:</span> {value as string}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                ) : (
                                    <div className="text-center text-muted-foreground py-12">
                                        Enter a URL and click Test HTTP
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="dns" className="space-y-4 mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Network className="mr-2 h-5 w-5" />
                                    DNS Lookup
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Hostname</Label>
                                    <Input
                                        value={dnsHost}
                                        onChange={(e) => setDnsHost(e.target.value)}
                                        placeholder="example.com"
                                    />
                                </div>
                                <Button onClick={testDns} disabled={dnsLoading} className="w-full">
                                    <Play className="mr-2 h-4 w-4" />
                                    {dnsLoading ? "Looking up..." : "Lookup DNS"}
                                </Button>
                                <div className="text-xs text-muted-foreground">
                                    Note: Browser-based DNS check. For detailed DNS records, use command-line tools.
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Results</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {dnsResult ? (
                                    dnsResult.error ? (
                                        <div className="text-red-500 p-4 bg-red-50 dark:bg-red-900/20 rounded">
                                            <div className="font-semibold mb-2">DNS Resolution Failed</div>
                                            <div className="text-sm">{dnsResult.error}</div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="flex items-center space-x-2">
                                                <div className={`h-3 w-3 rounded-full ${dnsResult.resolved ? 'bg-green-500' : 'bg-red-500'}`} />
                                                <span className="font-semibold">
                                                    {dnsResult.resolved ? 'Resolved' : 'Failed'}
                                                </span>
                                            </div>
                                            <div>
                                                <div className="text-sm text-muted-foreground">Host</div>
                                                <div className="font-mono text-lg">{dnsResult.host}</div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-muted-foreground">Resolution Time</div>
                                                <div className="text-2xl font-bold">{dnsResult.time}ms</div>
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {dnsResult.message}
                                            </div>
                                        </div>
                                    )
                                ) : (
                                    <div className="text-center text-muted-foreground py-12">
                                        Enter a hostname and click Lookup DNS
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="ping" className="space-y-4 mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Activity className="mr-2 h-5 w-5" />
                                    Ping Test
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Hostname</Label>
                                    <Input
                                        value={pingHost}
                                        onChange={(e) => setPingHost(e.target.value)}
                                        placeholder="example.com"
                                    />
                                </div>
                                <Button onClick={testPing} disabled={pingLoading} className="w-full">
                                    <Play className="mr-2 h-4 w-4" />
                                    {pingLoading ? "Pinging..." : "Ping (4 packets)"}
                                </Button>
                                <div className="text-xs text-muted-foreground">
                                    Note: Browser-based latency test using HTTP requests. Not actual ICMP ping.
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Results</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {pingResult ? (
                                    pingResult.error ? (
                                        <div className="text-red-500 p-4 bg-red-50 dark:bg-red-900/20 rounded">
                                            <div className="font-semibold mb-2">Ping Failed</div>
                                            <div className="text-sm">{pingResult.error}</div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div>
                                                <div className="text-sm text-muted-foreground mb-2">Statistics</div>
                                                <div className="grid grid-cols-3 gap-4">
                                                    <div>
                                                        <div className="text-xs text-muted-foreground">Min</div>
                                                        <div className="text-xl font-bold">{pingResult.min}ms</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-muted-foreground">Avg</div>
                                                        <div className="text-xl font-bold">{pingResult.avg}ms</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-muted-foreground">Max</div>
                                                        <div className="text-xl font-bold">{pingResult.max}ms</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold mb-2">Individual Times</div>
                                                <div className="space-y-1">
                                                    {pingResult.times.map((time: number, i: number) => (
                                                        <div key={i} className="flex items-center justify-between text-sm">
                                                            <span className="text-muted-foreground">Packet {i + 1}</span>
                                                            <span className="font-mono font-semibold">{time.toFixed(2)}ms</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                ) : (
                                    <div className="text-center text-muted-foreground py-12">
                                        Enter a hostname and click Ping
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
