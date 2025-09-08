from django.db import models
from django.contrib.auth.models import User
import json


class DesignProject(models.Model):
    PROJECT_TYPES = [
        ('flyer', 'Flyer'),
        ('poster', 'Poster'), 
        ('brochure', 'Brochure'),
        ('business_card', 'Business Card'),
        ('letterhead', 'Letterhead'),
        ('certificate', 'Certificate'),
        ('invitation', 'Invitation'),
        ('custom', 'Custom Design'),
    ]
    
    name = models.CharField(max_length=200)
    project_type = models.CharField(max_length=20, choices=PROJECT_TYPES)
    description = models.TextField(blank=True)
    canvas_width = models.IntegerField(default=800)
    canvas_height = models.IntegerField(default=600)
    background_color = models.CharField(max_length=7, default='#ffffff')
    design_data = models.JSONField(default=dict)  # Store all design elements
    preview_image = models.ImageField(upload_to='design_previews/', blank=True)
    final_document = models.FileField(upload_to='final_designs/', blank=True)
    is_template = models.BooleanField(default=False)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-updated_at']
    
    def __str__(self):
        return self.name


class DesignElement(models.Model):
    ELEMENT_TYPES = [
        ('text', 'Text'),
        ('image', 'Image'),
        ('shape', 'Shape'),
        ('line', 'Line'),
        ('chart', 'Chart'),
        ('table', 'Table'),
        ('qr_code', 'QR Code'),
        ('barcode', 'Barcode'),
    ]
    
    project = models.ForeignKey(DesignProject, on_delete=models.CASCADE, related_name='elements')
    element_type = models.CharField(max_length=20, choices=ELEMENT_TYPES)
    element_data = models.JSONField(default=dict)  # Element-specific properties
    position_x = models.FloatField(default=0)
    position_y = models.FloatField(default=0)
    width = models.FloatField(default=100)
    height = models.FloatField(default=50)
    rotation = models.FloatField(default=0)
    opacity = models.FloatField(default=1.0)
    z_index = models.IntegerField(default=0)
    is_locked = models.BooleanField(default=False)
    is_visible = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['z_index', 'created_at']
    
    def __str__(self):
        return f"{self.element_type} - {self.project.name}"


class DesignTemplate(models.Model):
    name = models.CharField(max_length=200)
    category = models.CharField(max_length=50)
    description = models.TextField()
    thumbnail = models.ImageField(upload_to='template_thumbnails/')
    template_data = models.JSONField(default=dict)  # Complete design structure
    tags = models.JSONField(default=list)  # Search tags
    is_premium = models.BooleanField(default=False)
    download_count = models.IntegerField(default=0)
    rating = models.FloatField(default=0.0)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-download_count', '-rating']
    
    def __str__(self):
        return self.name


class FontFamily(models.Model):
    name = models.CharField(max_length=200)
    font_file = models.FileField(upload_to='fonts/')
    font_type = models.CharField(
        max_length=10,
        choices=[('ttf', 'TrueType'), ('otf', 'OpenType'), ('woff', 'Web Font')],
        default='ttf'
    )
    is_web_safe = models.BooleanField(default=False)
    preview_text = models.CharField(max_length=100, default='The quick brown fox')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['name']
    
    def __str__(self):
        return self.name


class ColorPalette(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    colors = models.JSONField(default=list)  # List of hex color codes
    is_predefined = models.BooleanField(default=False)
    usage_count = models.IntegerField(default=0)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['name']
    
    def __str__(self):
        return self.name


class AssetLibrary(models.Model):
    ASSET_TYPES = [
        ('icon', 'Icon'),
        ('illustration', 'Illustration'),
        ('photo', 'Photo'),
        ('pattern', 'Pattern'),
        ('texture', 'Texture'),
        ('background', 'Background'),
    ]
    
    name = models.CharField(max_length=200)
    asset_type = models.CharField(max_length=20, choices=ASSET_TYPES)
    file = models.FileField(upload_to='design_assets/')
    thumbnail = models.ImageField(upload_to='asset_thumbnails/', blank=True)
    tags = models.JSONField(default=list)
    license_type = models.CharField(max_length=50, default='free')
    download_count = models.IntegerField(default=0)
    file_size = models.BigIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-download_count', 'name']
    
    def __str__(self):
        return self.name
