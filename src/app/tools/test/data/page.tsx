"use client"

import * as React from "react"
import { faker } from "@faker-js/faker"
import { toast } from "sonner"
import {
    Plus,
    Trash2,
    Download,
    GripVertical,
    Save,
    FolderOpen,
    RefreshCw,
    Eye,
    Copy,
    FileText
} from "lucide-react"
import * as XLSX from "xlsx"
import Papa from "papaparse"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

// Data type definitions
interface DataType {
    id: string
    label: string
    category: string
    hasConfig?: boolean
}

interface Field {
    id: string
    name: string
    type: string
    config?: {
        enumValues?: string
        min?: number
        max?: number
        decimals?: number
        pattern?: string
        nullPercent?: number
    }
}

interface Schema {
    id: string
    name: string
    description: string
    fields: Field[]
    createdAt: string
}

// Available data types
const DATA_TYPES: DataType[] = [
    // Person
    { id: "firstName", label: "First Name", category: "Person" },
    { id: "lastName", label: "Last Name", category: "Person" },
    { id: "fullName", label: "Full Name", category: "Person" },
    { id: "gender", label: "Gender", category: "Person" },
    { id: "jobTitle", label: "Job Title", category: "Person" },

    // Contact
    { id: "email", label: "Email", category: "Contact" },
    { id: "phone", label: "Phone Number", category: "Contact" },
    { id: "username", label: "Username", category: "Contact" },
    { id: "password", label: "Password", category: "Contact" },

    // Address
    { id: "street", label: "Street Address", category: "Address" },
    { id: "city", label: "City", category: "Address" },
    { id: "state", label: "State", category: "Address" },
    { id: "zipCode", label: "ZIP Code", category: "Address" },
    { id: "country", label: "Country", category: "Address" },
    { id: "latitude", label: "Latitude", category: "Address" },
    { id: "longitude", label: "Longitude", category: "Address" },

    // Company
    { id: "companyName", label: "Company Name", category: "Company" },
    { id: "industry", label: "Industry", category: "Company" },
    { id: "department", label: "Department", category: "Company" },

    // Product
    { id: "productName", label: "Product Name", category: "Product" },
    { id: "productDesc", label: "Product Description", category: "Product" },
    { id: "price", label: "Price", category: "Product", hasConfig: true },
    { id: "sku", label: "SKU", category: "Product" },

    // Date/Time
    { id: "date", label: "Date", category: "Date/Time" },
    { id: "time", label: "Time", category: "Date/Time" },
    { id: "datetime", label: "Date & Time", category: "Date/Time" },
    { id: "pastDate", label: "Past Date", category: "Date/Time" },
    { id: "futureDate", label: "Future Date", category: "Date/Time" },

    // Numbers
    { id: "integer", label: "Integer", category: "Numbers", hasConfig: true },
    { id: "decimal", label: "Decimal", category: "Numbers", hasConfig: true },
    { id: "currency", label: "Currency", category: "Numbers" },
    { id: "percentage", label: "Percentage", category: "Numbers" },

    // Text
    { id: "sentence", label: "Sentence", category: "Text" },
    { id: "paragraph", label: "Paragraph", category: "Text" },
    { id: "word", label: "Word", category: "Text" },
    { id: "lorem", label: "Lorem Ipsum", category: "Text" },

    // Internet
    { id: "url", label: "URL", category: "Internet" },
    { id: "domain", label: "Domain", category: "Internet" },
    { id: "ipAddress", label: "IP Address", category: "Internet" },
    { id: "macAddress", label: "MAC Address", category: "Internet" },
    { id: "userAgent", label: "User Agent", category: "Internet" },

    // Finance
    { id: "creditCard", label: "Credit Card", category: "Finance" },
    { id: "iban", label: "IBAN", category: "Finance" },
    { id: "bic", label: "BIC", category: "Finance" },
    { id: "bitcoin", label: "Bitcoin Address", category: "Finance" },

    // Custom
    { id: "enum", label: "Enum (Custom List)", category: "Custom", hasConfig: true },
    { id: "uuid", label: "UUID", category: "Custom" },
    { id: "boolean", label: "Boolean", category: "Custom" },
]

// Data generator function
function generateValue(field: Field): any {
    const { type, config } = field

    // Handle null percentage
    if (config?.nullPercent && Math.random() * 100 < config.nullPercent) {
        return null
    }

    switch (type) {
        // Person
        case "firstName": return faker.person.firstName()
        case "lastName": return faker.person.lastName()
        case "fullName": return faker.person.fullName()
        case "gender": return faker.person.sex()
        case "jobTitle": return faker.person.jobTitle()

        // Contact
        case "email": return faker.internet.email()
        case "phone": return faker.phone.number()
        case "username": return faker.internet.username()
        case "password": return faker.internet.password()

        // Address
        case "street": return faker.location.streetAddress()
        case "city": return faker.location.city()
        case "state": return faker.location.state()
        case "zipCode": return faker.location.zipCode()
        case "country": return faker.location.country()
        case "latitude": return faker.location.latitude()
        case "longitude": return faker.location.longitude()

        // Company
        case "companyName": return faker.company.name()
        case "industry": return faker.commerce.department()
        case "department": return faker.commerce.department()

        // Product
        case "productName": return faker.commerce.productName()
        case "productDesc": return faker.commerce.productDescription()
        case "price":
            return faker.commerce.price({
                min: config?.min || 1,
                max: config?.max || 1000,
                dec: config?.decimals || 2
            })
        case "sku": return faker.string.alphanumeric(10).toUpperCase()

        // Date/Time
        case "date": return faker.date.recent().toISOString().split('T')[0]
        case "time": return faker.date.recent().toISOString().split('T')[1].split('.')[0]
        case "datetime": return faker.date.recent().toISOString()
        case "pastDate": return faker.date.past().toISOString()
        case "futureDate": return faker.date.future().toISOString()

        // Numbers
        case "integer":
            return faker.number.int({
                min: config?.min || 0,
                max: config?.max || 1000
            })
        case "decimal":
            return faker.number.float({
                min: config?.min || 0,
                max: config?.max || 1000,
                fractionDigits: config?.decimals || 2
            })
        case "currency": return faker.finance.amount()
        case "percentage": return faker.number.int({ min: 0, max: 100 })

        // Text
        case "sentence": return faker.lorem.sentence()
        case "paragraph": return faker.lorem.paragraph()
        case "word": return faker.lorem.word()
        case "lorem": return faker.lorem.paragraphs(3)

        // Internet
        case "url": return faker.internet.url()
        case "domain": return faker.internet.domainName()
        case "ipAddress": return faker.internet.ip()
        case "macAddress": return faker.internet.mac()
        case "userAgent": return faker.internet.userAgent()

        // Finance
        case "creditCard": return faker.finance.creditCardNumber()
        case "iban": return faker.finance.iban()
        case "bic": return faker.finance.bic()
        case "bitcoin": return faker.finance.bitcoinAddress()

        // Custom
        case "enum":
            if (config?.enumValues) {
                const values = config.enumValues.split(',').map(v => v.trim())
                return faker.helpers.arrayElement(values)
            }
            return ""
        case "uuid": return faker.string.uuid()
        case "boolean": return faker.datatype.boolean()

        default: return ""
    }
}

export default function DataGeneratorPage() {
    const [fields, setFields] = React.useState<Field[]>([
        { id: "1", name: "id", type: "uuid" },
        { id: "2", name: "firstName", type: "firstName" },
        { id: "3", name: "lastName", type: "lastName" },
        { id: "4", name: "email", type: "email" },
    ])
    const [rowCount, setRowCount] = React.useState(100)
    const [generatedData, setGeneratedData] = React.useState<any[]>([])
    const [previewData, setPreviewData] = React.useState<any[]>([])
    const [draggedField, setDraggedField] = React.useState<string | null>(null)

    // Schema management
    const [schemas, setSchemas] = React.useState<Schema[]>([])
    const [schemaName, setSchemaName] = React.useState("")
    const [schemaDesc, setSchemaDesc] = React.useState("")
    const [saveDialogOpen, setSaveDialogOpen] = React.useState(false)
    const [loadDialogOpen, setLoadDialogOpen] = React.useState(false)

    // Export options
    const [sqlTableName, setSqlTableName] = React.useState("data_table")
    const [viewDialogOpen, setViewDialogOpen] = React.useState(false)
    const [viewContent, setViewContent] = React.useState("")
    const [viewTitle, setViewTitle] = React.useState("")

    // Load schemas from localStorage on mount
    React.useEffect(() => {
        const saved = localStorage.getItem("dataGenSchemas")
        if (saved) {
            setSchemas(JSON.parse(saved))
        }
    }, [])

    // Generate data
    const generateData = React.useCallback(() => {
        const data: any[] = []
        for (let i = 0; i < rowCount; i++) {
            const row: any = {}
            fields.forEach(field => {
                row[field.name] = generateValue(field)
            })
            data.push(row)
        }
        setGeneratedData(data)
        setPreviewData(data.slice(0, 10))
        toast.success(`Generated ${rowCount} rows`)
    }, [fields, rowCount])

    // Field management
    const addField = () => {
        const newField: Field = {
            id: Date.now().toString(),
            name: `field_${fields.length + 1} `,
            type: "firstName"
        }
        setFields([...fields, newField])
    }

    const removeField = (id: string) => {
        setFields(fields.filter(f => f.id !== id))
    }

    const updateField = (id: string, updates: Partial<Field>) => {
        setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f))
    }

    // Drag and drop
    const handleDragStart = (id: string) => {
        setDraggedField(id)
    }

    const handleDragOver = (e: React.DragEvent, id: string) => {
        e.preventDefault()
        if (!draggedField || draggedField === id) return

        const draggedIdx = fields.findIndex(f => f.id === draggedField)
        const targetIdx = fields.findIndex(f => f.id === id)

        const newFields = [...fields]
        const [removed] = newFields.splice(draggedIdx, 1)
        newFields.splice(targetIdx, 0, removed)

        setFields(newFields)
    }

    const handleDragEnd = () => {
        setDraggedField(null)
    }

    // Schema management
    const saveSchema = () => {
        if (!schemaName.trim()) {
            toast.error("Please enter a schema name")
            return
        }

        const newSchema: Schema = {
            id: Date.now().toString(),
            name: schemaName,
            description: schemaDesc,
            fields: fields,
            createdAt: new Date().toISOString()
        }

        const updated = [...schemas, newSchema]
        setSchemas(updated)
        localStorage.setItem("dataGenSchemas", JSON.stringify(updated))

        setSaveDialogOpen(false)
        setSchemaName("")
        setSchemaDesc("")
        toast.success("Schema saved successfully")
    }

    const loadSchema = (schema: Schema) => {
        setFields(schema.fields)
        setLoadDialogOpen(false)
        toast.success(`Loaded schema: ${schema.name} `)
    }

    const deleteSchema = (id: string) => {
        const updated = schemas.filter(s => s.id !== id)
        setSchemas(updated)
        localStorage.setItem("dataGenSchemas", JSON.stringify(updated))
        toast.success("Schema deleted")
    }

    // Export functions
    const getJSONString = () => JSON.stringify(generatedData, null, 2)
    const getCSVString = () => Papa.unparse(generatedData)
    const getSQLString = () => {
        let sql = ""
        generatedData.forEach(row => {
            const columns = Object.keys(row).join(", ")
            const values = Object.values(row).map(v => {
                if (v === null) return "NULL"
                if (typeof v === "string") return `'${v.replace(/'/g, "''")}'`
                return v
            }).join(", ")
            sql += `INSERT INTO ${sqlTableName} (${columns}) VALUES (${values});\n`
        })
        return sql
    }

    const copyToClipboard = (text: string, format: string) => {
        navigator.clipboard.writeText(text)
        toast.success(`${format} copied to clipboard`)
    }

    const viewInBrowser = (content: string, title: string) => {
        setViewContent(content)
        setViewTitle(title)
        setViewDialogOpen(true)
    }

    const exportJSON = () => {
        const json = getJSONString()
        const blob = new Blob([json], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `data_${Date.now()}.json`
        a.click()
        URL.revokeObjectURL(url)
        toast.success("Exported to JSON")
    }

    const exportCSV = () => {
        const csv = getCSVString()
        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `data_${Date.now()}.csv`
        a.click()
        URL.revokeObjectURL(url)
        toast.success("Exported to CSV")
    }

    const exportExcel = () => {
        const ws = XLSX.utils.json_to_sheet(generatedData)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "Data")

        // Auto-size columns
        const maxWidth = 50
        const colWidths = fields.map(field => ({
            wch: Math.min(maxWidth, field.name.length + 5)
        }))
        ws['!cols'] = colWidths

        XLSX.writeFile(wb, `data_${Date.now()}.xlsx`)
        toast.success("Exported to Excel")
    }

    const exportSQL = () => {
        const sql = getSQLString()
        const blob = new Blob([sql], { type: "text/plain" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `data_${Date.now()}.sql`
        a.click()
        URL.revokeObjectURL(url)
        toast.success("Exported to SQL")
    }

    // Group data types by category
    const groupedTypes = React.useMemo(() => {
        const groups: Record<string, DataType[]> = {}
        DATA_TYPES.forEach(type => {
            if (!groups[type.category]) {
                groups[type.category] = []
            }
            groups[type.category].push(type)
        })
        return groups
    }, [])

    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Data Generator</h2>
                    <p className="text-muted-foreground">
                        Create custom datasets with multiple data types and export formats
                    </p>
                </div>
                <div className="flex gap-2">
                    <Dialog open={loadDialogOpen} onOpenChange={setLoadDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                                <FolderOpen className="mr-2 h-4 w-4" />
                                Load Schema
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Load Schema</DialogTitle>
                                <DialogDescription>
                                    Select a saved schema to load
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-2 max-h-[400px] overflow-y-auto">
                                {schemas.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-8">
                                        No saved schemas
                                    </p>
                                ) : (
                                    schemas.map(schema => (
                                        <div
                                            key={schema.id}
                                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                                        >
                                            <div className="flex-1">
                                                <div className="font-medium">{schema.name}</div>
                                                {schema.description && (
                                                    <div className="text-sm text-muted-foreground">
                                                        {schema.description}
                                                    </div>
                                                )}
                                                <div className="text-xs text-muted-foreground mt-1">
                                                    {schema.fields.length} fields • {new Date(schema.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    onClick={() => loadSchema(schema)}
                                                >
                                                    Load
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => deleteSchema(schema.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                                <Save className="mr-2 h-4 w-4" />
                                Save Schema
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Save Schema</DialogTitle>
                                <DialogDescription>
                                    Save your current field configuration for reuse
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Schema Name</Label>
                                    <Input
                                        value={schemaName}
                                        onChange={(e) => setSchemaName(e.target.value)}
                                        placeholder="e.g., User Profile Data"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Description (optional)</Label>
                                    <Textarea
                                        value={schemaDesc}
                                        onChange={(e) => setSchemaDesc(e.target.value)}
                                        placeholder="Describe what this schema is for..."
                                        rows={3}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={saveSchema}>Save Schema</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Field Builder */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Fields ({fields.length})</span>
                            <Button size="sm" onClick={addField}>
                                <Plus className="h-4 w-4 mr-1" />
                                Add Field
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                            {fields.map((field, index) => (
                                <div
                                    key={field.id}
                                    draggable
                                    onDragStart={() => handleDragStart(field.id)}
                                    onDragOver={(e) => handleDragOver(e, field.id)}
                                    onDragEnd={handleDragEnd}
                                    className="border rounded-lg p-3 space-y-3 bg-card hover:bg-muted/50 cursor-move"
                                >
                                    <div className="flex items-center gap-2">
                                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                                        <Input
                                            value={field.name}
                                            onChange={(e) => updateField(field.id, { name: e.target.value })}
                                            placeholder="Field name"
                                            className="flex-1"
                                        />
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => removeField(field.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <Select
                                        value={field.type}
                                        onValueChange={(value) => updateField(field.id, { type: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(groupedTypes).map(([category, types]) => (
                                                <React.Fragment key={category}>
                                                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                                                        {category}
                                                    </div>
                                                    {types.map(type => (
                                                        <SelectItem key={type.id} value={type.id}>
                                                            {type.label}
                                                        </SelectItem>
                                                    ))}
                                                </React.Fragment>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {/* Type-specific configuration */}
                                    {field.type === "enum" && (
                                        <Input
                                            placeholder="Comma-separated values: red,blue,green"
                                            value={field.config?.enumValues || ""}
                                            onChange={(e) => updateField(field.id, {
                                                config: { ...field.config, enumValues: e.target.value }
                                            })}
                                        />
                                    )}

                                    {(field.type === "integer" || field.type === "decimal" || field.type === "price") && (
                                        <div className="grid grid-cols-2 gap-2">
                                            <Input
                                                type="number"
                                                placeholder="Min"
                                                value={field.config?.min || ""}
                                                onChange={(e) => updateField(field.id, {
                                                    config: { ...field.config, min: Number(e.target.value) }
                                                })}
                                            />
                                            <Input
                                                type="number"
                                                placeholder="Max"
                                                value={field.config?.max || ""}
                                                onChange={(e) => updateField(field.id, {
                                                    config: { ...field.config, max: Number(e.target.value) }
                                                })}
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Preview & Export */}
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Preview & Export</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Generation Controls */}
                        <div className="flex gap-3">
                            <div className="flex-1">
                                <Label>Number of Rows</Label>
                                <Input
                                    type="number"
                                    min={1}
                                    max={10000}
                                    value={rowCount}
                                    onChange={(e) => setRowCount(Math.min(10000, Math.max(1, parseInt(e.target.value) || 1)))}
                                />
                            </div>
                            <div className="flex items-end gap-2">
                                <Button onClick={generateData}>
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Generate Data
                                </Button>
                            </div>
                        </div>

                        {/* Preview Table */}
                        {previewData.length > 0 && (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label>Preview (first 10 rows)</Label>
                                    <span className="text-xs text-muted-foreground">
                                        {generatedData.length} total rows
                                    </span>
                                </div>
                                <div className="border rounded-lg overflow-auto max-h-[300px]">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                {fields.map(field => (
                                                    <TableHead key={field.id} className="whitespace-nowrap">
                                                        {field.name}
                                                    </TableHead>
                                                ))}
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {previewData.map((row, idx) => (
                                                <TableRow key={idx}>
                                                    {fields.map(field => (
                                                        <TableCell key={field.id} className="whitespace-nowrap max-w-[200px] truncate">
                                                            {row[field.name] === null ? (
                                                                <span className="text-muted-foreground italic">null</span>
                                                            ) : (
                                                                String(row[field.name])
                                                            )}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        )}

                        {/* Export Options */}
                        {generatedData.length > 0 && (
                            <div className="space-y-3">
                                <Label>Export & View Options</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    <Button onClick={exportJSON} variant="outline" size="sm">
                                        <Download className="mr-2 h-4 w-4" />
                                        Download JSON
                                    </Button>
                                    <Button onClick={() => copyToClipboard(getJSONString(), "JSON")} variant="outline" size="sm">
                                        <Copy className="mr-2 h-4 w-4" />
                                        Copy JSON
                                    </Button>

                                    <Button onClick={exportCSV} variant="outline" size="sm">
                                        <Download className="mr-2 h-4 w-4" />
                                        Download CSV
                                    </Button>
                                    <Button onClick={() => copyToClipboard(getCSVString(), "CSV")} variant="outline" size="sm">
                                        <Copy className="mr-2 h-4 w-4" />
                                        Copy CSV
                                    </Button>

                                    <Button onClick={exportExcel} variant="outline" size="sm">
                                        <Download className="mr-2 h-4 w-4" />
                                        Download Excel
                                    </Button>
                                    <Button onClick={() => viewInBrowser(getJSONString(), "JSON Preview")} variant="outline" size="sm">
                                        <Eye className="mr-2 h-4 w-4" />
                                        View JSON
                                    </Button>
                                    <Button onClick={exportSQL} variant="outline" size="sm">
                                        <Download className="mr-2 h-4 w-4" />
                                        Download SQL
                                    </Button>
                                    <Button onClick={() => copyToClipboard(getSQLString(), "SQL")} variant="outline" size="sm">
                                        <Copy className="mr-2 h-4 w-4" />
                                        Copy SQL
                                    </Button>
                                </div>

                                {/* SQL Table Name */}
                                <div className="space-y-2">
                                    <Label className="text-xs">SQL Table Name</Label>
                                    <Input
                                        value={sqlTableName}
                                        onChange={(e) => setSqlTableName(e.target.value)}
                                        placeholder="table_name"
                                        className="text-sm"
                                    />
                                </div>
                            </div>
                        )}

                        {generatedData.length === 0 && (
                            <div className="text-center py-12 text-muted-foreground">
                                <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>Configure fields and click "Generate Data" to preview</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* View Dialog */}
            <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[80vh]">
                    <DialogHeader>
                        <DialogTitle>{viewTitle}</DialogTitle>
                        <DialogDescription>
                            Viewing generated data in browser
                        </DialogDescription>
                    </DialogHeader>
                    <div className="relative">
                        <Textarea
                            value={viewContent}
                            readOnly
                            className="font-mono text-xs min-h-[500px] max-h-[60vh]"
                        />
                        <Button
                            size="sm"
                            variant="outline"
                            className="absolute top-2 right-2"
                            onClick={() => copyToClipboard(viewContent, viewTitle)}
                        >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
