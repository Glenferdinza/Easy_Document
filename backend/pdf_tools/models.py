from django.db import models
from django.utils import timezone


class PDFOperationHistory(models.Model):
    OPERATION_TYPES = [
        ('merge', 'Merge PDF'),
        ('split', 'Split PDF'),
        ('pdf_to_image', 'PDF to Image'),
    ]
    
    operation_type = models.CharField(max_length=20, choices=OPERATION_TYPES)
    file_count = models.IntegerField()
    total_size = models.BigIntegerField()
    ip_address = models.GenericIPAddressField()
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        app_label = 'pdf_tools'
        ordering = ['-created_at']
