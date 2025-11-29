"use client"

import { ModeToggle } from "@/components/mode-toggle"
import { SearchCommand } from "@/components/search-command"

export function Header() {
    return (
        <header className="border-b">
            <div className="flex h-16 items-center px-4">
                <div className="ml-auto flex items-center space-x-4">
                    <SearchCommand />
                    <ModeToggle />
                </div>
            </div>
        </header>
    )
}
