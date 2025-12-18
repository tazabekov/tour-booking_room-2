#!/bin/bash

echo "===================================="
echo "Tour Booking API - Starting Server"
echo "===================================="
echo ""

# Check if venv exists
if [ ! -d "venv" ]; then
    echo "[ERROR] Virtual environment not found!"
    echo "Please run: python3 -m venv venv"
    echo "Then activate it and install dependencies"
    exit 1
fi

# Activate virtual environment
source venv/bin/activate

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "[WARNING] .env file not found!"
    echo "Creating .env from .env.example..."
    cp .env.example .env
fi

# Check if database exists
if [ ! -f "tours.db" ]; then
    echo "[INFO] Database not found. Initializing..."
    python init_db.py
    echo ""
fi

echo "[INFO] Starting FastAPI server..."
echo "[INFO] API Documentation: http://localhost:8000/docs"
echo "[INFO] Press Ctrl+C to stop the server"
echo ""

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
