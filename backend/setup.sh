#!/bin/bash

echo "======================================"
echo "Tour Booking API - Setup Script"
echo "======================================"
echo ""

# Create virtual environment
echo "[1/4] Creating virtual environment..."
python3 -m venv venv
if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to create virtual environment"
    exit 1
fi

# Activate virtual environment
echo "[2/4] Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "[3/4] Installing dependencies..."
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to install dependencies"
    exit 1
fi

# Create .env file
if [ ! -f ".env" ]; then
    echo "[4/4] Creating .env file..."
    cp .env.example .env
fi

# Make start.sh executable
chmod +x start.sh

echo ""
echo "======================================"
echo "Setup Complete!"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Initialize database: python init_db.py"
echo "2. Start server: ./start.sh"
echo ""
echo "Or simply run: ./start.sh"
echo "(it will initialize database automatically)"
echo ""
