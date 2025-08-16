@echo off
echo ====================================
echo   Testing Local Development Setup
echo ====================================
echo.

echo Testing Backend Server...
cd backend
call venv\Scripts\activate.bat

echo Checking Django installation...
python -c "import django; print('Django version:', django.get_version())"

echo Checking database...
python manage.py check

echo Testing API endpoints...
start /min python manage.py runserver
timeout /t 5
curl -s http://localhost:8000/api/compress/history/ > nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ Backend API is working!
) else (
    echo ❌ Backend API test failed
)

REM Stop the test server
taskkill /f /im python.exe > nul 2>&1

echo.
echo Testing Frontend...
cd ..\frontend

echo Checking Node modules...
if exist "node_modules" (
    echo ✅ Node modules installed
) else (
    echo ❌ Node modules missing - run setup.bat
)

echo Testing React build...
npm run build > nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ React app builds successfully!
) else (
    echo ❌ React build failed
)

echo.
echo ====================================
echo   Test Complete
echo ====================================
echo.
echo If all tests passed, you can run start-dev.bat
echo.
pause
