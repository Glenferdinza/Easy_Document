#!/bin/bash
# Easy Document - All-in-One Desktop App Launcher
echo "========================================"
echo "Easy Document Desktop Application"
echo "========================================"
echo

# Check if setup has been run
if [ ! -d "backend/venv" ] || [ ! -d "frontend/node_modules" ]; then
    echo "First-time setup required..."
    ./setup-desktop.sh
fi

echo "Starting backend server in background..."
./run-backend.sh &

# Wait a moment for backend to start
echo "Waiting for backend to initialize..."
sleep 5

echo "Starting desktop application..."
./run-desktop.sh