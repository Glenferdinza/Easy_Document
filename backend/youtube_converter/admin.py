from django.contrib import admin
from .models import ConversionHistory

@admin.register(ConversionHistory)
class ConversionHistoryAdmin(admin.ModelAdmin):
    list_display = ['title', 'format', 'file_size', 'created_at']
    list_filter = ['format', 'created_at']
    search_fields = ['title', 'youtube_url']
    readonly_fields = ['created_at']
