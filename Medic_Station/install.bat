@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ============================================
echo  ติดตั้ง MED-App (Medic_Station)
echo ============================================
echo.

REM --- เช็คว่ามี Python ติดตั้งหรือยัง ---
where python >nul 2>nul
if errorlevel 1 (
    echo [!] ไม่พบ Python ในเครื่องนี้
    echo     กรุณาติดตั้ง Python จาก https://www.python.org/downloads/
    echo     ตอนติดตั้งให้ติ๊ก "Add python.exe to PATH" ด้วย
    echo     จากนั้นรันไฟล์นี้ใหม่อีกครั้ง
    echo.
    pause
    exit /b 1
)

echo กำลังติดตั้งไลบรารีที่จำเป็นทั้งหมด (อาจใช้เวลาสักครู่)...
echo.
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
if errorlevel 1 (
    echo.
    echo [!] ติดตั้งไลบรารีไม่สำเร็จ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตแล้วลองใหม่
    pause
    exit /b 1
)

echo.
echo กำลังสร้าง shortcut บน Desktop...
cscript //nologo "%~dp0create_desktop_shortcut.vbs"

echo.
echo ============================================
echo  ติดตั้งเสร็จสิ้น!
echo  เปิดโปรแกรมได้จากไอคอน "MED-App" บน Desktop
echo ============================================
pause
