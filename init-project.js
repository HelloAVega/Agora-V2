#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Create directories
const dirs = [
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

console.log('📁 Creating directory structure...');
dirs.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`✅ Created: ${dir}`);
  }
});

console.log('✅ Directory structure created successfully!');
console.log('\nNext steps:');
console.log('1. npm install');
console.log('2. cd server && npm install');
console.log('3. cd ../client && npm install');
