from django.urls import path
from .views import ImageCompressionView, PDFCompressionView, CompressionHistoryView

urlpatterns = [
    path('image/', ImageCompressionView.as_view(), name='compress-image'),
    path('pdf/', PDFCompressionView.as_view(), name='compress-pdf'),
    path('history/', CompressionHistoryView.as_view(), name='compression-history'),
]
