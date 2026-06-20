@echo off
:: รอ 5 วินาทีหลัง login ให้ระบบพร้อมก่อน
timeout /t 5 /nobreak >nul

:: หยุด server เก่า (ถ้ามี) ที่ port 5180
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5180 " ^| findstr "LISTENING"') do (
    taskkill /PID %%a /F >nul 2>&1
)

cd /d "%~dp0"

:: build ครั้งแรกถ้ายังไม่มี ทุกครั้งที่รัน script นี้จะ rebuild ให้ใหม่เสมอ (ของแก้ไฟล์ source ล่าสุด)
call npm run build

:: รัน production server แบบ adapter-node (ค้างตลอด ไม่ปิดเอง)
set PORT=5180
set HOST=127.0.0.1
node build\index.js
