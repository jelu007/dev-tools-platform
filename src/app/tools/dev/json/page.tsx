"use client"

import * as React from "react"
import Editor from "@monaco-editor/react"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import { Copy, FileJson, RefreshCw, Check, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatJson, validateJson, jsonToYaml } from "@/lib/json-utils"
import { Card } from "@/components/ui/card"

export default function JsonToolsPage() {
    const { theme } = useTheme()
    const [input, setInput] = React.useState("")
    const [output, setOutput] = React.useState("")
    const [indent, setIndent] = React.useState("2")
    const [isValid, setIsValid] = React.useState<boolean | null>(null)
    const [error, setError] = React.useState<string | null>(null)

    const handleFormat = () => {
        try {
            const formatted = formatJson(input, parseInt(indent))
            setOutput(formatted)
            setIsValid(true)
            setError(null)
            toast.success("JSON formatted successfully")
        } catch (e) {
            setIsValid(false)
            setError("Invalid JSON")
            toast.error("Invalid JSON")
        }
    }

    const handleValidate = () => {
        const result = validateJson(input)
        setIsValid(result.isValid)
        setError(result.error || null)
        if (result.isValid) {
            toast.success("Valid JSON")
        } else {
            toast.error("Invalid JSON")
        }
    }

    const handleToYaml = () => {
        try {
            const yaml = jsonToYaml(input)
            setOutput(yaml)
            setIsValid(true)
            setError(null)
            toast.success("Converted to YAML")
        } catch (e) {
            setIsValid(false)
            setError("Invalid JSON")
            toast.error("Invalid JSON")
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        toast.success("Copied to clipboard")
    }

    return (
        <div className="h-full flex flex-col space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">JSON Tools</h2>
                    <p className="text-muted-foreground">
                        Format, validate, and convert JSON data.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Select value={indent} onValueChange={setIndent}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Indentation" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="2">2 Spaces</SelectItem>
                            <SelectItem value="4">4 Spaces</SelectItem>
                            <SelectItem value="8">8 Spaces</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Tabs defaultValue="formatter" className="flex-1 flex flex-col">
                <TabsList>
                    <TabsTrigger value="formatter">Formatter</TabsTrigger>
                    <TabsTrigger value="validator">Validator</TabsTrigger>
                    <TabsTrigger value="converter">Converter</TabsTrigger>
                </TabsList>

                <TabsContent value="formatter" className="flex-1 flex flex-col space-y-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[600px]">
                        <Card className="p-0 overflow-hidden flex flex-col">
                            <div className="p-2 border-b bg-muted/50 flex justify-between items-center">
                                <span className="text-sm font-medium">Input</span>
                                <Button variant="ghost" size="icon" onClick={() => setInput("")}>
                                    <RefreshCw className="h-4 w-4" />
                                </Button>
                            </div>
                            <Editor
                                height="100%"
                                defaultLanguage="json"
                                theme={theme === "dark" ? "vs-dark" : "light"}
                                value={input}
                                onChange={(value) => setInput(value || "")}
                                options={{ minimap: { enabled: false }, fontSize: 14 }}
                            />
                        </Card>
                        <Card className="p-0 overflow-hidden flex flex-col">
                            <div className="p-2 border-b bg-muted/50 flex justify-between items-center">
                                <span className="text-sm font-medium">Output</span>
                                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(output)}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                            <Editor
                                height="100%"
                                defaultLanguage="json"
                                theme={theme === "dark" ? "vs-dark" : "light"}
                                value={output}
                                options={{ readOnly: true, minimap: { enabled: false }, fontSize: 14 }}
                            />
                        </Card>
                    </div>
                    <div className="flex justify-end">
                        <Button onClick={handleFormat}>Format JSON</Button>
                    </div>
                </TabsContent>

                <TabsContent value="validator" className="flex-1 mt-4">
                    <Card className="p-0 overflow-hidden flex flex-col h-[600px]">
                        <div className="p-2 border-b bg-muted/50 flex justify-between items-center">
                            <span className="text-sm font-medium">Input JSON</span>
                            <div className="flex items-center space-x-2">
                                {isValid === true && <span className="text-green-500 flex items-center text-sm"><Check className="h-4 w-4 mr-1" /> Valid</span>}
                                {isValid === false && <span className="text-red-500 flex items-center text-sm"><AlertCircle className="h-4 w-4 mr-1" /> Invalid</span>}
                            </div>
                        </div>
                        <Editor
                            height="100%"
                            defaultLanguage="json"
                            theme={theme === "dark" ? "vs-dark" : "light"}
                            value={input}
                            onChange={(value) => setInput(value || "")}
                            options={{ minimap: { enabled: false }, fontSize: 14 }}
                        />
                    </Card>
                    <div className="flex justify-end mt-4">
                        <Button onClick={handleValidate}>Validate JSON</Button>
                    </div>
                    {error && (
                        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md">
                            {error}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="converter" className="flex-1 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[600px]">
                        <Card className="p-0 overflow-hidden flex flex-col">
                            <div className="p-2 border-b bg-muted/50 flex justify-between items-center">
                                <span className="text-sm font-medium">Input JSON</span>
                            </div>
                            <Editor
                                height="100%"
                                defaultLanguage="json"
                                theme={theme === "dark" ? "vs-dark" : "light"}
                                value={input}
                                onChange={(value) => setInput(value || "")}
                                options={{ minimap: { enabled: false }, fontSize: 14 }}
                            />
                        </Card>
                        <Card className="p-0 overflow-hidden flex flex-col">
                            <div className="p-2 border-b bg-muted/50 flex justify-between items-center">
                                <span className="text-sm font-medium">Output YAML</span>
                                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(output)}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                            <Editor
                                height="100%"
                                defaultLanguage="yaml"
                                theme={theme === "dark" ? "vs-dark" : "light"}
                                value={output}
                                options={{ readOnly: true, minimap: { enabled: false }, fontSize: 14 }}
                            />
                        </Card>
                    </div>
                    <div className="flex justify-end mt-4">
                        <Button onClick={handleToYaml}>Convert to YAML</Button>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
