"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Trash2, Mail } from "lucide-react"
import { toast } from "sonner"

interface FeedbackItem {
  id: string
  rating: number
  email: string
  message: string
  timestamp: string
  url: string
  userAgent?: string
  ipAddress?: string
}

export default function FeedbackPage() {
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchFeedback()
  }, [])

  const fetchFeedback = async () => {
    try {
      const response = await fetch("/api/feedback")
      if (!response.ok) throw new Error("Failed to fetch feedback")
      const data = await response.json()
      setFeedbackList(data)
    } catch (error) {
      console.error("Error fetching feedback:", error)
      toast.error("Failed to load feedback")
    } finally {
      setIsLoading(false)
    }
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    if (rating >= 3) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Loading feedback...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Feedback Management</h1>
        <p className="text-muted-foreground mt-2">
          Total feedback received: {feedbackList.length}
        </p>
      </div>

      {feedbackList.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No feedback yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {feedbackList.map((feedback) => (
            <Card key={feedback.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      {feedback.rating > 0 && (
                        <Badge className={getRatingColor(feedback.rating)}>
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          {feedback.rating}/5
                        </Badge>
                      )}
                      <span className="text-sm text-muted-foreground">
                        {formatDate(feedback.timestamp)}
                      </span>
                    </div>
                    {feedback.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a href={`mailto:${feedback.email}`} className="text-blue-600 hover:underline">
                          {feedback.email}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">{feedback.message}</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div>
                    <span className="font-semibold">Page:</span>{" "}
                    <a href={feedback.url} className="text-blue-600 hover:underline truncate">
                      {new URL(feedback.url).pathname}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
