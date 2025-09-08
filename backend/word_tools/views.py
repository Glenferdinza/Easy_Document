from django.shortcuts import render
from django.http import JsonResponse, HttpResponse, Http404
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.conf import settings
from django.utils import timezone
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import os
import json
from .models import WordDocument, WordProcessingJob
from .utils import convert_word_to_pdf, merge_word_documents
from .serializers import WordDocumentSerializer, WordProcessingJobSerializer
import tempfile
import logging

logger = logging.getLogger(__name__)


@api_view(['POST'])
def convert_word_to_pdf_view(request):
    """Convert Word document to PDF"""
    try:
        if 'file' not in request.FILES:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        file = request.FILES['file']
        
        # Validate file type
        if not file.name.lower().endswith(('.doc', '.docx')):
            return Response({'error': 'File must be a Word document (.doc or .docx)'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        # Save uploaded file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.docx') as temp_file:
            for chunk in file.chunks():
                temp_file.write(chunk)
            temp_path = temp_file.name
        
        # Create WordDocument record
        word_doc = WordDocument.objects.create(
            filename=file.name,
            file_path=temp_path,
            file_size=file.size
        )
        
        # Create processing job
        job = WordProcessingJob.objects.create(
            job_type='word_to_pdf',
            output_format='pdf'
        )
        job.input_files.add(word_doc)
        
        # Convert to PDF
        try:
            job.status = 'processing'
            job.save()
            
            output_path = convert_word_to_pdf(temp_path, file.name)
            
            job.output_file_path = output_path
            job.output_filename = os.path.basename(output_path)
            job.status = 'completed'
            job.completed_at = timezone.now()
            job.save()
            
            return Response({
                'success': True,
                'job_id': str(job.id),
                'download_url': f'/api/word-tools/download/{job.id}/'
            })
            
        except Exception as e:
            job.status = 'failed'
            job.error_message = str(e)
            job.save()
            logger.error(f"Word to PDF conversion failed: {str(e)}")
            return Response({'error': f'Conversion failed: {str(e)}'}, 
                          status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        finally:
            # Clean up temporary file
            if os.path.exists(temp_path):
                os.unlink(temp_path)
                
    except Exception as e:
        logger.error(f"Word to PDF view error: {str(e)}")
        return Response({'error': 'Internal server error'}, 
                      status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def merge_word_documents_view(request):
    """Merge multiple Word documents"""
    try:
        files = request.FILES.getlist('files')
        output_format = request.POST.get('output_format', 'pdf')  # 'pdf' or 'docx'
        
        if len(files) < 2:
            return Response({'error': 'At least 2 files are required for merging'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        if output_format not in ['pdf', 'docx']:
            return Response({'error': 'Output format must be pdf or docx'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        # Validate all files are Word documents
        temp_paths = []
        word_docs = []
        
        for file in files:
            if not file.name.lower().endswith(('.doc', '.docx')):
                return Response({'error': f'File {file.name} must be a Word document (.doc or .docx)'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            # Save uploaded file
            with tempfile.NamedTemporaryFile(delete=False, suffix='.docx') as temp_file:
                for chunk in file.chunks():
                    temp_file.write(chunk)
                temp_paths.append(temp_file.name)
            
            # Create WordDocument record
            word_doc = WordDocument.objects.create(
                filename=file.name,
                file_path=temp_file.name,
                file_size=file.size
            )
            word_docs.append(word_doc)
        
        # Create processing job
        job = WordProcessingJob.objects.create(
            job_type='merge_word',
            output_format=output_format
        )
        for word_doc in word_docs:
            job.input_files.add(word_doc)
        
        # Merge documents
        try:
            job.status = 'processing'
            job.save()
            
            output_path = merge_word_documents(temp_paths, output_format)
            
            job.output_file_path = output_path
            job.output_filename = os.path.basename(output_path)
            job.status = 'completed'
            job.completed_at = timezone.now()
            job.save()
            
            return Response({
                'success': True,
                'job_id': str(job.id),
                'download_url': f'/api/word-tools/download/{job.id}/',
                'output_format': output_format
            })
            
        except Exception as e:
            job.status = 'failed'
            job.error_message = str(e)
            job.save()
            logger.error(f"Word merge failed: {str(e)}")
            return Response({'error': f'Merge failed: {str(e)}'}, 
                          status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        finally:
            # Clean up temporary files
            for temp_path in temp_paths:
                if os.path.exists(temp_path):
                    os.unlink(temp_path)
                
    except Exception as e:
        logger.error(f"Word merge view error: {str(e)}")
        return Response({'error': 'Internal server error'}, 
                      status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def download_result(request, job_id):
    """Download the processed file"""
    try:
        job = WordProcessingJob.objects.get(id=job_id, status='completed')
        
        if not job.output_file_path or not os.path.exists(job.output_file_path):
            raise Http404("File not found")
        
        with open(job.output_file_path, 'rb') as f:
            response = HttpResponse(f.read())
            
        # Set content type based on output format
        if job.output_format == 'pdf':
            response['Content-Type'] = 'application/pdf'
        else:
            response['Content-Type'] = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        
        response['Content-Disposition'] = f'attachment; filename="{job.output_filename}"'
        return response
        
    except WordProcessingJob.DoesNotExist:
        raise Http404("Job not found")
    except Exception as e:
        logger.error(f"Download error: {str(e)}")
        return Response({'error': 'Download failed'}, 
                      status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def job_status(request, job_id):
    """Get job status"""
    try:
        job = WordProcessingJob.objects.get(id=job_id)
        serializer = WordProcessingJobSerializer(job)
        return Response(serializer.data)
    except WordProcessingJob.DoesNotExist:
        raise Http404("Job not found")
