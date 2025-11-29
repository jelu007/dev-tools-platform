import Link from "next/link"

export default function HtmlEncoderPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">HTML Encoder / Decoder</h1>
                <p className="text-muted-foreground mt-2">Escape or unescape HTML entities for safe rendering.</p>
            </div>

            <div className="prose">
                <p>Stub page: HTML encode/decode UI will be implemented here.</p>
                <p>
                    <Link href="/tools/dev/data-transformation">← Back to Data & Transformation Tools</Link>
                </p>
            </div>
        </div>
    )
}
