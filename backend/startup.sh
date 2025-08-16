#!/bin/bash

echo "🚀 Starting Azure App Service startup script..."

# Install system dependencies if needed
echo "📦 Installing system dependencies..."

# Collect static files
echo "📁 Collecting static files..."
python manage.py collectstatic --noinput

# Run database migrations
echo "🗄️  Running database migrations..."
python manage.py migrate --noinput

# Create superuser if environment variables are set
if [[ -n "$DJANGO_SUPERUSER_USERNAME" && -n "$DJANGO_SUPERUSER_EMAIL" && -n "$DJANGO_SUPERUSER_PASSWORD" ]]; then
    echo "👤 Creating superuser..."
    python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='$DJANGO_SUPERUSER_USERNAME').exists():
    User.objects.create_superuser('$DJANGO_SUPERUSER_USERNAME', '$DJANGO_SUPERUSER_EMAIL', '$DJANGO_SUPERUSER_PASSWORD')
    print('✅ Superuser created successfully')
else:
    print('ℹ️  Superuser already exists')
"
else
    echo "⚠️  Superuser environment variables not set, skipping..."
fi

echo "🌐 Starting Gunicorn server..."
# Start Gunicorn with proper settings for Azure
# Use PORT environment variable provided by Azure App Service
exec gunicorn --bind=0.0.0.0:${PORT:-8000} --workers=2 --timeout=600 --keep-alive=2 --max-requests=1000 --access-logfile=- --error-logfile=- compress_website.wsgi:application
