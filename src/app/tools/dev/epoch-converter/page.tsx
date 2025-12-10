"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import { Copy, Clock, Calendar, RefreshCw, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function EpochConverterPage() {
    const { theme } = useTheme()

    // Current timestamp state
    const [currentTimestamp, setCurrentTimestamp] = React.useState(Math.floor(Date.now() / 1000))
    const [currentDate, setCurrentDate] = React.useState(new Date())

    // Epoch to Human state
    const [epochInput, setEpochInput] = React.useState("")
    const [epochFormat, setEpochFormat] = React.useState<"auto" | "seconds" | "milliseconds" | "microseconds" | "nanoseconds">("auto")

    // Human to Epoch state
    const [dateTimeInput, setDateTimeInput] = React.useState("")
    const [timezone, setTimezone] = React.useState("local")

    // Batch conversion state
    const [batchInput, setBatchInput] = React.useState("")
    const [batchOutput, setBatchOutput] = React.useState("")

    // Update current timestamp every second
    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTimestamp(Math.floor(Date.now() / 1000))
            setCurrentDate(new Date())
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    // Auto-detect epoch format
    const detectFormat = (value: string): "seconds" | "milliseconds" | "microseconds" | "nanoseconds" => {
        const num = value.replace(/[^0-9]/g, "")
        const length = num.length

        if (length <= 10) return "seconds"
        if (length <= 13) return "milliseconds"
        if (length <= 16) return "microseconds"
        return "nanoseconds"
    }

    // Convert epoch to Date
    const epochToDate = (epoch: string, format?: string): Date | null => {
        try {
            const num = parseFloat(epoch)
            if (isNaN(num)) return null

            const actualFormat = format === "auto" || !format ? detectFormat(epoch) : format

            let milliseconds: number
            switch (actualFormat) {
                case "seconds":
                    milliseconds = num * 1000
                    break
                case "milliseconds":
                    milliseconds = num
                    break
                case "microseconds":
                    milliseconds = num / 1000
                    break
                case "nanoseconds":
                    milliseconds = num / 1000000
                    break
                default:
                    milliseconds = num * 1000
            }

            return new Date(milliseconds)
        } catch {
            return null
        }
    }

    // Convert Date to epoch in various formats
    const dateToEpoch = (date: Date) => {
        const ms = date.getTime()
        return {
            seconds: Math.floor(ms / 1000),
            milliseconds: ms,
            microseconds: ms * 1000,
            nanoseconds: ms * 1000000
        }
    }

    // Get relative time
    const getRelativeTime = (date: Date): string => {
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffSec = Math.floor(Math.abs(diffMs) / 1000)
        const diffMin = Math.floor(diffSec / 60)
        const diffHour = Math.floor(diffMin / 60)
        const diffDay = Math.floor(diffHour / 24)
        const diffMonth = Math.floor(diffDay / 30)
        const diffYear = Math.floor(diffDay / 365)

        const future = diffMs < 0
        const prefix = future ? "in " : ""
        const suffix = future ? "" : " ago"

        if (diffYear > 0) return `${prefix}${diffYear} year${diffYear > 1 ? "s" : ""}${suffix}`
        if (diffMonth > 0) return `${prefix}${diffMonth} month${diffMonth > 1 ? "s" : ""}${suffix}`
        if (diffDay > 0) return `${prefix}${diffDay} day${diffDay > 1 ? "s" : ""}${suffix}`
        if (diffHour > 0) return `${prefix}${diffHour} hour${diffHour > 1 ? "s" : ""}${suffix}`
        if (diffMin > 0) return `${prefix}${diffMin} minute${diffMin > 1 ? "s" : ""}${suffix}`
        return `${prefix}${diffSec} second${diffSec !== 1 ? "s" : ""}${suffix}`
    }

    // Copy to clipboard
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        toast.success("Copied to clipboard")
    }

    // Convert epoch input to human-readable
    const convertedDate = epochInput ? epochToDate(epochInput, epochFormat) : null
    const detectedFormat = epochInput ? detectFormat(epochInput) : "seconds"

    // Convert datetime input to epoch
    const humanToEpochResult = React.useMemo(() => {
        if (!dateTimeInput) return null
        try {
            const date = new Date(dateTimeInput)
            if (isNaN(date.getTime())) return null
            return dateToEpoch(date)
        } catch {
            return null
        }
    }, [dateTimeInput])

    // Batch conversion
    const handleBatchConvert = () => {
        const lines = batchInput.split("\n").filter(line => line.trim())
        const results = lines.map(line => {
            const trimmed = line.trim()
            const date = epochToDate(trimmed, "auto")
            if (date) {
                return `${trimmed} → ${date.toUTCString()} (${date.toLocaleString()})`
            }
            return `${trimmed} → Invalid timestamp`
        })
        setBatchOutput(results.join("\n"))
    }

    // Set current datetime in input
    const setCurrentDateTime = () => {
        const now = new Date()
        const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 16)
        setDateTimeInput(localDateTime)
    }

    return (
        <div className="h-full flex flex-col space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Epoch Converter</h2>
                <p className="text-muted-foreground">
                    Convert between Unix timestamps and human-readable dates
                </p>
            </div>

            {/* Current Timestamp */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Current Timestamp
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">Unix Timestamp (seconds)</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={currentTimestamp}
                                    readOnly
                                    className="font-mono"
                                />
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => copyToClipboard(currentTimestamp.toString())}
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">Human Readable</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={currentDate.toLocaleString()}
                                    readOnly
                                    className="font-mono"
                                />
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => copyToClipboard(currentDate.toLocaleString())}
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Conversion Tabs */}
            <Tabs defaultValue="epoch-to-human" className="flex-1">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="epoch-to-human">Epoch → Human</TabsTrigger>
                    <TabsTrigger value="human-to-epoch">Human → Epoch</TabsTrigger>
                    <TabsTrigger value="batch">Batch Convert</TabsTrigger>
                </TabsList>

                {/* Epoch to Human */}
                <TabsContent value="epoch-to-human" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Epoch Timestamp Input</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Enter epoch timestamp (e.g., 1733222400)"
                                    value={epochInput}
                                    onChange={(e) => setEpochInput(e.target.value)}
                                    className="font-mono"
                                />
                                <Select value={epochFormat} onValueChange={(v: any) => setEpochFormat(v)}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="auto">Auto-detect</SelectItem>
                                        <SelectItem value="seconds">Seconds</SelectItem>
                                        <SelectItem value="milliseconds">Milliseconds</SelectItem>
                                        <SelectItem value="microseconds">Microseconds</SelectItem>
                                        <SelectItem value="nanoseconds">Nanoseconds</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {epochInput && (
                                <div className="text-xs text-muted-foreground">
                                    Detected format: <span className="font-semibold">{detectedFormat}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {convertedDate && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Converted Date & Time</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground">GMT / UTC</Label>
                                    <div className="flex gap-2">
                                        <Input value={convertedDate.toUTCString()} readOnly className="font-mono" />
                                        <Button variant="outline" size="icon" onClick={() => copyToClipboard(convertedDate.toUTCString())}>
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground">Local Time</Label>
                                    <div className="flex gap-2">
                                        <Input value={convertedDate.toLocaleString()} readOnly className="font-mono" />
                                        <Button variant="outline" size="icon" onClick={() => copyToClipboard(convertedDate.toLocaleString())}>
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground">Relative Time</Label>
                                    <div className="flex gap-2">
                                        <Input value={getRelativeTime(convertedDate)} readOnly className="font-mono" />
                                        <Button variant="outline" size="icon" onClick={() => copyToClipboard(getRelativeTime(convertedDate))}>
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground">ISO 8601</Label>
                                    <div className="flex gap-2">
                                        <Input value={convertedDate.toISOString()} readOnly className="font-mono" />
                                        <Button variant="outline" size="icon" onClick={() => copyToClipboard(convertedDate.toISOString())}>
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground">RFC 2822</Label>
                                    <div className="flex gap-2">
                                        <Input value={convertedDate.toString()} readOnly className="font-mono" />
                                        <Button variant="outline" size="icon" onClick={() => copyToClipboard(convertedDate.toString())}>
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                {/* Human to Epoch */}
                <TabsContent value="human-to-epoch" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Date & Time Input</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2">
                                <Input
                                    type="datetime-local"
                                    value={dateTimeInput}
                                    onChange={(e) => setDateTimeInput(e.target.value)}
                                    className="font-mono"
                                />
                                <Button variant="outline" onClick={setCurrentDateTime}>
                                    <Clock className="h-4 w-4 mr-2" />
                                    Now
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {humanToEpochResult && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Epoch Timestamps</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground">Seconds</Label>
                                    <div className="flex gap-2">
                                        <Input value={humanToEpochResult.seconds} readOnly className="font-mono" />
                                        <Button variant="outline" size="icon" onClick={() => copyToClipboard(humanToEpochResult.seconds.toString())}>
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground">Milliseconds</Label>
                                    <div className="flex gap-2">
                                        <Input value={humanToEpochResult.milliseconds} readOnly className="font-mono" />
                                        <Button variant="outline" size="icon" onClick={() => copyToClipboard(humanToEpochResult.milliseconds.toString())}>
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground">Microseconds</Label>
                                    <div className="flex gap-2">
                                        <Input value={humanToEpochResult.microseconds} readOnly className="font-mono" />
                                        <Button variant="outline" size="icon" onClick={() => copyToClipboard(humanToEpochResult.microseconds.toString())}>
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground">Nanoseconds</Label>
                                    <div className="flex gap-2">
                                        <Input value={humanToEpochResult.nanoseconds} readOnly className="font-mono" />
                                        <Button variant="outline" size="icon" onClick={() => copyToClipboard(humanToEpochResult.nanoseconds.toString())}>
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                {/* Batch Convert */}
                <TabsContent value="batch" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Input (one timestamp per line)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Textarea
                                    value={batchInput}
                                    onChange={(e) => setBatchInput(e.target.value)}
                                    placeholder="1733222400&#10;1733308800&#10;1733395200"
                                    className="h-[300px] font-mono resize-none"
                                />
                                <Button onClick={handleBatchConvert} className="mt-4 w-full">
                                    <ArrowRight className="h-4 w-4 mr-2" />
                                    Convert All
                                </Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Output</CardTitle>
                                <Button variant="outline" size="icon" onClick={() => copyToClipboard(batchOutput)}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <Textarea
                                    value={batchOutput}
                                    readOnly
                                    placeholder="Converted timestamps will appear here..."
                                    className="h-[300px] font-mono resize-none"
                                />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}