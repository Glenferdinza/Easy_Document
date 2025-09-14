from django.urls import path
from . import views

urlpatterns = [
    path('', views.qr_tools_home, name='qr_tools_home'),
    path('generate/text/', views.generate_qr_from_text, name='generate_qr_from_text'),
    path('generate/url/', views.generate_qr_from_url, name='generate_qr_from_url'),
    path('generate/contact/', views.generate_qr_from_contact, name='generate_qr_from_contact'),
    path('read/', views.read_qr_code_view, name='read_qr_code'),
    path('jobs/', views.get_qr_jobs, name='get_qr_jobs'),
    path('contacts/', views.get_contacts, name='get_contacts'),
]