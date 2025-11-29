"use client"

import * as React from "react"
import Link from "next/link"
// import jwtDecode from "jwt-decode"
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner"
import { Copy, RotateCcw, Play, Download } from "lucide-react"

import { Button } from "@/components/ui/button"

type JwtPayload = Record<string, any>

function isJwt(token: string) {
    return /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(token.trim())
}

function generateRandomToken(length = 32) {
    const bytes = crypto.getRandomValues(new Uint8Array(length))
    return Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")
}

export default function OAuthToolPage() {
    const [token, setToken] = React.useState("")
    const [header, setHeader] = React.useState<JwtPayload | null>(null)
    const [payload, setPayload] = React.useState<JwtPayload | null>(null)
    const [signature, setSignature] = React.useState<string | null>(null)

    const [provider, setProvider] = React.useState<"custom" | "keycloak">("custom")
    const [keycloakRealm, setKeycloakRealm] = React.useState("https://keycloak.example.com/realms/myrealm")
    const [keycloakClientId, setKeycloakClientId] = React.useState("")
    const [keycloakClientSecret, setKeycloakClientSecret] = React.useState("")

    const [introspectUrl, setIntrospectUrl] = React.useState("")
    const [introspectResult, setIntrospectResult] = React.useState<any>(null)
    const [userinfoUrl, setUserinfoUrl] = React.useState("")
    const [userinfoResult, setUserinfoResult] = React.useState<any>(null)
    const [useAuthHeader, setUseAuthHeader] = React.useState(true)
    const [authValue, setAuthValue] = React.useState("")

    const getIntrospectUrl = React.useCallback(() => {
        if (provider === "keycloak") {
            return `${keycloakRealm}/protocol/openid-connect/token/introspect`
        }
        return introspectUrl
    }, [provider, keycloakRealm, introspectUrl])

    const getUserinfoUrl = React.useCallback(() => {
        if (provider === "keycloak") {
            return `${keycloakRealm}/protocol/openid-connect/userinfo`
        }
        return userinfoUrl
    }, [provider, keycloakRealm, userinfoUrl])

    const getAuthHeader = React.useCallback(() => {
        if (provider === "keycloak" && keycloakClientId && keycloakClientSecret) {
            const credentials = btoa(`${keycloakClientId}:${keycloakClientSecret}`)
            return `Basic ${credentials}`
        }
        return authValue
    }, [provider, keycloakClientId, keycloakClientSecret, authValue])

    const decode = React.useCallback(() => {
        if (!token.trim()) {
            setHeader(null)
            setPayload(null)
            setSignature(null)
            toast.error("No token provided")
            return
        }

        if (!isJwt(token)) {
            setHeader(null)
            setPayload(null)
            setSignature(null)
            toast.error("Not a JWT (can't decode header/payload).")
            return
        }

        try {
            const parts = token.split(".")
            const rawHeader = JSON.parse(atob(parts[0].replace(/-/g, "+").replace(/_/g, "/")))
            const rawPayload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")))
            setHeader(rawHeader)
            setPayload(rawPayload)
            setSignature(parts[2])
            toast.success("Decoded JWT")
        } catch (e: any) {
            setHeader(null)
            setPayload(null)
            setSignature(null)
            toast.error(e?.message || "Decode error")
        }
    }, [token])

    const doIntrospect = React.useCallback(async () => {
        const url = getIntrospectUrl()
        if (!url.trim()) {
            toast.error("Provide an introspection URL")
            return
        }
        try {
            const headers: Record<string, string> = { "Content-Type": "application/x-www-form-urlencoded" }
            let body = `token=${encodeURIComponent(token)}`
            const auth = getAuthHeader()
            if (useAuthHeader && auth.trim()) {
                headers["Authorization"] = auth
            }

            const res = await fetch(url, { method: "POST", headers, body })
            const json = await res.json()
            setIntrospectResult(json)
            toast.success("Introspection response received")
        } catch (e: any) {
            setIntrospectResult({ error: e?.message || "Request failed" })
            toast.error(e?.message || "Introspection failed")
        }
    }, [token, getIntrospectUrl, useAuthHeader, getAuthHeader])

    const doUserinfo = React.useCallback(async () => {
        const url = getUserinfoUrl()
        if (!url.trim()) {
            toast.error("Provide a userinfo URL")
            return
        }
        try {
            const headers: Record<string, string> = {}
            const auth = getAuthHeader()
            if (auth.trim()) {
                headers["Authorization"] = `Bearer ${token}`
            }

            const res = await fetch(url, { method: "GET", headers })
            const json = await res.json()
            setUserinfoResult(json)
            toast.success("Userinfo response received")
        } catch (e: any) {
            setUserinfoResult({ error: e?.message || "Request failed" })
            toast.error(e?.message || "Userinfo request failed")
        }
    }, [token, getUserinfoUrl, getAuthHeader])

    const handleGenerate = () => {
        const t = `token-${generateRandomToken(24)}`
        setToken(t)
        setHeader(null)
        setPayload(null)
        setSignature(null)
        toast.success("Generated token (dummy)")
    }

    const copyToken = () => {
        navigator.clipboard.writeText(token || "")
        toast.success("Token copied")
    }

    const downloadToken = () => {
        const blob = new Blob([token || ""], { type: "text/plain;charset=utf-8" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "token.txt"
        document.body.appendChild(a)
        a.click()
        a.remove()
        URL.revokeObjectURL(url)
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">OAuth Token Generator / Inspector</h1>
                <p className="text-muted-foreground mt-2">Paste a token, decode JWTs, run introspection endpoints, or generate a dummy token for testing.</p>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Token</label>
                <textarea
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="w-full h-28 p-3 font-mono text-sm rounded-md border resize-none"
                    placeholder="Paste OAuth access token or JWT here"
                />
                <div className="flex gap-2">
                    <Button onClick={decode} size="sm">Decode</Button>
                    <Button onClick={handleGenerate} variant="outline" size="sm">Generate</Button>
                    <Button onClick={copyToken} variant="ghost" size="sm" title="Copy token"><Copy className="w-4 h-4" /></Button>
                    <Button onClick={downloadToken} variant="ghost" size="sm" title="Download token"><Download className="w-4 h-4" /></Button>
                    <Button onClick={() => { setToken(""); setHeader(null); setPayload(null); setSignature(null); setIntrospectResult(null); }} variant="outline" size="sm"><RotateCcw className="w-4 h-4 mr-2" />Clear</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-4">
                    <h3 className="font-semibold">Decoded JWT</h3>
                    {!header && !payload ? (
                        <div className="text-sm text-muted-foreground">No decoded JWT available (or token is not a JWT).</div>
                    ) : (
                        <div className="space-y-3">
                            <div>
                                <div className="text-xs text-muted-foreground">Header</div>
                                <pre className="bg-muted/5 p-3 rounded text-sm overflow-auto">{JSON.stringify(header, null, 2)}</pre>
                            </div>
                            <div>
                                <div className="text-xs text-muted-foreground">Payload</div>
                                <pre className="bg-muted/5 p-3 rounded text-sm overflow-auto">{JSON.stringify(payload, null, 2)}</pre>
                            </div>
                            <div>
                                <div className="text-xs text-muted-foreground">Signature</div>
                                <pre className="bg-muted/5 p-3 rounded text-sm overflow-auto">{signature}</pre>
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <h3 className="font-semibold">Introspection & Userinfo</h3>
                    <div className="space-y-2">
                        <div className="flex gap-2 items-center">
                            <label className="text-sm font-medium">Provider:</label>
                            <select value={provider} onChange={(e) => setProvider(e.target.value as any)} className="rounded-md border px-2 py-1">
                                <option value="custom">Custom</option>
                                <option value="keycloak">Keycloak OpenID Connect</option>
                            </select>
                        </div>

                        {provider === "keycloak" ? (
                            <div className="space-y-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-md border">
                                <input
                                    value={keycloakRealm}
                                    onChange={(e) => setKeycloakRealm(e.target.value)}
                                    placeholder="https://keycloak.example.com/realms/myrealm"
                                    className="w-full rounded-md border px-3 py-2"
                                />
                                <input
                                    value={keycloakClientId}
                                    onChange={(e) => setKeycloakClientId(e.target.value)}
                                    placeholder="Client ID"
                                    className="w-full rounded-md border px-3 py-2"
                                />
                                <input
                                    value={keycloakClientSecret}
                                    onChange={(e) => setKeycloakClientSecret(e.target.value)}
                                    placeholder="Client Secret (for introspection)"
                                    type="password"
                                    className="w-full rounded-md border px-3 py-2"
                                />
                                <div className="text-xs text-muted-foreground">Endpoints will auto-populate based on realm URL</div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <input
                                    value={introspectUrl}
                                    onChange={(e) => setIntrospectUrl(e.target.value)}
                                    placeholder="https://auth.example.com/oauth2/introspect"
                                    className="w-full rounded-md border px-3 py-2"
                                />
                                <input
                                    value={userinfoUrl}
                                    onChange={(e) => setUserinfoUrl(e.target.value)}
                                    placeholder="https://auth.example.com/oauth2/userinfo"
                                    className="w-full rounded-md border px-3 py-2"
                                />
                            </div>
                        )}

                        <div className="flex gap-2 items-center">
                            <label className="inline-flex items-center gap-2">
                                <input type="checkbox" checked={useAuthHeader} onChange={(e) => setUseAuthHeader(e.target.checked)} />
                                <span className="text-sm">Use Authorization header</span>
                            </label>
                        </div>
                        {useAuthHeader && provider === "custom" && (
                            <input
                                value={authValue}
                                onChange={(e) => setAuthValue(e.target.value)}
                                placeholder="Authorization value (e.g. Basic ... or Bearer ...)"
                                className="w-full rounded-md border px-3 py-2"
                            />
                        )}

                        <div className="flex gap-2">
                            <Button onClick={doIntrospect} size="sm" variant="outline">
                                <Play className="w-4 h-4 mr-2" />
                                Introspect Token
                            </Button>
                            <Button onClick={doUserinfo} size="sm" variant="outline">
                                <Play className="w-4 h-4 mr-2" />
                                Get Userinfo
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <div>
                                <div className="text-xs text-muted-foreground font-medium">Introspection Result</div>
                                <pre className="bg-muted/5 p-3 rounded text-sm overflow-auto max-h-48">{introspectResult ? JSON.stringify(introspectResult, null, 2) : "No response"}</pre>
                            </div>
                            <div>
                                <div className="text-xs text-muted-foreground font-medium">Userinfo Result</div>
                                <pre className="bg-muted/5 p-3 rounded text-sm overflow-auto max-h-48">{userinfoResult ? JSON.stringify(userinfoResult, null, 2) : "No response"}</pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <Link href="/tools/dev">← Back to Developer Tools</Link>
            </div>
        </div>
    )
}
