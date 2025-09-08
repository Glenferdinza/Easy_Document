from django.db import models
import uuid


class QRCodeJob(models.Model):
    """Model to track QR code jobs"""
    JOB_TYPES = [
        ('generate_text', 'Generate QR from Text'),
        ('generate_url', 'Generate QR from URL'),
        ('generate_contact', 'Generate QR from Contact'),
        ('read_qr', 'Read QR Code'),
        ('batch_generate', 'Batch Generate QR'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    job_type = models.CharField(max_length=20, choices=JOB_TYPES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # QR Content
    qr_content = models.TextField()
    qr_size = models.IntegerField(default=200)  # pixels
    qr_error_correction = models.CharField(max_length=1, default='M')  # L, M, Q, H
    
    # Output info
    output_file_path = models.CharField(max_length=500, blank=True, null=True)
    output_filename = models.CharField(max_length=255, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(blank=True, null=True)
    error_message = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.get_job_type_display()} - {self.qr_content[:50]}"


class ContactQR(models.Model):
    """Model for contact QR codes"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    organization = models.CharField(max_length=100, blank=True)
    website = models.URLField(blank=True)
    address = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name
    
    def to_vcard(self):
        """Convert to vCard format for QR code"""
        vcard = f"""BEGIN:VCARD
VERSION:3.0
FN:{self.name}
ORG:{self.organization}
TEL:{self.phone}
EMAIL:{self.email}
URL:{self.website}
ADR:;;{self.address};;;;
END:VCARD"""
        return vcard
