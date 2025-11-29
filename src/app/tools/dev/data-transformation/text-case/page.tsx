import Link from "next/link"

export default function TextCaseConverterPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Text Case Converter</h1>
                <p className="text-muted-foreground mt-2">Convert between camelCase, PascalCase, snake_case, kebab-case and more.</p>
            </div>

            <div className="prose">
                <p>Stub page: Text case conversion UI will be implemented here.</p>
                <p>
                    <Link href="/tools/dev/data-transformation">← Back to Data & Transformation Tools</Link>
                </p>
            </div>
        </div>
    )
}
