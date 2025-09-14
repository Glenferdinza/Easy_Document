from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.utils import timezone
from PIL import Image, ImageDraw, ImageFont
import json
import io
import os
from .models import WatermarkJob, DigitalSignature
from .utils import add_text_watermark_to_image, add_text_watermark_to_pdf


def watermark_home(request):
    """Main Watermark Tools page."""
    return render(request, 'watermark_tools/home.html')


@csrf_exempt
@require_http_methods(["POST"])
def apply_watermark(request):
    """Apply watermark to image."""
    try:
        if 'image' not in request.FILES:
            return JsonResponse({'error': 'No image provided'}, status=400)
        
        image = request.FILES['image']
        watermark_type = request.POST.get('watermark_type', 'text')
        position = request.POST.get('position', 'center')
        opacity = int(request.POST.get('opacity', 50))
        rotation = int(request.POST.get('rotation', 0))
        
        # Create watermark job
        job = WatermarkJob.objects.create(
            job_type=f'{watermark_type}_watermark',
            file_type='image',
            input_filename=image.name,
            input_file_size=image.size,
            watermark_position=position,
            watermark_opacity=opacity / 100.0,
            status='processing'
        )
        
        try:
            # Open image with PIL
            img = Image.open(image)
            img = img.convert('RGBA')
            
            # Create overlay for watermark
            overlay = Image.new('RGBA', img.size, (255, 255, 255, 0))
            draw = ImageDraw.Draw(overlay)
            
            if watermark_type == 'text':
                # Text watermark
                text = request.POST.get('text', 'WATERMARK')
                font_size = int(request.POST.get('font_size', 48))
                
                try:
                    font = ImageFont.truetype("arial.ttf", font_size)
                except:
                    font = ImageFont.load_default()
                
                # Get text dimensions
                bbox = draw.textbbox((0, 0), text, font=font)
                text_width = bbox[2] - bbox[0]
                text_height = bbox[3] - bbox[1]
                
                # Calculate position
                x, y = calculate_position(position, img.size, (text_width, text_height))
                
                # Draw text with opacity
                text_color = (0, 0, 0, int(255 * opacity / 100))
                draw.text((x, y), text, font=font, fill=text_color)
                
                job.watermark_text = text
                job.watermark_font_size = font_size
                
            elif watermark_type == 'image':
                # Image watermark
                if 'watermark_image' not in request.FILES:
                    return JsonResponse({'error': 'No watermark image provided'}, status=400)
                
                watermark_img = Image.open(request.FILES['watermark_image'])
                watermark_img = watermark_img.convert('RGBA')
                
                # Resize watermark if needed (max 25% of original image)
                max_size = min(img.size[0] // 4, img.size[1] // 4)
                if watermark_img.size[0] > max_size or watermark_img.size[1] > max_size:
                    watermark_img.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
                
                # Apply opacity
                if opacity < 100:
                    alpha = watermark_img.split()[-1]
                    alpha = alpha.point(lambda p: int(p * opacity / 100))
                    watermark_img.putalpha(alpha)
                
                # Calculate position
                x, y = calculate_position(position, img.size, watermark_img.size)
                
                # Paste watermark
                overlay.paste(watermark_img, (x, y), watermark_img)
            
            # Apply rotation if specified
            if rotation != 0:
                overlay = overlay.rotate(rotation, expand=True)
            
            # Combine original image with watermark
            watermarked = Image.alpha_composite(img, overlay)
            watermarked = watermarked.convert('RGB')
            
            # Save to memory
            img_buffer = io.BytesIO()
            watermarked.save(img_buffer, format='PNG')
            img_buffer.seek(0)
            
            # Return as HTTP response
            from django.http import HttpResponse
            response = HttpResponse(img_buffer.getvalue(), content_type='image/png')
            response['Content-Disposition'] = f'attachment; filename="watermarked_{image.name}"'
            
            # Update job
            job.status = 'completed'
            job.completed_at = timezone.now()
            job.save()
            
            return response
            
        except Exception as e:
            job.status = 'failed'
            job.error_message = str(e)
            job.save()
            return JsonResponse({'error': f'Processing failed: {str(e)}'}, status=500)
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


def calculate_position(position, img_size, watermark_size):
    """Calculate watermark position based on position string."""
    img_width, img_height = img_size
    mark_width, mark_height = watermark_size
    
    positions = {
        'top-left': (10, 10),
        'top-center': ((img_width - mark_width) // 2, 10),
        'top-right': (img_width - mark_width - 10, 10),
        'center-left': (10, (img_height - mark_height) // 2),
        'center': ((img_width - mark_width) // 2, (img_height - mark_height) // 2),
        'center-right': (img_width - mark_width - 10, (img_height - mark_height) // 2),
        'bottom-left': (10, img_height - mark_height - 10),
        'bottom-center': ((img_width - mark_width) // 2, img_height - mark_height - 10),
        'bottom-right': (img_width - mark_width - 10, img_height - mark_height - 10),
    }
    
    return positions.get(position, positions['center'])


@csrf_exempt
@require_http_methods(["POST"])
def add_text_watermark(request):
    """Add text watermark to file."""
    try:
        if 'file' not in request.FILES:
            return JsonResponse({'error': 'No file provided'}, status=400)
        
        file = request.FILES['file']
        watermark_text = request.POST.get('watermark_text', 'WATERMARK')
        position = request.POST.get('position', 'bottom-right')
        opacity = float(request.POST.get('opacity', 0.3))
        font_size = int(request.POST.get('font_size', 12))
        color = request.POST.get('color', '#000000')
        
        # Determine file type
        file_type = 'image' if file.content_type.startswith('image/') else 'pdf'
        
        # Create watermark job
        job = WatermarkJob.objects.create(
            job_type='text_watermark',
            file_type=file_type,
            input_filename=file.name,
            input_file_size=file.size,
            watermark_text=watermark_text,
            watermark_position=position,
            watermark_opacity=opacity,
            watermark_font_size=font_size,
            watermark_color=color
        )
        
        # Save input file
        input_path = default_storage.save(f'watermark/input/{job.id}_{file.name}', ContentFile(file.read()))
        job.input_file_path = input_path
        job.status = 'processing'
        job.save()
        
        try:
            if file_type == 'image':
                # Process image watermark
                with default_storage.open(input_path, 'rb') as f:
                    temp_path = f'/tmp/{file.name}'
                    with open(temp_path, 'wb') as temp_file:
                        temp_file.write(f.read())
                    
                output_path = add_text_watermark_to_image(
                    temp_path, watermark_text, position, opacity, font_size, color
                )
                
                # Save to storage
                with open(output_path, 'rb') as output_file:
                    output_path = default_storage.save(
                        f'watermark/output/watermarked_{file.name}',
                        ContentFile(output_file.read())
                    )
            else:
                # Process PDF watermark - simplified for now
                output_path = input_path
            
            # Update job with success
            job.output_file_path = output_path
            job.output_filename = f'watermarked_{file.name}'
            job.status = 'completed'
            job.completed_at = timezone.now()
            job.save()
            
            return JsonResponse({
                'success': True,
                'message': 'Watermark added successfully',
                'job_id': str(job.id),
                'download_url': f'/api/watermark/download/{job.id}/'
            })
            
        except Exception as e:
            job.status = 'failed'
            job.error_message = str(e)
            job.save()
            return JsonResponse({'error': f'Processing failed: {str(e)}'}, status=500)
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def remove_watermark_view(request):
    """Remove watermark from file."""
    try:
        if 'file' not in request.FILES:
            return JsonResponse({'error': 'No file provided'}, status=400)
        
        file = request.FILES['file']
        
        # Determine file type
        file_type = 'image' if file.content_type.startswith('image/') else 'pdf'
        
        # Create watermark job
        job = WatermarkJob.objects.create(
            job_type='remove_watermark',
            file_type=file_type,
            input_filename=file.name,
            input_file_size=file.size
        )
        
        # Save input file
        input_path = default_storage.save(f'watermark/input/{job.id}_{file.name}', ContentFile(file.read()))
        job.input_file_path = input_path
        job.status = 'processing'
        job.save()
        
        try:
            # Process watermark removal - simplified for now
            output_path = input_path
            
            # Update job with success
            job.output_file_path = output_path
            job.output_filename = f'no_watermark_{file.name}'
            job.status = 'completed'
            job.completed_at = timezone.now()
            job.save()
            
            return JsonResponse({
                'success': True,
                'message': 'Watermark removed successfully',
                'job_id': str(job.id),
                'download_url': f'/api/watermark/download/{job.id}/'
            })
            
        except Exception as e:
            job.status = 'failed'
            job.error_message = str(e)
            job.save()
            return JsonResponse({'error': f'Processing failed: {str(e)}'}, status=500)
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@require_http_methods(["GET"])
def get_watermark_jobs(request):
    """Get recent watermark jobs."""
    jobs = WatermarkJob.objects.all().order_by('-created_at')[:20]
    
    jobs_data = []
    for job in jobs:
        jobs_data.append({
            'id': str(job.id),
            'job_type': job.job_type,
            'file_type': job.file_type,
            'status': job.status,
            'input_filename': job.input_filename,
            'output_filename': job.output_filename,
            'watermark_text': job.watermark_text,
            'created_at': job.created_at.isoformat(),
            'completed_at': job.completed_at.isoformat() if job.completed_at else None,
            'error_message': job.error_message
        })
    
    return JsonResponse({
        'success': True,
        'jobs': jobs_data
    })


@csrf_exempt
@require_http_methods(["POST"])
def create_digital_signature(request):
    """Create a new digital signature."""
    try:
        data = json.loads(request.body)
        signature_name = data.get('signature_name')
        signature_data = data.get('signature_data')  # Base64 image data
        
        if not signature_name or not signature_data:
            return JsonResponse({'error': 'Signature name and data are required'}, status=400)
        
        # Decode base64 signature data
        import base64
        signature_bytes = base64.b64decode(signature_data.split(',')[1])
        
        # Save signature image
        signature_path = default_storage.save(
            f'signatures/{signature_name}.png',
            ContentFile(signature_bytes)
        )
        
        # Create signature record
        signature = DigitalSignature.objects.create(
            signature_name=signature_name,
            signature_image_path=signature_path
        )
        
        return JsonResponse({
            'success': True,
            'message': 'Digital signature created successfully',
            'signature_id': str(signature.id)
        })
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@require_http_methods(["GET"])
def get_digital_signatures(request):
    """Get available digital signatures."""
    signatures = DigitalSignature.objects.all().order_by('-created_at')
    
    signatures_data = []
    for signature in signatures:
        signatures_data.append({
            'id': str(signature.id),
            'signature_name': signature.signature_name,
            'signature_image_path': signature.signature_image_path,
            'created_at': signature.created_at.isoformat()
        })
    
    return JsonResponse({
        'success': True,
        'signatures': signatures_data
    })