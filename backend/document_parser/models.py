from django.db import models
from django.contrib.auth.models import User
import json


class ParsedDocument(models.Model):
    DOCUMENT_TYPES = [
        ('pdf', 'PDF Document'),
        ('docx', 'Word Document'),
        ('txt', 'Text File'),
        ('csv', 'CSV File'),
        ('xlsx', 'Excel File'),
        ('image', 'Image with Text'),
    ]
    
    original_file = models.FileField(upload_to='parsed_documents/original/')
    document_type = models.CharField(max_length=20, choices=DOCUMENT_TYPES)
    extracted_text = models.TextField()
    extracted_data = models.JSONField(default=dict)  # Structured data
    metadata = models.JSONField(default=dict)
    confidence_score = models.FloatField(default=0.0)
    processing_time = models.FloatField(default=0.0)  # seconds
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Parsed: {self.original_file.name}"


class TextExtraction(models.Model):
    document = models.ForeignKey(ParsedDocument, on_delete=models.CASCADE, related_name='extractions')
    page_number = models.IntegerField(default=1)
    text_content = models.TextField()
    bounding_boxes = models.JSONField(default=list)  # OCR bounding box data
    language_detected = models.CharField(max_length=10, default='en')
    extraction_method = models.CharField(
        max_length=20,
        choices=[('ocr', 'OCR'), ('text_layer', 'Text Layer'), ('parsing', 'Document Parsing')],
        default='parsing'
    )
    
    class Meta:
        ordering = ['page_number']
    
    def __str__(self):
        return f"Page {self.page_number} - {self.document.original_file.name}"


class EntityExtraction(models.Model):
    ENTITY_TYPES = [
        ('person', 'Person Name'),
        ('organization', 'Organization'),
        ('location', 'Location'),
        ('date', 'Date'),
        ('phone', 'Phone Number'),
        ('email', 'Email Address'),
        ('money', 'Money Amount'),
        ('custom', 'Custom Entity'),
    ]
    
    document = models.ForeignKey(ParsedDocument, on_delete=models.CASCADE, related_name='entities')
    entity_type = models.CharField(max_length=20, choices=ENTITY_TYPES)
    entity_value = models.CharField(max_length=500)
    confidence = models.FloatField(default=0.0)
    start_position = models.IntegerField()
    end_position = models.IntegerField()
    context = models.TextField(blank=True)  # Surrounding text
    
    class Meta:
        ordering = ['start_position']
    
    def __str__(self):
        return f"{self.entity_type}: {self.entity_value}"


class ParsingTemplate(models.Model):
    """Templates for parsing specific document types."""
    name = models.CharField(max_length=200)
    document_type = models.CharField(max_length=50)
    description = models.TextField()
    parsing_rules = models.JSONField(default=dict)  # Regex patterns and extraction rules
    field_mappings = models.JSONField(default=dict)  # Map extracted data to fields
    is_active = models.BooleanField(default=True)
    usage_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['name']
    
    def __str__(self):
        return self.name


class ValidationRule(models.Model):
    """Rules for validating extracted data."""
    name = models.CharField(max_length=200)
    entity_type = models.CharField(max_length=50)
    validation_pattern = models.CharField(max_length=500)  # Regex pattern
    error_message = models.CharField(max_length=200)
    is_required = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['name']
    
    def __str__(self):
        return self.name
