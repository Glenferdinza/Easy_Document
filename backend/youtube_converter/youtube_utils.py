import os
import tempfile
import re
import yt_dlp
from datetime import timedelta

def validate_youtube_url(url):
    """Validate if the URL is a valid YouTube URL"""
    youtube_regex = re.compile(
        r'(https?://)?(www\.)?(youtube\.com/watch\?v=|youtu\.be/|youtube\.com/embed/|youtube\.com/v/)'
    )
    return bool(youtube_regex.search(url))

def get_video_info(url):
    """Get video information without downloading"""
    try:
        ydl_opts = {
            'quiet': True,
            'no_warnings': True,
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            
            return {
                'title': info.get('title', 'Unknown'),
                'uploader': info.get('uploader', 'Unknown'),
                'duration': info.get('duration', 0),
                'view_count': info.get('view_count', 0),
                'thumbnail': info.get('thumbnail', ''),
                'description': info.get('description', '')[:200] + '...' if info.get('description') else ''
            }
    except Exception as e:
        raise Exception(f"Failed to get video info: {str(e)}")

def download_youtube_video(url, format_type, quality='720p'):
    """Download YouTube video in specified format"""
    try:
        # Create temporary directory
        temp_dir = tempfile.mkdtemp()
        
        if format_type == 'mp3':
            ydl_opts = {
                'format': 'bestaudio/best',
                'outtmpl': os.path.join(temp_dir, '%(title)s.%(ext)s'),
                'postprocessors': [{
                    'key': 'FFmpegExtractAudio',
                    'preferredcodec': 'mp3',
                    'preferredquality': '192',
                }],
                'quiet': True,
                'no_warnings': True,
            }
        else:  # mp4
            # Map quality to format selector
            quality_map = {
                '480p': 'best[height<=480]',
                '720p': 'best[height<=720]',
                '1080p': 'best[height<=1080]'
            }
            
            ydl_opts = {
                'format': quality_map.get(quality, 'best[height<=720]'),
                'outtmpl': os.path.join(temp_dir, '%(title)s.%(ext)s'),
                'quiet': True,
                'no_warnings': True,
            }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            # Extract info first to get metadata
            info = ydl.extract_info(url, download=False)
            title = info.get('title', 'Unknown')
            duration = info.get('duration', 0)
            
            # Download the video
            ydl.download([url])
            
            # Find the downloaded file
            downloaded_files = os.listdir(temp_dir)
            if not downloaded_files:
                raise Exception("No file was downloaded")
            
            file_path = os.path.join(temp_dir, downloaded_files[0])
            file_size = os.path.getsize(file_path)
            
            # Clean filename for download
            clean_title = re.sub(r'[^a-zA-Z0-9_\-]', '_', title)
            filename = f"{clean_title}.{format_type}"
            
            return {
                'file_path': file_path,
                'filename': filename,
                'title': title,
                'file_size': file_size,
                'duration': timedelta(seconds=duration) if duration else None
            }
            
    except Exception as e:
        raise Exception(f"Download failed: {str(e)}")

def cleanup_temp_file(file_path):
    """Clean up temporary files"""
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            # Also remove the parent directory if it's a temp directory
            parent_dir = os.path.dirname(file_path)
            if 'tmp' in parent_dir:
                import shutil
                shutil.rmtree(parent_dir, ignore_errors=True)
    except Exception:
        pass  # Ignore cleanup errors
