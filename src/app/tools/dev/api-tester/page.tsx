"use client"

import * as React from "react"
import Editor from "@monaco-editor/react"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import { Play, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function ApiTesterPage() {
    const { theme } = useTheme()
    const [method, setMethod] = React.useState("GET")
    const [url, setUrl] = React.useState("https://jsonplaceholder.typicode.com/todos/1")
    const [headers, setHeaders] = React.useState<{ key: string; value: string }[]>([{ key: "", value: "" }])
    const [body, setBody] = React.useState("")
    const [response, setResponse] = React.useState<any>(null)
    const [loading, setLoading] = React.useState(false)

    // Auth state
    const [authType, setAuthType] = React.useState("none")
    const [bearerToken, setBearerToken] = React.useState("")
    const [basicUsername, setBasicUsername] = React.useState("")
    const [basicPassword, setBasicPassword] = React.useState("")
    const [apiKey, setApiKey] = React.useState("")
    const [apiKeyHeader, setApiKeyHeader] = React.useState("X-API-Key")

    const addHeader = () => {
        setHeaders([...headers, { key: "", value: "" }])
    }

    const removeHeader = (index: number) => {
        const newHeaders = [...headers]
        newHeaders.splice(index, 1)
        setHeaders(newHeaders)
    }

    const updateHeader = (index: number, field: "key" | "value", value: string) => {
        const newHeaders = [...headers]
        newHeaders[index][field] = value
        setHeaders(newHeaders)
    }

    const handleSend = async () => {
        setLoading(true)
        setResponse(null)
        try {
            const headerObj: Record<string, string> = {}
            headers.forEach((h) => {
                if (h.key) headerObj[h.key] = h.value
            })

            // Add auth headers based on type
            if (authType === "bearer" && bearerToken) {
                headerObj["Authorization"] = `Bearer ${bearerToken}`
            } else if (authType === "basic" && basicUsername) {
                const encoded = btoa(`${basicUsername}:${basicPassword}`)
                headerObj["Authorization"] = `Basic ${encoded}`
            } else if (authType === "apikey" && apiKey) {
                headerObj[apiKeyHeader] = apiKey
            }

            const res = await fetch("/api/proxy", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    url,
                    method,
                    headers: headerObj,
                    body: body || undefined,
                }),
            })

            const data = await res.json()
            setResponse(data)
            if (data.error) {
                toast.error("Request failed")
            } else {
                toast.success(`Status: ${data.status} ${data.statusText}`)
            }
        } catch (e) {
            toast.error("An error occurred")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="h-full flex flex-col space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">API Request Tester</h2>
                    <p className="text-muted-foreground">
                        Test HTTP requests with custom headers and body.
                    </p>
                </div>
            </div>

            <div className="flex space-x-2">
                <Select value={method} onValueChange={setMethod}>
                    <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Method" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="GET">GET</SelectItem>
                        <SelectItem value="POST">POST</SelectItem>
                        <SelectItem value="PUT">PUT</SelectItem>
                        <SelectItem value="DELETE">DELETE</SelectItem>
                        <SelectItem value="PATCH">PATCH</SelectItem>
                    </SelectContent>
                </Select>
                <Input
                    placeholder="Enter URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1"
                />
                <Button onClick={handleSend} disabled={loading}>
                    <Play className="mr-2 h-4 w-4" />
                    {loading ? "Sending..." : "Send"}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
                <Card className="p-4 flex flex-col h-full">
                    <Tabs defaultValue="params" className="flex-1 flex flex-col">
                        <TabsList>
                            <TabsTrigger value="params">Params</TabsTrigger>
                            <TabsTrigger value="auth">Auth</TabsTrigger>
                            <TabsTrigger value="headers">Headers</TabsTrigger>
                            <TabsTrigger value="body">Body</TabsTrigger>
                        </TabsList>
                        <TabsContent value="params" className="mt-4">
                            <div className="text-sm text-muted-foreground">Query params editing coming soon. Edit URL directly for now.</div>
                        </TabsContent>
                        <TabsContent value="auth" className="mt-4 space-y-4">
                            <div className="space-y-2">
                                <Label>Auth Type</Label>
                                <Select value={authType} onValueChange={setAuthType}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">No Auth</SelectItem>
                                        <SelectItem value="bearer">Bearer Token</SelectItem>
                                        <SelectItem value="basic">Basic Auth</SelectItem>
                                        <SelectItem value="apikey">API Key</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {authType === "bearer" && (
                                <div className="space-y-2">
                                    <Label>Token</Label>
                                    <Input
                                        type="password"
                                        placeholder="Enter bearer token"
                                        value={bearerToken}
                                        onChange={(e) => setBearerToken(e.target.value)}
                                    />
                                </div>
                            )}

                            {authType === "basic" && (
                                <>
                                    <div className="space-y-2">
                                        <Label>Username</Label>
                                        <Input
                                            placeholder="Enter username"
                                            value={basicUsername}
                                            onChange={(e) => setBasicUsername(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Password</Label>
                                        <Input
                                            type="password"
                                            placeholder="Enter password"
                                            value={basicPassword}
                                            onChange={(e) => setBasicPassword(e.target.value)}
                                        />
                                    </div>
                                </>
                            )}

                            {authType === "apikey" && (
                                <>
                                    <div className="space-y-2">
                                        <Label>Header Name</Label>
                                        <Input
                                            placeholder="X-API-Key"
                                            value={apiKeyHeader}
                                            onChange={(e) => setApiKeyHeader(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>API Key</Label>
                                        <Input
                                            type="password"
                                            placeholder="Enter API key"
                                            value={apiKey}
                                            onChange={(e) => setApiKey(e.target.value)}
                                        />
                                    </div>
                                </>
                            )}
                        </TabsContent>
                        <TabsContent value="headers" className="mt-4 space-y-2">
                            {headers.map((header, index) => (
                                <div key={index} className="flex space-x-2">
                                    <Input
                                        placeholder="Key"
                                        value={header.key}
                                        onChange={(e) => updateHeader(index, "key", e.target.value)}
                                    />
                                    <Input
                                        placeholder="Value"
                                        value={header.value}
                                        onChange={(e) => updateHeader(index, "value", e.target.value)}
                                    />
                                    <Button variant="ghost" size="icon" onClick={() => removeHeader(index)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button variant="outline" size="sm" onClick={addHeader}>
                                <Plus className="mr-2 h-4 w-4" /> Add Header
                            </Button>
                        </TabsContent>
                        <TabsContent value="body" className="mt-4 flex-1 h-[400px]">
                            <Editor
                                height="100%"
                                defaultLanguage="json"
                                theme={theme === "dark" ? "vs-dark" : "light"}
                                value={body}
                                onChange={(value) => setBody(value || "")}
                                options={{ minimap: { enabled: false }, fontSize: 14 }}
                            />
                        </TabsContent>
                    </Tabs>
                </Card>

                <Card className="p-4 flex flex-col h-full">
                    <Tabs defaultValue="response" className="flex-1 flex flex-col">
                        <TabsList>
                            <TabsTrigger value="response">Response Body</TabsTrigger>
                            <TabsTrigger value="headers">Response Headers</TabsTrigger>
                        </TabsList>
                        {response && (
                            <div className="mt-2 flex space-x-4 text-sm">
                                <span className={response.status >= 200 && response.status < 300 ? "text-green-500" : "text-red-500"}>
                                    Status: {response.status} {response.statusText}
                                </span>
                                <span>Time: {response.time}ms</span>
                                <span>Size: {response.size} B</span>
                            </div>
                        )}
                        <TabsContent value="response" className="mt-4 flex-1 h-[400px]">
                            <Editor
                                height="100%"
                                defaultLanguage="json"
                                theme={theme === "dark" ? "vs-dark" : "light"}
                                value={response ? (() => {
                                    try {
                                        // Try to parse and format as JSON
                                        const parsed = JSON.parse(response.body)
                                        return JSON.stringify(parsed, null, 2)
                                    } catch {
                                        // If not JSON, return as-is
                                        return response.body
                                    }
                                })() : ""}
                                options={{ readOnly: true, minimap: { enabled: false }, fontSize: 14, wordWrap: "on" }}
                            />
                        </TabsContent>
                        <TabsContent value="headers" className="mt-4 flex-1">
                            {response && response.headers ? (
                                <div className="space-y-1">
                                    {Object.entries(response.headers).map(([key, value]) => (
                                        <div key={key} className="grid grid-cols-3 gap-2 text-sm border-b py-1">
                                            <span className="font-medium">{key}</span>
                                            <span className="col-span-2 text-muted-foreground break-all">{value as string}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-muted-foreground">No response yet</div>
                            )}
                        </TabsContent>
                    </Tabs>
                </Card>
            </div>
        </div>
    )
}
