@echo off
echo ====================================
echo Tour Booking API - Starting Server
echo ====================================
echo.

REM Check if venv exists
if not exist "venv" (
    echo [ERROR] Virtual environment not found!
    echo Please run: python -m venv venv
    echo Then activate it and install dependencies
    pause
    exit /b 1
)

REM Activate virtual environment
call venv\Scripts\activate

REM Check if .env exists
if not exist ".env" (
    echo [WARNING] .env file not found!
    echo Creating .env from .env.example...
    copy .env.example .env
)

REM Check if database exists
if not exist "tours.db" (
    echo [INFO] Database not found. Initializing...
    python init_db.py
    echo.
)

echo [INFO] Starting FastAPI server...
echo [INFO] API Documentation: http://localhost:8000/docs
echo [INFO] Press Ctrl+C to stop the server
echo.

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
