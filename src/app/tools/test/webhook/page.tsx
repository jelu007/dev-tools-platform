"use client"

import * as React from "react"
import { toast } from "sonner"
import { Copy, Trash2, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface WebhookRequest {
    id: string
    timestamp: string
    method: string
    headers: Record<string, string>
    body: string
    query: Record<string, string>
}

export default function WebhookPage() {
    const [webhookId] = React.useState(() => Math.random().toString(36).substring(7))
    const [requests, setRequests] = React.useState<WebhookRequest[]>([])
    const [selectedRequest, setSelectedRequest] = React.useState<WebhookRequest | null>(null)

    const webhookUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/api/webhook/${webhookId}`
        : ''

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        toast.success("Copied to clipboard")
    }

    const clearRequests = () => {
        setRequests([])
        setSelectedRequest(null)
        toast.success("Cleared all requests")
    }

    const sendTestWebhook = async () => {
        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Test-Header': 'test-value'
                },
                body: JSON.stringify({
                    event: 'test',
                    timestamp: new Date().toISOString(),
                    data: {
                        message: 'This is a test webhook'
                    }
                })
            })

            if (response.ok) {
                toast.success("Test webhook sent")
            }
        } catch (e) {
            toast.error("Failed to send test webhook")
        }
    }

    return (
        <div className="h-full flex flex-col space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Webhook Tester</h2>
                <p className="text-muted-foreground">
                    Test webhooks with a temporary endpoint. Note: This is a demo - requests are simulated locally.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Your Webhook URL</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex space-x-2">
                        <Input
                            value={webhookUrl}
                            readOnly
                            className="font-mono text-sm"
                        />
                        <Button variant="outline" onClick={() => copyToClipboard(webhookUrl)}>
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex space-x-2">
                        <Button onClick={sendTestWebhook} variant="outline">
                            Send Test Request
                        </Button>
                        <Button onClick={clearRequests} variant="outline">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Clear All
                        </Button>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        💡 This is a demo implementation. In production, this would create a real temporary endpoint
                        that receives webhooks. For now, use the "Send Test Request" button to simulate incoming webhooks.
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Received Requests ({requests.length})</CardTitle>
                        <Button variant="ghost" size="icon" onClick={() => setRequests([])}>
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {requests.length > 0 ? (
                            <div className="space-y-2 max-h-[500px] overflow-y-auto">
                                {requests.map((req) => (
                                    <div
                                        key={req.id}
                                        onClick={() => setSelectedRequest(req)}
                                        className={`p-3 rounded-md border cursor-pointer transition-colors ${selectedRequest?.id === req.id
                                                ? 'bg-primary/10 border-primary'
                                                : 'hover:bg-muted/50'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-mono text-sm font-semibold">{req.method}</span>
                                            <span className="text-xs text-muted-foreground">{req.timestamp}</span>
                                        </div>
                                        <div className="text-xs text-muted-foreground truncate">
                                            {req.body ? JSON.parse(req.body).event || 'Request' : 'Empty body'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-muted-foreground py-12">
                                No requests received yet. Send a test request to see it here.
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Request Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {selectedRequest ? (
                            <div className="space-y-4">
                                <div>
                                    <Label className="text-sm font-semibold">Method</Label>
                                    <div className="mt-1 p-2 bg-muted rounded font-mono text-sm">
                                        {selectedRequest.method}
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-sm font-semibold">Timestamp</Label>
                                    <div className="mt-1 p-2 bg-muted rounded font-mono text-sm">
                                        {selectedRequest.timestamp}
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-sm font-semibold">Headers</Label>
                                    <div className="mt-1 p-2 bg-muted rounded font-mono text-xs max-h-[150px] overflow-y-auto">
                                        <pre>{JSON.stringify(selectedRequest.headers, null, 2)}</pre>
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-sm font-semibold">Body</Label>
                                    <div className="mt-1 p-2 bg-muted rounded font-mono text-xs max-h-[200px] overflow-y-auto">
                                        <pre>{selectedRequest.body ? JSON.stringify(JSON.parse(selectedRequest.body), null, 2) : 'Empty'}</pre>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => copyToClipboard(selectedRequest.body)}
                                    className="w-full"
                                >
                                    <Copy className="mr-2 h-4 w-4" />
                                    Copy Body
                                </Button>
                            </div>
                        ) : (
                            <div className="text-center text-muted-foreground py-12">
                                Select a request to view details
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-muted/30">
                <CardHeader>
                    <CardTitle className="text-sm">How to use</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                    <p>1. Copy the webhook URL above</p>
                    <p>2. Configure it in your application or service</p>
                    <p>3. Send webhooks to this URL</p>
                    <p>4. View incoming requests in real-time</p>
                    <p className="text-xs text-muted-foreground mt-4">
                        Note: This demo uses local simulation. In a production environment, this would create
                        a real temporary endpoint using services like webhook.site or a custom backend.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
