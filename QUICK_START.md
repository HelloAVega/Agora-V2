# ÁGORA V2 - QUICK START COMMAND REFERENCE

## ⚡ TL;DR - Execute Setup Right Now

Open **Command Prompt** (NOT PowerShell) and paste this:

```cmd
cd C:\Users\teamv\Downloads\Agora-V2 && node setup-full.js
```

That's it! The setup script will create all 19 directories and 13+ configuration files.

---

## 🎯 Available Setup Commands

### Option 1: Full Setup (Recommended)
```cmd
cd C:\Users\teamv\Downloads\Agora-V2
node setup-full.js
```
**Output:** Complete directory structure + all configuration files

### Option 2: Enhanced Setup with Detailed Logging
```cmd
cd C:\Users\teamv\Downloads\Agora-V2
node complete-setup.js
```
**Output:** Same as Option 1 + detailed progress logging

### Option 3: Windows Batch Execution
```cmd
cd C:\Users\teamv\Downloads\Agora-V2
setup.bat
```
**Output:** Creates directories, then run `node setup-full.js`

### Option 4: Using PowerShell (if available)
```powershell
cd C:\Users\teamv\Downloads\Agora-V2
node setup-full.js
```

---

## ✅ What Gets Created

Running any setup command creates:

### 19 Directories
```
8 Server directories:
  server/
  server/config/
  server/controllers/
  server/middleware/
  server/models/
  server/routes/
  server/services/
  server/utils/

11 Client directories:
  client/
  client/src/
  client/src/components/
  client/src/pages/
  client/src/hooks/
  client/src/stores/
  client/src/services/
  client/src/utils/
  client/src/types/
  client/src/styles/
  client/public/
```

### 13+ Files
```
Server (4 files):
  ✓ server/package.json
  ✓ server/server.js
  ✓ server/.env.example
  ✓ server/.gitignore

Client (9 files):
  ✓ client/package.json
  ✓ client/index.html
  ✓ client/vite.config.js
  ✓ client/tailwind.config.js
  ✓ client/postcss.config.js
  ✓ client/.env.example
  ✓ client/src/main.jsx
  ✓ client/src/App.jsx
  ✓ client/src/styles/index.css

Plus 15 × .gitkeep files
```

---

## 🚀 After Setup: Install Dependencies

### Step 1: Root Dependencies
```cmd
cd C:\Users\teamv\Downloads\Agora-V2
npm install
```

### Step 2: Server Dependencies
```cmd
cd server
npm install
cd ..
```

### Step 3: Client Dependencies
```cmd
cd client
npm install
cd ..
```

---

## 🔧 Configuration

### Server .env (required)
Create `server/.env`:
```
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/agora
JWT_SECRET=your_secret_key_minimum_32_characters
FRONTEND_URL=http://localhost:3000
OPENAI_API_KEY=your_api_key_here
```

### Client .env (required)
Create `client/.env.local`:
```
VITE_API_URL=http://localhost:3001/api
```

---

## ▶️ Start Development

### All-in-One (from root)
```cmd
npm run dev
```

This starts:
- ✅ Backend Server: http://localhost:3001
- ✅ Frontend Client: http://localhost:3000
- ✅ API Proxy: Configured from 3000 → 3001

### Separate Terminal Windows

**Terminal 1 - Backend:**
```cmd
cd server
npm run dev
```
Runs on http://localhost:3001

**Terminal 2 - Frontend:**
```cmd
cd client
npm run dev
```
Runs on http://localhost:3000

---

## 🔗 Access Points

| Component | URL | Purpose |
|-----------|-----|---------|
| Frontend | http://localhost:3000 | React app |
| Backend API | http://localhost:3001 | Express server |
| Health Check | http://localhost:3001/api/health | API status |
| API Proxy | http://localhost:3000/api/* | Frontend → Backend |

---

## 🛠️ Troubleshooting

### Problem: "Command not found: node"
```
Solution: Install Node.js from https://nodejs.org/
Then restart Command Prompt and verify: node -v
```

### Problem: "Port 3001 already in use"
```
Solution: Change PORT in server/.env to 3002
Also update VITE_API_URL in client/.env.local
```

### Problem: "npm command not found"
```
Solution: Reinstall Node.js (npm is included)
Or verify npm: npm -v
```

### Problem: "setup script fails"
```
Solution: 
1. Run Command Prompt as Administrator
2. Ensure C:\Users\teamv\Downloads\Agora-V2 is writable
3. Try: node complete-setup.js (for detailed error output)
```

---

## 📋 Checklist

After running setup, verify:

- [ ] `server/` directory exists with 8 subdirectories
- [ ] `client/` directory exists with 11 subdirectories
- [ ] `server/package.json` exists with express, socket.io, sequelize
- [ ] `client/package.json` exists with react, vite, tailwindcss
- [ ] `server/server.js` has Express setup
- [ ] `client/index.html` contains root div
- [ ] `client/src/main.jsx` imports React and App
- [ ] All `.env.example` files exist
- [ ] `.gitkeep` files in empty directories

---

## 📚 Tech Stack

### Backend
- Express.js 4.18
- Socket.io 4.7
- PostgreSQL + Sequelize
- JWT Authentication
- bcryptjs Password Hashing

### Frontend
- React 18.2
- Vite 5.0
- Tailwind CSS 3.3
- React Router 6.20
- Zustand State Management
- Axios HTTP Client
- Socket.io-client

---

## 🎯 Next Steps

1. **NOW:** Run `node setup-full.js`
2. **Then:** Run `npm install` (3 times: root, server, client)
3. **Next:** Create `.env` files
4. **Start:** Run `npm run dev`
5. **Open:** http://localhost:3000

---

## 📞 Quick Links

- **Node.js:** https://nodejs.org/
- **React:** https://react.dev/
- **Express:** https://expressjs.com/
- **Vite:** https://vitejs.dev/
- **Tailwind:** https://tailwindcss.com/
- **Socket.io:** https://socket.io/

---

**🎉 Ready to build Ágora?**

Run this command NOW:
```cmd
cd C:\Users\teamv\Downloads\Agora-V2 && node setup-full.js
```
