"use client"

import * as React from "react"
import Link from "next/link"
import yaml from "js-yaml"
import { toast } from "sonner"
import { Copy, RotateCcw, Upload, Download } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function YamlJsonConverterPage() {
    const [input, setInput] = React.useState("")
    const [output, setOutput] = React.useState("")
    const [mode, setMode] = React.useState<"yaml-to-json" | "json-to-yaml">("yaml-to-json")
    const [autoConvert, setAutoConvert] = React.useState(true)

    const convert = React.useCallback(() => {
        if (!input.trim()) {
            setOutput("")
            return
        }

        try {
            if (mode === "yaml-to-json") {
                const parsed = yaml.load(input)
                setOutput(JSON.stringify(parsed, null, 2))
            } else {
                // json-to-yaml
                const parsed = JSON.parse(input)
                const dumped = yaml.dump(parsed, { noRefs: true })
                setOutput(dumped)
            }
        } catch (e: any) {
            setOutput("")
            toast.error(e?.message || "Conversion error")
        }
    }, [input, mode])

    // Auto convert when input or mode changes
    React.useEffect(() => {
        if (!autoConvert) return
        const t = setTimeout(() => convert(), 250)
        return () => clearTimeout(t)
    }, [input, mode, autoConvert, convert])

    const handleSwapMode = () => {
        setMode((m) => (m === "yaml-to-json" ? "json-to-yaml" : "yaml-to-json"))
        // swap input/output when swapping modes
        setInput(output)
        setOutput(input)
    }

    const handleReset = () => {
        setInput("")
        setOutput("")
        toast.success("Cleared")
    }

    const copyOutput = () => {
        navigator.clipboard.writeText(output || "")
        toast.success("Output copied")
    }

    const handleFile = (f?: File) => {
        if (!f) return
        f.text().then((txt) => {
            setInput(txt)
            toast.success(`Loaded ${f.name}`)
        })
    }

    const downloadOutput = (filename = "output.txt") => {
        const blob = new Blob([output || ""], { type: "text/plain;charset=utf-8" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        a.remove()
        URL.revokeObjectURL(url)
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">YAML ⇄ JSON Converter</h1>
                <p className="text-muted-foreground mt-2">Convert YAML to JSON and JSON to YAML quickly and reliably.</p>
            </div>

            <div className="flex items-center gap-3">
                <div className="inline-flex items-center gap-2">
                    <label className="text-sm font-medium">Mode</label>
                    <select
                        value={mode}
                        onChange={(e) => setMode(e.target.value as any)}
                        className="rounded-md border px-2 py-1"
                    >
                        <option value="yaml-to-json">YAML → JSON</option>
                        <option value="json-to-yaml">JSON → YAML</option>
                    </select>
                </div>

                <label className="inline-flex items-center gap-2 ml-2">
                    <input
                        type="checkbox"
                        checked={autoConvert}
                        onChange={(e) => setAutoConvert(e.target.checked)}
                    />
                    <span className="text-sm">Auto-convert</span>
                </label>

                <div className="ml-auto flex items-center gap-2">
                        <input
                            id="yaml-file"
                            type="file"
                            accept=".yaml,.yml,application/x-yaml,text/yaml,application/json,text/json"
                            className="hidden"
                            onChange={(e) => handleFile(e.target.files?.[0])}
                        />
                        <label htmlFor="yaml-file">
                            <Button size="sm" variant="outline" onClick={() => {}} title="Upload file">
                                <Upload className="w-4 h-4 mr-2" />
                                Upload
                            </Button>
                        </label>

                        <Button onClick={convert} size="sm">Convert</Button>
                        <Button onClick={handleSwapMode} variant="outline" size="sm">Swap</Button>
                        <Button onClick={handleReset} variant="outline" size="sm">
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Clear
                        </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium">Input</label>
                        <span className="text-xs text-muted-foreground">Paste {mode === "yaml-to-json" ? "YAML" : "JSON"} here</span>
                    </div>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="w-full h-64 p-3 font-mono text-sm rounded-md border resize-none"
                        placeholder={mode === "yaml-to-json" ? "---\nkey: value" : "{\n  \"key\": \"value\"\n}"}
                    />
                </div>

                <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium">Output</label>
                        <div className="flex items-center gap-2">
                            <Button onClick={copyOutput} size="sm" variant="ghost" title="Copy output">
                                <Copy className="w-4 h-4" />
                            </Button>
                            <Button onClick={() => downloadOutput(mode === "yaml-to-json" ? "output.json" : "output.yaml")} size="sm" variant="ghost" title="Download output">
                                <Download className="w-4 h-4" />
                            </Button>
                            <Link href="/tools/dev/data-transformation" className="text-sm text-muted-foreground">← Back</Link>
                        </div>
                    </div>
                    <textarea
                        value={output}
                        readOnly
                        className="w-full h-64 p-3 font-mono text-sm rounded-md border bg-muted/5 resize-none"
                        placeholder="Converted output will appear here"
                    />
                </div>
            </div>
        </div>
    )
}

