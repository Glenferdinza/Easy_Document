#!/bin/bash
# Development Setup Script - Simple Local Development

echo "===================================="
echo "   File Compression Website Setup   "
echo "===================================="
echo

# Check Python installation
echo "Checking Python installation..."
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is not installed or not in PATH"
    echo "Please install Python 3.8+ from your package manager or https://python.org"
    exit 1
fi
python3 --version

# Check Node.js installation
echo "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed or not in PATH"
    echo "Please install Node.js from your package manager or https://nodejs.org"
    exit 1
fi
node --version

echo
echo "=== Setting up Backend (Django) ==="
cd backend

echo "Creating Python virtual environment..."
python3 -m venv venv

echo "Activating virtual environment..."
source venv/bin/activate

echo "Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "Setting up Django database..."
python manage.py makemigrations
python manage.py makemigrations compression
python manage.py makemigrations youtube_converter
python manage.py migrate

echo "Creating Django superuser (optional)..."
echo "Username: admin, Password: admin123"
read -p "Create superuser now? (y/n): " create_superuser
if [[ $create_superuser == "y" || $create_superuser == "Y" ]]; then
    echo "Creating superuser with username 'admin' and password 'admin123'..."
    python -c "import os, django; os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'compress_website.settings'); django.setup(); from django.contrib.auth.models import User; User.objects.filter(username='admin').exists() or User.objects.create_superuser('admin', 'admin@example.com', 'admin123'); print('Superuser created successfully!')"
fi

echo
echo "=== Setting up Frontend (React) ==="
cd ../frontend

echo "Installing Node.js dependencies..."
npm install

echo
echo "===================================="
echo "        Setup Complete! 🎉         "
echo "===================================="
echo
echo "Your local development environment is ready!"
echo
echo "To start the servers:"
echo "  Backend: cd backend && source venv/bin/activate && python manage.py runserver"
echo "  Frontend: cd frontend && npm start"
echo
echo "URLs:"
echo "  Frontend: http://localhost:3000"
echo "  Backend API: http://localhost:8000/api"
echo "  Admin Panel: http://localhost:8000/admin (admin/admin123)"
echo
echo "Note: Uses SQLite database for development (no MySQL needed)"
echo
