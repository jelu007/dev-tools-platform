# Feedback System Setup Guide

## Overview
The feedback system allows users to submit feedback with ratings and messages. Admin users receive email notifications for each submission.

## Configuration

### 1. Environment Variables
Create a `.env.local` file in the project root with the following variables:

```bash
# Email Configuration
EMAIL_SERVICE=gmail                    # Email service provider
EMAIL_USER=your-email@gmail.com       # Your email address
EMAIL_PASSWORD=your-app-password      # App-specific password
EMAIL_FROM=noreply@devstack.com       # Sender email
ADMIN_EMAIL=your-admin@email.com      # Where to send notifications
```

### 2. Gmail Setup (Recommended)
If using Gmail, follow these steps:

1. Enable 2-Factor Authentication on your Google Account
2. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Select "Mail" and "Windows Computer" (or your device)
4. Copy the generated 16-character password
5. Use this password as `EMAIL_PASSWORD` in `.env.local`

### 3. Other Email Providers
Nodemailer supports many providers. Update the `EMAIL_SERVICE` variable:
- Gmail: `gmail`
- Outlook: `outlook` or `office365`
- Yahoo: `yahoo`
- SendGrid: Configure custom SMTP
- And many more...

## Features

### User-Facing Features
- **Feedback Modal**: Click the message icon in the header to open the feedback form
- **Star Rating**: Users can rate their experience (1-5 stars)
- **Optional Email**: Users can provide their email for follow-up
- **Message Field**: Text area for detailed feedback

### Admin Features
- **Feedback Dashboard**: View all feedback at `/admin/feedback`
- **Email Notifications**: Get notified instantly when feedback is submitted
- **Feedback Storage**: All feedback is stored in `public/feedback/feedback.json`

## API Endpoints

### POST `/api/feedback`
Submit new feedback.

**Request Body:**
```json
{
  "rating": 5,
  "email": "user@example.com",
  "message": "Great tool!",
  "timestamp": "2024-11-29T20:00:00Z",
  "url": "http://localhost:3000/tools/dev/json"
}
```

**Response:**
```json
{
  "message": "Feedback submitted successfully",
  "id": "feedback-id-123"
}
```

### GET `/api/feedback`
Retrieve all submitted feedback (requires authentication for production).

## File Structure

```
src/
├── components/
│   └── feedback-modal.tsx          # Feedback form modal
├── app/
│   ├── api/
│   │   └── feedback/
│   │       └── route.ts             # Feedback API endpoints
│   └── admin/
│       └── feedback/
│           └── page.tsx             # Feedback dashboard
└── ...

public/
└── feedback/
    └── feedback.json                # Stored feedback data
```

## Troubleshooting

### Email Not Sending
1. Check that all environment variables are correctly set
2. Verify your email credentials
3. Check server logs for error messages
4. For Gmail, ensure App Passwords are enabled (not regular password)
5. Check that your email provider allows third-party app access

### Feedback Not Being Saved
1. Ensure `public/feedback/` directory exists and is writable
2. Check file permissions
3. Verify the API endpoint is accessible

## Future Enhancements
- [ ] Database integration (MongoDB, PostgreSQL, etc.)
- [ ] Authentication for feedback dashboard
- [ ] Email templates customization
- [ ] Feedback filtering and search
- [ ] Export feedback to CSV
- [ ] Automated responses to user feedback
- [ ] Feedback analytics and charts
