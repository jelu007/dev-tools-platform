"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import { Copy, RefreshCw, Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import Editor from "@monaco-editor/react"

export default function LogParserPage() {
    const { theme } = useTheme()
    const [input, setInput] = React.useState("")
    const [output, setOutput] = React.useState("")
    const [levels, setLevels] = React.useState({
        INFO: true,
        WARN: true,
        ERROR: true,
        DEBUG: true
    })

    React.useEffect(() => {
        parseLogs()
    }, [input, levels])

    const parseLogs = () => {
        if (!input) {
            setOutput("")
            return
        }

        const lines = input.split("\n")
        const filteredLines = lines.filter(line => {
            if (!line.trim()) return false

            let show = false
            if (levels.INFO && line.includes("INFO")) show = true
            else if (levels.WARN && line.includes("WARN")) show = true
            else if (levels.ERROR && line.includes("ERROR")) show = true
            else if (levels.DEBUG && line.includes("DEBUG")) show = true
            else if (!line.match(/INFO|WARN|ERROR|DEBUG/)) show = true // Show lines without level if they are part of stack trace or context? Or maybe hide? Let's show for now.

            return show
        })

        const beautified = filteredLines.map(line => {
            // Try to find JSON in the line
            try {
                const jsonMatch = line.match(/\{.*\}/)
                if (jsonMatch) {
                    const jsonStr = jsonMatch[0]
                    const parsed = JSON.parse(jsonStr)
                    return line.replace(jsonStr, JSON.stringify(parsed, null, 2))
                }
            } catch (e) {
                // Not valid JSON, ignore
            }
            return line
        }).join("\n")

        setOutput(beautified)
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        toast.success("Copied to clipboard")
    }

    return (
        <div className="h-full flex flex-col space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Log Parser</h2>
                <p className="text-muted-foreground">
                    Filter and beautify logs (supports JSON extraction).
                </p>
            </div>

            <div className="flex space-x-4 items-center">
                <Label className="flex items-center space-x-2">
                    <Checkbox checked={levels.INFO} onCheckedChange={(c) => setLevels({ ...levels, INFO: !!c })} />
                    <span>INFO</span>
                </Label>
                <Label className="flex items-center space-x-2">
                    <Checkbox checked={levels.WARN} onCheckedChange={(c) => setLevels({ ...levels, WARN: !!c })} />
                    <span>WARN</span>
                </Label>
                <Label className="flex items-center space-x-2">
                    <Checkbox checked={levels.ERROR} onCheckedChange={(c) => setLevels({ ...levels, ERROR: !!c })} />
                    <span>ERROR</span>
                </Label>
                <Label className="flex items-center space-x-2">
                    <Checkbox checked={levels.DEBUG} onCheckedChange={(c) => setLevels({ ...levels, DEBUG: !!c })} />
                    <span>DEBUG</span>
                </Label>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
                <Card className="flex flex-col h-[600px]">
                    <CardHeader className="py-3 px-4 border-b bg-muted/30 flex flex-row justify-between items-center">
                        <CardTitle className="text-sm">Raw Logs</CardTitle>
                        <Button variant="ghost" size="icon" onClick={() => setInput("")}>
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0 flex-1">
                        <Editor
                            height="100%"
                            defaultLanguage="plaintext"
                            theme={theme === "dark" ? "vs-dark" : "light"}
                            value={input}
                            onChange={(value) => setInput(value || "")}
                            options={{ minimap: { enabled: false }, fontSize: 13 }}
                        />
                    </CardContent>
                </Card>

                <Card className="flex flex-col h-[600px]">
                    <CardHeader className="py-3 px-4 border-b bg-muted/30 flex flex-row justify-between items-center">
                        <CardTitle className="text-sm">Parsed Output</CardTitle>
                        <Button variant="ghost" size="icon" onClick={() => copyToClipboard(output)}>
                            <Copy className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0 flex-1">
                        <Editor
                            height="100%"
                            defaultLanguage="json" // Use json highlighting for better readability even if mixed
                            theme={theme === "dark" ? "vs-dark" : "light"}
                            value={output}
                            options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13, wordWrap: "on" }}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
