import os
import tempfile
import re
import yt_dlp
from datetime import timedelta

def get_ffmpeg_path():
    """Get FFmpeg path from the project directory"""
    try:
        # Check project's FFmpeg installation
        project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        ffmpeg_paths = [
            os.path.join(project_root, 'ffmpeg', 'ffmpeg-master-latest-win64-gpl', 'bin', 'ffmpeg.exe'),
            os.path.join(project_root, 'ffmpeg_local_backup', 'ffmpeg-master-latest-win64-gpl', 'bin', 'ffmpeg.exe'),
        ]
        
        for path in ffmpeg_paths:
            if os.path.exists(path):
                return path
                
        # Check system PATH
        import shutil
        system_ffmpeg = shutil.which('ffmpeg')
        if system_ffmpeg:
            return system_ffmpeg
            
        return None
    except:
        return None

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
            
            if not info:
                raise Exception("Could not extract video information")
            
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
    """Download YouTube video with optimized quality and robust error handling"""
    temp_dir = None
    try:
        # Create temporary directory
        temp_dir = tempfile.mkdtemp()
        
        # Get FFmpeg path
        ffmpeg_path = get_ffmpeg_path()
        
        if format_type == 'mp3':
            # Enhanced MP3 download with better quality options
            audio_quality = '320' if quality == 'high' else '192' if quality == 'medium' else '128'
            
            if ffmpeg_path:
                # Use FFmpeg for MP3 conversion
                ydl_opts = {
                    'format': 'bestaudio[ext=m4a]/bestaudio[ext=mp3]/bestaudio/best',
                    'outtmpl': os.path.join(temp_dir, '%(title)s.%(ext)s'),
                    'postprocessors': [{
                        'key': 'FFmpegExtractAudio',
                        'preferredcodec': 'mp3',
                        'preferredquality': audio_quality,
                        'nopostoverwrites': False,
                    }],
                    'ffmpeg_location': os.path.dirname(ffmpeg_path),
                    'prefer_ffmpeg': True,
                    'keepvideo': False,
                    'quiet': True,
                    'no_warnings': True,
                    'extract_flat': False,
                    'writethumbnail': False,
                    'writeinfojson': False,
                }
            else:
                # Fallback: Download best audio format available (might be m4a/webm)
                ydl_opts = {
                    'format': 'bestaudio/best',
                    'outtmpl': os.path.join(temp_dir, '%(title)s.%(ext)s'),
                    'quiet': True,
                    'no_warnings': True,
                    'extract_flat': False,
                    'writethumbnail': False,
                    'writeinfojson': False,
                }
                print("Warning: FFmpeg not found, downloading audio in original format")
        else:  # mp4
            # Advanced format selection with quality priorities
            quality_formats = {
                '2160p': [
                    'best[height<=2160][ext=mp4][vcodec^=avc1]',
                    'best[height<=2160][ext=mp4]',
                    'best[height<=2160]',
                    'best[ext=mp4]',
                    'best'
                ],
                '1440p': [
                    'best[height<=1440][ext=mp4][vcodec^=avc1]',
                    'best[height<=1440][ext=mp4]',
                    'best[height<=1440]',
                    'best[ext=mp4]',
                    'best'
                ],
                '1080p': [
                    'best[height<=1080][ext=mp4][vcodec^=avc1]',
                    'best[height<=1080][ext=mp4]',
                    'best[height<=1080]',
                    'best[ext=mp4]',
                    'best'
                ],
                '720p': [
                    'best[height<=720][ext=mp4][vcodec^=avc1]',
                    'best[height<=720][ext=mp4]',
                    'best[height<=720]',
                    'best[ext=mp4]',
                    'best'
                ],
                '480p': [
                    'best[height<=480][ext=mp4][vcodec^=avc1]',     
                    'best[height<=480][ext=mp4]',
                    'best[height<=480]',
                    'best[ext=mp4]',
                    'best'
                ],
                '360p': [
                    'best[height<=360][ext=mp4]',
                    'best[height<=360]',
                    'worst[ext=mp4]',
                    'worst'
                ]
            }
            
            # Get format list for the requested quality
            format_list = quality_formats.get(quality, quality_formats['720p'])
            format_selector = '/'.join(format_list)
            
            ydl_opts = {
                'format': format_selector,
                'outtmpl': os.path.join(temp_dir, '%(title)s.%(ext)s'),
                'merge_output_format': 'mp4',
                'writeinfojson': False,
                'writesubtitles': False,
                'writeautomaticsub': False,
                'writethumbnail': False,
                'prefer_ffmpeg': True,
                'quiet': True,
                'no_warnings': True,
                'extract_flat': False,
                'ignoreerrors': False,
                'retries': 3,
                'fragment_retries': 3,
                'skip_unavailable_fragments': True,
            }
        
        # Multiple download attempts with different strategies
        download_attempts = [
            ydl_opts,  # Primary attempt
            {**ydl_opts, 'format': 'best/worst', 'quiet': False},  # Fallback 1
            {**ydl_opts, 'format': 'worst', 'quiet': False},       # Fallback 2 (any quality)
        ]
        
        downloaded_file = None
        title = 'Unknown'
        duration = 0
        
        for attempt_num, opts in enumerate(download_attempts):
            try:
                with yt_dlp.YoutubeDL(opts) as ydl:
                    # Extract info first
                    info = ydl.extract_info(url, download=False)
                    if not info:
                        continue
                        
                    title = info.get('title', 'Unknown')
                    duration = info.get('duration', 0)
                    
                    # Validate video availability
                    if info.get('availability') == 'private':
                        raise Exception("Video is private")
                    if info.get('availability') == 'premium_only':
                        raise Exception("Video requires premium access")
                    
                    # Download with current options
                    ydl.download([url])
                    
                    # Check if download was successful
                    downloaded_files = [f for f in os.listdir(temp_dir) if not f.startswith('.')]
                    if downloaded_files:
                        downloaded_file = os.path.join(temp_dir, downloaded_files[0])
                        if os.path.getsize(downloaded_file) > 1024:  # At least 1KB
                            break
                            
            except Exception as e:
                if attempt_num == len(download_attempts) - 1:
                    # Last attempt failed
                    error_msg = str(e)
                    if 'Private video' in error_msg:
                        raise Exception("This video is private and cannot be downloaded")
                    elif 'Video unavailable' in error_msg:
                        raise Exception("This video is not available")
                    elif 'Sign in to confirm your age' in error_msg:
                        raise Exception("Age-restricted video cannot be downloaded")
                    else:
                        raise Exception(f"Download failed: {error_msg}")
                continue
        
        if not downloaded_file or not os.path.exists(downloaded_file):
            raise Exception("No file was downloaded successfully")
        
        file_size = os.path.getsize(downloaded_file)
        if file_size < 1024:  # Less than 1KB indicates failure
            raise Exception("Downloaded file is too small, likely corrupted")
        
        # Clean filename for download
        clean_title = re.sub(r'[^\w\-_\.]', '_', title)[:50]  # Limit length
        if not clean_title:
            clean_title = "video"
        filename = f"{clean_title}.{format_type}"
        
        return {
            'file_path': downloaded_file,
            'filename': filename,
            'title': title,
            'file_size': file_size,
            'duration': timedelta(seconds=duration) if duration else None,
            'quality_downloaded': quality,
            'format': format_type
        }
        
    except Exception as e:
        # Clean up on failure
        try:
            if temp_dir and os.path.exists(temp_dir):
                import shutil
                shutil.rmtree(temp_dir, ignore_errors=True)
        except:
            pass
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
