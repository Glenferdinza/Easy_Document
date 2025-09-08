from django.db import models
from django.contrib.auth.models import User
import json


class FileComparison(models.Model):
    COMPARISON_TYPES = [
        ('text', 'Text Comparison'),
        ('binary', 'Binary Comparison'),
        ('image', 'Image Comparison'),
        ('pdf', 'PDF Comparison'),
        ('structure', 'Structure Comparison'),
    ]
    
    name = models.CharField(max_length=200)
    comparison_type = models.CharField(max_length=20, choices=COMPARISON_TYPES)
    file1 = models.FileField(upload_to='comparisons/file1/')
    file2 = models.FileField(upload_to='comparisons/file2/')
    comparison_result = models.JSONField(default=dict)
    similarity_percentage = models.FloatField(default=0.0)
    differences_count = models.IntegerField(default=0)
    comparison_report = models.FileField(upload_to='comparison_reports/', blank=True)
    processing_time = models.FloatField(default=0.0)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name


class ComparisonDifference(models.Model):
    DIFFERENCE_TYPES = [
        ('added', 'Added Content'),
        ('removed', 'Removed Content'),
        ('modified', 'Modified Content'),
        ('moved', 'Moved Content'),
    ]
    
    comparison = models.ForeignKey(FileComparison, on_delete=models.CASCADE, related_name='differences')
    difference_type = models.CharField(max_length=20, choices=DIFFERENCE_TYPES)
    location = models.JSONField(default=dict)  # Line numbers, coordinates, etc.
    old_content = models.TextField(blank=True)
    new_content = models.TextField(blank=True)
    context_before = models.TextField(blank=True)
    context_after = models.TextField(blank=True)
    severity = models.CharField(
        max_length=10,
        choices=[('low', 'Low'), ('medium', 'Medium'), ('high', 'High')],
        default='medium'
    )
    
    class Meta:
        ordering = ['location']
    
    def __str__(self):
        return f"{self.difference_type} - {self.comparison.name}"


class ComparisonTemplate(models.Model):
    """Templates for specific comparison scenarios."""
    name = models.CharField(max_length=200)
    description = models.TextField()
    file_types = models.JSONField(default=list)  # Supported file extensions
    comparison_settings = models.JSONField(default=dict)
    ignore_patterns = models.JSONField(default=list)  # Patterns to ignore
    is_default = models.BooleanField(default=False)
    usage_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['name']
    
    def __str__(self):
        return self.name


class BatchComparison(models.Model):
    """Compare multiple files in batch."""
    name = models.CharField(max_length=200)
    source_folder1 = models.CharField(max_length=500)
    source_folder2 = models.CharField(max_length=500)
    comparison_template = models.ForeignKey(ComparisonTemplate, on_delete=models.SET_NULL, null=True, blank=True)
    total_files = models.IntegerField(default=0)
    processed_files = models.IntegerField(default=0)
    identical_files = models.IntegerField(default=0)
    different_files = models.IntegerField(default=0)
    error_files = models.IntegerField(default=0)
    status = models.CharField(
        max_length=20,
        choices=[('pending', 'Pending'), ('running', 'Running'), ('completed', 'Completed'), ('failed', 'Failed')],
        default='pending'
    )
    results_summary = models.JSONField(default=dict)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name


class VersionComparison(models.Model):
    """Track changes between different versions of the same document."""
    document_name = models.CharField(max_length=200)
    version1_file = models.FileField(upload_to='versions/v1/')
    version2_file = models.FileField(upload_to='versions/v2/')
    version1_number = models.CharField(max_length=50)
    version2_number = models.CharField(max_length=50)
    change_summary = models.JSONField(default=dict)
    change_log = models.TextField(blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.document_name} ({self.version1_number} vs {self.version2_number})"
