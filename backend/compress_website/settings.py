import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

# Security settings
SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-change-in-production')
DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'

# Azure App Service automatically provides WEBSITE_HOSTNAME
WEBSITE_HOSTNAME = os.getenv('WEBSITE_HOSTNAME')
if WEBSITE_HOSTNAME:
    ALLOWED_HOSTS = [WEBSITE_HOSTNAME]
else:
    ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')

# Azure-specific settings
CSRF_TRUSTED_ORIGINS = []
if WEBSITE_HOSTNAME:
    CSRF_TRUSTED_ORIGINS = [f'https://{WEBSITE_HOSTNAME}']

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'compression',
    'youtube_converter',
    'pdf_tools',
    'image_tools',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'youtube_converter.middleware.FileCleanupMiddleware',
]

ROOT_URLCONF = 'compress_website.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'compress_website.wsgi.application'

# Database
if os.getenv('AZURE_MYSQL_HOST'):
    # Production MySQL configuration
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': os.getenv('AZURE_MYSQL_NAME'),
            'USER': os.getenv('AZURE_MYSQL_USER'),
            'PASSWORD': os.getenv('AZURE_MYSQL_PASSWORD'),
            'HOST': os.getenv('AZURE_MYSQL_HOST'),
            'PORT': '3306',
            'OPTIONS': {
                'sql_mode': 'traditional',
                'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
            }
        }
    }
else:
    # Development SQLite configuration (default)
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

# REST Framework
REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/hour',
    }
}

# CORS settings
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# Add additional origins from environment variable
cors_origins = os.getenv('CORS_ORIGINS', '')
if cors_origins:
    CORS_ALLOWED_ORIGINS.extend([origin.strip() for origin in cors_origins.split(',') if origin.strip()])

# Azure-specific CORS settings
if WEBSITE_HOSTNAME:
    # Add Azure frontend URL to CORS
    azure_frontend_url = os.getenv('FRONTEND_URL', f'https://{WEBSITE_HOSTNAME.replace("-api", "")}')
    CORS_ALLOWED_ORIGINS.append(azure_frontend_url)

# For development, allow all origins (less secure but easier for testing)
if DEBUG:
    CORS_ALLOW_ALL_ORIGINS = True
else:
    # Production: be more restrictive
    CORS_ALLOW_ALL_ORIGINS = False

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Security settings for production
if not DEBUG:
    SECURE_SSL_REDIRECT = True
    SECURE_HSTS_SECONDS = 31536000
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SECURE_BROWSER_XSS_FILTER = True
    X_FRAME_OPTIONS = 'DENY'
    CSRF_COOKIE_SECURE = True
    SESSION_COOKIE_SECURE = True

# File upload settings
FILE_UPLOAD_MAX_MEMORY_SIZE = 50 * 1024 * 1024  # 50MB
DATA_UPLOAD_MAX_MEMORY_SIZE = 50 * 1024 * 1024  # 50MB

# Celery settings (optional - only if Redis is available)
if os.getenv('REDIS_URL'):
    try:
        import celery
        CELERY_BROKER_URL = os.getenv('REDIS_URL')
        CELERY_RESULT_BACKEND = os.getenv('REDIS_URL')
    except ImportError:
        pass  # Celery not installed, skip configuration

# Azure Storage settings (optional)
if os.getenv('AZURE_STORAGE_CONNECTION_STRING'):
    try:
        from azure.storage.blob import BlobServiceClient
        DEFAULT_FILE_STORAGE = 'azure_storage.AzureStorage'
        AZURE_STORAGE_CONNECTION_STRING = os.getenv('AZURE_STORAGE_CONNECTION_STRING')
        AZURE_CONTAINER = 'media'
    except ImportError:
        pass  # Azure storage not available, use local storage
