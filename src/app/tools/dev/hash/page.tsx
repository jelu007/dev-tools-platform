"use client"

import * as React from "react"
import CryptoJS from "crypto-js"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import { Copy, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"

export default function HashPage() {
    const [input, setInput] = React.useState("")
    const [secret, setSecret] = React.useState("")

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        toast.success("Copied to clipboard")
    }

    const Hasher = ({ algo, label }: { algo: (text: string) => any, label: string }) => {
        const hash = React.useMemo(() => {
            if (!input) return ""
            try {
                return algo(input).toString()
            } catch (e) {
                return "Error"
            }
        }, [algo, input])

        return (
            <div className="space-y-2">
                <Label>{label}</Label>
                <div className="flex space-x-2">
                    <Input value={hash} readOnly className="font-mono" />
                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(hash)}>
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        )
    }

    const HmacHasher = ({ algo, label }: { algo: (text: string, secret: string) => any, label: string }) => {
        const hash = React.useMemo(() => {
            if (!input || !secret) return ""
            try {
                return algo(input, secret).toString()
            } catch (e) {
                return "Error"
            }
        }, [algo, input, secret])

        return (
            <div className="space-y-2">
                <Label>{label}</Label>
                <div className="flex space-x-2">
                    <Input value={hash} readOnly className="font-mono" />
                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(hash)}>
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="h-full flex flex-col space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Hash & Encode</h2>
                <p className="text-muted-foreground">
                    Generate hashes and encode/decode strings.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Input</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="min-h-[150px]"
                                placeholder="Enter text to hash/encode..."
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Base64</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Encoded</Label>
                                <div className="flex space-x-2">
                                    <Textarea
                                        value={input ? CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(input)) : ""}
                                        readOnly
                                        className="font-mono min-h-[100px]"
                                    />
                                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(input ? CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(input)) : "")}>
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Decoded (from Base64 input)</Label>
                                <div className="flex space-x-2">
                                    <Textarea
                                        value={(() => {
                                            try {
                                                return input ? CryptoJS.enc.Base64.parse(input).toString(CryptoJS.enc.Utf8) : ""
                                            } catch { return "Invalid Base64" }
                                        })()}
                                        readOnly
                                        className="font-mono min-h-[100px]"
                                    />
                                    <Button variant="ghost" size="icon" onClick={() => {
                                        try {
                                            copyToClipboard(input ? CryptoJS.enc.Base64.parse(input).toString(CryptoJS.enc.Utf8) : "")
                                        } catch { }
                                    }}>
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Tabs defaultValue="hash">
                        <TabsList className="w-full">
                            <TabsTrigger value="hash" className="flex-1">Hashing</TabsTrigger>
                            <TabsTrigger value="hmac" className="flex-1">HMAC</TabsTrigger>
                        </TabsList>
                        <TabsContent value="hash" className="space-y-4 mt-4">
                            <Card>
                                <CardContent className="space-y-4 pt-6">
                                    <Hasher algo={CryptoJS.MD5} label="MD5" />
                                    <Hasher algo={CryptoJS.SHA1} label="SHA1" />
                                    <Hasher algo={CryptoJS.SHA256} label="SHA256" />
                                    <Hasher algo={CryptoJS.SHA512} label="SHA512" />
                                    <Hasher algo={CryptoJS.RIPEMD160} label="RIPEMD160" />
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="hmac" className="space-y-4 mt-4">
                            <Card>
                                <CardContent className="space-y-4 pt-6">
                                    <div className="space-y-2">
                                        <Label>Secret Key</Label>
                                        <Input
                                            value={secret}
                                            onChange={(e) => setSecret(e.target.value)}
                                            placeholder="Enter secret key..."
                                            type="password"
                                        />
                                    </div>
                                    <HmacHasher algo={CryptoJS.HmacMD5} label="HMAC-MD5" />
                                    <HmacHasher algo={CryptoJS.HmacSHA1} label="HMAC-SHA1" />
                                    <HmacHasher algo={CryptoJS.HmacSHA256} label="HMAC-SHA256" />
                                    <HmacHasher algo={CryptoJS.HmacSHA512} label="HMAC-SHA512" />
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
