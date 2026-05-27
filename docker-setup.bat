@echo off
REM docker-setup.bat - Quick Docker setup for Windows

echo.
echo ╔════════════════════════════════════════════╗
echo ║   🐳 DOCKER QUICK SETUP - ÁGORA V2        ║
echo ╚════════════════════════════════════════════╝
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not installed!
    echo    Download from: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('docker --version') do set DOCKER_VERSION=%%i
echo ✓ %DOCKER_VERSION%
echo.

REM Check if docker-compose is installed
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ docker-compose is not installed!
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('docker-compose --version') do set COMPOSE_VERSION=%%i
echo ✓ %COMPOSE_VERSION%
echo.

echo Select an option:
echo 1) Start development (with hot-reload)
echo 2) Build production image
echo 3) Run production image
echo 4) Stop all containers
echo 5) Clean up (remove containers and volumes)
echo.

set /p option="Enter option (1-5): "

if "%option%"=="1" (
    echo.
    echo 🚀 Starting development environment...
    echo    Frontend: http://localhost:5173
    echo    Backend: http://localhost:5000
    echo.
    echo Press Ctrl+C to stop
    docker-compose up
) else if "%option%"=="2" (
    echo.
    echo 📦 Building production image...
    docker build -t agora:latest .
    echo ✓ Build complete! Run 'option 3' to start.
    pause
) else if "%option%"=="3" (
    echo.
    echo 🚀 Running production image...
    echo    App: http://localhost:5000
    echo.
    echo Press Ctrl+C to stop
    docker run -p 5000:5000 agora:latest
) else if "%option%"=="4" (
    echo.
    echo ⏹  Stopping containers...
    docker-compose down
    echo ✓ Containers stopped
    pause
) else if "%option%"=="5" (
    echo.
    echo 🧹 Cleaning up...
    docker-compose down -v
    docker system prune -f
    echo ✓ Cleanup complete
    pause
) else (
    echo ❌ Invalid option
    pause
    exit /b 1
)
