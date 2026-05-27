#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const baseDir = process.cwd();
const clientDir = path.join(baseDir, 'client');

// Create all directories
const dirs = [
  clientDir,
  path.join(clientDir, 'src'),
  path.join(clientDir, 'src', 'components'),
  path.join(clientDir, 'src', 'pages'),
  path.join(clientDir, 'src', 'hooks'),
  path.join(clientDir, 'src', 'stores'),
  path.join(clientDir, 'src', 'services'),
  path.join(clientDir, 'src', 'utils'),
  path.join(clientDir, 'src', 'types'),
  path.join(clientDir, 'src', 'styles'),
  path.join(clientDir, 'public')
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log('Created directory: ' + dir);
  }
});

// Create package.json
const packageJson = {
  name: "agora-client",
  version: "0.1.0",
  type: "module",
  scripts: {
    dev: "vite",
    build: "vite build",
    preview: "vite preview",
    lint: "eslint src --ext .js,.jsx,.ts,.tsx"
  },
  dependencies: {
    react: "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    zustand: "^4.4.1",
    axios: "^1.6.2",
    "socket.io-client": "^4.7.2"
  },
  devDependencies: {
    "@types/react": "^18.2.37",
    "@types/react-dom": "^18.2.15",
    "@vitejs/plugin-react": "^4.2.0",
    vite: "^5.0.8",
    tailwindcss: "^3.3.6",
    postcss: "^8.4.32",
    autoprefixer: "^10.4.16"
  }
};

// Create vite.config.js
const viteConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})`;

// Create tailwind.config.js
const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`;

// Create postcss.config.js
const postcssConfig = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`;

// Create .env.example
const envExample = `VITE_API_BASE_URL=https://localhost:3001
VITE_APP_NAME=Ágora
VITE_SOCKET_URL=https://localhost:3001`;

// Create .gitignore
const gitignore = `# Dependencies
node_modules/
/.pnp
.pnp.js

# Testing
/coverage

# Production
/dist
/build

# Misc
.DS_Store
.env.local
.env.*.local

# Editor directories and files
.idea
.vscode
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?`;

// Create index.html
const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Ágora</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"><\/script>
  </body>
</html>`;

// Create src/main.jsx
const mainJsx = `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`;

// Create src/App.jsx
const appJsx = `import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<div className="p-8"><h1 className="text-4xl font-bold text-gray-900">Ágora</h1></div>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App`;

// Create src/styles/index.css
const indexCss = `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: light dark;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Source Sans Pro',
    -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}`;

// Create README.md for client
const readmeMd = `# Ágora Client

React frontend for the Ágora platform.

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

\`\`\`bash
cd client
npm install
\`\`\`

### Development

\`\`\`bash
npm run dev
\`\`\`

The app will be available at \`http://localhost:3000\`

### Build

\`\`\`bash
npm run build
\`\`\`

### Preview

\`\`\`bash
npm run preview
\`\`\`

## Technologies

- **React** 18.2
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS
- **React Router** v6 - Client-side routing
- **Zustand** - State management
- **Axios** - HTTP client
- **Socket.io-client** - Real-time communication

## Project Structure

\`\`\`
src/
├── components/      # Reusable components
├── pages/          # Page components
├── hooks/          # Custom React hooks
├── stores/         # Zustand stores
├── services/       # API and external services
├── utils/          # Utility functions
├── types/          # TypeScript type definitions
├── styles/         # Global styles
└── App.jsx         # Main app component
\`\`\`

## Environment Variables

Create a \`.env.local\` file based on \`.env.example\`:

\`\`\`
VITE_API_BASE_URL=https://localhost:3001
VITE_APP_NAME=Ágora
VITE_SOCKET_URL=https://localhost:3001
\`\`\``;

// Write all files
fs.writeFileSync(path.join(clientDir, 'package.json'), JSON.stringify(packageJson, null, 2));
fs.writeFileSync(path.join(clientDir, 'vite.config.js'), viteConfig);
fs.writeFileSync(path.join(clientDir, 'tailwind.config.js'), tailwindConfig);
fs.writeFileSync(path.join(clientDir, 'postcss.config.js'), postcssConfig);
fs.writeFileSync(path.join(clientDir, '.env.example'), envExample);
fs.writeFileSync(path.join(clientDir, '.gitignore'), gitignore);
fs.writeFileSync(path.join(clientDir, 'index.html'), indexHtml);
fs.writeFileSync(path.join(clientDir, 'README.md'), readmeMd);
fs.writeFileSync(path.join(clientDir, 'src', 'main.jsx'), mainJsx);
fs.writeFileSync(path.join(clientDir, 'src', 'App.jsx'), appJsx);
fs.writeFileSync(path.join(clientDir, 'src', 'styles', 'index.css'), indexCss);

// Create placeholder files for each directory to ensure they're tracked
const placeholderDirs = [
  path.join(clientDir, 'src', 'components'),
  path.join(clientDir, 'src', 'pages'),
  path.join(clientDir, 'src', 'hooks'),
  path.join(clientDir, 'src', 'stores'),
  path.join(clientDir, 'src', 'services'),
  path.join(clientDir, 'src', 'utils'),
  path.join(clientDir, 'src', 'types'),
  path.join(clientDir, 'public')
];

placeholderDirs.forEach(dir => {
  fs.writeFileSync(path.join(dir, '.gitkeep'), '');
});

console.log('');
console.log('✓ Frontend project structure created successfully!');
console.log('✓ Location: ' + clientDir);
console.log('✓ Directories created: src/components, src/pages, src/hooks, src/stores, src/services, src/utils, src/types, src/styles, public');
console.log('✓ Files created: package.json, vite.config.js, tailwind.config.js, postcss.config.js, index.html, src/App.jsx, src/main.jsx, src/styles/index.css, .env.example, README.md');
console.log('');
console.log('Next steps:');
console.log('1. cd client');
console.log('2. npm install');
console.log('3. npm run dev');
