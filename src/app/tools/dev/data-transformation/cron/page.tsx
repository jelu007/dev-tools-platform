import Link from "next/link"

export default function CronGeneratorPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Cron Expression Generator & Validator</h1>
                <p className="text-muted-foreground mt-2">Create and interpret cron schedules with ease.</p>
            </div>

            <div className="prose">
                <p>Stub page: Cron generator and validator UI will be implemented here.</p>
                <p>
                    <Link href="/tools/dev/data-transformation">← Back to Data & Transformation Tools</Link>
                </p>
            </div>
        </div>
    )
}
