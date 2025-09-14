from django.urls import path
from . import views

urlpatterns = [
    path('', views.watermark_home, name='watermark_home'),
    path('apply/', views.apply_watermark, name='apply_watermark'),
    path('add-text/', views.add_text_watermark, name='add_text_watermark'),
    path('remove/', views.remove_watermark_view, name='remove_watermark'),
    path('jobs/', views.get_watermark_jobs, name='get_watermark_jobs'),
    path('signatures/create/', views.create_digital_signature, name='create_digital_signature'),
    path('signatures/', views.get_digital_signatures, name='get_digital_signatures'),
]