import os
import tempfile
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser
from django.http import FileResponse
from django.core.files.storage import default_storage
from .serializers import ImageCompressionSerializer, PDFCompressionSerializer
from .models import CompressionHistory
from .utils import compress_image, compress_pdf, get_file_size, calculate_compression_ratio

def get_client_ip(request):
    """Get client IP address"""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

class ImageCompressionView(APIView):
    parser_classes = [MultiPartParser]
    
    def post(self, request):
        serializer = ImageCompressionSerializer(data=request.data)
        if serializer.is_valid():
            try:
                image_file = serializer.validated_data['image']
                quality = serializer.validated_data['quality']
                
                # Save original file temporarily
                temp_original = tempfile.NamedTemporaryFile(delete=False)
                for chunk in image_file.chunks():
                    temp_original.write(chunk)
                temp_original.close()
                
                # Get original file size
                original_size = get_file_size(temp_original.name)
                
                # Compress image
                compressed_path = compress_image(temp_original.name, quality)
                compressed_size = get_file_size(compressed_path)
                
                # Calculate compression ratio
                ratio = calculate_compression_ratio(original_size, compressed_size)
                
                # Save to history
                history = CompressionHistory.objects.create(
                    file_type='image',
                    original_filename=image_file.name,
                    compressed_filename=f"compressed_{image_file.name}",
                    original_size=original_size,
                    compressed_size=compressed_size,
                    compression_ratio=ratio,
                    ip_address=get_client_ip(request)
                )
                
                # Return compressed file
                response = FileResponse(
                    open(compressed_path, 'rb'),
                    as_attachment=True,
                    filename=f"compressed_{image_file.name}"
                )
                
                # Note: Files will be cleaned up by OS when temp files are garbage collected
                # In production, implement proper cleanup with Celery or signals
                
                return response
                
            except Exception as e:
                return Response(
                    {'error': str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PDFCompressionView(APIView):
    parser_classes = [MultiPartParser]
    
    def post(self, request):
        serializer = PDFCompressionSerializer(data=request.data)
        if serializer.is_valid():
            try:
                pdf_file = serializer.validated_data['pdf']
                compression_level = serializer.validated_data['compression_level']
                
                # Save original file temporarily
                temp_original = tempfile.NamedTemporaryFile(delete=False)
                for chunk in pdf_file.chunks():
                    temp_original.write(chunk)
                temp_original.close()
                
                # Get original file size
                original_size = get_file_size(temp_original.name)
                
                # Compress PDF
                compressed_path = compress_pdf(temp_original.name, compression_level)
                compressed_size = get_file_size(compressed_path)
                
                # Calculate compression ratio
                ratio = calculate_compression_ratio(original_size, compressed_size)
                
                # Save to history
                history = CompressionHistory.objects.create(
                    file_type='pdf',
                    original_filename=pdf_file.name,
                    compressed_filename=f"compressed_{pdf_file.name}",
                    original_size=original_size,
                    compressed_size=compressed_size,
                    compression_ratio=ratio,
                    ip_address=get_client_ip(request)
                )
                
                # Return compressed file
                response = FileResponse(
                    open(compressed_path, 'rb'),
                    as_attachment=True,
                    filename=f"compressed_{pdf_file.name}"
                )
                
                # Note: Files will be cleaned up by OS when temp files are garbage collected
                # In production, implement proper cleanup with Celery or signals
                
                return response
                
            except Exception as e:
                return Response(
                    {'error': str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CompressionHistoryView(APIView):
    def get(self, request):
        ip_address = get_client_ip(request)
        history = CompressionHistory.objects.filter(ip_address=ip_address)[:10]
        
        data = []
        for item in history:
            data.append({
                'filename': item.original_filename,
                'file_type': item.file_type,
                'original_size': round(item.original_size / (1024 * 1024), 2),
                'compressed_size': round(item.compressed_size / (1024 * 1024), 2),
                'compression_ratio': float(item.compression_ratio),
                'size_saved': item.size_saved_mb,
                'created_at': item.created_at.isoformat()
            })
        
        return Response(data)
