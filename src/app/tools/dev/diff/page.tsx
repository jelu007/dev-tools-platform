"use client"

import * as React from "react"
import { toast } from "sonner"

interface CharDiff {
    text: string
    type: "add" | "remove" | "context"
}

interface LineDiff {
    originalLine: string
    modifiedLine: string
    lineNumber: number
    isChanged: boolean
}

export default function DiffCheckerPage() {
    const [original, setOriginal] = React.useState("")
    const [modified, setModified] = React.useState("")
    const [showDiff, setShowDiff] = React.useState(false)
    const originalScrollRef = React.useRef<HTMLDivElement>(null)
    const modifiedScrollRef = React.useRef<HTMLDivElement>(null)

    // Sync scroll between diff views
    const handleScroll = (source: 'original' | 'modified', e: React.UIEvent<HTMLDivElement>) => {
        const scrollTop = e.currentTarget.scrollTop
        if (source === 'original' && modifiedScrollRef.current) {
            modifiedScrollRef.current.scrollTop = scrollTop
        } else if (source === 'modified' && originalScrollRef.current) {
            originalScrollRef.current.scrollTop = scrollTop
        }
    }

    // Calculate character-level diff
    const getCharDiff = (str1: string, str2: string): CharDiff[] => {
        if (str1 === str2) {
            return [{ text: str1, type: "context" }]
        }

        // Find common prefix
        let prefixLen = 0
        while (
            prefixLen < str1.length &&
            prefixLen < str2.length &&
            str1[prefixLen] === str2[prefixLen]
        ) {
            prefixLen++
        }

        // Find common suffix
        let suffixLen = 0
        while (
            suffixLen < str1.length - prefixLen &&
            suffixLen < str2.length - prefixLen &&
            str1[str1.length - 1 - suffixLen] === str2[str2.length - 1 - suffixLen]
        ) {
            suffixLen++
        }

        const diffs: CharDiff[] = []

        // Add common prefix
        if (prefixLen > 0) {
            diffs.push({ text: str1.substring(0, prefixLen), type: "context" })
        }

        // Add middle part (different part)
        const str1Middle = str1.substring(prefixLen, str1.length - suffixLen)
        const str2Middle = str2.substring(prefixLen, str2.length - suffixLen)

        if (str1Middle) {
            diffs.push({ text: str1Middle, type: "remove" })
        }
        if (str2Middle) {
            diffs.push({ text: str2Middle, type: "add" })
        }

        // Add common suffix
        if (suffixLen > 0) {
            diffs.push({ text: str1.substring(str1.length - suffixLen), type: "context" })
        }

        return diffs
    }

    // Simple LCS-based diff algorithm
    const getLineDiff = React.useMemo(() => {
        const originalLines = original.split("\n")
        const modifiedLines = modified.split("\n")
        
        // Build LCS matrix
        const m = originalLines.length
        const n = modifiedLines.length
        const lcs: number[][] = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0))
        
        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                if (originalLines[i - 1] === modifiedLines[j - 1]) {
                    lcs[i][j] = lcs[i - 1][j - 1] + 1
                } else {
                    lcs[i][j] = Math.max(lcs[i - 1][j], lcs[i][j - 1])
                }
            }
        }
        
        // Backtrack to build diff
        const lineDiffs: LineDiff[] = []
        let i = m, j = n
        let lineNum = Math.max(m, n)
        
        const result: Array<{type: 'same' | 'add' | 'remove', origLine?: string, modLine?: string}> = []
        
        while (i > 0 || j > 0) {
            if (i > 0 && j > 0 && originalLines[i - 1] === modifiedLines[j - 1]) {
                result.unshift({type: 'same', origLine: originalLines[i - 1], modLine: modifiedLines[j - 1]})
                i--
                j--
            } else if (j > 0 && (i === 0 || lcs[i][j - 1] >= lcs[i - 1][j])) {
                result.unshift({type: 'add', origLine: '', modLine: modifiedLines[j - 1]})
                j--
            } else if (i > 0) {
                result.unshift({type: 'remove', origLine: originalLines[i - 1], modLine: ''})
                i--
            }
        }
        
        // Convert to LineDiff format
        result.forEach((item, idx) => {
            lineDiffs.push({
                originalLine: item.origLine || '',
                modifiedLine: item.modLine || '',
                lineNumber: idx + 1,
                isChanged: item.type !== 'same'
            })
        })
        
        return lineDiffs
    }, [original, modified])

    // Count differences
    const countDifferences = () => {
        let additions = 0
        let removals = 0
        
        getLineDiff.forEach(line => {
            if (line.isChanged) {
                const diffs = getCharDiff(line.originalLine, line.modifiedLine)
                diffs.forEach(diff => {
                    if (diff.type === "add") additions += diff.text.length
                    if (diff.type === "remove") removals += diff.text.length
                })
            }
        })
        
        return { additions, removals }
    }

    const handleReset = () => {
        setOriginal("")
        setModified("")
        setShowDiff(false)
        toast.success("Reset successfully")
    }

    const handleSwap = () => {
        const temp = original
        setOriginal(modified)
        setModified(temp)
        toast.success("Content swapped")
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        toast.success("Copied to clipboard")
    }

    const handleCompare = () => {
        if (original && modified) {
            setShowDiff(true)
        } else {
            toast.error("Please enter text in both fields")
        }
    }

    const { additions, removals } = countDifferences()
    const originalLines = original.split("\n")
    const modifiedLines = modified.split("\n")

    return (
        <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
            {/* Header */}
            <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-3 flex items-center justify-between flex-shrink-0">
                <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Untitled diff</h1>
                <div className="flex gap-2">
                    <button
                        onClick={handleReset}
                        className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        Clear
                    </button>
                    <button
                        onClick={handleSwap}
                        className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        ↔ Swap
                    </button>
                    {!showDiff && (
                        <button
                            onClick={handleCompare}
                            className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
                        >
                            Compare
                        </button>
                    )}
                    {showDiff && (
                        <button
                            onClick={() => setShowDiff(false)}
                            className="px-4 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            ← Back to Edit
                        </button>
                    )}
                </div>
            </div>

            {/* Stats Bar */}
            {showDiff && (original || modified) && (
                <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-2 flex items-center justify-between text-xs flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <span className="text-red-600 dark:text-red-400 font-medium">- {removals} removals</span>
                        <span className="text-gray-300 dark:text-gray-700">|</span>
                        <span className="text-gray-600 dark:text-gray-400">{originalLines.length} lines</span>
                        <button 
                            onClick={() => copyToClipboard(original)}
                            className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                        >
                            Copy
                        </button>
                        <span className="text-gray-400">→</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-green-600 dark:text-green-400 font-medium">+ {additions} additions</span>
                        <span className="text-gray-300 dark:text-gray-700">|</span>
                        <span className="text-gray-600 dark:text-gray-400">{modifiedLines.length} lines</span>
                        <button 
                            onClick={() => copyToClipboard(modified)}
                            className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                        >
                            Copy
                        </button>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            {!showDiff ? (
                /* Edit Mode - Textareas */
                <div className="flex-1 overflow-hidden grid grid-cols-2 divide-x divide-gray-200 dark:divide-gray-800">
                    {/* Original Text Input */}
                    <div className="flex flex-col overflow-hidden bg-white dark:bg-gray-900">
                        <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Original Text</span>
                        </div>
                        <div className="flex-1 overflow-hidden relative">
                            <div className="absolute inset-0 flex">
                                {/* Line Numbers */}
                                <div className="bg-gray-50 dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 px-2 py-3 text-right select-none overflow-hidden">
                                    {originalLines.map((_, idx) => (
                                        <div key={idx} className="font-mono text-xs text-gray-400 dark:text-gray-600 leading-6 h-6">
                                            {idx + 1}
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Text Content */}
                                <textarea
                                    value={original}
                                    onChange={(e) => setOriginal(e.target.value)}
                                    placeholder="Paste your original text here..."
                                    className="flex-1 px-4 py-3 font-mono text-sm text-gray-900 dark:text-gray-100 bg-transparent border-none resize-none focus:outline-none leading-6"
                                    spellCheck={false}
                                    style={{ lineHeight: '1.5rem' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Modified Text Input */}
                    <div className="flex flex-col overflow-hidden bg-white dark:bg-gray-900">
                        <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Modified Text</span>
                        </div>
                        <div className="flex-1 overflow-hidden relative">
                            <div className="absolute inset-0 flex">
                                {/* Line Numbers */}
                                <div className="bg-gray-50 dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 px-2 py-3 text-right select-none overflow-hidden">
                                    {modifiedLines.map((_, idx) => (
                                        <div key={idx} className="font-mono text-xs text-gray-400 dark:text-gray-600 leading-6 h-6">
                                            {idx + 1}
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Text Content */}
                                <textarea
                                    value={modified}
                                    onChange={(e) => setModified(e.target.value)}
                                    placeholder="Paste your modified text here..."
                                    className="flex-1 px-4 py-3 font-mono text-sm text-gray-900 dark:text-gray-100 bg-transparent border-none resize-none focus:outline-none leading-6"
                                    spellCheck={false}
                                    style={{ lineHeight: '1.5rem' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* Diff View Mode */
                <div className="flex-1 overflow-hidden grid grid-cols-2 divide-x divide-gray-200 dark:divide-gray-800">
                    {/* Original Side */}
                    <div 
                        ref={originalScrollRef}
                        onScroll={(e) => handleScroll('original', e)}
                        className="overflow-auto bg-gray-900"
                    >
                        {getLineDiff.map((line) => (
                            <div 
                                key={`orig-${line.lineNumber}`} 
                                className={`flex ${line.isChanged ? 'bg-red-900/30' : ''}`}
                            >
                                <div className="px-3 py-0.5 text-xs font-mono text-gray-500 select-none text-right w-12 flex-shrink-0 border-r border-gray-800">
                                    {line.lineNumber}
                                </div>
                                <div className="flex-1 px-4 py-0.5 font-mono text-sm whitespace-pre select-text">
                                    {line.isChanged ? (
                                        <span>
                                            {getCharDiff(line.originalLine, line.modifiedLine).map(
                                                (char, cIdx) =>
                                                    char.type === "remove" ? (
                                                        <span
                                                            key={cIdx}
                                                            className="bg-red-600/50 text-red-100"
                                                        >
                                                            {char.text}
                                                        </span>
                                                    ) : char.type === "context" ? (
                                                        <span key={cIdx} className="text-gray-300">{char.text}</span>
                                                    ) : null
                                            )}
                                        </span>
                                    ) : (
                                        <span className="text-gray-400">{line.originalLine || '\u00A0'}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Modified Side */}
                    <div 
                        ref={modifiedScrollRef}
                        onScroll={(e) => handleScroll('modified', e)}
                        className="overflow-auto bg-gray-900"
                    >
                        {getLineDiff.map((line) => (
                            <div 
                                key={`mod-${line.lineNumber}`} 
                                className={`flex ${line.isChanged ? 'bg-green-900/30' : ''}`}
                            >
                                <div className="px-3 py-0.5 text-xs font-mono text-gray-500 select-none text-right w-12 flex-shrink-0 border-r border-gray-800">
                                    {line.lineNumber}
                                </div>
                                <div className="flex-1 px-4 py-0.5 font-mono text-sm whitespace-pre select-text">
                                    {line.isChanged ? (
                                        <span>
                                            {getCharDiff(line.originalLine, line.modifiedLine).map(
                                                (char, cIdx) =>
                                                    char.type === "add" ? (
                                                        <span
                                                            key={cIdx}
                                                            className="bg-green-600/50 text-green-100"
                                                        >
                                                            {char.text}
                                                        </span>
                                                    ) : char.type === "context" ? (
                                                        <span key={cIdx} className="text-gray-300">{char.text}</span>
                                                    ) : null
                                            )}
                                        </span>
                                    ) : (
                                        <span className="text-gray-400">{line.modifiedLine || '\u00A0'}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}