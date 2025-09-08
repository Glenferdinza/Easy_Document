from rest_framework import serializers
from .models import WordDocument, WordProcessingJob


class WordDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = WordDocument
        fields = ['id', 'filename', 'file_size', 'upload_time']


class WordProcessingJobSerializer(serializers.ModelSerializer):
    input_files = WordDocumentSerializer(many=True, read_only=True)
    job_type_display = serializers.CharField(source='get_job_type_display', read_only=True)
    output_format_display = serializers.CharField(source='get_output_format_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = WordProcessingJob
        fields = [
            'id', 'job_type', 'job_type_display', 'output_format', 
            'output_format_display', 'status', 'status_display',
            'input_files', 'output_filename', 'created_at', 
            'completed_at', 'error_message'
        ]
