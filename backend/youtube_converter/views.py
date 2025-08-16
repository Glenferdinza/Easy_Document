import os
import shutil
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import FileResponse
from .serializers import YouTubeConversionSerializer
from .models import ConversionHistory
from .utils import download_youtube_video, validate_youtube_url, get_video_info

def get_client_ip(request):
    """Get client IP address"""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

class YouTubeConverterView(APIView):
    def post(self, request):
        serializer = YouTubeConversionSerializer(data=request.data)
        if serializer.is_valid():
            file_path = None
            try:
                url = serializer.validated_data['url']
                format = serializer.validated_data['format']
                quality = serializer.validated_data.get('quality', '720p')
                
                # Validate YouTube URL
                if not validate_youtube_url(url):
                    return Response(
                        {'error': 'Invalid YouTube URL'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                # Download and convert
                result = download_youtube_video(url, format, quality)
                file_path = result['file_path']
                
                # Save to history
                history = ConversionHistory.objects.create(
                    youtube_url=url,
                    title=result['title'],
                    format=format,
                    file_size=result['file_size'],
                    duration=result['duration'],
                    ip_address=get_client_ip(request)
                )
                
                # Return file
                response = FileResponse(
                    open(result['file_path'], 'rb'),
                    as_attachment=True,
                    filename=result['filename']
                )
                
                # Add custom header to track the temp directory for later cleanup
                response['X-Temp-Dir'] = os.path.dirname(result['file_path'])
                
                return response
                
            except Exception as e:
                # Cleanup on error
                if file_path:
                    try:
                        temp_dir = os.path.dirname(file_path)
                        if os.path.exists(temp_dir):
                            shutil.rmtree(temp_dir)
                    except:
                        pass
                
                # Log error for debugging
                import logging
                logger = logging.getLogger(__name__)
                logger.error(f"YouTube conversion error: {str(e)}")
                
                return Response(
                    {'error': str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VideoInfoView(APIView):
    def post(self, request):
        url = request.data.get('url')
        if not url:
            return Response(
                {'error': 'URL is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not validate_youtube_url(url):
            return Response(
                {'error': 'Invalid YouTube URL'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        info = get_video_info(url)
        if not info:
            return Response(
                {'error': 'Could not fetch video information'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        return Response(info)

class ConversionHistoryView(APIView):
    def get(self, request):
        ip_address = get_client_ip(request)
        history = ConversionHistory.objects.filter(ip_address=ip_address)[:10]
        
        data = []
        for item in history:
            data.append({
                'title': item.title,
                'format': item.format,
                'file_size': round(item.file_size / (1024 * 1024), 2),
                'duration': str(item.duration) if item.duration else None,
                'created_at': item.created_at.isoformat()
            })
        
        return Response(data)
