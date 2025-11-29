"use client"

import * as React from "react"
import { minify } from "terser"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import { Copy, RefreshCw, FileCode, FileType } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import Editor from "@monaco-editor/react"

export default function MinifyPage() {
    const { theme } = useTheme()
    const [input, setInput] = React.useState("")
    const [output, setOutput] = React.useState("")
    const [language, setLanguage] = React.useState("javascript")

    const handleMinify = async () => {
        if (!input) return
        try {
            let result = ""
            if (language === "javascript") {
                const minified = await minify(input, { sourceMap: false })
                result = minified.code || ""
            } else if (language === "css") {
                // Simple CSS minifier regex
                result = input
                    .replace(/\/\*[\s\S]*?\*\//g, "") // Remove comments
                    .replace(/\s+/g, " ") // Collapse whitespace
                    .replace(/\s*([{}:;,])\s*/g, "$1") // Remove space around delimiters
                    .replace(/;}/g, "}") // Remove last semicolon
                    .trim()
            } else if (language === "html") {
                // Simple HTML minifier regex
                result = input
                    .replace(/<!--[\s\S]*?-->/g, "") // Remove comments
                    .replace(/\s+/g, " ") // Collapse whitespace
                    .replace(/>\s+</g, "><") // Remove space between tags
                    .trim()
            }
            setOutput(result)
            toast.success("Minified successfully")
        } catch (e) {
            toast.error("Minification failed")
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        toast.success("Copied to clipboard")
    }

    return (
        <div className="h-full flex flex-col space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Minifiers</h2>
                <p className="text-muted-foreground">
                    Minify JavaScript, CSS, and HTML.
                </p>
            </div>

            <Tabs defaultValue="javascript" onValueChange={setLanguage} className="flex-1 flex flex-col">
                <TabsList>
                    <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                    <TabsTrigger value="css">CSS</TabsTrigger>
                    <TabsTrigger value="html">HTML</TabsTrigger>
                </TabsList>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 mt-4">
                    <Card className="flex flex-col h-[500px]">
                        <CardHeader className="py-3 px-4 border-b bg-muted/30 flex flex-row justify-between items-center">
                            <span className="font-medium text-sm">Input</span>
                            <Button variant="ghost" size="icon" onClick={() => setInput("")}>
                                <RefreshCw className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0 flex-1">
                            <Editor
                                height="100%"
                                defaultLanguage={language}
                                theme={theme === "dark" ? "vs-dark" : "light"}
                                value={input}
                                onChange={(value) => setInput(value || "")}
                                options={{ minimap: { enabled: false }, fontSize: 14 }}
                            />
                        </CardContent>
                    </Card>

                    <Card className="flex flex-col h-[500px]">
                        <CardHeader className="py-3 px-4 border-b bg-muted/30 flex flex-row justify-between items-center">
                            <span className="font-medium text-sm">Output</span>
                            <div className="flex space-x-2">
                                <div className="text-xs text-muted-foreground flex items-center mr-2">
                                    {input && output && (
                                        <span>
                                            {((1 - output.length / input.length) * 100).toFixed(1)}% saved
                                        </span>
                                    )}
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(output)}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 flex-1">
                            <Editor
                                height="100%"
                                defaultLanguage={language}
                                theme={theme === "dark" ? "vs-dark" : "light"}
                                value={output}
                                options={{ readOnly: true, minimap: { enabled: false }, fontSize: 14, wordWrap: "on" }}
                            />
                        </CardContent>
                    </Card>
                </div>

                <div className="flex justify-end mt-4">
                    <Button onClick={handleMinify}>Minify {language.toUpperCase()}</Button>
                </div>
            </Tabs>
        </div>
    )
}
