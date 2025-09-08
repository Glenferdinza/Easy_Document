from django.db import models
import uuid


class WordDocument(models.Model):
    """Model to track uploaded Word documents"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    filename = models.CharField(max_length=255)
    file_path = models.CharField(max_length=500)
    file_size = models.IntegerField()
    upload_time = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.filename} ({self.file_size} bytes)"


class WordProcessingJob(models.Model):
    """Model to track word processing jobs"""
    JOB_TYPES = [
        ('word_to_pdf', 'Word to PDF'),
        ('merge_word', 'Merge Word Documents'),
    ]
    
    OUTPUT_FORMATS = [
        ('pdf', 'PDF'),
        ('docx', 'Word Document'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    job_type = models.CharField(max_length=20, choices=JOB_TYPES)
    output_format = models.CharField(max_length=10, choices=OUTPUT_FORMATS, default='pdf')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    input_files = models.ManyToManyField(WordDocument, related_name='processing_jobs')
    output_file_path = models.CharField(max_length=500, blank=True, null=True)
    output_filename = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(blank=True, null=True)
    error_message = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.get_job_type_display()} - {self.status}"
