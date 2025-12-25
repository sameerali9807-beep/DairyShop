@echo off
title Indian Doodh Dairy System
color 0A

echo ========================================
echo     INDIAN DOODH DAIRY - STARTUP
echo ========================================
echo.

cd /d "C:\Users\PC\Desktop\Indian Doodh Dary\backend"

echo [1/3] Installing dependencies...
call npm install

echo [2/3] Starting Backend Server...
start cmd /k "node server.js"
timeout /t 5 /nobreak >nul

echo [3/3] Opening Frontend...
start "" "C:\Users\PC\Desktop\Indian Doodh Dary\frontend\index.html"

echo.
echo ========================================
echo ✅ SYSTEM STARTED SUCCESSFULLY!
echo.
echo 📍 Frontend Website: Customer Order Page
echo 🛠️  Backend API: http://localhost:5000
echo 🔑 Admin Password: Indian@2010
echo.
echo ========================================
echo.
pause