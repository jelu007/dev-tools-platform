"use client"

import { useState } from "react"
import { ModeToggle } from "@/components/mode-toggle"
import { SearchCommand } from "@/components/search-command"
import { FeedbackModal } from "@/components/feedback-modal"
import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"

export function Header() {
    const [feedbackOpen, setFeedbackOpen] = useState(false)

    return (
        <>
            <header className="border-b">
                <div className="flex h-16 items-center px-4">
                    <div className="ml-auto flex items-center space-x-4">
                        <SearchCommand />
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setFeedbackOpen(true)}
                            title="Send feedback"
                        >
                            <MessageSquare className="h-5 w-5" />
                        </Button>
                        <ModeToggle />
                    </div>
                </div>
            </header>
            <FeedbackModal open={feedbackOpen} onOpenChange={setFeedbackOpen} />
        </>
    )
}
