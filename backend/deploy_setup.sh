#!/bin/bash
echo "🚀 Deployment Setup Script for MySQL"
echo "======================================"

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  Creating .env from .env.example..."
    cp .env.example .env
    echo "📝 Please edit .env file with your actual MySQL credentials"
fi

# Install dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

# Database setup
echo "🗄️  Setting up MySQL database..."
echo "Please make sure your MySQL server is running and accessible"

# Run migrations
echo "🔧 Running database migrations..."
python manage.py makemigrations
python manage.py migrate

# Create superuser (optional)
echo "👤 Creating superuser (optional)..."
echo "Press Ctrl+C to skip"
python manage.py createsuperuser || echo "Skipped superuser creation"

# Collect static files
echo "📁 Collecting static files..."
python manage.py collectstatic --noinput

echo "✅ Deployment setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update .env with your MySQL credentials"
echo "2. Run: python manage.py runserver"
echo "3. Access admin at: http://localhost:8000/admin/"
echo ""
echo "🌐 For production:"
echo "1. Use gunicorn: gunicorn compress_website.wsgi"
echo "2. Configure nginx as reverse proxy"
echo "3. Set DEBUG=False in .env"
