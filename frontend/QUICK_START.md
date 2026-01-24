# Quick Start Guide

Follow these steps to run the Card Compass frontend application:

## Step 1: Open PowerShell as Administrator

1. Press `Windows Key + X`
2. Select "Windows PowerShell (Admin)" or "Terminal (Admin)"
3. Click "Yes" when prompted by User Account Control

## Step 2: Navigate to the Frontend Directory

```powershell
cd g:\Card-Compass\frontend
```

## Step 3: Install Dependencies

Run this command to install all required packages:

```powershell
npm install --legacy-peer-deps
```

**Note:** The `--legacy-peer-deps` flag is needed to handle React version compatibility with `react-plaid-link`.

If you get permission errors, make sure you're running PowerShell as Administrator.

## Step 4: Set Up Environment Variables (Optional for Testing)

Create a `.env.local` file in the `frontend` directory with your Firebase credentials:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

**Note:** The app will work with mock data even without Firebase credentials, but Google Sign-In won't work.

## Step 5: Start the Development Server

```powershell
npm run dev
```

The application will start and you'll see output like:
```
  ▲ Next.js 16.1.4
  - Local:        http://localhost:3000
```

## Step 6: Open in Browser

Open your web browser and navigate to:
```
http://localhost:3000
```

## Troubleshooting

### If npm install fails with permission errors:
- Make sure PowerShell is running as Administrator
- Try: `npm install --legacy-peer-deps --force`

### If npm install fails with network errors:
- Check your internet connection
- Try: `npm config set offline false`
- Then run: `npm install --legacy-peer-deps`

### If the dev server won't start:
- Make sure port 3000 is not in use
- Check that all dependencies installed successfully
- Look for error messages in the terminal

## Next Steps

Once the app is running:
1. You'll see the login page with the Card Compass logo
2. Click "Sign in with Google" (requires Firebase setup)
3. Or the app will show mock data for testing

## Stopping the Server

Press `Ctrl + C` in the PowerShell window to stop the development server.
