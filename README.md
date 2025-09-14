# Easy Document

[![GitHub repo](https://img.shields.io/badge/GitHub-Easy_Document-blue?style=flat&logo=github)](https://github.com/Glenferdinza/Easy_Document)
[![Python](https://img.shields.io/badge/Python-3.9+-blue?style=flat&logo=python)](https://python.org)
[![Django](https://img.shields.io/badge/Django-5.2+-green?style=flat&logo=django)](https://djangoproject.com)
[![React](https://img.shields.io/badge/React-18.2+-blue?style=flat&logo=react)](https://reactjs.org)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Description

Easy Document is a comprehensive full-stack document processing platform built with Django (Backend) and React (Frontend). The platform provides professional document processing tools with a modern, responsive interface and fully functional APIs. It offers various document manipulation features including PDF processing, image compression, Word document conversion, QR code generation, watermarking, YouTube media conversion, and document security features.

## Features

### Document Processing
- **PDF Compression**: Smart compression with quality control (up to 70% size reduction)
- **PDF Merge**: Combine multiple PDFs seamlessly with drag-and-drop ordering
- **PDF Split**: Split multi-page PDFs into separate files
- **Word to PDF**: Document conversion with preserved formatting
- **Word Document Merger**: Merge multiple Word documents to PDF/DOCX format

### Image Processing  
- **Image Compression**: Batch compression with quality preview (up to 60% reduction)
- **Background Removal**: AI-powered background remover
- **Image Enhancement**: 6 enhancement types (sharpen, denoise, upscale, color enhance, brightness, contrast)
- **Image to PDF**: Convert multiple images to single PDF document
- **Format Conversion**: Multi-format support (JPG, PNG, WebP)

### Professional Tools
- **QR Code Generator**: Text, URL, contact QR codes with built-in scanner
- **Watermark Tools**: Text and image watermarks with 9 positioning options
- **YouTube Converter**: Video/audio download and conversion (MP4/MP3)
- **Security Center**: Document encryption and password protection

## Technology Stack

### Backend
- **Framework**: Django 5.2.5
- **API**: Django REST Framework 3.15.2
- **Database**: SQLite (default), MySQL (optional)
- **Image Processing**: Pillow 10.4.0, OpenCV 4.10.0.84
- **Document Processing**: PyPDF2 3.0.1, python-docx 1.1.2, docx2pdf 0.1.8
- **Media Processing**: yt-dlp 2024.8.6
- **QR Code**: qrcode[pil] 7.4.2, pyzbar 0.1.9
- **Security**: cryptography 43.0.0, pywin32 305.1
- **Server**: Gunicorn 22.0.0, Whitenoise 6.7.0

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
- Python 3.9 or higher
- Node.js 16 or higher
- Git

### Steps

1. **Clone Repository**
```bash
git clone https://github.com/Glenferdinza/Easy_Document.git
cd Easy_Document
```

2. **Backend Setup**
```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Run database migrations
python manage.py migrate

# Start Django development server
python manage.py runserver 0.0.0.0:8000
```

3. **Frontend Setup**
```bash
# Open new terminal and navigate to frontend directory
cd frontend

# Install Node.js dependencies
npm install

# Start React development server
npm start
```

4. **Access Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api/
- Django Admin: http://localhost:8000/admin/

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
│   ├── public/               # Static assets and index.html
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   ├── pages/           # Page components
│   │   ├── styles/          # CSS stylesheets
│   │   ├── utils/           # API utilities and helpers
│   │   └── App.js           # Main React component
│   ├── package.json         # Node.js dependencies
│   └── build/               # Production build output
├── .gitignore               # Git ignore rules
└── README.md               # Project documentation
```

## API Documentation

### Document Processing Endpoints
```
POST /api/compress/pdf/              # PDF compression
POST /api/compress/image/            # Image compression
POST /api/pdf-tools/merge/           # PDF merge
POST /api/pdf-tools/split/           # PDF split
POST /api/word-tools/convert-to-pdf/ # Word to PDF conversion
POST /api/word-tools/merge-documents/ # Word document merging
```

### Image Processing Endpoints
```
POST /api/image-processing/remove-background/ # Background removal
POST /api/image-processing/enhance/           # Image enhancement
POST /api/image-tools/to-pdf/                 # Image to PDF conversion
```

### Professional Tools Endpoints
```
POST /api/qr-tools/generate/text/      # QR code generation
POST /api/qr-tools/read/               # QR code scanning
POST /api/watermark/apply/             # Watermark application
POST /api/youtube/convert/             # YouTube media conversion
POST /api/security/password-protect/   # Document password protection
```

## Deployment

### Production Setup
```bash
# Backend deployment with Gunicorn
pip install gunicorn
gunicorn compress_website.wsgi:application --bind 0.0.0.0:8000

# Frontend production build
npm run build
```

### Environment Configuration
Create `.env` file in backend directory:
```env
DEBUG=False
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=your-domain.com,localhost
DATABASE_URL=sqlite:///db.sqlite3
```

## Developer

**Glen Ferdinand**
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