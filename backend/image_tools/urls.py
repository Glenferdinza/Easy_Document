from django.urls import path
from . import views

urlpatterns = [
    path('to-pdf/', views.ImageToPDFView.as_view(), name='image_to_pdf'),
]
