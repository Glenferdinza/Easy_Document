import os
import time
import tempfile
from django.http import FileResponse, JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.conf import settings
from .utils import (
    remove_background, enhance_image, is_image_format, 
    save_image_with_quality, get_supported_formats
)
from .models import BackgroundRemovalHistory, ImageEnhancementHistory


@method_decorator(csrf_exempt, name='dispatch')
class BackgroundRemoverView(View):
    """Remove background from images"""
    
    def post(self, request):
        try:
            if 'file' not in request.FILES:
                return JsonResponse({'error': 'No file provided'}, status=400)
            
            uploaded_file = request.FILES['file']
            method = request.POST.get('method', 'auto')  # auto, grabcut, threshold
            
            # Validate file
            if not is_image_format(uploaded_file.name):
                return JsonResponse({
                    'error': f'Unsupported format. Supported: {", ".join(get_supported_formats())}'
                }, status=400)
            
            # Check file size (max 50MB)
            if uploaded_file.size > 50 * 1024 * 1024:
                return JsonResponse({'error': 'File too large. Maximum size is 50MB'}, status=400)
            
            start_time = time.time()
            
            # Read file data
            file_data = uploaded_file.read()
            original_size = len(file_data)
            
            # Remove background
            result_img = remove_background(file_data, method=method)
            
            # Save result
            result_data = save_image_with_quality(result_img, format='PNG')
            final_size = len(result_data)
            
            processing_time = time.time() - start_time
            
            # Save to temporary file
            temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.png')
            temp_file.write(result_data)
            temp_file.close()
            
            # Log operation
            try:
                BackgroundRemovalHistory.objects.create(
                    original_filename=uploaded_file.name,
                    output_filename=f"{os.path.splitext(uploaded_file.name)[0]}_no_bg.png",
                    file_size_before=original_size,
                    file_size_after=final_size,
                    processing_time=processing_time,
                    ip_address=self.get_client_ip(request)
                )
            except Exception:
                pass  # Don't fail if logging fails
            
            # Return file
            response = FileResponse(
                open(temp_file.name, 'rb'),
                content_type='image/png',
                as_attachment=True,
                filename=f"{os.path.splitext(uploaded_file.name)[0]}_no_bg.png"
            )
            
            # Clean up temp file after response
            def cleanup():
                try:
                    os.unlink(temp_file.name)
                except:
                    pass
            
            response.close = cleanup
            return response
            
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    def get(self, request):
        """Get supported methods and formats"""
        return JsonResponse({
            'methods': [
                {'value': 'auto', 'label': 'Automatic (Recommended)'},
                {'value': 'grabcut', 'label': 'GrabCut Algorithm'},
                {'value': 'threshold', 'label': 'Threshold Based'},
            ],
            'supported_formats': get_supported_formats(),
            'max_file_size': '50MB'
        })
    
    def get_client_ip(self, request):
        """Get client IP address"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


@method_decorator(csrf_exempt, name='dispatch')
class ImageEnhancerView(View):
    """Enhance images with various methods"""
    
    def post(self, request):
        try:
            if 'file' not in request.FILES:
                return JsonResponse({'error': 'No file provided'}, status=400)
            
            uploaded_file = request.FILES['file']
            enhancement_type = request.POST.get('type', 'sharpen')
            
            # Get enhancement parameters
            params = {}
            if enhancement_type == 'sharpen':
                params['intensity'] = float(request.POST.get('intensity', 1.0))
            elif enhancement_type == 'upscale':
                params['scale_factor'] = float(request.POST.get('scale_factor', 2.0))
                params['method'] = request.POST.get('method', 'LANCZOS')
            elif enhancement_type == 'color_enhance':
                params['saturation'] = float(request.POST.get('saturation', 1.2))
                params['vibrance'] = float(request.POST.get('vibrance', 1.1))
            elif enhancement_type == 'brightness':
                params['factor'] = float(request.POST.get('factor', 1.2))
            elif enhancement_type == 'contrast':
                params['factor'] = float(request.POST.get('factor', 1.2))
            elif enhancement_type == 'denoise':
                params['method'] = request.POST.get('method', 'bilateral')
            
            # Validate file
            if not is_image_format(uploaded_file.name):
                return JsonResponse({
                    'error': f'Unsupported format. Supported: {", ".join(get_supported_formats())}'
                }, status=400)
            
            # Check file size (max 50MB)
            if uploaded_file.size > 50 * 1024 * 1024:
                return JsonResponse({'error': 'File too large. Maximum size is 50MB'}, status=400)
            
            start_time = time.time()
            
            # Read file data
            file_data = uploaded_file.read()
            original_size = len(file_data)
            
            # Enhance image
            result_img = enhance_image(file_data, enhancement_type, **params)
            
            # Determine output format
            output_format = 'PNG' if uploaded_file.name.lower().endswith('.png') else 'JPEG'
            quality = int(request.POST.get('quality', 95))
            
            # Save result
            result_data = save_image_with_quality(result_img, format=output_format, quality=quality)
            final_size = len(result_data)
            
            processing_time = time.time() - start_time
            
            # Save to temporary file
            ext = 'png' if output_format == 'PNG' else 'jpg'
            temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=f'.{ext}')
            temp_file.write(result_data)
            temp_file.close()
            
            # Log operation
            try:
                ImageEnhancementHistory.objects.create(
                    original_filename=uploaded_file.name,
                    output_filename=f"{os.path.splitext(uploaded_file.name)[0]}_enhanced.{ext}",
                    enhancement_type=enhancement_type,
                    settings_used=params,
                    file_size_before=original_size,
                    file_size_after=final_size,
                    processing_time=processing_time,
                    ip_address=self.get_client_ip(request)
                )
            except Exception:
                pass  # Don't fail if logging fails
            
            # Return file
            content_type = 'image/png' if output_format == 'PNG' else 'image/jpeg'
            response = FileResponse(
                open(temp_file.name, 'rb'),
                content_type=content_type,
                as_attachment=True,
                filename=f"{os.path.splitext(uploaded_file.name)[0]}_enhanced.{ext}"
            )
            
            # Clean up temp file after response
            def cleanup():
                try:
                    os.unlink(temp_file.name)
                except:
                    pass
            
            response.close = cleanup
            return response
            
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    def get(self, request):
        """Get available enhancement types and parameters"""
        return JsonResponse({
            'enhancement_types': [
                {
                    'value': 'sharpen',
                    'label': 'Sharpen',
                    'parameters': [
                        {'name': 'intensity', 'type': 'float', 'min': 0.1, 'max': 3.0, 'default': 1.0}
                    ]
                },
                {
                    'value': 'denoise',
                    'label': 'Noise Reduction',
                    'parameters': [
                        {'name': 'method', 'type': 'select', 'options': ['bilateral', 'gaussian'], 'default': 'bilateral'}
                    ]
                },
                {
                    'value': 'upscale',
                    'label': 'Upscale',
                    'parameters': [
                        {'name': 'scale_factor', 'type': 'float', 'min': 1.1, 'max': 4.0, 'default': 2.0},
                        {'name': 'method', 'type': 'select', 'options': ['LANCZOS', 'BICUBIC', 'BILINEAR'], 'default': 'LANCZOS'}
                    ]
                },
                {
                    'value': 'color_enhance',
                    'label': 'Color Enhancement',
                    'parameters': [
                        {'name': 'saturation', 'type': 'float', 'min': 0.1, 'max': 3.0, 'default': 1.2},
                        {'name': 'vibrance', 'type': 'float', 'min': 0.1, 'max': 3.0, 'default': 1.1}
                    ]
                },
                {
                    'value': 'brightness',
                    'label': 'Brightness',
                    'parameters': [
                        {'name': 'factor', 'type': 'float', 'min': 0.1, 'max': 3.0, 'default': 1.2}
                    ]
                },
                {
                    'value': 'contrast',
                    'label': 'Contrast',
                    'parameters': [
                        {'name': 'factor', 'type': 'float', 'min': 0.1, 'max': 3.0, 'default': 1.2}
                    ]
                }
            ],
            'supported_formats': get_supported_formats(),
            'max_file_size': '50MB'
        })
    
    def get_client_ip(self, request):
        """Get client IP address"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


@method_decorator(csrf_exempt, name='dispatch')
class BackgroundEditorView(View):
    """Manual background editing tools"""
    
    def post(self, request):
        """Apply manual edits to background removal"""
        try:
            if 'file' not in request.FILES:
                return JsonResponse({'error': 'No file provided'}, status=400)
            
            uploaded_file = request.FILES['file']
            
            # Get editing parameters
            brush_size = int(request.POST.get('brush_size', 10))
            operation = request.POST.get('operation', 'erase')  # erase, restore
            coordinates = request.POST.get('coordinates', '[]')  # JSON array of [x, y] points
            
            # TODO: Implement manual editing functionality
            # This would require more complex interaction with the frontend
            # For now, return the original file
            
            return JsonResponse({
                'message': 'Manual editing feature coming soon!',
                'parameters': {
                    'brush_size': brush_size,
                    'operation': operation,
                    'coordinates': coordinates
                }
            })
            
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
