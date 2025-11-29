"use client"

import * as React from "react"
import Link from "next/link"
import { toast } from "sonner"
import { Copy, Download, RefreshCcw } from "lucide-react"

import { Button } from "@/components/ui/button"

const presets: Record<string, string> = {
  Node: `# Node
node_modules/
.env
dist/
.build/
npm-debug.log
.DS_Store
`,
  Python: `# Python
__pycache__/
*.pyc
.env
venv/
.env/*.local
.DS_Store
`,
  Java: `# Java
target/
*.class
*.jar
.DS_Store
`,
  Go: `# Go
bin/
*.exe
*.exe~
.DS_Store
`,
  Rust: `# Rust
target/
**/*.rs.bk
.DS_Store
`,
  "Visual Studio": `# Visual Studio
.vs/
*.user
*.suo
.DS_Store
`,
  "React Native": `# React Native
node_modules/
android/
ios/
.env
.DS_Store
`,
  Erlang: `# Erlang
_build/
deps/
rel/
erl_crash.dump
erlang.mk
erl_interface
.erlang.cookie
.DS_Store
`,
  Elixir: `# Elixir
_build/
deps/
erl_crash.dump
*.ez
cover/
.elixir_ls
.iex.exs
.DS_Store
`,
}

export default function GitIgnoreGeneratorPage() {
  const [type, setType] = React.useState<string>("Node")
  const [content, setContent] = React.useState<string>(presets["Node"])

  React.useEffect(() => {
    setContent(presets[type] || "")
  }, [type])

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    toast.success(".gitignore copied to clipboard")
  }

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = ".gitignore"
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
    toast.success(".gitignore downloaded")
  }

  const handleReset = () => {
    setContent(presets[type] || "")
    toast.success("Reset to preset")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Git Ignore Generator</h1>
        <p className="text-muted-foreground mt-2">Generate a .gitignore tailored to your project type.</p>
      </div>

      <div className="flex items-center gap-3">
        <label className="text-sm font-medium">Project Type</label>
        <select value={type} onChange={(e) => setType(e.target.value)} className="rounded-md border px-2 py-1">
          {Object.keys(presets).map((k) => (
            <option key={k} value={k}>{k}</option>
          ))}
        </select>

        <div className="ml-auto flex items-center gap-2">
          <Button onClick={handleCopy} size="sm" variant="outline">Copy</Button>
          <Button onClick={handleDownload} size="sm" variant="outline">Download</Button>
          <Button onClick={handleReset} size="sm" variant="ghost"><RefreshCcw className="w-4 h-4 mr-2" />Reset</Button>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">.gitignore content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-72 p-3 font-mono text-sm rounded-md border resize-none"
        />
      </div>

      <div>
        <Link href="/tools/dev">← Back to Developer Tools</Link>
      </div>
    </div>
  )
}
