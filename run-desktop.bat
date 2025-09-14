@echo off
REM Easy Document - Start Desktop Application
echo Starting Easy Document Desktop Application...

cd frontend

REM Check if node_modules exists
if not exist "node_modules" (
    echo ERROR: Node modules not found!
    echo Please run setup-desktop.bat first.
    pause
    exit /b 1
)

REM Check if backend is running
echo Checking if backend server is running...
powershell -Command "try { Invoke-WebRequest -Uri 'http://127.0.0.1:8000/api/' -TimeoutSec 5 -UseBasicParsing | Out-Null; Write-Host 'Backend is running!' } catch { Write-Host 'WARNING: Backend server not detected. Please start run-backend.bat first.' }"
echo.

REM Start desktop application
echo Starting desktop application...
echo Note: Autofill errors in console are normal and can be ignored
npm run electron-standalone