"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import { Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function RegexTesterPage() {
    const [regexStr, setRegexStr] = React.useState("([A-Z])\\w+")
    const [flags, setFlags] = React.useState("g")
    const [testString, setTestString] = React.useState("Hello World from Regex Tester")
    const [matches, setMatches] = React.useState<any[]>([])
    const [error, setError] = React.useState<string | null>(null)

    React.useEffect(() => {
        try {
            if (!regexStr) {
                setMatches([])
                setError(null)
                return
            }
            const regex = new RegExp(regexStr, flags)
            const newMatches = []
            let match

            // Prevent infinite loops with zero-length matches
            if (regex.global) {
                let lastIndex = 0;
                while ((match = regex.exec(testString)) !== null) {
                    newMatches.push({
                        index: match.index,
                        length: match[0].length,
                        content: match[0],
                        groups: match.slice(1)
                    })
                    if (regex.lastIndex === lastIndex) {
                        regex.lastIndex++; // Avoid infinite loop
                    }
                    lastIndex = regex.lastIndex;
                    if (newMatches.length > 1000) break; // Safety break
                }
            } else {
                match = regex.exec(testString)
                if (match) {
                    newMatches.push({
                        index: match.index,
                        length: match[0].length,
                        content: match[0],
                        groups: match.slice(1)
                    })
                }
            }

            setMatches(newMatches)
            setError(null)
        } catch (e: any) {
            setError(e.message)
            setMatches([])
        }
    }, [regexStr, flags, testString])

    const renderHighlightedText = () => {
        if (!testString) return null
        if (error || matches.length === 0) return testString

        let lastIndex = 0
        const elements = []

        matches.forEach((match, i) => {
            // Text before match
            if (match.index > lastIndex) {
                elements.push(
                    <span key={`text-${i}`}>
                        {testString.slice(lastIndex, match.index)}
                    </span>
                )
            }
            // Match
            elements.push(
                <span
                    key={`match-${i}`}
                    className="bg-yellow-200 dark:bg-yellow-900/50 rounded px-0.5 border border-yellow-400 dark:border-yellow-700"
                    title={`Match ${i + 1}`}
                >
                    {match.content}
                </span>
            )
            lastIndex = match.index + match.length
        })

        // Remaining text
        if (lastIndex < testString.length) {
            elements.push(
                <span key="text-end">
                    {testString.slice(lastIndex)}
                </span>
            )
        }

        return elements
    }

    return (
        <div className="h-full flex flex-col space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Regex Tester</h2>
                <p className="text-muted-foreground">
                    Test and debug regular expressions with real-time highlighting.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Expression</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex space-x-2 items-center">
                                <span className="text-xl font-mono text-muted-foreground">/</span>
                                <Input
                                    value={regexStr}
                                    onChange={(e) => setRegexStr(e.target.value)}
                                    className="font-mono text-lg"
                                    placeholder="Regex pattern"
                                />
                                <span className="text-xl font-mono text-muted-foreground">/</span>
                                <Input
                                    value={flags}
                                    onChange={(e) => setFlags(e.target.value)}
                                    className="w-20 font-mono text-lg"
                                    placeholder="flags"
                                />
                            </div>
                            {error && (
                                <div className="text-red-500 text-sm font-medium">
                                    Error: {error}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="h-[400px] flex flex-col">
                        <CardHeader>
                            <CardTitle>Test String</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col space-y-4">
                            <Textarea
                                value={testString}
                                onChange={(e) => setTestString(e.target.value)}
                                className="flex-1 font-mono resize-none"
                                placeholder="Enter test string here..."
                            />
                            <div className="p-4 rounded-md border bg-muted/30 font-mono whitespace-pre-wrap break-all min-h-[100px] max-h-[200px] overflow-y-auto">
                                {renderHighlightedText()}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Match Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Status:</span>
                                    <span className={error ? "text-red-500" : "text-green-500 font-medium"}>
                                        {error ? "Invalid" : "Valid"}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Matches:</span>
                                    <span className="font-medium">{matches.length}</span>
                                </div>
                            </div>

                            {matches.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    <h4 className="text-sm font-semibold">Match Details</h4>
                                    <div className="max-h-[300px] overflow-y-auto space-y-2">
                                        {matches.map((m, i) => (
                                            <div key={i} className="text-xs p-2 rounded bg-muted">
                                                <div className="font-medium mb-1">Match {i + 1}</div>
                                                <div>Index: {m.index}</div>
                                                <div>Content: "{m.content}"</div>
                                                {m.groups.length > 0 && (
                                                    <div className="mt-1">
                                                        <div className="font-medium text-muted-foreground">Groups:</div>
                                                        {m.groups.map((g: string, gi: number) => (
                                                            <div key={gi} className="pl-2">
                                                                {gi + 1}: "{g}"
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Info className="mr-2 h-4 w-4" /> Cheatsheet
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                                <code className="bg-muted px-1 rounded">.</code> <span>Any character</span>
                                <code className="bg-muted px-1 rounded">\d</code> <span>Digit</span>
                                <code className="bg-muted px-1 rounded">\w</code> <span>Word char</span>
                                <code className="bg-muted px-1 rounded">\s</code> <span>Whitespace</span>
                                <code className="bg-muted px-1 rounded">[abc]</code> <span>Character set</span>
                                <code className="bg-muted px-1 rounded">^</code> <span>Start of line</span>
                                <code className="bg-muted px-1 rounded">$</code> <span>End of line</span>
                                <code className="bg-muted px-1 rounded">*</code> <span>0 or more</span>
                                <code className="bg-muted px-1 rounded">+</code> <span>1 or more</span>
                                <code className="bg-muted px-1 rounded">?</code> <span>0 or 1</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
