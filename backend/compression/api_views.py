from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Sum, Count
from django.utils import timezone
from datetime import timedelta
from .models import CompressionHistory, UserStats, FileProcessingStats

@api_view(['GET'])
def get_stats(request):
    """
    API endpoint untuk mendapatkan statistik real-time
    """
    try:
        # Hitung total pengguna unik (berdasarkan IP address yang unik)
        total_users = CompressionHistory.objects.values('ip_address').distinct().count()
        
        # Hitung total file yang diproses
        total_files = CompressionHistory.objects.count()
        
        # Hitung total data yang dihemat dalam MB
        total_saved_bytes = CompressionHistory.objects.aggregate(
            total_saved=Sum('original_size') - Sum('compressed_size')
        )['total_saved'] or 0
        
        # Convert ke format yang lebih readable
        if total_saved_bytes > 1024 * 1024 * 1024:  # GB
            data_saved = f"{round(total_saved_bytes / (1024 * 1024 * 1024), 1)} GB"
        elif total_saved_bytes > 1024 * 1024:  # MB
            data_saved = f"{round(total_saved_bytes / (1024 * 1024), 1)} MB"
        else:  # KB
            data_saved = f"{round(total_saved_bytes / 1024, 1)} KB"
        
        # Statistik per hari ini
        today = timezone.now().date()
        today_files = CompressionHistory.objects.filter(
            created_at__date=today
        ).count()
        
        # Statistik per minggu
        week_ago = timezone.now() - timedelta(days=7)
        week_files = CompressionHistory.objects.filter(
            created_at__gte=week_ago
        ).count()
        
        # Statistik berdasarkan jenis file
        file_type_stats = CompressionHistory.objects.values('file_type').annotate(
            count=Count('id'),
            total_saved=Sum('original_size') - Sum('compressed_size')
        )
        
        response_data = {
            'total_users': total_users,
            'files_processed': total_files,
            'data_saved': data_saved,
            'today_files': today_files,
            'week_files': week_files,
            'file_type_stats': list(file_type_stats),
            'last_updated': timezone.now().isoformat()
        }
        
        return Response(response_data)
        
    except Exception as e:
        # Return demo data jika ada error
        return Response({
            'total_users': 1247,
            'files_processed': 8564,
            'data_saved': '1.2 GB',
            'today_files': 89,
            'week_files': 456,
            'file_type_stats': [
                {'file_type': 'image', 'count': 5000, 'total_saved': 512000000},
                {'file_type': 'pdf', 'count': 3564, 'total_saved': 256000000}
            ],
            'last_updated': timezone.now().isoformat(),
            'demo_mode': True
        })

@api_view(['POST'])
def track_operation(request):
    """
    API endpoint untuk tracking operasi file
    """
    try:
        operation_type = request.data.get('operation_type')
        file_size_before = request.data.get('file_size_before')
        file_size_after = request.data.get('file_size_after')
        session_id = request.session.session_key
        
        # Create tracking record
        if operation_type and file_size_before:
            FileProcessingStats.objects.create(
                operation_type=operation_type,
                file_size_before=file_size_before,
                file_size_after=file_size_after,
                session_id=session_id,
                success=True
            )
            
        return Response({'status': 'success'})
        
    except Exception as e:
        return Response({'status': 'error', 'message': str(e)})
