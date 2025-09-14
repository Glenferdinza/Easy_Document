from django.urls import path
from . import views

urlpatterns = [
    path('', views.security_center_home, name='security_center_home'),
    path('password-protect/', views.password_protect_document, name='password_protect_document'),
    path('encrypt/', views.encrypt_document, name='encrypt_document'),
    path('decrypt/', views.decrypt_document, name='decrypt_document'),
    path('watermark/', views.add_watermark, name='add_watermark'),
    path('policies/', views.get_security_policies, name='get_security_policies'),
    path('logs/', views.get_access_logs, name='get_access_logs'),
]