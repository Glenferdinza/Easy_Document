from django.contrib import admin
from .models import CompressionHistory

@admin.register(CompressionHistory)
class CompressionHistoryAdmin(admin.ModelAdmin):
    list_display = ['original_filename', 'file_type', 'compression_ratio', 'size_saved_mb', 'created_at']
    list_filter = ['file_type', 'created_at']
    search_fields = ['original_filename', 'ip_address']
    readonly_fields = ['created_at']
