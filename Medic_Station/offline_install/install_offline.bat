@echo off
chcp 65001 >nul
cd /d "%~dp0"

if defined MEDAPP_LOGGED goto :main
set "MEDAPP_LOGGED=1"
call "%~f0" > "%~dp0install_log.txt" 2>&1
set "RC=%errorlevel%"
type "%~dp0install_log.txt"
echo.
if "%RC%"=="0" goto :show_ok
echo ============================================
echo  ติดตั้งไม่สำเร็จ (โค้ด %RC%)
echo  รายละเอียดถูกบันทึกไว้ใน install_log.txt
echo  กรุณาส่งไฟล์ install_log.txt ให้ผู้ดูแลระบบ
echo ============================================
goto :end
:show_ok
echo ============================================
echo  ติดตั้งเสร็จสิ้น!
echo  เปิดโปรแกรมได้จากไอคอน "MED-App" บน Desktop
echo ============================================
:end
echo.
pause
exit /b %RC%

:main
echo ============================================
echo  ติดตั้ง MED-App (Medic_Station) - แบบออฟไลน์
echo ============================================
echo.

REM --- เช็คว่าไฟล์ที่ต้องใช้อยู่ครบหรือไม่ ---
if not exist "%~dp0python-3.14.5-amd64.exe" (
    echo [!] ไม่พบไฟล์ python-3.14.5-amd64.exe ในโฟลเดอร์นี้
    echo     ไฟล์อาจถูกลบ/บล็อกตอนคัดลอก ^(เช่น โดยโปรแกรมแอนตี้ไวรัส^)
    exit /b 1
)
if not exist "%~dp0packages" (
    echo [!] ไม่พบโฟลเดอร์ packages ในโฟลเดอร์นี้
    exit /b 1
)
if not exist "%~dp0..\create_desktop_shortcut.vbs" (
    echo [!] ไม่พบไฟล์ create_desktop_shortcut.vbs ในโฟลเดอร์ Medic_Station
    exit /b 1
)

set "PYEXE="
for /f "delims=" %%P in ('where python 2^>nul') do (
    if not defined PYEXE (
        "%%P" --version >nul 2>nul
        if not errorlevel 1 set "PYEXE=%%P"
    )
)

if defined PYEXE (
    echo [1/3] พบ Python ในเครื่องแล้ว: %PYEXE%
) else (
    echo [1/3] ไม่พบ Python กำลังติดตั้ง Python 3.14.5 ^(เงียบ ไม่มีหน้าต่างขึ้น, ใช้เวลา 1-3 นาที^)...
    "%~dp0python-3.14.5-amd64.exe" /quiet InstallAllUsers=0 PrependPath=1 Include_launcher=1 Include_test=0
    echo       ติดตั้งตัวติดตั้ง Python เสร็จ ^(exit code %errorlevel%^)

    if exist "%LocalAppData%\Programs\Python\Python314\python.exe" set "PYEXE=%LocalAppData%\Programs\Python\Python314\python.exe"
    if not defined PYEXE if exist "%ProgramFiles%\Python314\python.exe" set "PYEXE=%ProgramFiles%\Python314\python.exe"
    if not defined PYEXE (
        for /f "delims=" %%P in ('where python 2^>nul') do (
            if not defined PYEXE (
                "%%P" --version >nul 2>nul
                if not errorlevel 1 set "PYEXE=%%P"
            )
        )
    )

    if not defined PYEXE (
        echo [!] ไม่พบ python.exe หลังการติดตั้ง
        echo     กรุณาติดตั้ง Python ด้วยตนเองจากไฟล์ python-3.14.5-amd64.exe แล้วรันไฟล์นี้ใหม่
        exit /b 1
    )
    echo       ใช้ Python ที่: %PYEXE%
)

echo.
echo [2/3] กำลังติดตั้งไลบรารีที่จำเป็น (จากไฟล์ในเครื่อง ไม่ต้องใช้อินเทอร์เน็ต)...
"%PYEXE%" -m pip install --no-index --find-links="%~dp0packages" -r "%~dp0..\requirements.txt"
if errorlevel 1 (
    echo [!] ติดตั้งไลบรารีไม่สำเร็จ
    exit /b 1
)

echo.
echo [3/3] กำลังสร้าง shortcut บน Desktop...
cscript //nologo "%~dp0..\create_desktop_shortcut.vbs"
if errorlevel 1 (
    echo [!] สร้าง shortcut ไม่สำเร็จ ^(exit code %errorlevel%^)
    exit /b 1
)

echo.
echo ติดตั้งสำเร็จทุกขั้นตอน
exit /b 0
