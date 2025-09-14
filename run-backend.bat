@echo off
REM Easy Document - Start Backend Server
echo Starting Easy Document Backend Server...

cd backend

REM Check if virtual environment exists
if not exist "venv\Scripts\activate.bat" (
    echo ERROR: Virtual environment not found!
    echo Please run setup-desktop.bat first.
    pause
    exit /b 1
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Start Django server
echo Backend server starting on http://127.0.0.1:8000
echo Press Ctrl+C to stop the server
echo.
python manage.py runserver 127.0.0.1:8000