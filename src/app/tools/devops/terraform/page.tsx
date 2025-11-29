"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import { Copy } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Editor from "@monaco-editor/react"

export default function TerraformPage() {
    const { theme } = useTheme()
    const [provider, setProvider] = React.useState("aws")
    const [resourceType, setResourceType] = React.useState("ec2")
    const [resourceName, setResourceName] = React.useState("example")
    const [output, setOutput] = React.useState("")

    React.useEffect(() => {
        generateTerraform()
    }, [provider, resourceType, resourceName])

    const generateTerraform = () => {
        let terraform = ""

        if (provider === "aws") {
            if (resourceType === "ec2") {
                terraform = `# AWS EC2 Instance
resource "aws_instance" "${resourceName}" {
  ami           = "ami-0c55b159cbfafe1f0"  # Amazon Linux 2
  instance_type = "t2.micro"

  tags = {
    Name = "${resourceName}"
    Environment = "production"
  }

  # Optional: Key pair for SSH access
  # key_name = "my-key-pair"

  # Optional: Security group
  # vpc_security_group_ids = [aws_security_group.${resourceName}.id]
}`
            } else if (resourceType === "s3") {
                terraform = `# AWS S3 Bucket
resource "aws_s3_bucket" "${resourceName}" {
  bucket = "${resourceName}-bucket"

  tags = {
    Name        = "${resourceName}"
    Environment = "production"
  }
}

# S3 Bucket Versioning
resource "aws_s3_bucket_versioning" "${resourceName}" {
  bucket = aws_s3_bucket.${resourceName}.id

  versioning_configuration {
    status = "Enabled"
  }
}

# S3 Bucket Encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "${resourceName}" {
  bucket = aws_s3_bucket.${resourceName}.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}`
            } else if (resourceType === "rds") {
                terraform = `# AWS RDS Database Instance
resource "aws_db_instance" "${resourceName}" {
  identifier           = "${resourceName}-db"
  engine               = "postgres"
  engine_version       = "14.7"
  instance_class       = "db.t3.micro"
  allocated_storage    = 20
  storage_type         = "gp2"
  
  db_name  = "mydb"
  username = "admin"
  password = var.db_password  # Use variable for sensitive data
  
  skip_final_snapshot  = true
  publicly_accessible  = false

  tags = {
    Name        = "${resourceName}"
    Environment = "production"
  }
}`
            } else if (resourceType === "vpc") {
                terraform = `# AWS VPC
resource "aws_vpc" "${resourceName}" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "${resourceName}-vpc"
  }
}

# Public Subnet
resource "aws_subnet" "${resourceName}_public" {
  vpc_id            = aws_vpc.${resourceName}.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "us-east-1a"

  tags = {
    Name = "${resourceName}-public-subnet"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "${resourceName}" {
  vpc_id = aws_vpc.${resourceName}.id

  tags = {
    Name = "${resourceName}-igw"
  }
}`
            }
        } else if (provider === "gcp") {
            if (resourceType === "compute") {
                terraform = `# GCP Compute Instance
resource "google_compute_instance" "${resourceName}" {
  name         = "${resourceName}-instance"
  machine_type = "e2-micro"
  zone         = "us-central1-a"

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-11"
    }
  }

  network_interface {
    network = "default"
    access_config {
      // Ephemeral public IP
    }
  }

  metadata = {
    environment = "production"
  }

  tags = ["${resourceName}", "web"]
}`
            } else if (resourceType === "storage") {
                terraform = `# GCP Storage Bucket
resource "google_storage_bucket" "${resourceName}" {
  name          = "${resourceName}-bucket"
  location      = "US"
  force_destroy = false

  uniform_bucket_level_access = true

  versioning {
    enabled = true
  }

  lifecycle_rule {
    condition {
      age = 30
    }
    action {
      type = "Delete"
    }
  }
}`
            } else if (resourceType === "sql") {
                terraform = `# GCP Cloud SQL Instance
resource "google_sql_database_instance" "${resourceName}" {
  name             = "${resourceName}-db"
  database_version = "POSTGRES_14"
  region           = "us-central1"

  settings {
    tier = "db-f1-micro"

    backup_configuration {
      enabled = true
    }

    ip_configuration {
      ipv4_enabled = true
    }
  }

  deletion_protection = true
}`
            }
        } else if (provider === "azure") {
            if (resourceType === "vm") {
                terraform = `# Azure Virtual Machine
resource "azurerm_linux_virtual_machine" "${resourceName}" {
  name                = "${resourceName}-vm"
  resource_group_name = azurerm_resource_group.${resourceName}.name
  location            = azurerm_resource_group.${resourceName}.location
  size                = "Standard_B1s"
  admin_username      = "adminuser"

  network_interface_ids = [
    azurerm_network_interface.${resourceName}.id,
  ]

  admin_ssh_key {
    username   = "adminuser"
    public_key = file("~/.ssh/id_rsa.pub")
  }

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "UbuntuServer"
    sku       = "18.04-LTS"
    version   = "latest"
  }
}`
            } else if (resourceType === "storage") {
                terraform = `# Azure Storage Account
resource "azurerm_storage_account" "${resourceName}" {
  name                     = "${resourceName}storage"
  resource_group_name      = azurerm_resource_group.${resourceName}.name
  location                 = azurerm_resource_group.${resourceName}.location
  account_tier             = "Standard"
  account_replication_type = "LRS"

  tags = {
    environment = "production"
  }
}

# Storage Container
resource "azurerm_storage_container" "${resourceName}" {
  name                  = "${resourceName}-container"
  storage_account_name  = azurerm_storage_account.${resourceName}.name
  container_access_type = "private"
}`
            }
        }

        setOutput(terraform)
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        toast.success("Copied to clipboard")
    }

    const getResourceTypes = () => {
        if (provider === "aws") {
            return [
                { value: "ec2", label: "EC2 Instance" },
                { value: "s3", label: "S3 Bucket" },
                { value: "rds", label: "RDS Database" },
                { value: "vpc", label: "VPC Network" },
            ]
        } else if (provider === "gcp") {
            return [
                { value: "compute", label: "Compute Instance" },
                { value: "storage", label: "Storage Bucket" },
                { value: "sql", label: "Cloud SQL" },
            ]
        } else if (provider === "azure") {
            return [
                { value: "vm", label: "Virtual Machine" },
                { value: "storage", label: "Storage Account" },
            ]
        }
        return []
    }

    return (
        <div className="h-full flex flex-col space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Terraform Snippet Generator</h2>
                <p className="text-muted-foreground">
                    Generate Terraform resource templates for AWS, GCP, and Azure.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Cloud Provider</Label>
                            <Select value={provider} onValueChange={(val) => {
                                setProvider(val)
                                setResourceType(val === "aws" ? "ec2" : val === "gcp" ? "compute" : "vm")
                            }}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="aws">AWS</SelectItem>
                                    <SelectItem value="gcp">Google Cloud (GCP)</SelectItem>
                                    <SelectItem value="azure">Microsoft Azure</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Resource Type</Label>
                            <Select value={resourceType} onValueChange={setResourceType}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {getResourceTypes().map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Resource Name</Label>
                            <Input
                                value={resourceName}
                                onChange={(e) => setResourceName(e.target.value)}
                                placeholder="example"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2 flex flex-col h-[600px]">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Generated Terraform</CardTitle>
                        <Button variant="ghost" size="icon" onClick={() => copyToClipboard(output)}>
                            <Copy className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0 flex-1">
                        <Editor
                            height="100%"
                            defaultLanguage="hcl"
                            theme={theme === "dark" ? "vs-dark" : "light"}
                            value={output}
                            options={{ readOnly: true, minimap: { enabled: false }, fontSize: 14 }}
                        />
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-muted/30">
                <CardHeader>
                    <CardTitle className="text-sm">Usage Instructions</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                    <ol className="list-decimal list-inside space-y-1">
                        <li>Select your cloud provider (AWS, GCP, or Azure)</li>
                        <li>Choose the resource type you want to create</li>
                        <li>Customize the resource name</li>
                        <li>Copy the generated Terraform code</li>
                        <li>Adjust values like region, size, and tags as needed</li>
                        <li>Run <code className="bg-muted px-1 rounded">terraform init</code> and <code className="bg-muted px-1 rounded">terraform apply</code></li>
                    </ol>
                </CardContent>
            </Card>
        </div>
    )
}
