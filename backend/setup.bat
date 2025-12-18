@echo off
echo ======================================
echo Tour Booking API - Setup Script
echo ======================================
echo.

REM Create virtual environment
echo [1/4] Creating virtual environment...
python -m venv venv
if errorlevel 1 (
    echo [ERROR] Failed to create virtual environment
    pause
    exit /b 1
)

REM Activate virtual environment
echo [2/4] Activating virtual environment...
call venv\Scripts\activate

REM Install dependencies
echo [3/4] Installing dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)

REM Create .env file
if not exist ".env" (
    echo [4/4] Creating .env file...
    copy .env.example .env
)

echo.
echo ======================================
echo Setup Complete!
echo ======================================
echo.
echo Next steps:
echo 1. Initialize database: python init_db.py
echo 2. Start server: start.bat
echo.
echo Or simply run: start.bat
echo (it will initialize database automatically)
echo.
pause
