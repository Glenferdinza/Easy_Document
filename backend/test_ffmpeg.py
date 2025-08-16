#!/usr/bin/env python
"""
Test FFmpeg installation and YouTube converter functionality
"""
import os
import sys
import django

# Setup Django
sys.path.append('C:\\Users\\Lenovo\\Downloads\\Compress_Img\\backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'compress_website.settings')
django.setup()

from youtube_converter.utils import get_ffmpeg_path, check_ffmpeg_available

def test_ffmpeg():
    print("🔧 Testing FFmpeg Installation...")
    print("=" * 50)
    
    # Test FFmpeg path
    ffmpeg_path = get_ffmpeg_path()
    if ffmpeg_path:
        print(f"✅ FFmpeg found at: {ffmpeg_path}")
    else:
        print("❌ FFmpeg not found")
        return False
    
    # Test FFmpeg availability
    if check_ffmpeg_available():
        print("✅ FFmpeg is working correctly")
    else:
        print("❌ FFmpeg is not working")
        return False
    
    # Test actual FFmpeg execution
    try:
        import subprocess
        result = subprocess.run([ffmpeg_path, '-version'], 
                              capture_output=True, text=True, timeout=10)
        if result.returncode == 0:
            version_line = result.stdout.split('\n')[0]
            print(f"✅ FFmpeg version: {version_line}")
            print("🎉 YouTube converter should work now!")
            return True
        else:
            print(f"❌ FFmpeg execution failed: {result.stderr}")
            return False
    except Exception as e:
        print(f"❌ Error testing FFmpeg: {e}")
        return False

if __name__ == "__main__":
    test_ffmpeg()
