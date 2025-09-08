from django.urls import path
from .views import BackgroundRemoverView, ImageEnhancerView, BackgroundEditorView

urlpatterns = [
    path('remove-background/', BackgroundRemoverView.as_view(), name='remove_background'),
    path('enhance/', ImageEnhancerView.as_view(), name='enhance_image'),
    path('edit-background/', BackgroundEditorView.as_view(), name='edit_background'),
]
