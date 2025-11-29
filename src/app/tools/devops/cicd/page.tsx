"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import { Copy } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Editor from "@monaco-editor/react"

export default function CicdGeneratorPage() {
    const { theme } = useTheme()
    const [provider, setProvider] = React.useState("github")
    const [language, setLanguage] = React.useState("node")
    const [output, setOutput] = React.useState("")

    React.useEffect(() => {
        generateConfig()
    }, [provider, language])

    const generateConfig = () => {
        let config = ""

        if (provider === "github") {
            if (language === "node") {
                config = `name: Node.js CI

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Use Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18.x'
        cache: 'npm'
    - run: npm ci
    - run: npm run build --if-present
    - run: npm test`
            } else if (language === "python") {
                config = `name: Python application

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

permissions:
  contents: read

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Set up Python 3.10
      uses: actions/setup-python@v3
      with:
        python-version: "3.10"
    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install flake8 pytest
        if [ -f requirements.txt ]; then pip install -r requirements.txt; fi
    - name: Lint with flake8
      run: |
        # stop the build if there are Python syntax errors or undefined names
        flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics
        # exit-zero treats all errors as warnings. The GitHub editor is 127 chars wide
        flake8 . --count --exit-zero --max-complexity=10 --max-line-length=127 --statistics
    - name: Test with pytest
      run: |
        pytest`
            }
        } else if (provider === "gitlab") {
            if (language === "node") {
                config = `image: node:latest

stages:
  - build
  - test

build:
  stage: build
  script:
    - npm install
    - npm run build
  artifacts:
    paths:
      - dist/

test:
  stage: test
  script:
    - npm test`
            } else if (language === "python") {
                config = `image: python:latest

stages:
  - test

test:
  stage: test
  script:
    - pip install -r requirements.txt
    - pytest`
            }
        }

        setOutput(config)
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        toast.success("Copied to clipboard")
    }

    return (
        <div className="h-full flex flex-col space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">CI/CD Generator</h2>
                <p className="text-muted-foreground">
                    Generate CI/CD pipeline configurations.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Provider</Label>
                            <Select value={provider} onValueChange={setProvider}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="github">GitHub Actions</SelectItem>
                                    <SelectItem value="gitlab">GitLab CI</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Language / Framework</Label>
                            <Select value={language} onValueChange={setLanguage}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="node">Node.js</SelectItem>
                                    <SelectItem value="python">Python</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                <Card className="flex flex-col h-[600px]">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Output YAML</CardTitle>
                        <Button variant="ghost" size="icon" onClick={() => copyToClipboard(output)}>
                            <Copy className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0 flex-1">
                        <Editor
                            height="100%"
                            defaultLanguage="yaml"
                            theme={theme === "dark" ? "vs-dark" : "light"}
                            value={output}
                            options={{ readOnly: true, minimap: { enabled: false }, fontSize: 14 }}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
