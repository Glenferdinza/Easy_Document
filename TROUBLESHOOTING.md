# Troubleshooting Guide

## Common Issues and Solutions

### 1. Python "not found" or "not recognized"
**Solution:**
- Make sure Python is installed from [python.org](https://python.org)
- During installation, check "Add Python to PATH"
- Restart your terminal/command prompt
- Test: `python --version`

### 2. Node.js/npm "not found" or "not recognized"
**Solution:**
- Install Node.js from [nodejs.org](https://nodejs.org)
- Restart your terminal/command prompt
- Test: `node --version` and `npm --version`

### 3. Virtual environment activation fails
**Windows:**
```bash
# If activation fails, try:
cd backend
python -m venv venv --clear
venv\Scripts\activate.bat
```

**macOS/Linux:**
```bash
# If activation fails, try:
cd backend
python3 -m venv venv --clear
source venv/bin/activate
```

### 4. Permission denied (setup.sh)
```bash
chmod +x setup.sh
./setup.sh
```

### 5. Port already in use
**Error:** "Port 3000/8000 is already in use"

**Solution:**
- Kill existing processes:
  - Windows: `taskkill /f /im python.exe` and `taskkill /f /im node.exe`
  - macOS/Linux: `pkill -f python` and `pkill -f node`
- Or use different ports:
  - Backend: `python manage.py runserver 8001`
  - Frontend: `npm start` (will prompt for different port)

### 6. Module not found errors
**Solution:**
```bash
cd backend
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
```

### 7. Database migration errors
**Solution:**
```bash
cd backend
venv\Scripts\activate  # Windows
python manage.py makemigrations --empty compression
python manage.py makemigrations --empty youtube_converter
python manage.py migrate
```

### 8. YouTube converter not working
**Cause:** FFmpeg not installed

**Solution:** See [FFMPEG_INSTALL.md](FFMPEG_INSTALL.md) for installation instructions

### 9. CORS errors in browser
**Solution:**
- Make sure both servers are running
- Check that frontend is accessing `http://localhost:8000/api`
- Clear browser cache

### 10. React build fails
**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json  # Delete
npm install  # Reinstall
```

### 11. Django admin login fails
**Solution:**
Create a new superuser:
```bash
cd backend
venv\Scripts\activate
python manage.py createsuperuser
```

### 12. File upload not working
**Check:**
- File size limits (50MB for images, 100MB for PDFs)
- File formats (JPG, PNG, WebP for images; PDF for documents)
- Browser console for error messages

## Getting Help

If you're still having issues:

1. **Check the terminal/console output** for specific error messages
2. **Look at browser developer tools** (F12) for frontend errors
3. **Verify all prerequisites** are installed and working
4. **Try the test script:** `test-setup.bat` (Windows)

## Contact

- GitHub Issues: [Create an issue](https://github.com/Glenferdinza/Tugas-Proyek-Akhir-Dicoding/issues)
- Email: glen@example.com (replace with actual email)
