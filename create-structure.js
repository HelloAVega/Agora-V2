const fs = require('fs');
const path = require('path');

const basePath = path.join(__dirname, 'server');
const dirs = [
  basePath,
  path.join(basePath, 'routes'),
  path.join(basePath, 'controllers'),
  path.join(basePath, 'middleware'),
  path.join(basePath, 'models'),
  path.join(basePath, 'services'),
  path.join(basePath, 'utils'),
  path.join(basePath, 'config')
];

// Create all directories
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Create package.json
const packageJson = {
  name: "agora-backend",
  version: "1.0.0",
  description: "Backend for Ágora platform",
  main: "server.js",
  type: "module",
  scripts: {
    start: "node server.js",
    dev: "nodemon server.js",
    build: "tsc"
  },
  keywords: ["agora", "express", "api"],
  author: "",
  license: "MIT",
  dependencies: {
    "express": "^4.18.2",
    "socket.io": "^4.6.1",
    "jsonwebtoken": "^9.1.2",
    "bcrypt": "^5.1.1",
    "dotenv": "^16.3.1",
    "sequelize": "^6.35.1",
    "pg": "^8.11.3",
    "pg-hstore": "^2.3.4",
    "cors": "^2.8.5",
    "express-validator": "^7.0.0"
  },
  devDependencies: {
    "typescript": "^5.3.3",
    "nodemon": "^3.0.2",
    "@types/node": "^20.10.5",
    "@types/express": "^4.17.21",
    "@types/jsonwebtoken": "^9.0.7",
    "@types/bcrypt": "^5.0.2"
  }
};

// Create tsconfig.json
const tsConfig = {
  compilerOptions: {
    target: "ES2020",
    module: "ESNext",
    lib: ["ES2020"],
    outDir: "./dist",
    rootDir: "./",
    strict: true,
    esModuleInterop: true,
    skipLibCheck: true,
    forceConsistentCasingInFileNames: true,
    resolveJsonModule: true,
    declaration: true,
    declarationMap: true,
    sourceMap: true
  },
  include: ["**/*.ts"],
  exclude: ["node_modules", "dist"]
};

// Create .env.example
const envExample = `# Express Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=agora_db
DB_USER=postgres
DB_PASSWORD=

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRY=7d

# CORS
CORS_ORIGIN=http://localhost:3000

# Socket.io
SOCKET_IO_PORT=5001
`;

// Create server.js
const serverJs = `import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    status: err.status || 500
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(\`✓ Server running on port \${PORT}\`);
  console.log(\`✓ Environment: \${process.env.NODE_ENV || 'development'}\`);
});
`;

// Create config/database.js
const databaseJs = `import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'agora_db',
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false
});

export default sequelize;
`;

// Create middleware/auth.js
const authJs = `import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY || '7d'
  });
};
`;

// Create routes/index.js
const routesJs = `import express from 'express';

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'API is running', timestamp: new Date() });
});

// TODO: Add your routes here
// Example:
// import userRoutes from './users.js';
// router.use('/users', userRoutes);

export default router;
`;

// Write all files
fs.writeFileSync(path.join(basePath, 'package.json'), JSON.stringify(packageJson, null, 2));
fs.writeFileSync(path.join(basePath, 'tsconfig.json'), JSON.stringify(tsConfig, null, 2));
fs.writeFileSync(path.join(basePath, '.env.example'), envExample);
fs.writeFileSync(path.join(basePath, 'server.js'), serverJs);
fs.writeFileSync(path.join(basePath, 'config', 'database.js'), databaseJs);
fs.writeFileSync(path.join(basePath, 'middleware', 'auth.js'), authJs);
fs.writeFileSync(path.join(basePath, 'routes', 'index.js'), routesJs);

console.log('✓ Server project structure created successfully!');
console.log('✓ Location: ' + basePath);
console.log('✓ Directories created: config, controllers, middleware, models, routes, services, utils');
console.log('✓ Files created: package.json, tsconfig.json, server.js, .env.example, and initial files in config/middleware/routes/');
