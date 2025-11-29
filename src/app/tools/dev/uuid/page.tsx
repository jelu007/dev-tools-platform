"use client"

import * as React from "react"
import { v4 as uuidv4 } from "uuid"
import { ulid } from "ulid"
import { nanoid } from "nanoid"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import { Copy, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function UuidPage() {
    const [uuids, setUuids] = React.useState<string[]>([])
    const [ulids, setUlids] = React.useState<string[]>([])
    const [nanoids, setNanoids] = React.useState<string[]>([])
    const [count, setCount] = React.useState(1)
    const [nanoLength, setNanoLength] = React.useState(21)

    const generateUuids = React.useCallback(() => {
        const newUuids = Array.from({ length: count }, () => uuidv4())
        setUuids(newUuids)
    }, [count])

    const generateUlids = React.useCallback(() => {
        const newUlids = Array.from({ length: count }, () => ulid())
        setUlids(newUlids)
    }, [count])

    const generateNanoids = React.useCallback(() => {
        const newNanoids = Array.from({ length: count }, () => nanoid(nanoLength))
        setNanoids(newNanoids)
    }, [count, nanoLength])

    React.useEffect(() => {
        generateUuids()
        generateUlids()
        generateNanoids()
    }, []) // Initial generation

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        toast.success("Copied to clipboard")
    }

    const ResultList = ({ items, onRefresh }: { items: string[], onRefresh: () => void }) => (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <Label>Generated ({items.length})</Label>
                <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={onRefresh}>
                        <RefreshCw className="mr-2 h-4 w-4" /> Regenerate
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(items.join("\n"))}>
                        <Copy className="mr-2 h-4 w-4" /> Copy All
                    </Button>
                </div>
            </div>
            <div className="max-h-[200px] overflow-y-auto border rounded-md p-2 bg-muted/30 font-mono text-sm space-y-1">
                {items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center group">
                        <span>{item}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => copyToClipboard(item)}>
                            <Copy className="h-3 w-3" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    )

    return (
        <div className="h-full flex flex-col space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">ID Generators</h2>
                <p className="text-muted-foreground">
                    Generate UUIDs, ULIDs, and NanoIDs.
                </p>
            </div>

            <div className="flex items-center space-x-4">
                <Label>Count per batch:</Label>
                <Input
                    type="number"
                    min={1}
                    max={100}
                    value={count}
                    onChange={(e) => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="w-20"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>UUID v4</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <ResultList items={uuids} onRefresh={generateUuids} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>ULID</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <ResultList items={ulids} onRefresh={generateUlids} />
                        <p className="text-xs text-muted-foreground">
                            Universally Unique Lexicographically Sortable Identifier
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>NanoID</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Length: {nanoLength}</Label>
                            <Input
                                type="number"
                                min={1}
                                max={100}
                                value={nanoLength}
                                onChange={(e) => setNanoLength(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
                            />
                        </div>
                        <ResultList items={nanoids} onRefresh={generateNanoids} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
