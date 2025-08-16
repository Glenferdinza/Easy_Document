from django.db import models
from django.utils import timezone

class CompressionHistory(models.Model):
    FILE_TYPES = [
        ('image', 'Image'),
        ('pdf', 'PDF'),
    ]
    
    file_type = models.CharField(max_length=10, choices=FILE_TYPES)
    original_filename = models.CharField(max_length=255)
    compressed_filename = models.CharField(max_length=255)
    original_size = models.BigIntegerField()
    compressed_size = models.BigIntegerField()
    compression_ratio = models.DecimalField(max_digits=5, decimal_places=2)
    ip_address = models.GenericIPAddressField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        
    def __str__(self):
        return f"{self.original_filename} ({self.file_type})"
        
    @property
    def size_saved(self):
        return self.original_size - self.compressed_size
        
    @property
    def size_saved_mb(self):
        return round(self.size_saved / (1024 * 1024), 2)

class UserStats(models.Model):
    """Model untuk menyimpan statistik pengguna"""
    session_id = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(default=timezone.now)
    last_activity = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'user_stats'

class FileProcessingStats(models.Model):
    """Model untuk menyimpan statistik pemrosesan file"""
    OPERATION_CHOICES = [
        ('image_compress', 'Image Compression'),
        ('pdf_compress', 'PDF Compression'),
        ('youtube_convert', 'YouTube Conversion'),
        ('pdf_merge', 'PDF Merge'),
        ('pdf_split', 'PDF Split'),
        ('pdf_to_image', 'PDF to Image'),
        ('image_to_pdf', 'Image to PDF'),
    ]
    
    operation_type = models.CharField(max_length=20, choices=OPERATION_CHOICES)
    file_size_before = models.BigIntegerField(help_text="Size in bytes")
    file_size_after = models.BigIntegerField(help_text="Size in bytes", null=True, blank=True)
    processing_time = models.FloatField(help_text="Processing time in seconds", null=True, blank=True)
    success = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)
    session_id = models.CharField(max_length=100, null=True, blank=True)
    
    class Meta:
        db_table = 'file_processing_stats'
    
    @property
    def data_saved(self):
        """Calculate data saved in bytes"""
        if self.file_size_after and self.file_size_before > self.file_size_after:
            return self.file_size_before - self.file_size_after
        return 0
    
    @property
    def compression_ratio(self):
        """Calculate compression ratio as percentage"""
        if self.file_size_after and self.file_size_before > 0:
            return ((self.file_size_before - self.file_size_after) / self.file_size_before) * 100
        return 0
