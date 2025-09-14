from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/compress/', include('compression.urls')),
    path('api/youtube/', include('youtube_converter.urls')),
    path('api/pdf-tools/', include('pdf_tools.urls')),
    path('api/image-tools/', include('image_tools.urls')),
    path('api/image-processing/', include('image_processing.urls')),
    path('api/word-tools/', include('word_tools.urls')),
    path('api/security/', include('security_center.urls')),
    path('api/watermark/', include('watermark_tools.urls')),
    path('api/qr-tools/', include('qr_tools.urls')),
    path('api/stats/', include('compression.api_urls')),  # Untuk statistik
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
