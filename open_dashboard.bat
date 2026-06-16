@echo off
:: หยุด server เก่าที่ port 3334 (ถ้ามี)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3334 " ^| findstr "LISTENING"') do (
    taskkill /PID %%a /F >nul 2>&1
)

:: รอสักครู่
timeout /t 1 /nobreak >nul

:: เริ่ม server ใหม่ใน background
start "" /B powershell -WindowStyle Hidden -ExecutionPolicy Bypass -File "%~dp0serve.ps1"

:: รอ server พร้อม
timeout /t 2 /nobreak >nul

:: เปิด browser
start "" "http://localhost:3334/dashboard/"
