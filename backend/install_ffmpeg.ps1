# FFmpeg Installation Script for Windows
# This script downloads and sets up FFmpeg for the YouTube converter

Write-Host "📦 Installing FFmpeg for YouTube Converter..." -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green

# Create ffmpeg directory in backend
$backendPath = "C:\Users\Lenovo\Downloads\Compress_Img\backend"
$ffmpegPath = "$backendPath\ffmpeg"

if (!(Test-Path $ffmpegPath)) {
    New-Item -ItemType Directory -Path $ffmpegPath -Force
    Write-Host "📁 Created ffmpeg directory: $ffmpegPath" -ForegroundColor Blue
}

# Download FFmpeg (portable version)
$ffmpegUrl = "https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-win64-gpl.zip"
$zipPath = "$ffmpegPath\ffmpeg.zip"

Write-Host "⬇️  Downloading FFmpeg..." -ForegroundColor Blue
try {
    Invoke-WebRequest -Uri $ffmpegUrl -OutFile $zipPath -UseBasicParsing
    Write-Host "✅ Download completed!" -ForegroundColor Green
} catch {
    Write-Host "❌ Download failed. Please download manually from: $ffmpegUrl" -ForegroundColor Red
    Write-Host "Extract to: $ffmpegPath" -ForegroundColor Yellow
    exit 1
}

# Extract FFmpeg
Write-Host "📦 Extracting FFmpeg..." -ForegroundColor Blue
try {
    Expand-Archive -Path $zipPath -DestinationPath $ffmpegPath -Force
    
    # Move files from extracted folder to ffmpeg directory
    $extractedFolder = Get-ChildItem -Path $ffmpegPath -Directory | Where-Object { $_.Name -like "*ffmpeg*" }
    if ($extractedFolder) {
        $binPath = "$($extractedFolder.FullName)\bin"
        if (Test-Path $binPath) {
            Copy-Item -Path "$binPath\*" -Destination $ffmpegPath -Force
            Write-Host "✅ FFmpeg extracted successfully!" -ForegroundColor Green
        }
    }
    
    # Clean up
    Remove-Item $zipPath -Force -ErrorAction SilentlyContinue
    if ($extractedFolder) {
        Remove-Item $extractedFolder.FullName -Recurse -Force -ErrorAction SilentlyContinue
    }
    
} catch {
    Write-Host "❌ Extraction failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Please extract manually to: $ffmpegPath" -ForegroundColor Yellow
}

# Verify installation
$ffmpegExe = "$ffmpegPath\ffmpeg.exe"
if (Test-Path $ffmpegExe) {
    Write-Host "🎉 FFmpeg installed successfully!" -ForegroundColor Green
    Write-Host "Location: $ffmpegExe" -ForegroundColor Cyan
    
    # Test FFmpeg
    try {
        & $ffmpegExe -version | Select-Object -First 3
        Write-Host "✅ FFmpeg is working!" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  FFmpeg installed but may not be working properly" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ FFmpeg installation failed" -ForegroundColor Red
}

Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Update Django settings to use this FFmpeg path"
Write-Host "2. Restart your Django server"
Write-Host "3. Test YouTube converter feature"
