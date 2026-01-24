# Card Compass Frontend

A Next.js application for smart credit card recommendations based on location and rewards.

## Features

- **Google Authentication**: Sign in with Google using Firebase Auth
- **Plaid Integration**: Connect bank accounts to load credit cards
- **Location Tracking**: Real-time location tracking for contextual recommendations
- **AI-Powered Recommendations**: Get suggestions on which credit card to use based on your location
- **Card Management**: View all your Capital One credit cards with rewards information

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env.local`:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

# Optional: For reverse geocoding (address lookup)
NEXT_PUBLIC_OPENCAGE_API_KEY=your_opencage_api_key

# Backend API URLs (if different from defaults)
BACKEND_URL=http://localhost:8000
PLAID_BACKEND_URL=http://localhost:8000
```

3. Run the development server:
```bash
npm run dev
```

## Architecture

### Components

- **Dashboard**: Main application view with all features
- **PlaidLink**: Component for connecting bank accounts via Plaid
- **CreditCardList**: Displays user's credit cards
- **LocationTracker**: Tracks user location and updates context
- **CardRecommendation**: Shows AI-powered card recommendations

### API Routes

- `/api/plaid/link`: Creates Plaid Link token
- `/api/plaid/exchange`: Exchanges Plaid public token for access token
- `/api/cards`: Fetches user's credit cards
- `/api/recommendation`: Gets card recommendation based on location

## Backend Integration

The frontend expects a backend API running on `http://localhost:8000` (or configured via environment variables) with the following endpoints:

- `POST /api/plaid/create-link-token`: Creates a Plaid Link token
- `POST /api/plaid/exchange-token`: Exchanges public token for access token
- `GET /api/cards`: Returns user's credit cards
- `POST /api/recommendation`: Returns card recommendation based on location

Currently, the API routes return mock data for development. Update them to connect to your actual backend.

## Notes

- The app is currently configured for Capital One credit cards only
- Location tracking requires browser geolocation permissions
- Plaid sandbox environment is used for testing with 6 prepopulated Capital One cards
