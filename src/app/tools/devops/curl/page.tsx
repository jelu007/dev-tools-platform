"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import { Copy } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Editor from "@monaco-editor/react"

export default function CurlConverterPage() {
    const { theme } = useTheme()
    const [curlCommand, setCurlCommand] = React.useState(`curl -X POST https://api.example.com/users \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer token123" \\
  -d '{"name":"John","email":"john@example.com"}'`)
    const [language, setLanguage] = React.useState("python")
    const [output, setOutput] = React.useState("")

    React.useEffect(() => {
        convertCurl()
    }, [curlCommand, language])

    const parseCurl = (curl: string) => {
        const lines = curl.split('\n').map(l => l.trim()).join(' ')

        // Extract URL
        const urlMatch = lines.match(/curl\s+(?:-X\s+\w+\s+)?['"]?([^'"\s]+)['"]?/) ||
            lines.match(/curl\s+['"]?([^'"\s]+)['"]?/)
        const url = urlMatch ? urlMatch[1] : ''

        // Extract method
        const methodMatch = lines.match(/-X\s+(\w+)/)
        const method = methodMatch ? methodMatch[1] : 'GET'

        // Extract headers
        const headers: Record<string, string> = {}
        const headerMatches = lines.matchAll(/-H\s+['"]([^'"]+)['"]/g)
        for (const match of headerMatches) {
            const [key, ...valueParts] = match[1].split(':')
            headers[key.trim()] = valueParts.join(':').trim()
        }

        // Extract data
        const dataMatch = lines.match(/-d\s+['"](.+?)['"]/) || lines.match(/--data\s+['"](.+?)['"]/)
        const data = dataMatch ? dataMatch[1] : null

        return { url, method, headers, data }
    }

    const convertCurl = () => {
        try {
            const { url, method, headers, data } = parseCurl(curlCommand)

            let code = ""

            if (language === "python") {
                code = `import requests\n\n`
                code += `url = "${url}"\n`
                if (Object.keys(headers).length > 0) {
                    code += `headers = ${JSON.stringify(headers, null, 2)}\n`
                }
                if (data) {
                    code += `data = ${data}\n`
                }
                code += `\nresponse = requests.${method.toLowerCase()}(url`
                if (Object.keys(headers).length > 0) code += `, headers=headers`
                if (data) code += `, json=data`
                code += `)\n`
                code += `print(response.json())`
            } else if (language === "javascript") {
                code = `const url = "${url}";\n`
                if (Object.keys(headers).length > 0 || data) {
                    code += `const options = {\n`
                    code += `  method: "${method}",\n`
                    if (Object.keys(headers).length > 0) {
                        code += `  headers: ${JSON.stringify(headers, null, 4)},\n`
                    }
                    if (data) {
                        code += `  body: JSON.stringify(${data})\n`
                    }
                    code += `};\n\n`
                    code += `fetch(url, options)\n`
                } else {
                    code += `\nfetch(url)\n`
                }
                code += `  .then(response => response.json())\n`
                code += `  .then(data => console.log(data))\n`
                code += `  .catch(error => console.error('Error:', error));`
            } else if (language === "go") {
                code = `package main\n\nimport (\n\t"bytes"\n\t"fmt"\n\t"io"\n\t"net/http"\n)\n\n`
                code += `func main() {\n`
                code += `\turl := "${url}"\n`
                if (data) {
                    code += `\tpayload := []byte(\`${data}\`)\n`
                    code += `\treq, _ := http.NewRequest("${method}", url, bytes.NewBuffer(payload))\n`
                } else {
                    code += `\treq, _ := http.NewRequest("${method}", url, nil)\n`
                }
                Object.entries(headers).forEach(([key, value]) => {
                    code += `\treq.Header.Set("${key}", "${value}")\n`
                })
                code += `\n\tclient := &http.Client{}\n`
                code += `\tresp, err := client.Do(req)\n`
                code += `\tif err != nil {\n\t\tpanic(err)\n\t}\n`
                code += `\tdefer resp.Body.Close()\n\n`
                code += `\tbody, _ := io.ReadAll(resp.Body)\n`
                code += `\tfmt.Println(string(body))\n`
                code += `}`
            } else if (language === "node") {
                code = `const axios = require('axios');\n\n`
                code += `const url = "${url}";\n`
                if (Object.keys(headers).length > 0 || data) {
                    code += `const config = {\n`
                    code += `  method: '${method.toLowerCase()}',\n`
                    code += `  url: url,\n`
                    if (Object.keys(headers).length > 0) {
                        code += `  headers: ${JSON.stringify(headers, null, 4)},\n`
                    }
                    if (data) {
                        code += `  data: ${data}\n`
                    }
                    code += `};\n\n`
                    code += `axios(config)\n`
                } else {
                    code += `\naxios.${method.toLowerCase()}(url)\n`
                }
                code += `  .then(response => console.log(response.data))\n`
                code += `  .catch(error => console.error('Error:', error));`
            } else if (language === "java") {
                code = `import java.net.http.*;\nimport java.net.URI;\n\n`
                code += `public class Main {\n`
                code += `  public static void main(String[] args) throws Exception {\n`
                code += `    HttpClient client = HttpClient.newHttpClient();\n`
                code += `    HttpRequest.Builder builder = HttpRequest.newBuilder()\n`
                code += `      .uri(URI.create("${url}"))\n`
                code += `      .method("${method}", `
                if (data) {
                    code += `HttpRequest.BodyPublishers.ofString(${JSON.stringify(data)}))`
                } else {
                    code += `HttpRequest.BodyPublishers.noBody())`
                }
                code += `;\n\n`
                Object.entries(headers).forEach(([key, value]) => {
                    code += `    builder.header("${key}", "${value}");\n`
                })
                code += `\n    HttpRequest request = builder.build();\n`
                code += `    HttpResponse<String> response = client.send(request,\n`
                code += `      HttpResponse.BodyHandlers.ofString());\n`
                code += `    System.out.println(response.body());\n`
                code += `  }\n}`
            } else if (language === "csharp") {
                code = `using System;\nusing System.Net.Http;\nusing System.Text;\nusing System.Threading.Tasks;\n\n`
                code += `class Program {\n`
                code += `  static async Task Main() {\n`
                code += `    var client = new HttpClient();\n`
                Object.entries(headers).forEach(([key, value]) => {
                    code += `    client.DefaultRequestHeaders.Add("${key}", "${value}");\n`
                })
                code += `\n    var url = "${url}";\n`
                if (data) {
                    code += `    var content = new StringContent(${JSON.stringify(data)}, Encoding.UTF8, "application/json");\n`
                    code += `    var response = await client.${method === 'GET' ? 'GetAsync' : method === 'POST' ? 'PostAsync' : 'SendAsync'}(url${method === 'POST' ? ', content' : ''});\n`
                } else {
                    code += `    var response = await client.GetAsync(url);\n`
                }
                code += `    var result = await response.Content.ReadAsStringAsync();\n`
                code += `    Console.WriteLine(result);\n`
                code += `  }\n}`
            } else if (language === "erlang") {
                code = `%% Using httpc (built-in)\n`
                code += `-module(http_request).\n`
                code += `-export([make_request/0]).\n\n`
                code += `make_request() ->\n`
                code += `  inets:start(),\n`
                code += `  ssl:start(),\n\n`
                code += `  Url = "${url}",\n`

                if (Object.keys(headers).length > 0) {
                    code += `  Headers = [\n`
                    Object.entries(headers).forEach(([key, value], idx, arr) => {
                        code += `    {"${key}", "${value}"}${idx < arr.length - 1 ? ',' : ''}\n`
                    })
                    code += `  ],\n`
                } else {
                    code += `  Headers = [],\n`
                }

                if (data) {
                    code += `  Body = ${JSON.stringify(data)},\n`
                    code += `  ContentType = "application/json",\n`
                    code += `  Request = {Url, Headers, ContentType, Body},\n`
                } else {
                    code += `  Request = {Url, Headers},\n`
                }

                code += `  Method = ${method.toLowerCase()},\n`
                code += `  HttpOptions = [],\n`
                code += `  Options = [],\n\n`
                code += `  case httpc:request(Method, Request, HttpOptions, Options) of\n`
                code += `    {ok, {{_Version, 200, _ReasonPhrase}, _Headers, ResponseBody}} ->\n`
                code += `      io:format("Response: ~s~n", [ResponseBody]);\n`
                code += `    {ok, {{_Version, StatusCode, _ReasonPhrase}, _Headers, _Body}} ->\n`
                code += `      io:format("Error: Status code ~p~n", [StatusCode]);\n`
                code += `    {error, Reason} ->\n`
                code += `      io:format("Error: ~p~n", [Reason])\n`
                code += `  end.\n`
            }

            setOutput(code)
        } catch (e) {
            setOutput("// Error parsing curl command")
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        toast.success("Copied to clipboard")
    }

    return (
        <div className="h-full flex flex-col space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Curl to Code Converter</h2>
                <p className="text-muted-foreground">
                    Convert curl commands to code in various programming languages.
                </p>
            </div>

            <div className="flex items-center space-x-4">
                <Label>Target Language:</Label>
                <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="python">Python (requests)</SelectItem>
                        <SelectItem value="javascript">JavaScript (fetch)</SelectItem>
                        <SelectItem value="node">Node.js (axios)</SelectItem>
                        <SelectItem value="go">Go</SelectItem>
                        <SelectItem value="java">Java</SelectItem>
                        <SelectItem value="csharp">C#</SelectItem>
                        <SelectItem value="erlang">Erlang (httpc)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
                <Card className="flex flex-col h-[600px]">
                    <CardHeader>
                        <CardTitle>Curl Command</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <Textarea
                            value={curlCommand}
                            onChange={(e) => setCurlCommand(e.target.value)}
                            className="h-full font-mono text-sm resize-none"
                            placeholder="Paste your curl command here..."
                        />
                    </CardContent>
                </Card>

                <Card className="flex flex-col h-[600px]">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Generated Code</CardTitle>
                        <Button variant="ghost" size="icon" onClick={() => copyToClipboard(output)}>
                            <Copy className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0 flex-1">
                        <Editor
                            height="100%"
                            defaultLanguage={language === "node" ? "javascript" : language === "csharp" ? "csharp" : language}
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
