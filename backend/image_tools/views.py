from django.http import FileResponse, JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.conf import settings
import os
import tempfile
import threading
import time
from .utils import images_to_pdf

@method_decorator(csrf_exempt, name='dispatch')
class ImageToPDFView(View):
    def post(self, request):
        try:
            images = request.FILES.getlist('images')
            if not images:
                return JsonResponse({'error': 'No images provided'}, status=400)

            page_size = request.POST.get('page_size', 'A4')
            orientation = request.POST.get('orientation', 'portrait')
            quality = request.POST.get('quality', 'high')

            # Create temporary PDF file
            with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_pdf:
                temp_pdf_path = temp_pdf.name

            try:
                # Convert images to PDF
                images_to_pdf(images, temp_pdf_path, page_size, orientation, quality)

                # Create response
                response = FileResponse(
                    open(temp_pdf_path, 'rb'),
                    content_type='application/pdf',
                    as_attachment=True,
                    filename='images_to_pdf.pdf'
                )

                # Schedule file deletion after response
                def cleanup_file():
                    time.sleep(2)  # Wait for download to start
                    try:
                        os.unlink(temp_pdf_path)
                    except:
                        pass

                threading.Thread(target=cleanup_file, daemon=True).start()
                
                return response

            except Exception as e:
                # Clean up temp file on error
                try:
                    os.unlink(temp_pdf_path)
                except:
                    pass
                raise e

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
