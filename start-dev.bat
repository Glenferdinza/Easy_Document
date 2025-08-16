@echo off
echo ====================================
echo   File Compression Website
echo   Starting Development Servers...
echo ====================================
echo.

echo Checking if setup has been run...
if not exist "backend\venv" (
    echo Error: Virtual environment not found!
    echo Please run setup.bat first to set up the development environment.
    echo.
    pause
    exit /b 1
)

if not exist "frontend\node_modules" (
    echo Error: Node modules not found!
    echo Please run setup.bat first to set up the development environment.
    echo.
    pause
    exit /b 1
)

echo Starting Backend Server (Django)...
start "Backend - Django Server" cmd /k "cd /d %~dp0backend && venv\Scripts\activate.bat && echo Backend server starting at http://localhost:8000 && echo Admin panel at http://localhost:8000/admin && echo. && python manage.py runserver"

echo Waiting for backend to initialize...
timeout /t 3

echo Starting Frontend Server (React)...
start "Frontend - React Server" cmd /k "cd /d %~dp0frontend && echo Frontend server starting at http://localhost:3000 && echo. && npm start"

echo.
echo ====================================
echo   Development Servers Starting...
echo ====================================
echo.
echo Backend (Django): http://localhost:8000
echo Frontend (React): http://localhost:3000  
echo Admin Panel: http://localhost:8000/admin
echo.
echo Login credentials for admin:
echo Username: admin
echo Password: admin123
echo.
echo Both servers will open in separate command windows.
echo Close those windows to stop the servers.
echo.
echo Press any key to close this window...
pause > nul
