from django.db import models
from django.contrib.auth.models import User
from cryptography.fernet import Fernet
import bcrypt


class PasswordProtectedDocument(models.Model):
    PROTECTION_TYPES = [
        ('view', 'View Protection'),
        ('edit', 'Edit Protection'),
        ('print', 'Print Protection'),
        ('copy', 'Copy Protection'),
        ('full', 'Full Protection'),
    ]
    
    original_file = models.FileField(upload_to='protected_documents/original/')
    protected_file = models.FileField(upload_to='protected_documents/protected/')
    password_hash = models.CharField(max_length=128)
    protection_type = models.CharField(max_length=10, choices=PROTECTION_TYPES)
    access_count = models.IntegerField(default=0)
    max_access_count = models.IntegerField(null=True, blank=True)
    expiry_date = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def set_password(self, password):
        """Hash and set password for the document."""
        salt = bcrypt.gensalt()
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
    
    def check_password(self, password):
        """Check if provided password matches."""
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Protected: {self.original_file.name}"


class EncryptedDocument(models.Model):
    original_file = models.FileField(upload_to='encrypted_documents/original/')
    encrypted_file = models.FileField(upload_to='encrypted_documents/encrypted/')
    encryption_key = models.CharField(max_length=256)  # Base64 encoded key
    file_hash = models.CharField(max_length=64)  # SHA256 hash for integrity check
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    accessed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Encrypted: {self.original_file.name}"


class WatermarkSecurity(models.Model):
    document = models.FileField(upload_to='watermarked_documents/')
    watermark_text = models.CharField(max_length=200)
    watermark_type = models.CharField(
        max_length=20,
        choices=[('text', 'Text'), ('image', 'Image'), ('user_info', 'User Info')],
        default='text'
    )
    transparency = models.FloatField(default=0.3)
    position = models.CharField(
        max_length=20,
        choices=[
            ('center', 'Center'), ('top_left', 'Top Left'), ('top_right', 'Top Right'),
            ('bottom_left', 'Bottom Left'), ('bottom_right', 'Bottom Right')
        ],
        default='center'
    )
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Watermarked: {self.document.name}"


class AccessLog(models.Model):
    ACTION_TYPES = [
        ('view', 'Document Viewed'),
        ('download', 'Document Downloaded'),
        ('decrypt', 'Document Decrypted'),
        ('password_attempt', 'Password Attempt'),
        ('failed_access', 'Failed Access'),
    ]
    
    document_type = models.CharField(max_length=50)  # Model name
    document_id = models.IntegerField()
    action = models.CharField(max_length=20, choices=ACTION_TYPES)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField(blank=True)
    success = models.BooleanField()
    error_message = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"{self.action} - {self.timestamp.strftime('%Y-%m-%d %H:%M')}"


class SecurityPolicy(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    max_file_size = models.BigIntegerField(default=50*1024*1024)  # 50MB
    allowed_file_types = models.JSONField(default=list)
    require_password = models.BooleanField(default=False)
    password_min_length = models.IntegerField(default=8)
    auto_expire_days = models.IntegerField(null=True, blank=True)
    max_access_count = models.IntegerField(null=True, blank=True)
    enable_watermark = models.BooleanField(default=False)
    watermark_template = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['name']
    
    def __str__(self):
        return self.name
