"use client"

import * as React from "react"
import { faker } from "@faker-js/faker"
import { toast } from "sonner"
import { Copy, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export default function TestDataPage() {
    const [dataType, setDataType] = React.useState("person")
    const [count, setCount] = React.useState(10)
    const [output, setOutput] = React.useState("")

    const generateData = () => {
        const data: any[] = []

        for (let i = 0; i < count; i++) {
            if (dataType === "person") {
                data.push({
                    id: faker.string.uuid(),
                    firstName: faker.person.firstName(),
                    lastName: faker.person.lastName(),
                    email: faker.internet.email(),
                    phone: faker.phone.number(),
                    address: {
                        street: faker.location.streetAddress(),
                        city: faker.location.city(),
                        state: faker.location.state(),
                        zipCode: faker.location.zipCode(),
                        country: faker.location.country()
                    }
                })
            } else if (dataType === "company") {
                data.push({
                    id: faker.string.uuid(),
                    name: faker.company.name(),
                    industry: faker.commerce.department(),
                    email: faker.internet.email(),
                    phone: faker.phone.number(),
                    website: faker.internet.url()
                })
            } else if (dataType === "product") {
                data.push({
                    id: faker.string.uuid(),
                    name: faker.commerce.productName(),
                    description: faker.commerce.productDescription(),
                    price: faker.commerce.price(),
                    category: faker.commerce.department(),
                    sku: faker.string.alphanumeric(10).toUpperCase()
                })
            } else if (dataType === "user") {
                data.push({
                    id: faker.string.uuid(),
                    username: faker.internet.username(),
                    email: faker.internet.email(),
                    avatar: faker.image.avatar(),
                    password: faker.internet.password(),
                    createdAt: faker.date.past().toISOString()
                })
            }
        }

        setOutput(JSON.stringify(data, null, 2))
        toast.success(`Generated ${count} records`)
    }

    React.useEffect(() => {
        generateData()
    }, [dataType, count])

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        toast.success("Copied to clipboard")
    }

    return (
        <div className="h-full flex flex-col space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Test Data Generator</h2>
                <p className="text-muted-foreground">
                    Generate realistic fake data for testing.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Data Type</Label>
                            <Select value={dataType} onValueChange={setDataType}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="person">Person</SelectItem>
                                    <SelectItem value="company">Company</SelectItem>
                                    <SelectItem value="product">Product</SelectItem>
                                    <SelectItem value="user">User</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Count</Label>
                            <Input
                                type="number"
                                min={1}
                                max={100}
                                value={count}
                                onChange={(e) => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
                            />
                        </div>
                        <Button onClick={generateData} className="w-full">
                            <RefreshCw className="mr-2 h-4 w-4" /> Regenerate
                        </Button>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Generated Data (JSON)</CardTitle>
                        <Button variant="ghost" size="icon" onClick={() => copyToClipboard(output)}>
                            <Copy className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            value={output}
                            readOnly
                            className="font-mono min-h-[500px] text-xs"
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
