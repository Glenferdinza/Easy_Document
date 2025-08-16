from django.db import models

class ConversionHistory(models.Model):
    FORMAT_CHOICES = [
        ('mp3', 'MP3 Audio'),
        ('mp4', 'MP4 Video'),
    ]
    
    youtube_url = models.URLField()
    title = models.CharField(max_length=255)
    format = models.CharField(max_length=4, choices=FORMAT_CHOICES)
    file_size = models.BigIntegerField()
    duration = models.DurationField(null=True, blank=True)
    ip_address = models.GenericIPAddressField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        
    def __str__(self):
        return f"{self.title} ({self.format.upper()})"
