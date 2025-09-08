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
    """Download YouTube video and convert to specified format with robust error handling"""
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
        
        # Base options for yt-dlp with improved compatibility
        base_opts = {
            'outtmpl': os.path.join(temp_dir, '%(title).50s.%(ext)s'),
            'restrictfilenames': True,
            'noplaylist': True,
            'no_warnings': False,
            'quiet': False,
            'extract_flat': False,
            'writethumbnail': False,
            'writeinfojson': False,
        }
        
        # Add FFmpeg path if available
        if ffmpeg_path:
            base_opts['ffmpeg_location'] = ffmpeg_path
        
        if format == 'mp3':
            # For MP3, extract audio with quality options
            ydl_opts = {
                **base_opts,
                'format': 'bestaudio/best',
                'postprocessors': [{
                    'key': 'FFmpegExtractAudio',
                    'preferredcodec': 'mp3',
                    'preferredquality': '192',
                }] if check_ffmpeg_available() else [],
            }
        else:  # mp4
            # For MP4, use more flexible format selection
            # Start with simple format and fallback to more complex ones
            format_selectors = [
                'best[ext=mp4]',
                'best[height<=1080]',
                'best',
                'worst'
            ]
            
            ydl_opts = {
                **base_opts,
                'format': format_selectors[0],
                'merge_output_format': 'mp4',
            }
        
        # Download video with retry mechanism and different strategies
        max_attempts = 4
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
                    time.sleep(1 + attempt)  # Progressive delay
                    
                    # Try with different format strategies on retry
                    if format == 'mp4':
                        if attempt == 1:
                            ydl_opts['format'] = 'best[height<=720]'
                        elif attempt == 2:
                            ydl_opts['format'] = 'best'
                        elif attempt == 3:
                            ydl_opts['format'] = 'worst'
                    else:  # mp3
                        if attempt == 1:
                            ydl_opts['format'] = 'bestaudio[ext=m4a]/bestaudio'
                        elif attempt == 2:
                            ydl_opts['format'] = 'bestaudio'
                        elif attempt == 3:
                            ydl_opts['format'] = 'worst'
                            # Remove postprocessors for last attempt
                            ydl_opts['postprocessors'] = []
                
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
