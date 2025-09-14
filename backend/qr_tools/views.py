from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.utils import timezone
import json
import qrcode
import io
import base64
from PIL import Image
from pyzbar import pyzbar
from .models import QRCodeJob, ContactQR
# from .utils import generate_qr_code, read_qr_code


def qr_tools_home(request):
    """Main QR Tools page."""
    return render(request, 'qr_tools/home.html')


@csrf_exempt
@require_http_methods(["POST"])
def generate_qr_from_text(request):
    """Generate QR code from text."""
    try:
        data = json.loads(request.body)
        text_content = data.get('text_content', '')
        qr_size = int(data.get('qr_size', 200))
        error_correction = data.get('error_correction', 'M')
        
        if not text_content:
            return JsonResponse({'error': 'Text content is required'}, status=400)
        
        # Create QR job
        job = QRCodeJob.objects.create(
            job_type='generate_text',
            qr_content=text_content,
            qr_size=qr_size,
            qr_error_correction=error_correction,
            status='processing'
        )
        
        try:
            # Generate QR code
            qr = qrcode.QRCode(
                version=1,
                error_correction=getattr(qrcode.constants, f'ERROR_CORRECT_{error_correction}'),
                box_size=qr_size//25,
                border=4,
            )
            qr.add_data(text_content)
            qr.make(fit=True)
            
            # Create QR image
            qr_image = qr.make_image(fill_color="black", back_color="white")
            
            # Save to memory
            img_buffer = io.BytesIO()
            qr_image.save(img_buffer, format='PNG')
            img_buffer.seek(0)
            
            # Save file
            output_path = default_storage.save(
                f'qr_codes/{job.id}_qr.png',
                ContentFile(img_buffer.getvalue())
            )
            
            # Update job
            job.output_file_path = output_path
            job.output_filename = f'qr_code_{job.id}.png'
            job.status = 'completed'
            job.completed_at = timezone.now()
            job.save()
            
            # Convert to base64 for immediate display
            img_buffer.seek(0)
            img_base64 = base64.b64encode(img_buffer.getvalue()).decode()
            
            return JsonResponse({
                'success': True,
                'message': 'QR code generated successfully',
                'job_id': str(job.id),
                'qr_image_base64': f'data:image/png;base64,{img_base64}',
                'download_url': f'/api/qr-tools/download/{job.id}/'
            })
            
        except Exception as e:
            job.status = 'failed'
            job.error_message = str(e)
            job.save()
            return JsonResponse({'error': f'QR generation failed: {str(e)}'}, status=500)
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def generate_qr_from_url(request):
    """Generate QR code from URL."""
    try:
        data = json.loads(request.body)
        url_content = data.get('url_content', '')
        qr_size = int(data.get('qr_size', 200))
        error_correction = data.get('error_correction', 'M')
        
        if not url_content:
            return JsonResponse({'error': 'URL is required'}, status=400)
        
        # Validate URL format
        if not url_content.startswith(('http://', 'https://')):
            url_content = 'https://' + url_content
        
        # Create QR job
        job = QRCodeJob.objects.create(
            job_type='generate_url',
            qr_content=url_content,
            qr_size=qr_size,
            qr_error_correction=error_correction,
            status='processing'
        )
        
        try:
            # Generate QR code
            qr = qrcode.QRCode(
                version=1,
                error_correction=getattr(qrcode.constants, f'ERROR_CORRECT_{error_correction}'),
                box_size=qr_size//25,
                border=4,
            )
            qr.add_data(url_content)
            qr.make(fit=True)
            
            # Create QR image
            qr_image = qr.make_image(fill_color="black", back_color="white")
            
            # Save to memory
            img_buffer = io.BytesIO()
            qr_image.save(img_buffer, format='PNG')
            img_buffer.seek(0)
            
            # Save file
            output_path = default_storage.save(
                f'qr_codes/{job.id}_qr.png',
                ContentFile(img_buffer.getvalue())
            )
            
            # Update job
            job.output_file_path = output_path
            job.output_filename = f'qr_url_{job.id}.png'
            job.status = 'completed'
            job.completed_at = timezone.now()
            job.save()
            
            # Convert to base64 for immediate display
            img_buffer.seek(0)
            img_base64 = base64.b64encode(img_buffer.getvalue()).decode()
            
            return JsonResponse({
                'success': True,
                'message': 'QR code generated successfully',
                'job_id': str(job.id),
                'qr_image_base64': f'data:image/png;base64,{img_base64}',
                'download_url': f'/api/qr-tools/download/{job.id}/'
            })
            
        except Exception as e:
            job.status = 'failed'
            job.error_message = str(e)
            job.save()
            return JsonResponse({'error': f'QR generation failed: {str(e)}'}, status=500)
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def generate_qr_from_contact(request):
    """Generate QR code from contact information."""
    try:
        data = json.loads(request.body)
        
        # Create contact record
        contact = ContactQR.objects.create(
            name=data.get('name', ''),
            phone=data.get('phone', ''),
            email=data.get('email', ''),
            organization=data.get('organization', ''),
            website=data.get('website', ''),
            address=data.get('address', '')
        )
        
        # Get vCard data
        vcard_data = contact.to_vcard()
        
        qr_size = int(data.get('qr_size', 200))
        error_correction = data.get('error_correction', 'M')
        
        # Create QR job
        job = QRCodeJob.objects.create(
            job_type='generate_contact',
            qr_content=vcard_data,
            qr_size=qr_size,
            qr_error_correction=error_correction,
            status='processing'
        )
        
        try:
            # Generate QR code
            qr = qrcode.QRCode(
                version=1,
                error_correction=getattr(qrcode.constants, f'ERROR_CORRECT_{error_correction}'),
                box_size=qr_size//25,
                border=4,
            )
            qr.add_data(vcard_data)
            qr.make(fit=True)
            
            # Create QR image
            qr_image = qr.make_image(fill_color="black", back_color="white")
            
            # Save to memory
            img_buffer = io.BytesIO()
            qr_image.save(img_buffer, format='PNG')
            img_buffer.seek(0)
            
            # Save file
            output_path = default_storage.save(
                f'qr_codes/{job.id}_contact_qr.png',
                ContentFile(img_buffer.getvalue())
            )
            
            # Update job
            job.output_file_path = output_path
            job.output_filename = f'contact_qr_{contact.name}_{job.id}.png'
            job.status = 'completed'
            job.completed_at = timezone.now()
            job.save()
            
            # Convert to base64 for immediate display
            img_buffer.seek(0)
            img_base64 = base64.b64encode(img_buffer.getvalue()).decode()
            
            return JsonResponse({
                'success': True,
                'message': 'Contact QR code generated successfully',
                'job_id': str(job.id),
                'contact_id': str(contact.id),
                'qr_image_base64': f'data:image/png;base64,{img_base64}',
                'download_url': f'/api/qr-tools/download/{job.id}/'
            })
            
        except Exception as e:
            job.status = 'failed'
            job.error_message = str(e)
            job.save()
            return JsonResponse({'error': f'QR generation failed: {str(e)}'}, status=500)
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def read_qr_code_view(request):
    """Read QR code from uploaded image."""
    try:
        if 'file' not in request.FILES:
            return JsonResponse({'error': 'No file provided'}, status=400)
        
        file = request.FILES['file']
        
        # Create QR job
        job = QRCodeJob.objects.create(
            job_type='read_qr',
            qr_content='',
            status='processing'
        )
        
        try:
            # Open and read QR code
            image = Image.open(file)
            qr_codes = pyzbar.decode(image)
            
            if not qr_codes:
                job.status = 'failed'
                job.error_message = 'No QR code found in image'
                job.save()
                return JsonResponse({'error': 'No QR code found in the image'}, status=400)
            
            # Get first QR code data
            qr_data = qr_codes[0].data.decode('utf-8')
            
            # Update job
            job.qr_content = qr_data
            job.status = 'completed'
            job.completed_at = timezone.now()
            job.save()
            
            # Try to parse different types of QR content
            qr_type = 'text'
            parsed_data = {'content': qr_data}
            
            if qr_data.startswith(('http://', 'https://')):
                qr_type = 'url'
                parsed_data = {'url': qr_data}
            elif qr_data.startswith('BEGIN:VCARD'):
                qr_type = 'contact'
                # Parse vCard data (simplified)
                lines = qr_data.split('\n')
                contact_data = {}
                for line in lines:
                    if ':' in line:
                        key, value = line.split(':', 1)
                        if key == 'FN':
                            contact_data['name'] = value
                        elif key == 'TEL':
                            contact_data['phone'] = value
                        elif key == 'EMAIL':
                            contact_data['email'] = value
                        elif key == 'ORG':
                            contact_data['organization'] = value
                        elif key == 'URL':
                            contact_data['website'] = value
                parsed_data = contact_data
            
            return JsonResponse({
                'success': True,
                'message': 'QR code read successfully',
                'job_id': str(job.id),
                'qr_type': qr_type,
                'qr_data': parsed_data,
                'raw_content': qr_data
            })
            
        except Exception as e:
            job.status = 'failed'
            job.error_message = str(e)
            job.save()
            return JsonResponse({'error': f'QR reading failed: {str(e)}'}, status=500)
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@require_http_methods(["GET"])
def get_qr_jobs(request):
    """Get recent QR code jobs."""
    jobs = QRCodeJob.objects.all().order_by('-created_at')[:20]
    
    jobs_data = []
    for job in jobs:
        jobs_data.append({
            'id': str(job.id),
            'job_type': job.job_type,
            'status': job.status,
            'qr_content': job.qr_content[:100] + '...' if len(job.qr_content) > 100 else job.qr_content,
            'qr_size': job.qr_size,
            'output_filename': job.output_filename,
            'created_at': job.created_at.isoformat(),
            'completed_at': job.completed_at.isoformat() if job.completed_at else None,
            'error_message': job.error_message
        })
    
    return JsonResponse({
        'success': True,
        'jobs': jobs_data
    })


@require_http_methods(["GET"])
def get_contacts(request):
    """Get saved contacts."""
    contacts = ContactQR.objects.all().order_by('-created_at')[:50]
    
    contacts_data = []
    for contact in contacts:
        contacts_data.append({
            'id': str(contact.id),
            'name': contact.name,
            'phone': contact.phone,
            'email': contact.email,
            'organization': contact.organization,
            'website': contact.website,
            'address': contact.address,
            'created_at': contact.created_at.isoformat()
        })
    
    return JsonResponse({
        'success': True,
        'contacts': contacts_data
    })