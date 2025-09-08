from django.db import models
from django.contrib.auth.models import User
import json


class OrganizationRule(models.Model):
    RULE_TYPES = [
        ('extension', 'By File Extension'),
        ('size', 'By File Size'),
        ('date_created', 'By Creation Date'),
        ('date_modified', 'By Modification Date'),
        ('name_pattern', 'By Name Pattern'),
        ('content_type', 'By Content Type'),
        ('custom', 'Custom Rule'),
    ]
    
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    rule_type = models.CharField(max_length=20, choices=RULE_TYPES)
    rule_criteria = models.JSONField(default=dict)  # Store rule parameters
    target_folder = models.CharField(max_length=500)  # Destination folder pattern
    is_active = models.BooleanField(default=True)
    priority = models.IntegerField(default=0)  # Higher priority rules apply first
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-priority', 'name']
    
    def __str__(self):
        return self.name


class BatchOperation(models.Model):
    OPERATION_TYPES = [
        ('organize', 'Organize Files'),
        ('rename', 'Rename Files'),
        ('move', 'Move Files'),
        ('copy', 'Copy Files'),
        ('delete', 'Delete Files'),
        ('compress', 'Compress Files'),
        ('extract', 'Extract Archives'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('running', 'Running'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
    ]
    
    name = models.CharField(max_length=200)
    operation_type = models.CharField(max_length=20, choices=OPERATION_TYPES)
    source_paths = models.JSONField(default=list)  # List of source file/folder paths
    target_path = models.CharField(max_length=500, blank=True)
    rules = models.ManyToManyField(OrganizationRule, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    progress_percentage = models.IntegerField(default=0)
    files_processed = models.IntegerField(default=0)
    total_files = models.IntegerField(default=0)
    operation_log = models.JSONField(default=list)  # Log of operations performed
    error_log = models.JSONField(default=list)  # Log of errors
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} - {self.operation_type}"


class FileItem(models.Model):
    batch_operation = models.ForeignKey(BatchOperation, on_delete=models.CASCADE, related_name='files')
    original_path = models.CharField(max_length=1000)
    new_path = models.CharField(max_length=1000, blank=True)
    file_name = models.CharField(max_length=255)
    file_size = models.BigIntegerField()
    file_extension = models.CharField(max_length=10)
    mime_type = models.CharField(max_length=100, blank=True)
    created_date = models.DateTimeField()
    modified_date = models.DateTimeField()
    is_processed = models.BooleanField(default=False)
    processing_status = models.CharField(max_length=50, default='pending')
    error_message = models.TextField(blank=True)
    
    class Meta:
        ordering = ['file_name']
    
    def __str__(self):
        return self.file_name


class OrganizationPreset(models.Model):
    """Predefined organization schemes for common use cases."""
    name = models.CharField(max_length=200)
    description = models.TextField()
    rules = models.ManyToManyField(OrganizationRule)
    is_default = models.BooleanField(default=False)
    usage_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['name']
    
    def __str__(self):
        return self.name
