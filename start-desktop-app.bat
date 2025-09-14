@echo off
REM Easy Document - All-in-One Desktop App Launcher
echo ========================================
echo Easy Document Desktop Application
echo ========================================
echo.

REM Check if setup has been run
if not exist "backend\venv" (
    echo First-time setup required...
    call setup-desktop.bat
)

if not exist "frontend\node_modules" (
    echo Frontend setup required...
    call setup-desktop.bat
)

echo Starting backend server in background...
start "Easy Document Backend" /min cmd /c "run-backend.bat"

REM Wait a moment for backend to start
echo Waiting for backend to initialize...
timeout /t 5 /nobreak >nul

echo Starting desktop application...
call run-desktop.bat