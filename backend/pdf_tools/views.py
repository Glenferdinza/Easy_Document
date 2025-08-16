import os
import shutil
import tempfile
import threading
import time
from django.http import FileResponse, JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .models import PDFOperationHistory
from .utils import merge_pdfs, pdf_to_images, split_pdf


def get_client_ip(request):
    """Get client IP address"""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


@method_decorator(csrf_exempt, name='dispatch')
class MergePDFView(View):
    def post(self, request):
        try:
            pdf_files = request.FILES.getlist('pdf_files')
            
            if not pdf_files:
                return JsonResponse({'error': 'No PDF files provided'}, status=400)

            if len(pdf_files) < 2:
                return JsonResponse({'error': 'At least 2 PDF files are required for merging'}, status=400)

            # Validate that all files are PDFs
            for file in pdf_files:
                if not file.name.lower().endswith('.pdf'):
                    return JsonResponse({'error': f'File {file.name} is not a PDF'}, status=400)
                if file.size == 0:
                    return JsonResponse({'error': f'File {file.name} is empty'}, status=400)

            # Create temporary directory
            with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_pdf:
                temp_pdf_path = temp_pdf.name

            try:
                result = merge_pdfs(pdf_files, temp_pdf_path)
                
                # Save to history
                total_size = sum([f.size for f in pdf_files])
                PDFOperationHistory.objects.create(
                    operation_type='merge',
                    file_count=len(pdf_files),
                    total_size=total_size,
                    ip_address=get_client_ip(request)
                )
                
                # Return file
                response = FileResponse(
                    open(temp_pdf_path, 'rb'),
                    content_type='application/pdf',
                    as_attachment=True,
                    filename='merged_pdf.pdf'
                )

                # Schedule file deletion
                def cleanup_file():
                    time.sleep(2)
                    try:
                        os.unlink(temp_pdf_path)
                    except:
                        pass

                threading.Thread(target=cleanup_file, daemon=True).start()
                return response
                
            except Exception as e:
                try:
                    os.unlink(temp_pdf_path)
                except:
                    pass
                raise e

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)


@method_decorator(csrf_exempt, name='dispatch')
class PDFToImageView(View):
    def post(self, request):
        try:
            pdf_file = request.FILES.get('pdf_file')
            if not pdf_file:
                return JsonResponse({'error': 'No PDF file provided'}, status=400)

            output_format = request.POST.get('output_format', 'jpeg')
            dpi = int(request.POST.get('dpi', 150))

            # Create temporary ZIP file
            with tempfile.NamedTemporaryFile(delete=False, suffix='.zip') as temp_zip:
                temp_zip_path = temp_zip.name

            try:
                result = pdf_to_images(pdf_file, temp_zip_path, output_format, dpi)
                
                # Save to history
                PDFOperationHistory.objects.create(
                    operation_type='pdf_to_image',
                    file_count=1,
                    total_size=pdf_file.size,
                    ip_address=get_client_ip(request)
                )
                
                # Return file
                response = FileResponse(
                    open(temp_zip_path, 'rb'),
                    content_type='application/zip',
                    as_attachment=True,
                    filename='pdf_images.zip'
                )

                # Schedule file deletion
                def cleanup_file():
                    time.sleep(2)
                    try:
                        os.unlink(temp_zip_path)
                    except:
                        pass

                threading.Thread(target=cleanup_file, daemon=True).start()
                return response
                
            except Exception as e:
                try:
                    os.unlink(temp_zip_path)
                except:
                    pass
                raise e

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)


@method_decorator(csrf_exempt, name='dispatch')
class SplitPDFView(View):
    def post(self, request):
        try:
            pdf_file = request.FILES.get('pdf_file')
            if not pdf_file:
                return JsonResponse({'error': 'No PDF file provided'}, status=400)

            pages_per_split = int(request.POST.get('pages_per_split', 1))

            # Create temporary ZIP file  
            with tempfile.NamedTemporaryFile(delete=False, suffix='.zip') as temp_zip:
                temp_zip_path = temp_zip.name

            try:
                result = split_pdf(pdf_file, temp_zip_path, pages_per_split)
                
                # Save to history
                PDFOperationHistory.objects.create(
                    operation_type='split',
                    file_count=1,
                    total_size=pdf_file.size,
                    ip_address=get_client_ip(request)
                )
                
                # Return file
                response = FileResponse(
                    open(temp_zip_path, 'rb'),
                    content_type='application/zip',
                    as_attachment=True,
                    filename='split_pdfs.zip'
                )

                # Schedule file deletion
                def cleanup_file():
                    time.sleep(2)
                    try:
                        os.unlink(temp_zip_path)
                    except:
                        pass

                threading.Thread(target=cleanup_file, daemon=True).start()
                return response
                
            except Exception as e:
                try:
                    os.unlink(temp_zip_path)
                except:
                    pass
                raise e

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
