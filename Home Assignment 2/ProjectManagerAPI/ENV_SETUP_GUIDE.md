# Environment Configuration Guide

## Setup Instructions

### 1. Gmail App Password Setup

To send password reset emails, you need to create a Gmail App Password:

1. **Enable 2-Step Verification** (if not already enabled):
   - Go to: https://myaccount.google.com/security
   - Click on "2-Step Verification"
   - Follow the prompts to enable it

2. **Create App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" as the app
   - Select "Other (Custom name)" for device
   - Type "PathLock" or any name
   - Click "Generate"
   - **Copy the 16-character password** (looks like: `abcd efgh ijkl mnop`)

### 2. Configure the .env File

1. Open the `.env` file in the `ProjectManagerAPI` folder
2. Replace the `EMAIL_PASSWORD` value with your Gmail App Password:

```env
EMAIL_PASSWORD=abcdabcdabcdabcd
```

**Important**: Remove all spaces from the app password! If Gmail gives you `abcd efgh ijkl mnop`, enter it as `abcdabcdabcdabcd`

### 3. Verify Configuration

The `.env` file should look like this:

```env
# JWT Configuration
JWT_KEY=YourSuperSecretKeyForJWTTokenGenerationMinimum32Characters!
JWT_ISSUER=ProjectManagerAPI
JWT_AUDIENCE=ProjectManagerClient

# Email Configuration (Gmail)
EMAIL_SMTP_SERVER=smtp.gmail.com
EMAIL_SMTP_PORT=587
EMAIL_SENDER_EMAIL=vishwaskisaniya@gmail.com
EMAIL_SENDER_NAME=PathLock
EMAIL_PASSWORD=your-actual-16-char-password-here

# Database
DATABASE_CONNECTION_STRING=Data Source=projectmanager.db
```

### 4. Start the Backend Server

```bash
cd ProjectManagerAPI
dotnet run
```

You should see:
```
✅ .env file loaded successfully
```

### 5. Test Forgot Password

1. Go to your frontend: http://localhost:5173/forgot-password
2. Enter an email address (must be a registered user)
3. Click "Send reset link"
4. Check your email inbox (and spam folder)

### Troubleshooting

#### Email Not Received?

1. **Check backend console logs**:
   - ✅ Success: `Password reset email sent successfully to user@example.com`
   - ❌ Error: Will show the specific error message

2. **Common Issues**:
   - **"Email password not configured"**: Add your app password to `.env`
   - **"Invalid credentials"**: App password is wrong, regenerate it
   - **"Authentication failed"**: 2-Step Verification not enabled
   - **Email in spam**: Check your spam/junk folder

3. **Verify Settings**:
   ```bash
   # Check if .env is being loaded
   # You should see: "✅ .env file loaded successfully" in console
   ```

#### Still Not Working?

The backend will log detailed error messages. Common errors:

- `SMTP authentication failed` → Wrong app password
- `Unable to connect to SMTP server` → Port 587 might be blocked by firewall
- `Mailbox unavailable` → Sender email incorrect

### Security Notes

⚠️ **NEVER commit the `.env` file to git!**

- The `.env` file is already in `.gitignore`
- The `.env.example` file is the template (safe to commit)
- Keep your app password secret

### How It Works

1. When backend starts, it reads the `.env` file
2. Environment variables override `appsettings.json` values
3. If `.env` doesn't exist, it falls back to `appsettings.json`
4. Email service uses these settings to connect to Gmail SMTP

### Need Help?

If emails still aren't sending:
1. Check console logs for specific error messages
2. Verify 2-Step Verification is enabled on Gmail
3. Make sure the app password has no spaces
4. Try regenerating the app password
5. Check if port 587 is blocked by your firewall/network
