"use client"

import * as React from "react"
import Link from "next/link"
import { toast } from "sonner"
import { Copy, Download, Upload, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"

// Minimal robust CSV parser/serializer for common CSV (handles quoted fields)
function parseCSV(text: string, delimiter = ",") {
    const rows: string[][] = []
    let row: string[] = []
    let cur = ""
    let inQuotes = false
    for (let i = 0; i < text.length; i++) {
        const ch = text[i]
        if (ch === '"') {
            if (inQuotes && text[i + 1] === '"') {
                cur += '"'
                i++
            } else {
                inQuotes = !inQuotes
            }
            continue
        }
        if (!inQuotes && ch === delimiter) {
            row.push(cur)
            cur = ""
            continue
        }
        if (!inQuotes && (ch === "\n" || ch === "\r")) {
            // handle CRLF
            if (ch === "\r" && text[i + 1] === "\n") {
                i++
            }
            row.push(cur)
            rows.push(row)
            row = []
            cur = ""
            continue
        }
        cur += ch
    }
    // push last
    if (cur !== "" || row.length) {
        row.push(cur)
        rows.push(row)
    }
    return rows
}

function serializeCSV(rows: string[][], delimiter = ",") {
    return rows
        .map((r) =>
            r
                .map((cell) => {
                    if (cell == null) return ""
                    const needsQuotes = /["\n\r,]/.test(cell)
                    const escaped = String(cell).replace(/"/g, '""')
                    return needsQuotes ? `"${escaped}"` : escaped
                })
                .join(delimiter)
        )
        .join("\n")
}

export default function CsvJsonConverterPage() {
    const [input, setInput] = React.useState("")
    const [output, setOutput] = React.useState("")
    const [mode, setMode] = React.useState<"csv-to-json" | "json-to-csv">("csv-to-json")
    const [hasHeader, setHasHeader] = React.useState(true)
    const [autoConvert, setAutoConvert] = React.useState(true)

    const convert = React.useCallback(() => {
        if (!input.trim()) {
            setOutput("")
            return
        }
        try {
            if (mode === "csv-to-json") {
                const rows = parseCSV(input)
                if (rows.length === 0) {
                    setOutput("[]")
                    return
                }
                if (hasHeader) {
                    const headers = rows[0]
                    const data = rows.slice(1).map((r) => {
                        const obj: Record<string, any> = {}
                        for (let i = 0; i < headers.length; i++) {
                            obj[headers[i] ?? `col_${i}`] = r[i] ?? ""
                        }
                        return obj
                    })
                    setOutput(JSON.stringify(data, null, 2))
                } else {
                    setOutput(JSON.stringify(rows, null, 2))
                }
            } else {
                // json-to-csv
                const parsed = JSON.parse(input)
                if (Array.isArray(parsed)) {
                    if (parsed.length === 0) {
                        setOutput("")
                        return
                    }
                    if (hasHeader && typeof parsed[0] === "object" && !Array.isArray(parsed[0])) {
                        const keys = Object.keys(parsed[0])
                        const rows = [keys]
                        for (const item of parsed) {
                            rows.push(keys.map((k) => (item?.[k] ?? "") + ""))
                        }
                        setOutput(serializeCSV(rows))
                    } else if (Array.isArray(parsed[0])) {
                        const rows = parsed.map((r: any[]) => r.map((c) => (c == null ? "" : String(c))))
                        setOutput(serializeCSV(rows))
                    } else {
                        // array of primitives
                        const rows = parsed.map((v) => [String(v)])
                        setOutput(serializeCSV(rows))
                    }
                } else {
                    throw new Error("JSON root must be an array for conversion to CSV")
                }
            }
        } catch (e: any) {
            setOutput("")
            toast.error(e?.message || "Conversion error")
        }
    }, [input, mode, hasHeader])

    React.useEffect(() => {
        if (!autoConvert) return
        const t = setTimeout(() => convert(), 250)
        return () => clearTimeout(t)
    }, [input, mode, hasHeader, autoConvert, convert])

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

    const handleSwapMode = () => {
        setMode((m) => (m === "csv-to-json" ? "json-to-csv" : "csv-to-json"))
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

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">CSV ⇄ JSON Converter</h1>
                <p className="text-muted-foreground mt-2">Transform CSV datasets into JSON arrays and vice versa.</p>
            </div>

            <div className="flex items-center gap-3">
                <div className="inline-flex items-center gap-2">
                    <label className="text-sm font-medium">Mode</label>
                    <select value={mode} onChange={(e) => setMode(e.target.value as any)} className="rounded-md border px-2 py-1">
                        <option value="csv-to-json">CSV → JSON</option>
                        <option value="json-to-csv">JSON → CSV</option>
                    </select>
                </div>

                <label className="inline-flex items-center gap-2">
                    <input type="checkbox" checked={hasHeader} onChange={(e) => setHasHeader(e.target.checked)} />
                    <span className="text-sm">First row is header</span>
                </label>

                <label className="inline-flex items-center gap-2 ml-2">
                    <input type="checkbox" checked={autoConvert} onChange={(e) => setAutoConvert(e.target.checked)} />
                    <span className="text-sm">Auto-convert</span>
                </label>

                <div className="ml-auto flex items-center gap-2">
                    <input
                        id="csv-file"
                        type="file"
                        accept=".csv,text/csv"
                        className="hidden"
                        onChange={(e) => handleFile(e.target.files?.[0])}
                    />
                    <label htmlFor="csv-file">
                        <Button size="sm" variant="outline" onClick={() => {}} title="Upload CSV">
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
                        <span className="text-xs text-muted-foreground">Paste {mode === "csv-to-json" ? "CSV" : "JSON"} here</span>
                    </div>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="w-full h-64 p-3 font-mono text-sm rounded-md border resize-none"
                        placeholder={mode === "csv-to-json" ? "name,age\nAlice,30" : "[ { \"name\": \"Alice\", \"age\": 30 } ]"}
                    />
                </div>

                <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium">Output</label>
                        <div className="flex items-center gap-2">
                            <Button onClick={copyOutput} size="sm" variant="ghost" title="Copy output">
                                <Copy className="w-4 h-4" />
                            </Button>
                            <Button onClick={() => downloadOutput(mode === "csv-to-json" ? "output.json" : "output.csv")} size="sm" variant="ghost" title="Download output">
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
