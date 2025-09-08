from django.db import models
from django.utils import timezone


class BackgroundRemovalHistory(models.Model):
    """Track background removal operations"""
    original_filename = models.CharField(max_length=255)
    output_filename = models.CharField(max_length=255)
    file_size_before = models.IntegerField()
    file_size_after = models.IntegerField()
    processing_time = models.FloatField()  # seconds
    created_at = models.DateTimeField(default=timezone.now)
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Background removal: {self.original_filename}"


class ImageEnhancementHistory(models.Model):
    """Track image enhancement operations"""
    ENHANCEMENT_CHOICES = [
        ('sharpen', 'Sharpen'),
        ('denoise', 'Denoise'),
        ('upscale', 'Upscale'),
        ('color_enhance', 'Color Enhancement'),
        ('brightness', 'Brightness Adjustment'),
        ('contrast', 'Contrast Adjustment'),
    ]
    
    original_filename = models.CharField(max_length=255)
    output_filename = models.CharField(max_length=255)
    enhancement_type = models.CharField(max_length=20, choices=ENHANCEMENT_CHOICES)
    settings_used = models.JSONField(default=dict)  # Store enhancement parameters
    file_size_before = models.IntegerField()
    file_size_after = models.IntegerField()
    processing_time = models.FloatField()  # seconds
    created_at = models.DateTimeField(default=timezone.now)
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Enhancement ({self.enhancement_type}): {self.original_filename}"
