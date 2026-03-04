# Card Compass

Card Compass is an AI-powered, location-aware web application that recommends the best credit card from your wallet to maximize rewards based on your current physical location.

Never miss out on potential cashback or points again. Whether you are at a restaurant, gas station, or grocery store, Card Compass tracks your location, identifies the type of business you're visiting, and instantly suggests the optimal credit card to use.

## 🚀 Features

- **Real-Time Location Tracking**: Automatically detects your current location and determines when you are stationary at a business.
- **AI-Powered Recommendations**: Uses an intelligent multi-agent system to categorize your current location and calculate the best card for maximum rewards.
- **Bank Account Integration**: Securely connects to your bank via **Plaid** to fetch your actual credit cards and their reward structures.
- **Modern Dashboard**: A clean, responsive UI built with Tailwind CSS displaying your connected cards, current location, and AI recommendation.

## 🏗️ Architecture & Tech Stack

The project is divided into a robust frontend and an intelligent multi-agent backend.

### **Frontend** (`/frontend`)
- **Framework**: Next.js 16 (App Router), React 19
- **Styling**: Tailwind CSS
- **Bank Integration**: React Plaid Link
- **Icons**: Lucide React
- **Location Tracking**: Browser Geolocation API mapped through WebSockets

### **Backend & AI Orchestrator** (`/PlaidWorld` & `/backend/agents`)
- **Framework**: FastAPI (Python)
- **API integrations**: Plaid API (for financial data exchange)
- **Real-time Communication**: WebSockets for live GPS pinging
- **AI Multi-Agent System**:
  - `OrchestratorAgent`: The "Brain". Monitors movement and dwells. Triggers the recommendation flow when the user is stationary.
  - `LocatorAgent`: The "Eyes". Analyzes GPS coordinates, identifies the business location, and determines its spending category.
  - `CardPickerAgent`: The "Decision Maker". Cross-references the business category with the user's Plaid-linked cards to select the highest-yielding reward card.

## 🛠️ Setup & Installation

### 1. Prerequisites
- **Node.js**: v18+ 
- **Python**: v3.10+
- **Plaid Sandbox Account**: Obtain your client ID and secret

### 2. Frontend Setup
Navigate to the `frontend` directory and install dependencies:
```bash
cd frontend
npm install
```

Create a `.env.local` file in the `/frontend` directory:
```env
# Backend URLs
BACKEND_URL=http://localhost:8000
PLAID_BACKEND_URL=http://localhost:8000
```
Run the development server:
```bash
npm run dev
```

### 3. Backend Setup
Create your Python virtual environment and install the required dependencies:

**For Windows (Command Prompt):**
```cmd
python -m venv .venv
call .venv\Scripts\activate
pip install -r requirement.txt
```

**For Windows (PowerShell):**
```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirement.txt
```

**For macOS/Linux:**
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirement.txt
```

Set up your `.env` variables at the project root for Plaid:
```env
PLAID_CLIENT_ID=your_plaid_client_id
PLAID_SECRET=your_plaid_secret
PLAID_ENV=sandbox
```

Start the backend server:

**For Windows (Command Prompt):**
```cmd
run_backend.bat
```

**For Windows (PowerShell):**
```powershell
.\run_backend.bat
```
*(Alternatively, run `python PlaidWorld/api/server.py` after activating the virtual environment).*

## 💡 How It Works

1. **Sign In & Link**: Users sign in and link their credit cards via the integrated Plaid Link sandbox.
2. **Move**: The frontend continuously tracks GPS data and streams it to the backend via WebSockets.
3. **Dwell & Process**: Once the `OrchestratorAgent` detects the user has stopped moving for a set timeframe (e.g. stopped at a coffee shop), it triggers the AI processing sequence.
4. **Locate & Pick**: The `LocatorAgent` identifies the coffee shop and its "Dining/Cafe" category. The `CardPickerAgent` then selects the best card (e.g. Capital One Savor) for that category.
5. **Recommend**: The backend pushes the recommendation directly to the Next.js dashboard, showing the user exactly which card to swipe.