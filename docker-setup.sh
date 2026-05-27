#!/bin/bash
# docker-setup.sh - Quick Docker setup script

echo "╔════════════════════════════════════════════╗"
echo "║   🐳 DOCKER QUICK SETUP - ÁGORA V2        ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed!"
    echo "   Download from: https://www.docker.com/products/docker-desktop"
    exit 1
fi

echo "✓ Docker found: $(docker --version)"
echo ""

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose is not installed!"
    exit 1
fi

echo "✓ docker-compose found: $(docker-compose --version)"
echo ""

# Ask user what to do
echo "Select an option:"
echo "1) Start development (with hot-reload)"
echo "2) Build production image"
echo "3) Run production image"
echo "4) Stop all containers"
echo "5) Clean up (remove containers and volumes)"
echo ""

read -p "Enter option (1-5): " option

case $option in
    1)
        echo ""
        echo "🚀 Starting development environment..."
        echo "   Frontend: http://localhost:5173"
        echo "   Backend: http://localhost:5000"
        echo ""
        echo "Press Ctrl+C to stop"
        docker-compose up
        ;;
    2)
        echo ""
        echo "📦 Building production image..."
        docker build -t agora:latest .
        echo "✓ Build complete! Run 'option 3' to start."
        ;;
    3)
        echo ""
        echo "🚀 Running production image..."
        echo "   App: http://localhost:5000"
        echo ""
        echo "Press Ctrl+C to stop"
        docker run -p 5000:5000 agora:latest
        ;;
    4)
        echo ""
        echo "⏹  Stopping containers..."
        docker-compose down
        echo "✓ Containers stopped"
        ;;
    5)
        echo ""
        echo "🧹 Cleaning up..."
        docker-compose down -v
        docker system prune -f
        echo "✓ Cleanup complete"
        ;;
    *)
        echo "❌ Invalid option"
        exit 1
        ;;
esac
