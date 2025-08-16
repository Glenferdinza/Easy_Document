from rest_framework import serializers
from .models import ConversionHistory

class YouTubeConversionSerializer(serializers.Serializer):
    url = serializers.URLField()
    format = serializers.ChoiceField(choices=[('mp3', 'MP3'), ('mp4', 'MP4')])
    quality = serializers.ChoiceField(
        choices=[('480p', '480p'), ('720p', '720p'), ('1080p', '1080p')],
        default='720p',
        required=False
    )

class ConversionHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ConversionHistory
        fields = '__all__'
