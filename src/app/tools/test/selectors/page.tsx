"use client"

import * as React from "react"
import { toast } from "sonner"
import { Search, Copy } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SelectorsPage() {
    const [html, setHtml] = React.useState(`<div class="container">
  <h1 id="title">Hello World</h1>
  <p class="text">First paragraph</p>
  <p class="text highlight">Second paragraph</p>
  <ul>
    <li data-id="1">Item 1</li>
    <li data-id="2">Item 2</li>
    <li data-id="3">Item 3</li>
  </ul>
</div>`)
    const [cssSelector, setCssSelector] = React.useState(".text")
    const [xpathSelector, setXpathSelector] = React.useState("//p[@class='text']")
    const [cssResults, setCssResults] = React.useState<string[]>([])
    const [xpathResults, setXpathResults] = React.useState<string[]>([])
    const [cssError, setCssError] = React.useState<string | null>(null)
    const [xpathError, setXpathError] = React.useState<string | null>(null)

    const testCssSelector = () => {
        try {
            const parser = new DOMParser()
            const doc = parser.parseFromString(html, 'text/html')
            const elements = doc.querySelectorAll(cssSelector)
            const results = Array.from(elements).map(el => el.outerHTML)
            setCssResults(results)
            setCssError(null)
            toast.success(`Found ${results.length} element(s)`)
        } catch (e: any) {
            setCssError(e.message)
            setCssResults([])
            toast.error("Invalid CSS selector")
        }
    }

    const testXpathSelector = () => {
        try {
            const parser = new DOMParser()
            const doc = parser.parseFromString(html, 'text/html')
            const result = doc.evaluate(
                xpathSelector,
                doc,
                null,
                XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                null
            )
            const results: string[] = []
            for (let i = 0; i < result.snapshotLength; i++) {
                const node = result.snapshotItem(i)
                if (node) {
                    results.push((node as Element).outerHTML || node.textContent || '')
                }
            }
            setXpathResults(results)
            setXpathError(null)
            toast.success(`Found ${results.length} element(s)`)
        } catch (e: any) {
            setXpathError(e.message)
            setXpathResults([])
            toast.error("Invalid XPath selector")
        }
    }

    React.useEffect(() => {
        if (cssSelector) testCssSelector()
    }, [html, cssSelector])

    React.useEffect(() => {
        if (xpathSelector) testXpathSelector()
    }, [html, xpathSelector])

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        toast.success("Copied to clipboard")
    }

    return (
        <div className="h-full flex flex-col space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">XPath & CSS Selector Tester</h2>
                <p className="text-muted-foreground">
                    Test XPath and CSS selectors against HTML.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle>HTML Input</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <Textarea
                            value={html}
                            onChange={(e) => setHtml(e.target.value)}
                            className="font-mono min-h-[400px] text-sm"
                            placeholder="Paste HTML here..."
                        />
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Tabs defaultValue="css">
                        <TabsList className="w-full">
                            <TabsTrigger value="css" className="flex-1">CSS Selector</TabsTrigger>
                            <TabsTrigger value="xpath" className="flex-1">XPath</TabsTrigger>
                        </TabsList>

                        <TabsContent value="css" className="space-y-4 mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">CSS Selector</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex space-x-2">
                                        <Input
                                            value={cssSelector}
                                            onChange={(e) => setCssSelector(e.target.value)}
                                            placeholder=".class or #id or element"
                                            className="font-mono"
                                        />
                                        <Button onClick={testCssSelector}>
                                            <Search className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    {cssError && (
                                        <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                                            {cssError}
                                        </div>
                                    )}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label>Results ({cssResults.length})</Label>
                                        </div>
                                        <div className="max-h-[300px] overflow-y-auto border rounded-md p-3 bg-muted/30 font-mono text-xs space-y-2">
                                            {cssResults.length > 0 ? (
                                                cssResults.map((result, i) => (
                                                    <div key={i} className="group relative">
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex-1 break-all pr-8">
                                                                <div className="text-muted-foreground mb-1">Match {i + 1}:</div>
                                                                <div className="bg-background p-2 rounded border">{result}</div>
                                                            </div>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-6 w-6 opacity-0 group-hover:opacity-100 absolute top-0 right-0"
                                                                onClick={() => copyToClipboard(result)}
                                                            >
                                                                <Copy className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-muted-foreground text-center py-4">
                                                    No matches found
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm">Common CSS Selectors</CardTitle>
                                </CardHeader>
                                <CardContent className="text-xs space-y-1">
                                    <div className="grid grid-cols-2 gap-2">
                                        <code className="bg-muted px-2 py-1 rounded">.class</code>
                                        <span className="text-muted-foreground">Class selector</span>
                                        <code className="bg-muted px-2 py-1 rounded">#id</code>
                                        <span className="text-muted-foreground">ID selector</span>
                                        <code className="bg-muted px-2 py-1 rounded">element</code>
                                        <span className="text-muted-foreground">Tag selector</span>
                                        <code className="bg-muted px-2 py-1 rounded">[attr]</code>
                                        <span className="text-muted-foreground">Attribute</span>
                                        <code className="bg-muted px-2 py-1 rounded">:first-child</code>
                                        <span className="text-muted-foreground">Pseudo-class</span>
                                        <code className="bg-muted px-2 py-1 rounded">parent &gt; child</code>
                                        <span className="text-muted-foreground">Direct child</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="xpath" className="space-y-4 mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">XPath Expression</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex space-x-2">
                                        <Input
                                            value={xpathSelector}
                                            onChange={(e) => setXpathSelector(e.target.value)}
                                            placeholder="//div[@class='example']"
                                            className="font-mono"
                                        />
                                        <Button onClick={testXpathSelector}>
                                            <Search className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    {xpathError && (
                                        <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                                            {xpathError}
                                        </div>
                                    )}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label>Results ({xpathResults.length})</Label>
                                        </div>
                                        <div className="max-h-[300px] overflow-y-auto border rounded-md p-3 bg-muted/30 font-mono text-xs space-y-2">
                                            {xpathResults.length > 0 ? (
                                                xpathResults.map((result, i) => (
                                                    <div key={i} className="group relative">
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex-1 break-all pr-8">
                                                                <div className="text-muted-foreground mb-1">Match {i + 1}:</div>
                                                                <div className="bg-background p-2 rounded border">{result}</div>
                                                            </div>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-6 w-6 opacity-0 group-hover:opacity-100 absolute top-0 right-0"
                                                                onClick={() => copyToClipboard(result)}
                                                            >
                                                                <Copy className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-muted-foreground text-center py-4">
                                                    No matches found
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm">Common XPath Expressions</CardTitle>
                                </CardHeader>
                                <CardContent className="text-xs space-y-1">
                                    <div className="grid grid-cols-1 gap-2">
                                        <div className="flex justify-between">
                                            <code className="bg-muted px-2 py-1 rounded">//div</code>
                                            <span className="text-muted-foreground">All div elements</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <code className="bg-muted px-2 py-1 rounded">//div[@class='x']</code>
                                            <span className="text-muted-foreground">Div with class</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <code className="bg-muted px-2 py-1 rounded">//div[1]</code>
                                            <span className="text-muted-foreground">First div</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <code className="bg-muted px-2 py-1 rounded">//div/p</code>
                                            <span className="text-muted-foreground">P inside div</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
