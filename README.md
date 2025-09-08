# Compresso - Advanced File Processing Platform

A comprehensive full-stack web application for file processing, conversion, and manipulation. Built with Django REST API backend and React frontend, featuring multiple document processing tools with a modern pink-themed interface.

## Features Overview

### Core File Processing
- **Image Compression & Enhancement**: Multi-level compression with AI-powered enhancement tools
- **PDF Processing Suite**: Compress, merge, split, convert PDF documents
- **YouTube Media Converter**: High-quality video and audio downloads
- **Word Document Tools**: Convert Word to PDF and merge multiple documents
- **Universal File Converter**: Support for multiple document format conversions

### Advanced Tools
- **Document Watermarking**: Add custom text watermarks with adjustable opacity and positioning
- **QR Code Generator & Reader**: Create QR codes for text, URLs, contacts, and read existing codes
- **Metadata Editor & Privacy Cleaner**: Edit file metadata and remove sensitive information
- **Audio Document Processor**: Audio transcription, text-to-speech, and audio format conversion
- **Background Removal**: AI-powered image background removal

### Technical Features
- **Responsive Design**: Modern pink gradient theme optimized for all devices
- **Custom SVG Icons**: Hand-crafted icon library replacing emoji usage
- **Real-time Processing**: Background job processing with status tracking
- **Batch Operations**: Process multiple files simultaneously
- **Secure File Handling**: Temporary file management with automatic cleanup

## Technology Stack

### Backend
- **Django 5.0.8**: Web framework with REST API
- **MySQL**: Primary database for production
- **Pillow & OpenCV**: Image processing libraries
- **python-docx & docx2pdf**: Word document processing
- **qrcode & pyzbar**: QR code generation and reading
- **SpeechRecognition & gTTS**: Audio processing capabilities
- **PyPDF2 & reportlab**: PDF manipulation tools

### Frontend
- **React 18**: Modern frontend with hooks
- **Custom Component Library**: Reusable UI components
- **CSS3 Gradients**: Pink theme implementation
- **AOS Animations**: Smooth scroll animations
- **React Router**: Client-side routing

### Development Tools
- **Django REST Framework**: API development
- **CORS Support**: Cross-origin request handling
- **Environment Configuration**: Development and production settings
- **Error Handling**: Comprehensive error management

## Quick Setup

### Prerequisites
- Python 3.8 or higher
- Node.js 16 or higher
- MySQL Server (for production)

### Installation

1. **Clone Repository**
```bash
git clone https://github.com/Glenferdinza/composser_compress-convert-file.git
cd composser_compress-convert-file
```

2. **Backend Setup**
```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Database setup
python manage.py makemigrations
python manage.py migrate

# Create admin user
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

3. **Frontend Setup**
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

4. **Access Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api
- Admin Panel: http://localhost:8000/admin

## Database Configuration

### Development (SQLite)
Default configuration uses SQLite for easy development setup.

### Production (MySQL)
Update environment variables:
```bash
DB_NAME=compress_website
DB_USER=your_username
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=3306
```

## API Documentation

### Image Processing
```
POST /api/image-tools/compress/        # Compress images
POST /api/image-tools/background-remove/  # Remove backgrounds
POST /api/image-processing/enhance/    # Enhance images
```

### Document Processing
```
POST /api/pdf-tools/compress/          # Compress PDFs
POST /api/pdf-tools/merge/             # Merge PDFs
POST /api/word-tools/convert-to-pdf/   # Word to PDF
POST /api/word-tools/merge-documents/  # Merge Word docs
```

### Watermarking
```
POST /api/watermark-tools/add-text/    # Add text watermark
POST /api/watermark-tools/remove/      # Remove watermark
```

### QR Code Tools
```
POST /api/qr-tools/generate/           # Generate QR codes
POST /api/qr-tools/read/               # Read QR codes
POST /api/qr-tools/batch-generate/     # Batch QR generation
```

### Audio Processing
```
POST /api/audio-tools/transcribe/      # Audio to text
POST /api/audio-tools/text-to-speech/ # Text to speech
POST /api/audio-tools/convert/         # Audio format conversion
```

## File Processing Capabilities

### Supported Input Formats
- **Images**: JPG, PNG, WebP, GIF, BMP, TIFF
- **Documents**: PDF, DOC, DOCX, TXT, RTF
- **Audio**: MP3, WAV, M4A, OGG, FLAC
- **Spreadsheets**: XLS, XLSX, CSV
- **Archives**: ZIP (for batch processing)

### Output Options
- **Images**: Compressed images in original or converted formats
- **Documents**: PDF, Word, TXT formats
- **QR Codes**: PNG, JPG, SVG formats
- **Audio**: MP3, WAV, text transcriptions

## Security Features

- **File Validation**: Type and size restrictions
- **Temporary Storage**: Automatic file cleanup
- **CSRF Protection**: Django security middleware
- **Input Sanitization**: Comprehensive data validation
- **Rate Limiting**: API request throttling
- **Privacy Mode**: Metadata removal capabilities

## Production Deployment

### Environment Setup
```bash
# Production environment variables
SECRET_KEY=your-production-secret-key
DEBUG=False
ALLOWED_HOSTS=yourdomain.com
DB_NAME=compress_website_prod
DB_USER=prod_user
DB_PASSWORD=secure_password
DB_HOST=your-mysql-server
```

### Static Files
```bash
# Collect static files for production
python manage.py collectstatic

# Build frontend for production
cd frontend && npm run build
```

## Performance Optimization

- **File Size Limits**: 50MB for most file types
- **Compression Algorithms**: Multiple quality levels
- **Background Processing**: Non-blocking file operations
- **Caching**: Optimized response times
- **CDN Ready**: Static asset optimization

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit pull request

## Development Guidelines

- Follow Django best practices for backend development
- Use React hooks for frontend components
- Maintain consistent pink theme across all components
- Create custom SVG icons instead of using emojis
- Write comprehensive tests for new features
- Document API endpoints and component props

## License

This project is licensed under the MIT License. See LICENSE file for details.

## Author

**Glen Ferdinand**
- GitHub: [@Glenferdinza](https://github.com/Glenferdinza)
- Project Repository: [composser_compress-convert-file](https://github.com/Glenferdinza/composser_compress-convert-file)

## Acknowledgments

- Django and React communities for excellent documentation
- Open source libraries that power this application
- Contributors who help improve the codebase

---

For support, bug reports, or feature requests, please create an issue on GitHub.
