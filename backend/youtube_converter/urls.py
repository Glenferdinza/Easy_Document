from django.urls import path
from .views import YouTubeConverterView, VideoInfoView, ConversionHistoryView

urlpatterns = [
    path('convert/', YouTubeConverterView.as_view(), name='youtube-convert'),
    path('info/', VideoInfoView.as_view(), name='video-info'),
    path('history/', ConversionHistoryView.as_view(), name='conversion-history'),
]
