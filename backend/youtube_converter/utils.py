import os
import tempfile
import yt_dlp
from datetime import timedelta
import shutil
import subprocess
from django.conf import settings

def get_ffmpeg_path():
    """Get FFmpeg executable path"""
    # Try local FFmpeg first (for development)
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    local_ffmpeg = os.path.join(base_dir, 'ffmpeg', 'ffmpeg-master-latest-win64-gpl', 'bin', 'ffmpeg.exe')
    
    if os.path.exists(local_ffmpeg):
        return local_ffmpeg
    
    # Try system PATH
    try:
        subprocess.run(['ffmpeg', '-version'], capture_output=True, check=True, timeout=5)
        return 'ffmpeg'
    except (subprocess.CalledProcessError, FileNotFoundError, subprocess.TimeoutExpired):
        return None

def check_ffmpeg_available():
    """Check if FFmpeg is available"""
    ffmpeg_path = get_ffmpeg_path()
    if ffmpeg_path:
        try:
            subprocess.run([ffmpeg_path, '-version'], capture_output=True, check=True, timeout=10)
            return True
        except (subprocess.CalledProcessError, FileNotFoundError, subprocess.TimeoutExpired):
            pass
    return False

def download_youtube_video(url, format='mp4', quality='720p'):
    """Download YouTube video and convert to specified format"""
    temp_dir = None
    try:
        # Create temporary directory
        temp_dir = tempfile.mkdtemp()
        
        # Get FFmpeg path
        ffmpeg_path = get_ffmpeg_path()
        ffprobe_path = None
        if ffmpeg_path and ffmpeg_path != 'ffmpeg':
            # If using local FFmpeg, also set ffprobe path
            ffprobe_path = ffmpeg_path.replace('ffmpeg.exe', 'ffprobe.exe')
        
        # Simplified base options for yt-dlp to avoid format issues
        base_opts = {
            'outtmpl': os.path.join(temp_dir, '%(title).50s.%(ext)s'),
            'restrictfilenames': True,
            'noplaylist': True,
            'no_warnings': True,
            'quiet': False,  # Enable logging for debugging
        }
        
        # Add FFmpeg path if available
        if ffmpeg_path:
            base_opts['ffmpeg_location'] = ffmpeg_path
        
        if format == 'mp3':
            # For MP3, use simple audio format selection
            ydl_opts = {
                **base_opts,
                'format': 'bestaudio',  # Simple format selector
                'postprocessors': [{
                    'key': 'FFmpegExtractAudio',
                    'preferredcodec': 'mp3',
                    'preferredquality': '192',
                }] if check_ffmpeg_available() else [],
            }
        else:  # mp4
            # Use the simplest format selection for maximum compatibility
            ydl_opts = {
                **base_opts,
                'format': 'best',  # Let yt-dlp choose the best available format
            }
        
        # Download video with retry mechanism
        max_attempts = 3
        last_error = None
        
        for attempt in range(max_attempts):
            try:
                with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                    # Get video info first
                    info = ydl.extract_info(url, download=False)
                    title = info.get('title', 'Unknown')[:50]  # Limit title length
                    duration = info.get('duration', 0)
                    
                    # Download the video
                    ydl.download([url])
                    
                    # Find the downloaded file
                    downloaded_file = None
                    for filename in os.listdir(temp_dir):
                        file_path = os.path.join(temp_dir, filename)
                        if os.path.isfile(file_path):
                            downloaded_file = file_path
                            break
                    
                    if not downloaded_file:
                        raise Exception("No file was downloaded")
                    
                    # Get file info
                    file_size = os.path.getsize(downloaded_file)
                    original_filename = os.path.basename(downloaded_file)
                    
                    # For MP3 without FFmpeg, rename audio file
                    if format == 'mp3' and not check_ffmpeg_available():
                        # Rename to .mp3 extension
                        mp3_filename = os.path.splitext(original_filename)[0] + '.mp3'
                        mp3_path = os.path.join(temp_dir, mp3_filename)
                        shutil.move(downloaded_file, mp3_path)
                        downloaded_file = mp3_path
                        original_filename = mp3_filename
                    
                    # Clean filename for download
                    safe_title = "".join(c for c in title if c.isalnum() or c in (' ', '-', '_')).rstrip()
                    if format == 'mp3':
                        final_filename = f"{safe_title}.mp3"
                    else:
                        final_filename = f"{safe_title}.mp4"
                    
                    return {
                        'file_path': downloaded_file,
                        'title': title,
                        'duration': timedelta(seconds=duration) if duration else None,
                        'file_size': file_size,
                        'filename': final_filename
                    }
                    
            except Exception as e:
                last_error = e
                if attempt < max_attempts - 1:
                    # Wait before retry
                    import time
                    time.sleep(2 ** attempt)  # Exponential backoff
                    
                    # Try with different options on retry
                    if attempt == 1:
                        # Try with different format selector
                        if format == 'mp4':
                            ydl_opts['format'] = 'best[ext=mp4]/best'
                        else:
                            ydl_opts['format'] = 'bestaudio'
                    elif attempt == 2:
                        # Last resort - try any format
                        ydl_opts['format'] = 'best'
                        # Remove some headers that might cause issues
                        ydl_opts.pop('user_agent', None)
                        ydl_opts.pop('referer', None)
                
        # If all attempts failed
        if last_error:
            raise Exception(f"YouTube download failed after {max_attempts} attempts: {str(last_error)}")
        
    except Exception as e:
        # Clean up temp directory on error
        try:
            if temp_dir and os.path.exists(temp_dir):
                shutil.rmtree(temp_dir)
        except:
            pass
        raise Exception(f"YouTube download failed: {str(e)}")

def validate_youtube_url(url):
    """Validate if URL is a valid YouTube URL"""
    if not url:
        return False
    
    youtube_patterns = [
        'youtube.com/watch',
        'youtube.com/v/',
        'youtube.com/embed/',
        'youtu.be/',
        'm.youtube.com/watch',
        'www.youtube.com/watch'
    ]
    return any(pattern in url.lower() for pattern in youtube_patterns)

def get_video_info(url):
    """Get video information without downloading"""
    try:
        ydl_opts = {
            'quiet': True,
            'no_warnings': True,
            'extract_flat': False,
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            
            # Format duration
            duration = info.get('duration', 0)
            duration_str = str(timedelta(seconds=duration)) if duration else "Unknown"
            
            return {
                'title': info.get('title', 'Unknown'),
                'duration': duration,
                'duration_string': duration_str,
                'thumbnail': info.get('thumbnail', ''),
                'uploader': info.get('uploader', 'Unknown'),
                'view_count': info.get('view_count', 0),
                'upload_date': info.get('upload_date', ''),
            }
    except Exception as e:
        print(f"Error getting video info: {str(e)}")
        return None
