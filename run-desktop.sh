#!/bin/bash
# Easy Document - Start Desktop Application
echo "Starting Easy Document Desktop Application..."

cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "ERROR: Node modules not found!"
    echo "Please run ./setup-desktop.sh first."
    exit 1
fi

# Check if backend is running
echo "Checking if backend server is running..."
if curl -s --connect-timeout 5 http://127.0.0.1:8000/api/ > /dev/null; then
    echo "Backend is running!"
else
    echo "WARNING: Backend server not detected. Please start ./run-backend.sh first."
fi
echo

# Start desktop application
echo "Starting desktop application..."
echo "Note: Autofill errors in console are normal and can be ignored"
npm run electron-standalone