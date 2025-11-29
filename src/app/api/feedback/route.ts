import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import nodemailer from "nodemailer"

interface FeedbackData {
  rating: number
  email: string
  message: string
  timestamp: string
  url: string
}

// Email configuration - update these with your email service details
const getEmailTransporter = () => {
  // Using environment variables for email configuration
  const emailService = process.env.EMAIL_SERVICE
  const emailUser = process.env.EMAIL_USER
  const emailPassword = process.env.EMAIL_PASSWORD
  const emailFrom = process.env.EMAIL_FROM

  if (!emailService || !emailUser || !emailPassword) {
    console.warn("Email configuration not set. Feedback will be saved but not emailed.")
    return null
  }

  return nodemailer.createTransport({
    service: emailService,
    auth: {
      user: emailUser,
      pass: emailPassword,
    },
  })
}

const sendEmailNotification = async (feedback: any, recipientEmail: string) => {
  const transporter = getEmailTransporter()
  if (!transporter) return

  const ratingStars = "⭐".repeat(feedback.rating)
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">New Feedback Received</h2>
      
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <p><strong>Rating:</strong> ${ratingStars} (${feedback.rating}/5)</p>
        <p><strong>From:</strong> ${feedback.email || "Anonymous"}</p>
        <p><strong>Page:</strong> <a href="${feedback.url}">${new URL(feedback.url).pathname}</a></p>
        <p><strong>Date:</strong> ${new Date(feedback.timestamp).toLocaleString()}</p>
      </div>

      <div style="margin: 20px 0;">
        <h3>Message:</h3>
        <p style="white-space: pre-wrap; background-color: #f9f9f9; padding: 15px; border-left: 4px solid #007bff;">
          ${feedback.message}
        </p>
      </div>

      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
      <p style="color: #666; font-size: 12px;">
        This feedback was submitted via DevStack Feedback System
      </p>
    </div>
  `

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: recipientEmail,
      subject: `📝 New Feedback: ${feedback.rating ? `${feedback.rating}/5 Stars` : "New Message"}`,
      html: htmlContent,
      replyTo: feedback.email || undefined,
    })
    console.log(`Email sent successfully to ${recipientEmail}`)
  } catch (error) {
    console.error("Error sending email:", error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: FeedbackData = await request.json()

    // Validate required fields
    if (!body.message || !body.message.trim()) {
      return NextResponse.json(
        { error: "Feedback message is required" },
        { status: 400 }
      )
    }

    // Create feedback data object
    const feedback = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...body,
      userAgent: request.headers.get("user-agent"),
      ipAddress: request.headers.get("x-forwarded-for") || "unknown",
    }

    // Store feedback in a JSON file
    const feedbackDir = path.join(process.cwd(), "public", "feedback")
    if (!fs.existsSync(feedbackDir)) {
      fs.mkdirSync(feedbackDir, { recursive: true })
    }

    const feedbackFile = path.join(feedbackDir, "feedback.json")
    let feedbackList: FeedbackData[] = []

    if (fs.existsSync(feedbackFile)) {
      const data = fs.readFileSync(feedbackFile, "utf-8")
      feedbackList = JSON.parse(data)
    }

    feedbackList.push(feedback)
    fs.writeFileSync(feedbackFile, JSON.stringify(feedbackList, null, 2))

    // Send email notification to admin
    const adminEmail = process.env.ADMIN_EMAIL
    if (adminEmail) {
      await sendEmailNotification(feedback, adminEmail)
    }

    console.log("New feedback received:", feedback)

    return NextResponse.json(
      { message: "Feedback submitted successfully", id: feedback.id },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error processing feedback:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const feedbackFile = path.join(process.cwd(), "public", "feedback", "feedback.json")

    if (!fs.existsSync(feedbackFile)) {
      return NextResponse.json([], { status: 200 })
    }

    const data = fs.readFileSync(feedbackFile, "utf-8")
    const feedbackList = JSON.parse(data)

    return NextResponse.json(feedbackList, { status: 200 })
  } catch (error) {
    console.error("Error retrieving feedback:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
