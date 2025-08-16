from rest_framework import serializers
from .models import CompressionHistory

class ImageCompressionSerializer(serializers.Serializer):
    image = serializers.ImageField()
    quality = serializers.IntegerField(min_value=10, max_value=95, default=75)
    
class PDFCompressionSerializer(serializers.Serializer):
    pdf = serializers.FileField()
    compression_level = serializers.ChoiceField(
        choices=[('low', 'Low'), ('medium', 'Medium'), ('high', 'High')],
        default='medium'
    )

class CompressionHistorySerializer(serializers.ModelSerializer):
    size_saved_mb = serializers.ReadOnlyField()
    
    class Meta:
        model = CompressionHistory
        fields = '__all__'
