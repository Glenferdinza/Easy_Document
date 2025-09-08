from django.urls import path
from . import views

app_name = 'word_tools'

urlpatterns = [
    path('convert-to-pdf/', views.convert_word_to_pdf_view, name='convert_to_pdf'),
    path('merge-documents/', views.merge_word_documents_view, name='merge_documents'),
    path('download/<uuid:job_id>/', views.download_result, name='download_result'),
    path('status/<uuid:job_id>/', views.job_status, name='job_status'),
]
