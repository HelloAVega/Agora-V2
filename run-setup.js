#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get current directory
const baseDir = process.cwd();

console.log('\n🚀 Starting Ágora Project Setup\n');
console.log(`Working directory: ${baseDir}\n`);

// Create directories function
function ensureDirectoryExists(filePath) {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
}

// Define all directories to create
const directories = [
  'server',
  'server/config',
  'server/controllers',
  'server/middleware',
  'server/models',
  'server/routes',
  'server/services',
  'server/utils',
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
];

console.log('📁 Creating directories...\n');

directories.forEach(dir => {
  const fullPath = path.join(baseDir, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`  ✓ Created: ${dir}`);
  } else {
    console.log(`  • Already exists: ${dir}`);
  }
});

// Define server files
const serverFiles = {
  'server/package.json': JSON.stringify({
    name: "agora-server",
    version: "1.0.0",
    description: "Ágora backend API",
    main: "server.js",
    scripts: {
      start: "node server.js",
      dev: "nodemon server.js"
    },
    dependencies: {
      express: "^4.18.2",
      cors: "^2.8.5",
      dotenv: "^16.3.1",
      jsonwebtoken: "^9.1.0",
      bcryptjs: "^2.4.3",
      "socket.io": "^4.7.2",
      sequelize: "^6.35.0",
      pg: "^8.11.2"
    }
  }, null, 2),

  'server/server.js': `require('dotenv').config();
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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// WebSocket connection
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

module.exports = { app, io };`,

  'server/.env.example': `NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/agora
JWT_SECRET=your_jwt_secret_key_here
FRONTEND_URL=http://localhost:3000
OPENAI_API_KEY=your_openai_key_here`,

  'server/.gitignore': `node_modules/
.env
.env.local
dist/
*.log`
};

// Define client files
const clientFiles = {
  'client/package.json': JSON.stringify({
    name: "agora-client",
    version: "1.0.0",
    description: "Ágora frontend - React app",
    type: "module",
    scripts: {
      dev: "vite",
      build: "vite build",
      preview: "vite preview"
    },
    dependencies: {
      react: "^18.2.0",
      "react-dom": "^18.2.0",
      "react-router-dom": "^6.20.0",
      zustand: "^4.4.0",
      axios: "^1.6.0",
      "socket.io-client": "^4.7.2"
    },
    devDependencies: {
      "@vitejs/plugin-react": "^4.2.0",
      vite: "^5.0.0",
      tailwindcss: "^3.3.0",
      postcss: "^8.4.31",
      autoprefixer: "^10.4.16"
    }
  }, null, 2),

  'client/index.html': `<!doctype html>
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
</html>`,

  'client/vite.config.js': `import { defineConfig } from 'vite'
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
})`,

  'client/tailwind.config.js': `export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`,

  'client/postcss.config.js': `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`,

  'client/.env.example': `VITE_API_URL=http://localhost:3001/api`,

  'client/src/main.jsx': `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`,

  'client/src/App.jsx': `import { useState } from 'react'
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

export default App`,

  'client/src/styles/index.css': `@tailwind base;
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
}`
};

console.log('\n📝 Creating server files...\n');

Object.entries(serverFiles).forEach(([filePath, content]) => {
  const fullPath = path.join(baseDir, filePath);
  ensureDirectoryExists(fullPath);
  fs.writeFileSync(fullPath, content);
  console.log(`  ✓ Created: ${filePath}`);
});

console.log('\n📝 Creating client files...\n');

Object.entries(clientFiles).forEach(([filePath, content]) => {
  const fullPath = path.join(baseDir, filePath);
  ensureDirectoryExists(fullPath);
  fs.writeFileSync(fullPath, content);
  console.log(`  ✓ Created: ${filePath}`);
});

// Create .gitkeep files for empty directories
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

console.log('\n✨ Creating .gitkeep files...\n');

emptyDirs.forEach(dir => {
  const gitkeepPath = path.join(baseDir, dir, '.gitkeep');
  fs.writeFileSync(gitkeepPath, '');
  console.log(`  ✓ ${dir}/.gitkeep`);
});

console.log('\n' + '='.repeat(60));
console.log('✅ ÁGORA PROJECT STRUCTURE CREATED SUCCESSFULLY!');
console.log('='.repeat(60) + '\n');

console.log('📂 Created Directories:\n');
console.log('  Server:');
directories.filter(d => d.startsWith('server')).forEach(d => {
  console.log(`    • ${d}`);
});

console.log('\n  Client:');
directories.filter(d => d.startsWith('client')).forEach(d => {
  console.log(`    • ${d}`);
});

console.log('\n📄 Created Files:\n');
console.log('  Server Files:');
Object.keys(serverFiles).forEach(f => {
  console.log(`    • ${f}`);
});

console.log('\n  Client Files:');
Object.keys(clientFiles).forEach(f => {
  console.log(`    • ${f}`);
});

console.log('\n📋 Next Steps:\n');
console.log('  1. Install root dependencies:        npm install');
console.log('  2. Install server dependencies:      cd server && npm install');
console.log('  3. Install client dependencies:      cd ../client && npm install');
console.log('  4. Create .env files from .env.example');
console.log('  5. Start development:                npm run dev\n');

console.log('🎉 Setup complete!\n');
