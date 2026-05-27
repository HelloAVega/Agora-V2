#!/bin/bash
# Heroku build script

echo "🔨 Building Ágora V2 for Heroku..."

# Install client dependencies and build
echo "📦 Installing client dependencies..."
cd client
npm install --production=false --legacy-peer-deps
if [ $? -ne 0 ]; then
  echo "❌ Client dependencies installation failed"
  exit 1
fi

echo "🏗️  Building client..."
npm run build
if [ $? -ne 0 ]; then
  echo "❌ Client build failed"
  exit 1
fi

cd ..

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
npm install --production=false --legacy-peer-deps
if [ $? -ne 0 ]; then
  echo "❌ Server dependencies installation failed"
  exit 1
fi

cd ..

echo "✅ Build completed successfully!"
