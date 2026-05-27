#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Ensure directory exists
function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Component templates
const components = {
  // Client components
  'client/src/components/Layout.jsx': `export function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-indigo-600">Ágora</h1>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto p-4">
        {children}
      </main>
    </div>
  );
}`,

  'client/src/components/ChatBox.jsx': `import { useState } from 'react';

export function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { text: input, sender: 'user' }]);
    setInput('');
  };

  return (
    <div className="border rounded-lg h-96 flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={\`flex \${msg.sender === 'user' ? 'justify-end' : 'justify-start'}\`}>
            <div className={\`p-3 rounded-lg max-w-xs \${msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}\`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t p-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Escribe tu mensaje..."
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          onClick={handleSend}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}`,

  'client/src/components/Button.jsx': `export function Button({ children, variant = 'primary', ...props }) {
  const baseStyle = 'px-4 py-2 rounded font-medium transition-colors';
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  return (
    <button className={\`\${baseStyle} \${variants[variant]}\`} {...props}>
      {children}
    </button>
  );
}`,

  // Pages
  'client/src/pages/Home.jsx': `import { Layout } from '../components/Layout';
import { ChatBox } from '../components/ChatBox';
import { Button } from '../components/Button';

export function Home() {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-lg">
          <h1 className="text-4xl font-bold mb-2">¡Bienvenido a Ágora!</h1>
          <p className="text-lg opacity-90">Tu espacio seguro de escucha y apoyo emocional</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold text-lg mb-2">🤖 IA Empática</h3>
            <p className="text-gray-600">Conversaciones personalizadas disponibles 24/7</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold text-lg mb-2">🔒 Privacidad</h3>
            <p className="text-gray-600">Tus conversaciones están cifradas y seguras</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold text-lg mb-2">👨‍⚕️ Profesionales</h3>
            <p className="text-gray-600">Supervisión de psicólogos expertos</p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Comienza una conversación</h2>
          <ChatBox />
        </div>

        <div className="flex gap-4">
          <Button>Iniciar Sesión</Button>
          <Button variant="secondary">Registrarse</Button>
        </div>
      </div>
    </Layout>
  );
}`,

  'client/src/pages/NotFound.jsx': `import { Layout } from '../components/Layout';

export function NotFound() {
  return (
    <Layout>
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <p className="text-gray-600">Página no encontrada</p>
      </div>
    </Layout>
  );
}`,

  // Hooks
  'client/src/hooks/useApi.js': `import { useState, useEffect } from 'react';

export function useApi(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error('API Error');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}`,

  // Stores
  'client/src/stores/authStore.js': `import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));`,

  'client/src/stores/chatStore.js': `import { create } from 'zustand';

export const useChatStore = create((set) => ({
  messages: [],
  loading: false,

  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  clearMessages: () => set({ messages: [] }),

  setLoading: (loading) => set({ loading }),
}));`,

  // Services
  'client/src/services/api.js': `const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const api = {
  async get(endpoint) {
    const response = await fetch(\`\${API_URL}\${endpoint}\`);
    return response.json();
  },

  async post(endpoint, data) {
    const response = await fetch(\`\${API_URL}\${endpoint}\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async health() {
    return this.get('/health');
  },
};`,

  // Types
  'client/src/types/index.ts': `export interface User {
  id: string;
  email: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export interface Session {
  id: string;
  userId: string;
  messages: Message[];
  startedAt: Date;
  endedAt?: Date;
}`,

  // Styles
  'client/src/styles/App.css': `/* App styles */
:root {
  --primary: #667eea;
  --secondary: #764ba2;
  --success: #48bb78;
  --warning: #ed8936;
  --danger: #f56565;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  background-color: #f9fafb;
  color: #1f2937;
}

a {
  color: var(--primary);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}`,

  // Server files
  'server/config/database.js': `const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://user:pass@localhost:5432/agora', {
  dialect: 'postgres',
  logging: false,
});

module.exports = sequelize;`,

  'server/middleware/auth.js': `const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

module.exports = { verifyToken, generateToken };`,

  'server/routes/index.js': `const express = require('express');
const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Protected route example
router.get('/protected', (req, res) => {
  res.json({ message: 'This is protected', user: req.user });
});

module.exports = router;`,

  'server/controllers/authController.js': `const { generateToken } = require('../middleware/auth');

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    // TODO: Hash password, create user in DB
    const token = generateToken(email);
    res.json({ token, user: { email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // TODO: Find user, verify password
    const token = generateToken(email);
    res.json({ token, user: { email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};`,

  'server/services/chatService.js': `// Chat service for IA interactions
class ChatService {
  async processMessage(message, userId) {
    // TODO: Send to OpenAI/Claude API
    // TODO: Detect risk language
    // TODO: Store in DB
    
    return {
      response: 'This is a test response from the AI',
      riskLevel: 'low',
    };
  }

  async detectRiskLanguage(text) {
    // TODO: Implement risk detection
    return { isRisk: false, level: 0 };
  }
}

module.exports = new ChatService();`,
};

// Create all files
console.log('📁 Creating component templates...\n');

Object.entries(components).forEach(([filePath, content]) => {
  ensureDir(filePath);
  fs.writeFileSync(filePath, content);
  console.log(\`✅ Created: \${filePath}\`);
});

console.log('\n✨ Component templates created!\n');
console.log('Ready to start developing. Run: npm run dev');
