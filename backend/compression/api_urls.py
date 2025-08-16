from django.urls import path
from .api_views import get_stats, track_operation

urlpatterns = [
    path('', get_stats, name='get_stats'),
    path('track/', track_operation, name='track_operation'),
]
