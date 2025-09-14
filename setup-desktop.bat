@echo off
REM Easy Document - Desktop Application Setup Script
REM Automatically sets up the application for desktop use

echo ========================================
echo Easy Document Desktop App Setup
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.9+ from https://python.org
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js 16+ from https://nodejs.org
    pause
    exit /b 1
)

echo Setting up backend environment...
cd backend

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Upgrade pip
echo Upgrading pip...
python -m pip install --upgrade pip

REM Install dependencies
echo Installing Python dependencies...
pip install -r requirements.txt

REM Set up environment file if it doesn't exist
if not exist ".env" (
    echo Creating environment configuration...
    copy .env.example .env
)

REM Run migrations
echo Setting up database...
python manage.py migrate

cd ..

echo Setting up frontend environment...
cd frontend

REM Install Node.js dependencies
echo Installing Node.js dependencies...
npm install

REM Build the application
echo Building application...
npm run build

cd ..

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To run the desktop application:
echo 1. Start backend: run-backend.bat
echo 2. Start desktop app: run-desktop.bat
echo.
echo Or use the all-in-one: start-desktop-app.bat
echo.
pause