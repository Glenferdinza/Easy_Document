# FFmpeg Installation Guide

The YouTube converter feature requires FFmpeg to be installed on your system.

## Windows Installation

### Option 1: Using Chocolatey (Recommended)
1. Install Chocolatey from https://chocolatey.org/install
2. Run as Administrator: `choco install ffmpeg`

### Option 2: Manual Installation
1. Download FFmpeg from https://ffmpeg.org/download.html#build-windows
2. Extract to a folder (e.g., C:\ffmpeg)
3. Add C:\ffmpeg\bin to your PATH environment variable

### Option 3: Portable Version
1. Download from https://www.gyan.dev/ffmpeg/builds/
2. Extract and add to PATH

## macOS Installation

### Using Homebrew (Recommended)
```bash
brew install ffmpeg
```

### Using MacPorts
```bash
sudo port install ffmpeg
```

## Linux Installation

### Ubuntu/Debian
```bash
sudo apt update
sudo apt install ffmpeg
```

### CentOS/RHEL/Fedora
```bash
sudo yum install ffmpeg
# or
sudo dnf install ffmpeg
```

### Arch Linux
```bash
sudo pacman -S ffmpeg
```

## Verify Installation

After installation, verify by running:
```bash
ffmpeg -version
```

## Note for Development

If FFmpeg is not installed, the YouTube converter will show an error message.
All other features (Image and PDF compression) will work without FFmpeg.
