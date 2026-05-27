#!/usr/bin/env node

/**
 * Ágora Project Full Setup Script
 * Creates complete directory structure and initial files
 */

const fs = require('fs');
const path = require('path');

const baseDir = process.cwd();
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const GREEN = '\x1b[32m';
const BLUE = '\x1b[36m';

console.log(`\n${BOLD}${BLUE}🚀 ÁGORA PROJECT FULL SETUP${RESET}\n`);

// Configuration
const config = {
  directories: {
    server: [
      'server',
      'server/config',
      'server/controllers',
      'server/middleware',
      'server/models',
      'server/routes',
      'server/services',
      'server/utils'
    ],
    client: [
      'client',
      'client/src',
      'client/src/components',
      'client/src/pages',
      'client/src/hooks',
      'client/src/stores',
      'client/src/services',
      'client/src/utils',
      'client/src/types',
      'client/src/styles',
      'client/public'
    ]
  }
};

// Helper function to ensure directory exists
function ensureDir(dirPath) {
  const fullPath = path.join(baseDir, dirPath);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    return true;
  }
  return false;
}

// Helper function to write file
function writeFile(filePath, content) {
  const fullPath = path.join(baseDir, filePath);
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(fullPath, content);
}

// Create directories
console.log(`${BOLD}Creating directories...${RESET}\n`);
[...config.directories.server, ...config.directories.client].forEach(dir => {
  const created = ensureDir(dir);
  const status = created ? `${GREEN}✓${RESET}` : '•';
  console.log(`  ${status} ${dir}`);
});

// Server Files Content
console.log(`\n${BOLD}Creating server files...${RESET}\n`);

const serverPackageJson = {
  "name": "agora-server",
  "version": "1.0.0",
  "description": "Ágora backend API",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "jsonwebtoken": "^9.1.0",
    "bcryptjs": "^2.4.3",
    "socket.io": "^4.7.2",
    "sequelize": "^6.35.0",
    "pg": "^8.11.2"
  }
};

writeFile('server/package.json', JSON.stringify(serverPackageJson, null, 2));
console.log(`  ${GREEN}✓${RESET} server/package.json`);

const serverJs = `require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: process.env.FRONTEND_URL || 'http://localhost:3000' }
});

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// WebSocket connection handler
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(\`✅ Server running on port \${PORT}\`);
});

module.exports = { app, io };`;

writeFile('server/server.js', serverJs);
console.log(`  ${GREEN}✓${RESET} server/server.js`);

const serverEnv = `NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/agora
JWT_SECRET=your_jwt_secret_key_here
FRONTEND_URL=http://localhost:3000
OPENAI_API_KEY=your_openai_key_here`;

writeFile('server/.env.example', serverEnv);
console.log(`  ${GREEN}✓${RESET} server/.env.example`);

const serverGitignore = `node_modules/
.env
.env.local
dist/
*.log
package-lock.json
yarn.lock`;

writeFile('server/.gitignore', serverGitignore);
console.log(`  ${GREEN}✓${RESET} server/.gitignore`);

// Client Files Content
console.log(`\n${BOLD}Creating client files...${RESET}\n`);

const clientPackageJson = {
  "name": "agora-client",
  "version": "1.0.0",
  "description": "Ágora frontend - React app",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "zustand": "^4.4.0",
    "axios": "^1.6.0",
    "socket.io-client": "^4.7.2"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0",
    "tailwindcss": "^3.3.0",
    "postcss": "^8.4.31",
    "autoprefixer": "^10.4.16"
  }
};

writeFile('client/package.json', JSON.stringify(clientPackageJson, null, 2));
console.log(`  ${GREEN}✓${RESET} client/package.json`);

const indexHtml = `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Ágora - Plataforma de apoyo emocional híbrido" />
    <title>Ágora - Apoyo Emocional</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"><\/script>
  </body>
</html>`;

writeFile('client/index.html', indexHtml);
console.log(`  ${GREEN}✓${RESET} client/index.html`);

const viteConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      }
    }
  }
})`;

writeFile('client/vite.config.js', viteConfig);
console.log(`  ${GREEN}✓${RESET} client/vite.config.js`);

const tailwindConfig = `export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`;

writeFile('client/tailwind.config.js', tailwindConfig);
console.log(`  ${GREEN}✓${RESET} client/tailwind.config.js`);

const postcssConfig = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`;

writeFile('client/postcss.config.js', postcssConfig);
console.log(`  ${GREEN}✓${RESET} client/postcss.config.js`);

const clientEnv = `VITE_API_URL=http://localhost:3001/api`;

writeFile('client/.env.example', clientEnv);
console.log(`  ${GREEN}✓${RESET} client/.env.example`);

const mainJsx = `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`;

writeFile('client/src/main.jsx', mainJsx);
console.log(`  ${GREEN}✓${RESET} client/src/main.jsx`);

const appJsx = `import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <header className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-2">
          Ágora
        </h1>
        <p className="text-lg text-indigo-700">
          Apoyo emocional híbrido - IA + Supervisión Profesional
        </p>
      </header>
    </div>
  )
}

export default App`;

writeFile('client/src/App.jsx', appJsx);
console.log(`  ${GREEN}✓${RESET} client/src/App.jsx`);

const indexCss = `@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
}`;

writeFile('client/src/styles/index.css', indexCss);
console.log(`  ${GREEN}✓${RESET} client/src/styles/index.css`);

// Create .gitkeep files for empty directories
console.log(`\n${BOLD}Creating .gitkeep files...${RESET}\n`);

const emptyDirs = [
  'server/config',
  'server/controllers',
  'server/middleware',
  'server/models',
  'server/routes',
  'server/services',
  'server/utils',
  'client/src/components',
  'client/src/pages',
  'client/src/hooks',
  'client/src/stores',
  'client/src/services',
  'client/src/utils',
  'client/src/types',
  'client/public'
];

emptyDirs.forEach(dir => {
  writeFile(`${dir}/.gitkeep`, '');
});

console.log(`  ${GREEN}✓${RESET} Added ${emptyDirs.length} .gitkeep files\n`);

// Summary
console.log(`${'='.repeat(60)}`);
console.log(`${BOLD}${GREEN}✅ ÁGORA PROJECT STRUCTURE CREATED SUCCESSFULLY!${RESET}`);
console.log(`${'='.repeat(60)}\n`);

console.log(`${BOLD}📂 Directory Structure:${RESET}\n`);
console.log(`${BOLD}Server (8 directories):${RESET}`);
config.directories.server.forEach(d => console.log(`  • ${d}`));

console.log(`\n${BOLD}Client (11 directories):${RESET}`);
config.directories.client.forEach(d => console.log(`  • ${d}`));

console.log(`\n${BOLD}📄 Configuration Files Created:${RESET}`);
console.log(`  Server: 4 files (package.json, server.js, .env.example, .gitignore)`);
console.log(`  Client: 9 files (package.json, index.html, vite/tailwind/postcss configs, .env.example, React files)`);

console.log(`\n${BOLD}🎯 Next Steps:${RESET}\n`);
console.log(`  1. Install root dependencies:`);
console.log(`     npm install\n`);
console.log(`  2. Install server dependencies:`);
console.log(`     cd server && npm install\n`);
console.log(`  3. Install client dependencies:`);
console.log(`     cd ../client && npm install\n`);
console.log(`  4. Create .env files from .env.example\n`);
console.log(`  5. Start development:`);
console.log(`     npm run dev\n`);

console.log(`${BOLD}${GREEN}🎉 Setup complete!${RESET}\n`);
