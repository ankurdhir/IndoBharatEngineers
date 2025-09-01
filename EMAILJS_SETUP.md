# EmailJS Setup Guide for Contact Form

## Step 1: Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Create Email Service
1. Go to **Email Services** in your EmailJS dashboard
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Connect your email account
5. Note down the **Service ID**

## Step 3: Create Email Template
1. Go to **Email Templates** in your EmailJS dashboard
2. Click **Create New Template**
3. Use this template content:

```
Subject: New Contact Form Submission - {{subject}}

From: {{from_name}}
Email: {{from_email}}
Phone: {{phone}}
Service: {{service}}

Message:
{{message}}

---
This message was sent from the Indo Bharat Engineers website contact form.
```

4. Note down the **Template ID**

## Step 4: Get User ID
1. Go to **Account** → **General** in your EmailJS dashboard
2. Copy your **User ID** (Public Key)

## Step 5: Update Website Code
Replace the placeholder values in `/assets/js/script.js`:

```javascript
// Line ~603: Replace these with your actual EmailJS configuration
await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams, 'YOUR_USER_ID');
```

**Replace:**
- `YOUR_SERVICE_ID` with your Service ID from Step 2
- `YOUR_TEMPLATE_ID` with your Template ID from Step 3  
- `YOUR_USER_ID` with your User ID from Step 4

## Step 6: Test the Form
1. Save your changes
2. Open the contact page in your browser
3. Fill out and submit the contact form
4. Check if you receive the email at `support@indobharatengineers.com`

## Example Configuration
```javascript
// Example (replace with your actual values):
await emailjs.send('service_abc123', 'template_xyz789', templateParams, 'user_def456');
```

## Troubleshooting
- **EmailJS not loading**: Check browser console for errors
- **Email not received**: Verify Service ID, Template ID, and User ID
- **CORS errors**: Make sure you're testing on `localhost` or your deployed domain
- **Rate limits**: EmailJS free plan has monthly limits

## Fallback Behavior
If EmailJS fails or isn't configured:
- The form will automatically fall back to opening the user's default email client
- The WhatsApp integration will still work normally
- Users will see appropriate success messages for each method

---
**Note**: Keep your EmailJS credentials secure and don't commit them to public repositories.
