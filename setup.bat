# Development Setup Script - Simple Local Development
@echo off
echo ====================================
echo   File Compression Website Setup
echo ====================================
echo.

echo Checking Python installation...
python --version
if %ERRORLEVEL% NEQ 0 (
    echo Error: Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://python.org
    pause
    exit /b 1
)

echo Checking Node.js installation...
node --version
if %ERRORLEVEL% NEQ 0 (
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo.
echo === Setting up Backend (Django) ===
cd backend

echo Creating Python virtual environment...
python -m venv venv

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing Python dependencies...
pip install --upgrade pip
pip install -r requirements.txt

echo Setting up Django database...
python manage.py makemigrations
python manage.py makemigrations compression
python manage.py makemigrations youtube_converter
python manage.py migrate

echo Creating Django superuser (optional - you can skip this)...
echo Username: admin, Password: admin123
set /p create_superuser="Create superuser now? (y/n): "
if /i "%create_superuser%"=="y" (
    echo Creating superuser with username 'admin' and password 'admin123'...
    python -c "import os, django; os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'compress_website.settings'); django.setup(); from django.contrib.auth.models import User; User.objects.filter(username='admin').exists() or User.objects.create_superuser('admin', 'admin@example.com', 'admin123'); print('Superuser created successfully!')"
)

echo.
echo === Setting up Frontend (React) ===
cd ..\frontend

echo Installing Node.js dependencies...
npm install

echo.
echo ====================================
echo        Setup Complete! 🎉
echo ====================================
echo.
echo Your local development environment is ready!
echo.
echo To start the servers:
echo   1. Run start-dev.bat (recommended)
echo   OR manually:
echo   2. Backend: cd backend && venv\Scripts\activate && python manage.py runserver
echo   3. Frontend: cd frontend && npm start
echo.
echo URLs:
echo   Frontend: http://localhost:3000
echo   Backend API: http://localhost:8000/api
echo   Admin Panel: http://localhost:8000/admin (admin/admin123)
echo.
echo Note: Uses SQLite database for development (no MySQL needed)
echo.

pause
