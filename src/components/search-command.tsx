"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    Code,
    Server,
    TestTube,
    FileJson,
    Network,
    Regex,
    Key,
    Hash,
    Fingerprint,
    FileCode,
    Ship,
    GitBranch,
    FileText,
    Activity,
    Terminal,
    Container,
    Cloud,
    Database,
    Webhook,
    Timer,
    Code2,
    Globe,
} from "lucide-react"

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"

export function SearchCommand() {
    const [open, setOpen] = React.useState(false)
    const router = useRouter()

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    const runCommand = React.useCallback((command: () => void) => {
        setOpen(false)
        command()
    }, [])

    return (
        <>
            <Button
                variant="outline"
                className="relative h-9 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64"
                onClick={() => setOpen(true)}
            >
                <span className="hidden lg:inline-flex">Search tools...</span>
                <span className="inline-flex lg:hidden">Search...</span>
                <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </Button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Search tools..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Developer Tools">
                        <CommandItem onSelect={() => runCommand(() => router.push("/tools/dev/json"))}>
                            <FileJson className="mr-2 h-4 w-4" />
                            <span>JSON Tools</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push("/tools/dev/api-tester"))}>
                            <Network className="mr-2 h-4 w-4" />
                            <span>API Request Tester</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push("/tools/dev/regex"))}>
                            <Regex className="mr-2 h-4 w-4" />
                            <span>Regex Tester</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push("/tools/dev/jwt"))}>
                            <Key className="mr-2 h-4 w-4" />
                            <span>JWT Decoder</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push("/tools/dev/hash"))}>
                            <Hash className="mr-2 h-4 w-4" />
                            <span>Hash & Encode</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push("/tools/dev/uuid"))}>
                            <Fingerprint className="mr-2 h-4 w-4" />
                            <span>UUID Generator</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push("/tools/dev/minify"))}>
                            <FileCode className="mr-2 h-4 w-4" />
                            <span>Minifiers</span>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="DevOps Tools">
                        <CommandItem onSelect={() => runCommand(() => router.push("/tools/devops/k8s"))}>
                            <Ship className="mr-2 h-4 w-4" />
                            <span>K8s Generator</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push("/tools/devops/cicd"))}>
                            <GitBranch className="mr-2 h-4 w-4" />
                            <span>CI/CD Pipeline</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push("/tools/devops/logs"))}>
                            <FileText className="mr-2 h-4 w-4" />
                            <span>Log Parser</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push("/tools/devops/http"))}>
                            <Activity className="mr-2 h-4 w-4" />
                            <span>HTTP Diagnostics</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push("/tools/devops/curl"))}>
                            <Terminal className="mr-2 h-4 w-4" />
                            <span>Curl Converter</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push("/tools/devops/docker"))}>
                            <Container className="mr-2 h-4 w-4" />
                            <span>Dockerfile Generator</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push("/tools/devops/terraform"))}>
                            <Cloud className="mr-2 h-4 w-4" />
                            <span>Terraform Snippets</span>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Tester Tools">
                        <CommandItem onSelect={() => runCommand(() => router.push("/tools/test/data"))}>
                            <Database className="mr-2 h-4 w-4" />
                            <span>Test Data Generator</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push("/tools/test/webhook"))}>
                            <Webhook className="mr-2 h-4 w-4" />
                            <span>Webhook Tester</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push("/tools/test/performance"))}>
                            <Timer className="mr-2 h-4 w-4" />
                            <span>Performance Tester</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push("/tools/test/selectors"))}>
                            <Code2 className="mr-2 h-4 w-4" />
                            <span>XPath/CSS Tester</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push("/tools/test/browser"))}>
                            <Globe className="mr-2 h-4 w-4" />
                            <span>Browser Inspector</span>
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    )
}
