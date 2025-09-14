#!/bin/bash
# Easy Document - Desktop Application Setup Script
# Automatically sets up the application for desktop use

echo "========================================"
echo "Easy Document Desktop App Setup"
echo "========================================"
echo

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 is not installed"
    echo "Please install Python 3.9+ from your package manager"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed"
    echo "Please install Node.js 16+ from https://nodejs.org"
    exit 1
fi

echo "Setting up backend environment..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "Upgrading pip..."
python -m pip install --upgrade pip

# Install dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Set up environment file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating environment configuration..."
    cp .env.example .env
fi

# Run migrations
echo "Setting up database..."
python manage.py migrate

cd ..

echo "Setting up frontend environment..."
cd frontend

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm install

# Build the application
echo "Building application..."
npm run build

cd ..

echo
echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo
echo "To run the desktop application:"
echo "1. Start backend: ./run-backend.sh"
echo "2. Start desktop app: ./run-desktop.sh"
echo
echo "Or use the all-in-one: ./start-desktop-app.sh"
echo

# Make scripts executable
chmod +x run-backend.sh run-desktop.sh start-desktop-app.sh