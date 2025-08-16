from django.urls import path
from . import views

urlpatterns = [
    path('merge/', views.MergePDFView.as_view(), name='merge_pdf'),
    path('pdf-to-image/', views.PDFToImageView.as_view(), name='pdf_to_image'),
    path('split/', views.SplitPDFView.as_view(), name='split_pdf'),
]
