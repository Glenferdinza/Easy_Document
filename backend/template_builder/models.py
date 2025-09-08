from django.db import models
from django.contrib.auth.models import User
import json


class DocumentTemplate(models.Model):
    TEMPLATE_TYPES = [
        ('letter', 'Business Letter'),
        ('invoice', 'Invoice'),
        ('resume', 'Resume'),
        ('report', 'Report'),
        ('contract', 'Contract'),
        ('newsletter', 'Newsletter'),
        ('certificate', 'Certificate'),
        ('custom', 'Custom Template'),
    ]
    
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    template_type = models.CharField(max_length=20, choices=TEMPLATE_TYPES)
    content_structure = models.JSONField(default=dict)  # Store template structure
    preview_image = models.ImageField(upload_to='template_previews/', blank=True)
    is_public = models.BooleanField(default=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    usage_count = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name


class TemplateField(models.Model):
    FIELD_TYPES = [
        ('text', 'Text Field'),
        ('textarea', 'Text Area'),
        ('date', 'Date Field'),
        ('number', 'Number Field'),
        ('image', 'Image Field'),
        ('signature', 'Signature Field'),
        ('table', 'Table Field'),
        ('list', 'List Field'),
    ]
    
    template = models.ForeignKey(DocumentTemplate, on_delete=models.CASCADE, related_name='fields')
    field_name = models.CharField(max_length=100)
    field_label = models.CharField(max_length=200)
    field_type = models.CharField(max_length=20, choices=FIELD_TYPES)
    is_required = models.BooleanField(default=False)
    default_value = models.TextField(blank=True)
    placeholder_text = models.CharField(max_length=200, blank=True)
    position_x = models.FloatField(default=0)  # X coordinate in template
    position_y = models.FloatField(default=0)  # Y coordinate in template
    width = models.FloatField(default=100)
    height = models.FloatField(default=30)
    font_size = models.IntegerField(default=12)
    font_family = models.CharField(max_length=50, default='Arial')
    text_color = models.CharField(max_length=7, default='#000000')  # Hex color
    order = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['order', 'field_name']
    
    def __str__(self):
        return f"{self.template.name} - {self.field_label}"


class GeneratedDocument(models.Model):
    template = models.ForeignKey(DocumentTemplate, on_delete=models.CASCADE)
    generated_file = models.FileField(upload_to='generated_documents/')
    field_data = models.JSONField(default=dict)  # Store filled field values
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Document from {self.template.name} - {self.created_at.strftime('%Y-%m-%d')}"
