"use client"

import * as React from "react"
import { jwtDecode } from "jwt-decode"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import { Copy, AlertCircle, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Editor from "@monaco-editor/react"

export default function JwtDecoderPage() {
    const { theme } = useTheme()
    const [token, setToken] = React.useState("")
    const [header, setHeader] = React.useState<any>(null)
    const [payload, setPayload] = React.useState<any>(null)
    const [error, setError] = React.useState<string | null>(null)

    React.useEffect(() => {
        if (!token) {
            setHeader(null)
            setPayload(null)
            setError(null)
            return
        }

        try {
            const decodedHeader = jwtDecode(token, { header: true })
            const decodedPayload = jwtDecode(token)
            setHeader(decodedHeader)
            setPayload(decodedPayload)
            setError(null)
        } catch (e) {
            setHeader(null)
            setPayload(null)
            setError("Invalid JWT Token")
        }
    }, [token])

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        toast.success("Copied to clipboard")
    }

    const isExpired = payload?.exp ? payload.exp * 1000 < Date.now() : false

    return (
        <div className="h-full flex flex-col space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">JWT Decoder</h2>
                <p className="text-muted-foreground">
                    Decode and inspect JSON Web Tokens.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <Card className="h-full flex flex-col">
                        <CardHeader>
                            <CardTitle>Encoded Token</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <Textarea
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                className="h-full min-h-[200px] font-mono resize-none"
                                placeholder="Paste JWT here..."
                            />
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {error ? (
                                <div className="flex items-center text-red-500">
                                    <AlertCircle className="mr-2 h-4 w-4" />
                                    {error}
                                </div>
                            ) : payload ? (
                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                        <span className="text-green-500 font-medium">Valid Format</span>
                                    </div>
                                    {payload.exp && (
                                        <div className={`flex items-center ${isExpired ? "text-red-500" : "text-green-500"}`}>
                                            <AlertCircle className="mr-2 h-4 w-4" />
                                            {isExpired ? `Expired at ${new Date(payload.exp * 1000).toLocaleString()}` : `Expires at ${new Date(payload.exp * 1000).toLocaleString()}`}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-muted-foreground">Waiting for input...</div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Header</CardTitle>
                            <Button variant="ghost" size="icon" onClick={() => copyToClipboard(JSON.stringify(header, null, 2))}>
                                <Copy className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className="h-[150px]">
                            <Editor
                                height="100%"
                                defaultLanguage="json"
                                theme={theme === "dark" ? "vs-dark" : "light"}
                                value={header ? JSON.stringify(header, null, 2) : ""}
                                options={{ readOnly: true, minimap: { enabled: false }, fontSize: 14 }}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Payload</CardTitle>
                            <Button variant="ghost" size="icon" onClick={() => copyToClipboard(JSON.stringify(payload, null, 2))}>
                                <Copy className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            <Editor
                                height="100%"
                                defaultLanguage="json"
                                theme={theme === "dark" ? "vs-dark" : "light"}
                                value={payload ? JSON.stringify(payload, null, 2) : ""}
                                options={{ readOnly: true, minimap: { enabled: false }, fontSize: 14 }}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
