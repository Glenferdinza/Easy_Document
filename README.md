# File Compression Website

A full-stack web application for compressing images, PDFs, and converting YouTube videos to MP3/MP4 format.

![Website Preview](https://via.placeholder.com/800x400/FF6B6B/FFFFFF?text=FileCompress+Website)

## ✨ Features

- 🖼️ **Image Compression**: Compress JPG, PNG, WebP images with quality control
- 📄 **PDF Compression**: Reduce PDF file sizes with multiple compression levels
- 🎥 **YouTube Converter**: Convert YouTube videos to MP3/MP4 with quality selection
- 📱 **Responsive Design**: Works perfectly on all devices
- ✨ **AOS Animations**: Smooth scroll animations for better UX
- 🔒 **Secure**: Protected against SQL injection, XSS, and other vulnerabilities
- ⚡ **Fast Processing**: Optimized compression algorithms
- 📊 **History Tracking**: View your recent compressions and conversions

## 🎨 Design

- **Color Scheme**: Soft white and red theme for comfortable viewing
- **Interactive UI**: Smooth animations and hover effects
- **Modern Design**: Clean, professional interface
- **Mobile-First**: Responsive design for all screen sizes

## 🚀 Tech Stack

### Backend
- **Django 4.2**: Web framework
- **Django REST Framework**: API development
- **MySQL**: Primary database
- **Pillow**: Image processing
- **PyPDF2**: PDF processing
- **yt-dlp**: YouTube video downloading
- **Redis**: Caching and background tasks

### Frontend
- **React 18**: Frontend framework
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **AOS**: Animate On Scroll library
- **React Dropzone**: File upload component
- **React Toastify**: Notifications

### Deployment
- **Azure App Service**: Backend hosting
- **Azure Static Web Apps**: Frontend hosting
- **Azure Database for MySQL**: Production database
- **Docker**: Containerization
- **GitHub Actions**: CI/CD pipeline

## 📦 Quick Local Development Setup

### Prerequisites
- **Python 3.8+** (Download from [python.org](https://python.org))
- **Node.js 16+** (Download from [nodejs.org](https://nodejs.org))
- **FFmpeg** (Optional, for YouTube converter - see [FFMPEG_INSTALL.md](FFMPEG_INSTALL.md))

### 🚀 One-Click Setup

**Windows:**
```bash
# Clone repository
git clone https://github.com/Glenferdinza/Tugas-Proyek-Akhir-Dicoding.git
cd Tugas-Proyek-Akhir-Dicoding

# Run setup (installs everything automatically)
setup.bat

# Start development servers
start-dev.bat
```

**macOS/Linux:**
```bash
# Clone repository
git clone https://github.com/Glenferdinza/Tugas-Proyek-Akhir-Dicoding.git
cd Tugas-Proyek-Akhir-Dicoding

# Make scripts executable
chmod +x setup.sh

# Run setup
./setup.sh

# Start servers manually:
# Terminal 1 - Backend
cd backend && source venv/bin/activate && python manage.py runserver

# Terminal 2 - Frontend  
cd frontend && npm start
```

### 🌐 Access Your Local Website
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000/api  
- **Admin Panel:** http://localhost:8000/admin
- **Login:** admin / admin123

### 🧪 Test Your Setup
```bash
# Optional: Test if everything works
test-setup.bat  # Windows only
```

### 💡 Development Notes
- Uses **SQLite** database for development (easy setup)
- **MySQL** supported for production deployment
- **Environment variables** are pre-configured in `.env` files
- **CORS** is enabled for localhost development
- **Hot reloading** enabled for both frontend and backend

### Manual Setup

#### Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup database (SQLite for dev, MySQL for production)
python manage.py makemigrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

#### For MySQL Production Setup
```bash
# Install MySQL client
pip install mysqlclient

# Update .env with MySQL credentials
cp .env.example .env
# Edit .env with your MySQL settings

# Run setup script
./deploy_setup.sh  # Linux/Mac
# OR
./deploy_setup.ps1  # Windows
```

#### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

## 🌐 Production Deployment

### Azure Deployment

1. **Set up Azure resources:**
   - Azure App Service for backend
   - Azure Static Web Apps for frontend
   - Azure Database for MySQL
   - Azure Storage Account (optional)

2. **Configure environment variables:**
```bash
# Backend (.env)
SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=your-domain.com
AZURE_MYSQL_HOST=your-mysql-server.mysql.database.azure.com
AZURE_MYSQL_NAME=compress_db
AZURE_MYSQL_USER=your-username
AZURE_MYSQL_PASSWORD=your-password
```

3. **Deploy using GitHub Actions:**
   - Set up secrets in GitHub repository
   - Push to main branch to trigger deployment

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or build individually
docker build -t compress-backend ./backend
docker build -t compress-frontend ./frontend
```

## 📱 Usage

### Image Compression
1. Navigate to the Image Compression page
2. Drag and drop or select images
3. Adjust quality settings (10-95%)
4. Click "Compress All" to process
5. Download individual files or all at once

### PDF Compression
1. Go to the PDF Compression page
2. Upload PDF files
3. Choose compression level (Low/Medium/High)
4. Process and download compressed files

### YouTube Converter
1. Visit the YouTube Converter page
2. Paste a YouTube URL
3. Click "Get Info" to fetch video details
4. Select format (MP3 or MP4) and quality
5. Download the converted file

## 🛠️ API Endpoints

### Compression API
```
POST /api/compress/image/     # Compress images
POST /api/compress/pdf/       # Compress PDFs
GET  /api/compress/history/   # Get compression history
```

### YouTube API
```
POST /api/youtube/info/       # Get video information
POST /api/youtube/convert/    # Convert and download
GET  /api/youtube/history/    # Get conversion history
```

## 🔧 Configuration

### Environment Variables

**Backend (.env):**
```
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
AZURE_MYSQL_HOST=localhost
AZURE_MYSQL_NAME=compress_db
AZURE_MYSQL_USER=root
AZURE_MYSQL_PASSWORD=password
CORS_ORIGINS=http://localhost:3000
REDIS_URL=redis://localhost:6379/0
```

**Frontend (.env.local):**
```
REACT_APP_API_URL=http://localhost:8000/api
```

### Security Features

- **CSRF Protection**: Django CSRF middleware
- **CORS Configuration**: Restricted to allowed origins
- **Input Validation**: File type and size validation
- **SQL Injection Prevention**: Django ORM usage
- **XSS Protection**: Content Security Policy headers
- **File Upload Security**: Sanitized file handling

## 📊 Performance Features

- **File Size Limits**: 50MB for images, 100MB for PDFs
- **Compression Ratios**: Up to 80% size reduction
- **Background Processing**: Redis for queued tasks
- **Caching**: Optimized API responses
- **CDN Ready**: Static file optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Glen Ferdinand**
- GitHub: [@Glenferdinza](https://github.com/Glenferdinza)
- Instagram: [@g.syaaaa](https://instagram.com/g.syaaaa)

## 🙏 Acknowledgments

- [Django](https://djangoproject.com/) - Web framework
- [React](https://reactjs.org/) - Frontend library
- [AOS](https://michalsnik.github.io/aos/) - Animation library
- [yt-dlp](https://github.com/yt-dlp/yt-dlp) - YouTube downloader
- [Pillow](https://pillow.readthedocs.io/) - Image processing

## 📈 Future Enhancements

- [ ] Batch processing for multiple files
- [ ] Cloud storage integration
- [ ] User authentication and profiles
- [ ] API rate limiting
- [ ] Advanced compression algorithms
- [ ] Video compression support
- [ ] Mobile app development

---

⭐ If you find this project helpful, please give it a star!

## 🐛 Bug Reports & 💡 Feature Requests

Please use the [GitHub Issues](https://github.com/Glenferdinza/Tugas-Proyek-Akhir-Dicoding/issues) page to report bugs or request features.
