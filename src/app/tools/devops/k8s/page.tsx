"use client"

import * as React from "react"
import yaml from "js-yaml"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import { Copy, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Editor from "@monaco-editor/react"

export default function K8sGeneratorPage() {
    const { theme } = useTheme()
    const [name, setName] = React.useState("my-app")
    const [image, setImage] = React.useState("nginx:latest")
    const [replicas, setReplicas] = React.useState(1)
    const [port, setPort] = React.useState(80)
    const [type, setType] = React.useState("Deployment")
    const [namespace, setNamespace] = React.useState("default")
    const [output, setOutput] = React.useState("")

    React.useEffect(() => {
        generateYaml()
    }, [name, image, replicas, port, type, namespace])

    const generateYaml = () => {
        let manifest: any = {}

        if (type === "Deployment") {
            manifest = {
                apiVersion: "apps/v1",
                kind: "Deployment",
                metadata: {
                    name: name,
                    namespace: namespace,
                    labels: {
                        app: name
                    }
                },
                spec: {
                    replicas: replicas,
                    selector: {
                        matchLabels: {
                            app: name
                        }
                    },
                    template: {
                        metadata: {
                            labels: {
                                app: name
                            }
                        },
                        spec: {
                            containers: [
                                {
                                    name: name,
                                    image: image,
                                    ports: [
                                        {
                                            containerPort: port
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                }
            }
        } else if (type === "Service") {
            manifest = {
                apiVersion: "v1",
                kind: "Service",
                metadata: {
                    name: name,
                    namespace: namespace
                },
                spec: {
                    selector: {
                        app: name
                    },
                    ports: [
                        {
                            protocol: "TCP",
                            port: port,
                            targetPort: port
                        }
                    ],
                    type: "ClusterIP"
                }
            }
        } else if (type === "Ingress") {
            manifest = {
                apiVersion: "networking.k8s.io/v1",
                kind: "Ingress",
                metadata: {
                    name: name,
                    namespace: namespace,
                    annotations: {
                        "nginx.ingress.kubernetes.io/rewrite-target": "/"
                    }
                },
                spec: {
                    rules: [
                        {
                            http: {
                                paths: [
                                    {
                                        path: "/",
                                        pathType: "Prefix",
                                        backend: {
                                            service: {
                                                name: name,
                                                port: {
                                                    number: port
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        }

        try {
            setOutput(yaml.dump(manifest))
        } catch (e) {
            setOutput("Error generating YAML")
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        toast.success("Copied to clipboard")
    }

    return (
        <div className="h-full flex flex-col space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">K8s YAML Generator</h2>
                <p className="text-muted-foreground">
                    Generate Kubernetes manifests for Deployment, Service, and Ingress.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Kind</Label>
                            <Select value={type} onValueChange={setType}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Deployment">Deployment</SelectItem>
                                    <SelectItem value="Service">Service</SelectItem>
                                    <SelectItem value="Ingress">Ingress</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Name</Label>
                            <Input value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Namespace</Label>
                            <Input value={namespace} onChange={(e) => setNamespace(e.target.value)} />
                        </div>
                        {type === "Deployment" && (
                            <>
                                <div className="space-y-2">
                                    <Label>Image</Label>
                                    <Input value={image} onChange={(e) => setImage(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Replicas</Label>
                                    <Input type="number" value={replicas} onChange={(e) => setReplicas(parseInt(e.target.value) || 1)} />
                                </div>
                            </>
                        )}
                        <div className="space-y-2">
                            <Label>Port</Label>
                            <Input type="number" value={port} onChange={(e) => setPort(parseInt(e.target.value) || 80)} />
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
