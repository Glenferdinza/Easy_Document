from django.contrib import admin
from .models import WordDocument, WordProcessingJob


@admin.register(WordDocument)
class WordDocumentAdmin(admin.ModelAdmin):
    list_display = ['filename', 'file_size', 'upload_time']
    list_filter = ['upload_time']
    search_fields = ['filename']
    readonly_fields = ['id', 'upload_time']


@admin.register(WordProcessingJob)
class WordProcessingJobAdmin(admin.ModelAdmin):
    list_display = ['id', 'job_type', 'output_format', 'status', 'created_at', 'completed_at']
    list_filter = ['job_type', 'output_format', 'status', 'created_at']
    search_fields = ['id', 'output_filename']
    readonly_fields = ['id', 'created_at', 'completed_at']
    filter_horizontal = ['input_files']
