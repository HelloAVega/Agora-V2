@echo off
REM Create directories
if not exist "server" mkdir server
if not exist "server\config" mkdir server\config
if not exist "server\controllers" mkdir server\controllers
if not exist "server\middleware" mkdir server\middleware
if not exist "server\models" mkdir server\models
if not exist "server\routes" mkdir server\routes
if not exist "server\services" mkdir server\services
if not exist "server\utils" mkdir server\utils

if not exist "client" mkdir client
if not exist "client\src" mkdir client\src
if not exist "client\src\components" mkdir client\src\components
if not exist "client\src\pages" mkdir client\src\pages
if not exist "client\src\hooks" mkdir client\src\hooks
if not exist "client\src\stores" mkdir client\src\stores
if not exist "client\src\services" mkdir client\src\services
if not exist "client\src\utils" mkdir client\src\utils
if not exist "client\src\types" mkdir client\src\types
if not exist "client\src\styles" mkdir client\src\styles
if not exist "client\public" mkdir client\public

echo.
echo ✅ Directory structure created!
echo.
echo Next steps:
echo 1. npm install
echo 2. cd server ^&^& npm install
echo 3. cd ..\client ^&^& npm install
