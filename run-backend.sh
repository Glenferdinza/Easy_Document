#!/bin/bash
# Easy Document - Start Backend Server
echo "Starting Easy Document Backend Server..."

cd backend

# Check if virtual environment exists
if [ ! -f "venv/bin/activate" ]; then
    echo "ERROR: Virtual environment not found!"
    echo "Please run ./setup-desktop.sh first."
    exit 1
fi

# Activate virtual environment
source venv/bin/activate

# Start Django server
echo "Backend server starting on http://127.0.0.1:8000"
echo "Press Ctrl+C to stop the server"
echo
python manage.py runserver 127.0.0.1:8000