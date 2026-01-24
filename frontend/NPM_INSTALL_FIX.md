# Fixing npm Install Issues

You're experiencing network/proxy issues with npm. Here are several solutions to try:

## Solution 1: Run PowerShell as Administrator

1. **Close your current PowerShell window**
2. **Right-click on PowerShell** and select "Run as Administrator"
3. Navigate to the frontend directory:
   ```powershell
   cd g:\Card-Compass\frontend
   ```
4. Run:
   ```powershell
   npm install
   ```

## Solution 2: Clear npm Configuration

In a **new PowerShell window** (restart to get fresh environment), run:

```powershell
npm config delete proxy
npm config delete https-proxy
npm config delete http-proxy
npm config set offline false
npm config set registry https://registry.npmjs.org/
cd g:\Card-Compass\frontend
npm install
```

## Solution 3: Check Windows Proxy Settings

1. Open **Settings** → **Network & Internet** → **Proxy**
2. Check if "Use a proxy server" is enabled
3. If it is, either:
   - Disable it temporarily, OR
   - Configure npm to use it properly:
     ```powershell
     npm config set proxy http://your-proxy:port
     npm config set https-proxy http://your-proxy:port
     ```

## Solution 4: Use a Different Package Manager (Yarn)

If npm continues to have issues, try using Yarn instead:

1. Install Yarn:
   ```powershell
   npm install -g yarn
   ```
   (If npm doesn't work, download Yarn from https://yarnpkg.com/getting-started/install)

2. Then install dependencies:
   ```powershell
   cd g:\Card-Compass\frontend
   yarn install
   ```

## Solution 5: Manual Package Installation

If all else fails, you can try installing packages one by one:

```powershell
cd g:\Card-Compass\frontend
npm install firebase@^12.8.0
npm install next@16.1.4
npm install react@19.2.3
npm install react-dom@19.2.3
npm install react-plaid-link@^3.5.0
npm install --save-dev @tailwindcss/postcss@^4
npm install --save-dev @types/node@^20
npm install --save-dev @types/react@^19
npm install --save-dev @types/react-dom@^19
npm install --save-dev eslint@^9
npm install --save-dev eslint-config-next@16.1.4
npm install --save-dev tailwindcss@^4
npm install --save-dev typescript@^5
```

## Solution 6: Check Antivirus/Firewall

Sometimes antivirus or firewall software can interfere with npm. Try:
- Temporarily disabling your antivirus
- Adding npm/node to firewall exceptions
- Running PowerShell as Administrator

## Most Likely Fix

The most common solution is **Solution 1** - running PowerShell as Administrator. This often resolves permission and network issues.

After successfully installing, you can run the development server with:
```powershell
npm run dev
```
