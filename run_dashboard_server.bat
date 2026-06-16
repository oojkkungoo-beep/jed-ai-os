@echo off
:: รอ 5 วินาทีหลัง login ให้ระบบพร้อมก่อน
timeout /t 5 /nobreak >nul

:: หยุด server เก่า (ถ้ามี)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3334 " ^| findstr "LISTENING"') do (
    taskkill /PID %%a /F >nul 2>&1
)

:: เริ่ม Python HTTP server แบบ hidden
cd /d "D:\Claude_Cowork\Jed_org"
python -m http.server 3334 --bind 127.0.0.1
