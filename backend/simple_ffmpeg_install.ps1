Write-Host "Installing FFmpeg..."
$ffmpegPath = "C:\Users\Lenovo\Downloads\Compress_Img\backend\ffmpeg"
New-Item -ItemType Directory -Path $ffmpegPath -Force
Write-Host "Created directory: $ffmpegPath"

$url = "https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-win64-gpl.zip"
$zipFile = "$ffmpegPath\ffmpeg.zip"

Write-Host "Downloading FFmpeg..."
try {
    Invoke-WebRequest -Uri $url -OutFile $zipFile
    Write-Host "Download completed"
} catch {
    Write-Host "Download failed: $_"
    exit 1
}

Write-Host "Extracting..."
try {
    Expand-Archive -Path $zipFile -DestinationPath $ffmpegPath -Force
    Write-Host "Extraction completed"
} catch {
    Write-Host "Extraction failed: $_"
    exit 1
}

Write-Host "FFmpeg installation completed!"
