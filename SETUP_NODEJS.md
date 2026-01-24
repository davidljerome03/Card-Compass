# Installing Node.js and npm

Node.js is not currently installed on your system. You need to install it to run the frontend application.

## Quick Installation Steps

### Option 1: Download from Official Website (Recommended)

1. **Go to the Node.js website**: https://nodejs.org/
2. **Download the LTS version** (Long Term Support) - this is the stable version recommended for most users
3. **Run the installer** (.msi file for Windows)
4. **Follow the installation wizard** - make sure to check "Add to PATH" option (usually checked by default)
5. **Restart your terminal/PowerShell** after installation

### Option 2: Using Chocolatey (if you have it installed)

```powershell
choco install nodejs-lts
```

### Option 3: Using Winget (Windows Package Manager)

```powershell
winget install OpenJS.NodeJS.LTS
```

## Verify Installation

After installing, open a **new** PowerShell or Command Prompt window and run:

```powershell
node --version
npm --version
```

You should see version numbers for both commands.

## After Installation

Once Node.js is installed, navigate to the frontend directory and run:

```powershell
cd frontend
npm install
```

This will install all the required dependencies for the frontend application.

## Troubleshooting

If after installation you still get "npm is not recognized":
1. **Restart your terminal/PowerShell** - PATH changes require a new terminal session
2. **Check if Node.js is in PATH**: 
   - Open System Properties → Environment Variables
   - Check if `C:\Program Files\nodejs\` is in your PATH
3. **Manually add to PATH** if needed:
   - Add `C:\Program Files\nodejs\` to your System PATH variable

## Recommended Version

For this project, any Node.js version 18.x or higher will work. The LTS version (currently 20.x or 22.x) is recommended.
