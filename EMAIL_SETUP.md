# Email Configuration Guide

This guide explains how to configure email functionality for the Support Panel application.

## Gmail SMTP Setup

To configure Gmail SMTP for sending email notifications, follow these steps:

### 1. Enable 2-Factor Authentication
- Go to your Google Account settings
- Enable 2-Factor Authentication if not already enabled

### 2. Generate an App Password
1. Go to Google Account settings
2. Navigate to Security > 2-Step Verification > App passwords
3. Select "Mail" and the device you're using
4. Generate the app password (16 characters with spaces every 4 characters)

### 3. Update Environment Variables
Update your `.env` file in the backend directory with Gmail settings:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your_app_password_here
EMAIL_FROM="Support Panel" <no-reply@supportpanel.com>
```

### 4. Security Considerations
- Never commit your `.env` file to version control
- Keep your app password secure
- Use strong, unique app passwords
- Revoke app passwords when no longer needed

## Alternative Email Providers

If you're not using Gmail, configure your email provider's SMTP settings:

```env
EMAIL_HOST=smtp.your-email-provider.com
EMAIL_PORT=587  # or 465 for SSL
EMAIL_SECURE=true  # true for 465, false for other ports
EMAIL_USER=your-email@provider.com
EMAIL_PASS=your_email_password
EMAIL_FROM="Support Panel" <no-reply@supportpanel.com>
```

## Common Ports
- Port 587: TLS (recommended for most providers)
- Port 465: SSL
- Port 25: Unencrypted (not recommended)

## Testing Email Configuration

When you register a new user in the Support Panel, the system will attempt to send a verification email using the configured SMTP settings.