from django.db import models
from django.utils import timezone


class ImageOperationHistory(models.Model):
    OPERATION_TYPES = [
        ('images_to_pdf', 'Images to PDF'),
    ]
    
    operation_type = models.CharField(max_length=20, choices=OPERATION_TYPES)
    image_count = models.IntegerField()
    total_size = models.BigIntegerField()
    page_size = models.CharField(max_length=10, default='A4')
    orientation = models.CharField(max_length=10, default='portrait')
    quality = models.CharField(max_length=10, default='high')
    ip_address = models.GenericIPAddressField()
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        app_label = 'image_tools'
        ordering = ['-created_at']
