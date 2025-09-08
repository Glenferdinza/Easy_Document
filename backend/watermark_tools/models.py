from django.db import models
import uuid


class WatermarkJob(models.Model):
    """Model to track watermark jobs"""
    JOB_TYPES = [
        ('text_watermark', 'Text Watermark'),
        ('image_watermark', 'Image Watermark'),
        ('remove_watermark', 'Remove Watermark'),
    ]
    
    FILE_TYPES = [
        ('pdf', 'PDF Document'),
        ('image', 'Image File'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    job_type = models.CharField(max_length=20, choices=JOB_TYPES)
    file_type = models.CharField(max_length=10, choices=FILE_TYPES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Input file info
    input_filename = models.CharField(max_length=255)
    input_file_path = models.CharField(max_length=500)
    input_file_size = models.IntegerField()
    
    # Watermark settings
    watermark_text = models.TextField(blank=True, null=True)
    watermark_position = models.CharField(max_length=20, default='bottom-right')  # bottom-right, center, etc.
    watermark_opacity = models.FloatField(default=0.3)  # 0.1 to 1.0
    watermark_font_size = models.IntegerField(default=12)
    watermark_color = models.CharField(max_length=7, default='#000000')  # hex color
    
    # Output file info
    output_file_path = models.CharField(max_length=500, blank=True, null=True)
    output_filename = models.CharField(max_length=255, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(blank=True, null=True)
    error_message = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.get_job_type_display()} - {self.input_filename}"


class DigitalSignature(models.Model):
    """Model for digital signatures"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    signature_name = models.CharField(max_length=100)
    signature_image_path = models.CharField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.signature_name
