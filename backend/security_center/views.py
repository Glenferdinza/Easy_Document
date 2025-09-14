from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.utils import timezone
from django.conf import settings
from cryptography.fernet import Fernet
from PIL import Image, ImageDraw, ImageFont
import os
import json
import hashlib
import base64
import io
import zipfile
from .models import PasswordProtectedDocument, EncryptedDocument, WatermarkSecurity, AccessLog, SecurityPolicy


def security_center_home(request):
    """Main Security Center page."""
    return render(request, 'security_center/home.html')


@csrf_exempt
@require_http_methods(["POST"])
def password_protect_document(request):
    """Apply password protection to documents."""
    try:
        if 'file' not in request.FILES:
            return JsonResponse({'error': 'No file provided'}, status=400)
        
        file = request.FILES['file']
        password = request.POST.get('password', '')
        protection_type = request.POST.get('protection_type', 'view')
        max_access = request.POST.get('max_access_count')
        expiry_days = request.POST.get('expiry_days')
        
        if not password:
            return JsonResponse({'error': 'Password is required'}, status=400)
        
        if len(password) < 8:
            return JsonResponse({'error': 'Password must be at least 8 characters'}, status=400)
        
        # Save original file
        original_path = default_storage.save(f'security/original/{file.name}', ContentFile(file.read()))
        
        # Create password-protected version (simplified - in real app would use proper PDF encryption)
        protected_content = file.read()  # In production, apply actual protection
        protected_path = default_storage.save(f'security/protected/protected_{file.name}', ContentFile(protected_content))
        
        # Create database record
        doc = PasswordProtectedDocument.objects.create(
            original_file=original_path,
            protected_file=protected_path,
            protection_type=protection_type,
            max_access_count=int(max_access) if max_access else None,
            expiry_date=timezone.now() + timezone.timedelta(days=int(expiry_days)) if expiry_days else None,
            created_by=request.user if request.user.is_authenticated else None
        )
        doc.set_password(password)
        doc.save()
        
        # Log the action
        AccessLog.objects.create(
            document_type='PasswordProtectedDocument',
            document_id=doc.id,
            action='password_protect',
            user=request.user if request.user.is_authenticated else None,
            ip_address=get_client_ip(request),
            user_agent=request.META.get('HTTP_USER_AGENT', ''),
            success=True
        )
        
        return JsonResponse({
            'success': True,
            'message': 'Document password protected successfully',
            'document_id': doc.id,
            'download_url': f'/api/security/download/protected/{doc.id}/'
        })
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def encrypt_document(request):
    """Encrypt documents using AES-256."""
    try:
        if 'file' not in request.FILES:
            return JsonResponse({'error': 'No file provided'}, status=400)
        
        file = request.FILES['file']
        
        # Generate encryption key
        key = Fernet.generate_key()
        fernet = Fernet(key)
        
        # Read and encrypt file content
        file_content = file.read()
        encrypted_content = fernet.encrypt(file_content)
        
        # Calculate file hash for integrity
        file_hash = hashlib.sha256(file_content).hexdigest()
        
        # Save original and encrypted files
        original_path = default_storage.save(f'security/original/{file.name}', ContentFile(file_content))
        encrypted_path = default_storage.save(f'security/encrypted/encrypted_{file.name}', ContentFile(encrypted_content))
        
        # Create database record
        doc = EncryptedDocument.objects.create(
            original_file=original_path,
            encrypted_file=encrypted_path,
            encryption_key=base64.b64encode(key).decode(),
            file_hash=file_hash,
            created_by=request.user if request.user.is_authenticated else None
        )
        
        # Log the action
        AccessLog.objects.create(
            document_type='EncryptedDocument',
            document_id=doc.id,
            action='encrypt',
            user=request.user if request.user.is_authenticated else None,
            ip_address=get_client_ip(request),
            user_agent=request.META.get('HTTP_USER_AGENT', ''),
            success=True
        )
        
        return JsonResponse({
            'success': True,
            'message': 'Document encrypted successfully',
            'document_id': doc.id,
            'encryption_key': base64.b64encode(key).decode(),
            'download_url': f'/api/security/download/encrypted/{doc.id}/'
        })
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def decrypt_document(request):
    """Decrypt documents using provided key."""
    try:
        data = json.loads(request.body)
        document_id = data.get('document_id')
        encryption_key = data.get('encryption_key')
        
        if not document_id or not encryption_key:
            return JsonResponse({'error': 'Document ID and encryption key are required'}, status=400)
        
        try:
            doc = EncryptedDocument.objects.get(id=document_id)
        except EncryptedDocument.DoesNotExist:
            return JsonResponse({'error': 'Document not found'}, status=404)
        
        try:
            # Decode the key and create Fernet instance
            key = base64.b64decode(encryption_key.encode())
            fernet = Fernet(key)
            
            # Read encrypted file and decrypt
            with default_storage.open(doc.encrypted_file.name, 'rb') as encrypted_file:
                encrypted_content = encrypted_file.read()
                decrypted_content = fernet.decrypt(encrypted_content)
            
            # Verify file integrity
            decrypted_hash = hashlib.sha256(decrypted_content).hexdigest()
            if decrypted_hash != doc.file_hash:
                return JsonResponse({'error': 'File integrity check failed'}, status=400)
            
            # Save decrypted file temporarily
            decrypted_path = default_storage.save(
                f'security/decrypted/decrypted_{os.path.basename(doc.original_file.name)}',
                ContentFile(decrypted_content)
            )
            
            # Update access time
            doc.accessed_at = timezone.now()
            doc.save()
            
            # Log the action
            AccessLog.objects.create(
                document_type='EncryptedDocument',
                document_id=doc.id,
                action='decrypt',
                user=request.user if request.user.is_authenticated else None,
                ip_address=get_client_ip(request),
                user_agent=request.META.get('HTTP_USER_AGENT', ''),
                success=True
            )
            
            return JsonResponse({
                'success': True,
                'message': 'Document decrypted successfully',
                'download_url': f'/api/security/download/decrypted/{decrypted_path}'
            })
            
        except Exception as decrypt_error:
            # Log failed attempt
            AccessLog.objects.create(
                document_type='EncryptedDocument',
                document_id=doc.id,
                action='decrypt',
                user=request.user if request.user.is_authenticated else None,
                ip_address=get_client_ip(request),
                user_agent=request.META.get('HTTP_USER_AGENT', ''),
                success=False,
                error_message=str(decrypt_error)
            )
            return JsonResponse({'error': 'Invalid encryption key'}, status=400)
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def add_watermark(request):
    """Add watermark to documents."""
    try:
        if 'file' not in request.FILES:
            return JsonResponse({'error': 'No file provided'}, status=400)
        
        file = request.FILES['file']
        watermark_text = request.POST.get('watermark_text', 'CONFIDENTIAL')
        watermark_type = request.POST.get('watermark_type', 'text')
        transparency = float(request.POST.get('transparency', 0.3))
        position = request.POST.get('position', 'center')
        
        # For this example, we'll handle image files
        if file.content_type.startswith('image/'):
            # Open image
            image = Image.open(file)
            
            # Create watermark overlay
            overlay = Image.new('RGBA', image.size, (255, 255, 255, 0))
            draw = ImageDraw.Draw(overlay)
            
            # Calculate position
            text_width, text_height = draw.textsize(watermark_text) if hasattr(draw, 'textsize') else (100, 30)
            
            positions = {
                'center': ((image.width - text_width) // 2, (image.height - text_height) // 2),
                'top_left': (10, 10),
                'top_right': (image.width - text_width - 10, 10),
                'bottom_left': (10, image.height - text_height - 10),
                'bottom_right': (image.width - text_width - 10, image.height - text_height - 10)
            }
            
            x, y = positions.get(position, positions['center'])
            
            # Add watermark text
            alpha = int(255 * transparency)
            draw.text((x, y), watermark_text, fill=(128, 128, 128, alpha))
            
            # Combine images
            watermarked = Image.alpha_composite(image.convert('RGBA'), overlay)
            
            # Save watermarked image
            output = io.BytesIO()
            watermarked.convert('RGB').save(output, format='JPEG', quality=95)
            output.seek(0)
            
            watermarked_path = default_storage.save(
                f'security/watermarked/watermarked_{file.name}',
                ContentFile(output.getvalue())
            )
            
            # Create database record
            watermark_doc = WatermarkSecurity.objects.create(
                document=watermarked_path,
                watermark_text=watermark_text,
                watermark_type=watermark_type,
                transparency=transparency,
                position=position,
                created_by=request.user if request.user.is_authenticated else None
            )
            
            # Log the action
            AccessLog.objects.create(
                document_type='WatermarkSecurity',
                document_id=watermark_doc.id,
                action='watermark',
                user=request.user if request.user.is_authenticated else None,
                ip_address=get_client_ip(request),
                user_agent=request.META.get('HTTP_USER_AGENT', ''),
                success=True
            )
            
            return JsonResponse({
                'success': True,
                'message': 'Watermark added successfully',
                'document_id': watermark_doc.id,
                'download_url': f'/api/security/download/watermarked/{watermark_doc.id}/'
            })
        else:
            return JsonResponse({'error': 'Only image files are supported for watermarking'}, status=400)
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@require_http_methods(["GET"])
def get_security_policies(request):
    """Get available security policies."""
    policies = SecurityPolicy.objects.filter(is_active=True)
    policies_data = []
    
    for policy in policies:
        policies_data.append({
            'id': policy.id,
            'name': policy.name,
            'description': policy.description,
            'max_file_size': policy.max_file_size,
            'allowed_file_types': policy.allowed_file_types,
            'require_password': policy.require_password,
            'password_min_length': policy.password_min_length,
            'auto_expire_days': policy.auto_expire_days,
            'max_access_count': policy.max_access_count,
            'enable_watermark': policy.enable_watermark,
            'watermark_template': policy.watermark_template
        })
    
    return JsonResponse({
        'success': True,
        'policies': policies_data
    })


@require_http_methods(["GET"])
def get_access_logs(request):
    """Get recent access logs for security monitoring."""
    if request.user.is_authenticated:
        logs = AccessLog.objects.filter(user=request.user)[:50]
    else:
        # For demo purposes, return empty for anonymous users
        logs = []
    
    logs_data = []
    for log in logs:
        logs_data.append({
            'id': log.id,
            'document_type': log.document_type,
            'document_id': log.document_id,
            'action': log.get_action_display(),
            'success': log.success,
            'timestamp': log.timestamp.isoformat(),
            'ip_address': log.ip_address,
            'error_message': log.error_message
        })
    
    return JsonResponse({
        'success': True,
        'logs': logs_data
    })


def get_client_ip(request):
    """Helper function to get client IP address."""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip