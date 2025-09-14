# Easy Document

[![GitHub repo](https://img.shields.io/badge/GitHub-Easy_Document-blue?style=flat&logo=github)](https://github.com/Glenferdinza/Easy_Document)
[![Python](https://img.shields.io/badge/Python-3.9+-blue?style=flat&logo=python)](https://python.org)
[![Django](https://img.shields.io/badge/Django-5.2+-green?style=flat&logo=django)](https://djangoproject.com)
[![React](https://img.shields.io/badge/React-18.2+-blue?style=flat&logo=react)](https://reactjs.org)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Description

Easy Document is a comprehensive full-stack document processing platform built with Django (Backend) and React (Frontend). The platform provides professional document processing tools with a modern, responsive interface and secure APIs. It offers document manipulation features including PDF processing, image compression, Word document conversion, QR code generation, watermarking, YouTube media conversion, and advanced document security features with encryption and access controls.

## Features

### Document Processing
- **PDF Compression**: 2-level compression system (High: 25% reduction, Low: 15% reduction)
- **PDF Merge**: Combine multiple PDFs seamlessly with drag-and-drop ordering
- **PDF Split**: Split multi-page PDFs into separate files
- **Word to PDF**: Document conversion with preserved formatting
- **Word Document Merger**: Merge multiple Word documents to PDF/DOCX format

### Image Processing  
- **Image Compression**: Batch compression with quality preview and size reduction
- **Background Removal**: AI-powered background removal with transparency support
- **Image Enhancement**: 6 enhancement types (sharpen, denoise, upscale, color enhance, brightness, contrast)
- **Image to PDF**: Convert multiple images to single PDF document
- **Format Conversion**: Multi-format support (JPG, PNG, WebP)

### Media & Professional Tools
- **YouTube Converter**: Video/audio download with quality selection (MP3: 128/192/320 kbps, MP4: 360p-4K)
- **QR Code Generator**: Text, URL, contact QR codes with built-in scanner
- **Watermark Tools**: Text and image watermarks with 9 positioning options

### Security Features
- **Password Protection**: Multi-level document access control with expiration and usage limits
- **AES-256 Encryption**: Military-grade file encryption with integrity verification
- **Digital Watermarking**: Transparent watermark protection for document authenticity
- **Access Logging**: Complete audit trail for security monitoring and compliance
- **File Validation**: Comprehensive input sanitization and file type verification

## Technology Stack

### Backend
- **Framework**: Django 5.2.5 with Django REST Framework 3.15.2
- **Database**: SQLite (development), MySQL (production ready)
- **Image Processing**: Pillow 10.4.0, OpenCV 4.10.0.84, PyMuPDF 1.26.4
- **Document Processing**: PyPDF2 3.0.1, python-docx 1.1.2, docx2pdf 0.1.8
- **Media Processing**: yt-dlp 2024.8.6 with FFmpeg integration
- **QR Code**: qrcode[pil] 7.4.2, pyzbar 0.1.9
- **Security**: cryptography 43.0.0, pywin32 305.1, bcrypt hashing
- **Server**: Gunicorn 22.0.0, Whitenoise 6.7.0 for static files
- **API Security**: CORS headers, CSRF protection, rate limiting (100 req/hour)

### Frontend
- **Framework**: React 18.2.0
- **HTTP Client**: Axios 1.3.0
- **Routing**: React Router DOM 6.8.0
- **File Upload**: React Dropzone 14.2.3
- **Icons**: Lucide React 0.263.1
- **Animations**: AOS 2.3.4
- **Notifications**: React Toastify 9.1.1
- **Charts**: Recharts 3.1.2

## Installation

### Prerequisites
- **Python 3.9+** (3.11 recommended for best performance)
- **Node.js 16+** (18 LTS recommended)
- **Git** for version control

### Quick Start

1. **Clone Repository**
```bash
git clone https://github.com/Glenferdinza/Easy_Document.git
cd Easy_Document
```

2. **Backend Setup (Recommended: Virtual Environment)**
```bash
# Navigate to backend directory
cd backend

# Create virtual environment (HIGHLY RECOMMENDED)
python -m venv venv

# Activate virtual environment
# Windows PowerShell/CMD:
venv\Scripts\activate
# Windows Git Bash:
source venv/Scripts/activate
# Linux/Mac:
source venv/bin/activate

# Upgrade pip to latest version
python -m pip install --upgrade pip

# Install Python dependencies
pip install -r requirements.txt

# Set up environment variables (recommended for production)
copy .env.example .env     # Windows
# cp .env.example .env     # Linux/Mac
# Edit .env file with your settings

# Run database migrations
python manage.py migrate

# Create superuser (optional - for admin panel access)
python manage.py createsuperuser

# Start Django development server
python manage.py runserver 127.0.0.1:8000
```

**Why use Virtual Environment?**
- Isolates project dependencies from system Python
- Prevents version conflicts between projects
- Ensures consistent deployment environments
- Makes dependency management cleaner and more secure

3. **Frontend Setup**
```bash
# Open new terminal and navigate to frontend directory
cd frontend

# Install Node.js dependencies
npm install

# For Web Application (Development)
npm start

# For Desktop Application (Standalone)
npm run electron-standalone
```

4. **Access Application**

**Web Version:**
- Frontend Application: http://localhost:3000
- Backend API: http://localhost:8000/api/
- Django Admin Panel: http://localhost:8000/admin/

**Desktop Version:**
- Runs as standalone Electron app
- No browser required
- Portable and offline-capable for file processing

### Running Commands

#### Development Mode (Web Application)
```bash
# Terminal 1: Backend server (keep virtual environment activated)
cd backend
venv\Scripts\activate  # Windows
python manage.py runserver 127.0.0.1:8000

# Terminal 2: Frontend server
cd frontend
npm start
```

#### Desktop Application Mode
```bash
# Terminal 1: Backend server (required for processing)
cd backend
venv\Scripts\activate  # Windows
python manage.py runserver 127.0.0.1:8000

# Terminal 2: Desktop app
cd frontend
npm run electron-standalone
```

#### Production Deployment

**Web Application:**
```bash
# Backend with Gunicorn (recommended)
cd backend
venv\Scripts\activate  # Windows
pip install gunicorn
gunicorn compress_website.wsgi:application --bind 0.0.0.0:8000 --workers 4

# Frontend production build
cd frontend
npm run build
# Deploy build/ folder to your web server (nginx, apache, etc.)
```

**Desktop Application:**
```bash
# Build desktop executable
cd frontend
npm run build
npm run dist  # Creates installer in dist/ folder

# Or create portable version
npm run pack  # Creates unpacked app in dist/ folder
```

## Desktop Application

Easy Document can run as both a web application and a standalone desktop application using Electron.

### Quick Desktop Setup (Windows)
```batch
# One-command setup and launch
start-desktop-app.bat
```

### Quick Desktop Setup (Linux/Mac)
```bash
# Make scripts executable and run
chmod +x *.sh
./start-desktop-app.sh
```

### Manual Desktop Setup
```bash
# 1. Run setup script
setup-desktop.bat    # Windows
./setup-desktop.sh   # Linux/Mac

# 2. Start backend (Terminal 1)
run-backend.bat      # Windows
./run-backend.sh     # Linux/Mac

# 3. Start desktop app (Terminal 2)
run-desktop.bat      # Windows
./run-desktop.sh     # Linux/Mac
```

### Desktop vs Web Features
- **Desktop**: Standalone app, no browser needed, offline file processing
- **Web**: Browser-based, easier deployment, better for shared environments
- **Both**: Same features, same security, same performance

## Project Structure

```
Easy_Document/
├── backend/                    # Django backend application
│   ├── compress_website/       # Main Django project configuration
│   ├── compression/            # PDF and image compression module
│   ├── word_tools/             # Word document processing module
│   ├── youtube_converter/      # YouTube download and conversion module
│   ├── qr_tools/              # QR code generation and scanning module
│   ├── watermark_tools/       # Watermark application module
│   ├── security_center/       # Document security and encryption module
│   ├── image_processing/      # Image enhancement and processing module
│   ├── pdf_tools/             # PDF manipulation module
│   ├── manage.py              # Django management script
│   └── requirements.txt       # Python dependencies
├── frontend/                  # React frontend application
│   ├── public/               # Static assets and Electron configuration
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   ├── pages/           # Page components
│   │   ├── styles/          # CSS stylesheets
│   │   ├── utils/           # API utilities and helpers
│   │   └── App.js           # Main React component
│   ├── package.json         # Node.js dependencies and Electron config
│   └── build/               # Production build output
├── setup-desktop.*           # Desktop app setup scripts
├── run-backend.*             # Backend server scripts
├── run-desktop.*             # Desktop app launch scripts
├── start-desktop-app.*       # All-in-one launcher scripts
├── .gitignore               # Git ignore rules
├── CONTRIBUTING.md          # Contribution guidelines
└── README.md               # Project documentation
```

## API Documentation

### Document Processing Endpoints
```
POST /api/compress/pdf/                    # PDF compression (2-level system)
POST /api/compress/image/                  # Image compression with preview
POST /api/pdf-tools/merge/                 # PDF merge with drag-drop order
POST /api/pdf-tools/split/                 # PDF split into separate files
POST /api/word-tools/convert-to-pdf/       # Word to PDF conversion
POST /api/word-tools/merge-documents/      # Word document merging
```

### Image Processing Endpoints
```
POST /api/image-processing/remove-background/  # AI-powered background removal
POST /api/image-processing/enhance/            # 6-type image enhancement
POST /api/image-tools/to-pdf/                  # Multi-image to PDF conversion
```

### Media & Professional Tools
```
POST /api/youtube/convert/                     # YouTube video/audio conversion
POST /api/qr-tools/generate/text/              # QR code generation (text/URL/contact)
POST /api/qr-tools/read/                       # QR code scanning
POST /api/watermark/apply/                     # Watermark application (9 positions)
```

### Security Center Endpoints
```
POST /api/security/password-protect/          # Password protection with access controls
POST /api/security/encrypt/                   # AES-256 file encryption
POST /api/security/decrypt/                   # File decryption with integrity check
POST /api/security/watermark/                 # Digital watermarking
GET  /api/security/policies/                  # Available security policies
GET  /api/security/logs/                      # Access logs and audit trail
```

### Authentication & Rate Limiting
- Anonymous users: 100 requests per hour
- CSRF protection enabled for all POST requests
- CORS configured for cross-origin requests
- File size limits: 50MB per upload

## Configuration

### Environment Variables
Create `.env` file in backend directory for production:
```env
# Security Settings
DEBUG=False
SECRET_KEY=your-production-secret-key-minimum-50-characters-long
ALLOWED_HOSTS=your-domain.com,www.your-domain.com,localhost

# Database Configuration (MySQL example)
DB_NAME=easy_document
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=3306

# CORS Settings
CORS_ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com

# API Rate Limiting
THROTTLE_ANON_RATE=100/hour
THROTTLE_USER_RATE=1000/hour
```

### Security Configuration
The application includes comprehensive security features:
- CSRF protection with trusted origins
- CORS headers for cross-origin requests
- Rate limiting for API endpoints
- File validation and size limits
- Input sanitization and error handling
- Secure headers (HSTS, XSS protection, content type sniffing)
- Password hashing with bcrypt
- AES-256 encryption for sensitive documents

### Deployment Options

#### Traditional Server Deployment
```bash
# Backend with Gunicorn
cd backend
pip install gunicorn
gunicorn compress_website.wsgi:application --bind 0.0.0.0:8000 --workers 4

# Frontend served by web server (nginx/apache)
cd frontend
npm run build
# Copy build/ contents to web server document root
```

#### Docker Deployment
```bash
# Build and run containers
docker-compose up -d

# Or individually
docker build -t easy-document-backend ./backend
docker build -t easy-document-frontend ./frontend
```

## Troubleshooting

### Desktop Application Issues

**Problem: `npm run electron-standalone` shows Autofill errors**
```
Solution: These errors are cosmetic and can be ignored. The application works normally.
Error messages like "Autofill.enable wasn't found" do not affect functionality.
```

**Problem: Desktop app won't start**
```bash
# 1. Check if all dependencies are installed
cd frontend
npm install

# 2. Ensure backend is set up
cd backend
venv\Scripts\activate  # Windows
pip install -r requirements.txt

# 3. Try manual start
cd frontend
npx electron public/electron-standalone.js
```

**Problem: Backend server not starting**
```bash
# Check Python installation
python --version  # Should be 3.9+

# Check if virtual environment is activated
# Windows
venv\Scripts\activate

# Install/reinstall requirements
pip install -r requirements.txt

# Try running server manually
python manage.py runserver 127.0.0.1:8000
```

**Problem: Port conflicts**
```
The electron app automatically finds available ports.
If you need to use specific ports, check the electron-standalone.js configuration.
```

### Common Solutions
- **Virtual Environment**: Always use virtual environment for Python dependencies
- **Node Modules**: Delete `node_modules` and run `npm install` if packages are corrupted
- **Port Issues**: Close other applications using ports 8000-8010
- **Path Issues**: Ensure you're running commands from correct directories

## Developer

**Glenferdinza**
- GitHub: [@Glenferdinza](https://github.com/Glenferdinza)
- Email: glenferdinza@github.com

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/NewFeature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/NewFeature`)
5. Open a Pull Request

## Acknowledgements

- Django community for the excellent web framework
- React team for the powerful frontend library
- All open source libraries and contributors that made this project possible