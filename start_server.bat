@echo off
:: หยุด process ที่ใช้ port 3334 (ถ้ามี)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3334 " ^| findstr "LISTENING"') do (
    taskkill /PID %%a /F >nul 2>&1
)
timeout /t 1 /nobreak >nul

:: เริ่ม Python HTTP server ใน background
start "" /B python -m http.server 3334 --directory "%~dp0"

:: รอ server พร้อม
timeout /t 2 /nobreak >nul

:: เปิด browser
start "" "http://localhost:3334/dashboard/"
