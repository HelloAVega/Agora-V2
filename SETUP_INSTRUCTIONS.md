# Ágora V2 Project Setup Instructions

## Overview
This document provides instructions for completing the Ágora project setup on Windows.

## Current Status
✅ **Setup scripts are ready to execute**

The following setup files have been created:
- `setup.bat` - Original Windows batch script
- `setup-full.js` - Complete Node.js setup script
- `complete-setup.js` - Enhanced Node.js setup script with full logging

## How to Complete Setup

### Method 1: Using Command Prompt (Recommended)
1. Open Command Prompt
2. Navigate to the project directory:
   ```
   cd C:\Users\teamv\Downloads\Agora-V2
   ```
3. Run one of these commands:
   ```
   node setup-full.js
   ```
   OR
   ```
   node complete-setup.js
   ```

### Method 2: Using Windows Batch File
1. Navigate to `C:\Users\teamv\Downloads\Agora-V2`
2. Double-click `setup.bat`
3. Then run: `node setup-full.js`

### Method 3: Using Node.js Directly
```
C:\Users\teamv\Downloads\Agora-V2> node setup-full.js
```

## What Gets Created

### Directory Structure (19 total directories)

#### Server (8 directories)
```
server/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── services/
└── utils/
```

#### Client (11 directories)
```
client/
├── public/
└── src/
    ├── components/
    ├── hooks/
    ├── pages/
    ├── services/
    ├── stores/
    ├── styles/
    ├── types/
    └── utils/
```

### Files Created (13 configuration + code files)

#### Server Files
- `server/package.json` - Backend dependencies and scripts
- `server/server.js` - Express server with Socket.io
- `server/.env.example` - Environment variables template
- `server/.gitignore` - Git ignore rules

#### Client Files
- `client/package.json` - Frontend dependencies and scripts
- `client/index.html` - HTML entry point
- `client/vite.config.js` - Vite build configuration
- `client/tailwind.config.js` - Tailwind CSS configuration
- `client/postcss.config.js` - PostCSS configuration
- `client/.env.example` - Environment variables template
- `client/src/main.jsx` - React entry point
- `client/src/App.jsx` - Main React component
- `client/src/styles/index.css` - Global styles with Tailwind

### .gitkeep Files
15 `.gitkeep` files are added to preserve empty directories in Git

## Post-Setup Configuration

### 1. Install Dependencies

```bash
# Root dependencies
npm install

# Server dependencies
cd server
npm install

# Client dependencies  
cd ../client
npm install
```

### 2. Create Environment Files

Copy `.env.example` to `.env` in both directories:

**Server (.env)**
```
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/agora
JWT_SECRET=your_jwt_secret_key_here
FRONTEND_URL=http://localhost:3000
OPENAI_API_KEY=your_openai_key_here
```

**Client (.env.local)**
```
VITE_API_URL=http://localhost:3001/api
```

### 3. Start Development

```bash
npm run dev
```

This will start both server (port 3001) and client (port 3000) in development mode.

## Technologies Included

### Backend
- **Express.js** - Web framework
- **Socket.io** - Real-time communication
- **Sequelize** - ORM for database
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment configuration

### Frontend
- **React 18.2** - UI library
- **Vite 5.0** - Build tool
- **Tailwind CSS 3.3** - Styling
- **React Router DOM 6.20** - Client-side routing
- **Zustand 4.4** - State management
- **Axios 1.6** - HTTP client
- **Socket.io-client 4.7** - WebSocket client

## Troubleshooting

### PowerShell Not Available
If you see "PowerShell 6+ is not available":
- Use Command Prompt (cmd.exe) instead
- Run: `node setup-full.js` directly

### Node.js Not Found
- Ensure Node.js is installed: https://nodejs.org/
- Check PATH environment variable includes Node.js directory
- Restart Command Prompt after installing Node.js

### Permission Denied
- Run Command Prompt as Administrator
- Ensure you have write permissions to the directory

## Verification

After running the setup script, verify the structure:

```
Agora-V2/
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── package.json
│   ├── server.js
│   ├── .env.example
│   └── .gitignore
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── stores/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── types/
│   │   ├── styles/
│   │   ├── main.jsx
│   │   └── App.jsx
│   ├── public/
│   ├── package.json
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .env.example
├── setup.bat
├── setup-full.js
├── complete-setup.js
└── README.md
```

## Support

For more information about technologies:
- Express: https://expressjs.com/
- React: https://react.dev/
- Vite: https://vitejs.dev/
- Tailwind CSS: https://tailwindcss.com/
- Socket.io: https://socket.io/
