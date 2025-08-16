# PowerShell Deployment Setup Script for MySQL
Write-Host "🚀 Deployment Setup Script for MySQL" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green

# Check if .env exists
if (!(Test-Path .env)) {
    Write-Host "⚠️  Creating .env from .env.example..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host "📝 Please edit .env file with your actual MySQL credentials" -ForegroundColor Cyan
}

# Install dependencies
Write-Host "📦 Installing Python dependencies..." -ForegroundColor Blue
pip install -r requirements.txt

# Database setup
Write-Host "🗄️  Setting up MySQL database..." -ForegroundColor Blue
Write-Host "Please make sure your MySQL server is running and accessible" -ForegroundColor Yellow

# Run migrations
Write-Host "🔧 Running database migrations..." -ForegroundColor Blue
python manage.py makemigrations
python manage.py migrate

# Create superuser (optional)
Write-Host "👤 Creating superuser (optional)..." -ForegroundColor Blue
Write-Host "Press Ctrl+C to skip" -ForegroundColor Yellow
try {
    python manage.py createsuperuser
} catch {
    Write-Host "Skipped superuser creation" -ForegroundColor Yellow
}

# Collect static files
Write-Host "📁 Collecting static files..." -ForegroundColor Blue
python manage.py collectstatic --noinput

Write-Host "✅ Deployment setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Update .env with your MySQL credentials"
Write-Host "2. Run: python manage.py runserver"
Write-Host "3. Access admin at: http://localhost:8000/admin/"
Write-Host ""
Write-Host "🌐 For production:" -ForegroundColor Cyan
Write-Host "1. Use gunicorn: gunicorn compress_website.wsgi"
Write-Host "2. Configure nginx as reverse proxy"
Write-Host "3. Set DEBUG=False in .env"
