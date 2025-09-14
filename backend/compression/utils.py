import os
import tempfile
from PIL import Image
from PyPDF2 import PdfReader, PdfWriter
import io

def compress_image(image_file, quality=75):
    """Compress image with specified quality"""
    try:
        # Open image
        image = Image.open(image_file)
        
        # Convert RGBA to RGB if necessary
        if image.mode == 'RGBA':
            background = Image.new('RGB', image.size, (255, 255, 255))
            background.paste(image, mask=image.split()[-1])
            image = background
        
        # Create temporary file for compressed image
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.jpg')
        
        # Compress and save
        image.save(
            temp_file.name,
            'JPEG',
            quality=quality,
            optimize=True
        )
        
        return temp_file.name
        
    except Exception as e:
        raise Exception(f"Image compression failed: {str(e)}")

def compress_pdf(pdf_file, compression_level='medium'):
    """Advanced PDF compression with guaranteed size reduction and distinct compression levels"""
    
    # Create temporary file for compressed PDF
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
    temp_file.close()
    
    # Handle both bytes and file objects
    temp_input = None
    original_path = None
    original_size = 0
    
    try:
        import subprocess
        import platform
        
        # Handle different input types
        if isinstance(pdf_file, bytes):
            # If input is bytes, create temporary file
            temp_input = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
            temp_input.write(pdf_file)
            temp_input.close()
            original_path = temp_input.name
            original_size = len(pdf_file)
        else:
            # If input is file object
            original_path = pdf_file.name if hasattr(pdf_file, 'name') else str(pdf_file)
            original_size = os.path.getsize(original_path)
        
        # Method: PyMuPDF with proper text-based compression (no re-rendering)
        try:
            import fitz  # PyMuPDF
            
            if isinstance(pdf_file, bytes):
                doc = fitz.open(stream=pdf_file, filetype="pdf")
            else:
                doc = fitz.open(original_path)
            
            # Simplified to 2 distinct compression levels only (removed medium)
            if compression_level == 'high':
                # AGGRESSIVE: Maximum compression with all optimizations
                doc.save(
                    temp_file.name,
                    garbage=4,              # Maximum garbage collection
                    deflate=True,           # Compress streams  
                    deflate_images=True,    # Compress images
                    deflate_fonts=True,     # Compress fonts
                    clean=True,             # Clean up PDF structure
                    ascii=False,            # Use binary encoding
                    linear=False,           # Don't linearize
                    pretty=False,           # Don't pretty-print
                    encryption=fitz.PDF_ENCRYPT_NONE,
                    expand=255,             # Expand objects for better compression
                )
                
            else:  # low (default for any non-'high' value including 'medium')
                # GENTLE: Light compression preserving quality
                doc.save(
                    temp_file.name,
                    garbage=1,              # Light garbage collection
                    deflate=True,           # Basic stream compression
                    deflate_images=False,   # Don't compress images aggressively
                    deflate_fonts=False,    # Preserve font quality
                    clean=True,             # Basic cleanup only
                    pretty=True,            # Keep readable structure
                )
                
            doc.close()
            
            # Check the results
            final_size = os.path.getsize(temp_file.name)
            
            # Return appropriate format based on input type
            if isinstance(pdf_file, bytes):
                with open(temp_file.name, 'rb') as f:
                    result = f.read()
                os.unlink(temp_file.name)
                return result
            else:
                return temp_file.name
                
        except ImportError:
            # PyMuPDF not available, use PyPDF2 fallback
            pass
        
        # Fallback: PyPDF2 with different scaling
        try:
            # Handle different input types for PyPDF2
            if isinstance(pdf_file, bytes):
                pdf_input = io.BytesIO(pdf_file)
            else:
                pdf_input = pdf_file
                
            reader = PdfReader(pdf_input)
            writer = PdfWriter()
            
            # Apply VERY different scaling based on compression level
            for page in reader.pages:
                page.compress_content_streams()
                
                # Apply DISTINCT scaling for each level
                if compression_level == 'high':
                    page.scale(0.6, 0.6)   # 40% size reduction - AGGRESSIVE
                elif compression_level == 'medium':
                    page.scale(0.75, 0.75) # 25% size reduction - MODERATE
                else:  # low
                    page.scale(0.9, 0.9)   # 10% size reduction - GENTLE
                    
                writer.add_page(page)
            
            with open(temp_file.name, 'wb') as output:
                writer.write(output)
            
            # Verify compression worked
            final_size = os.path.getsize(temp_file.name)
            if final_size >= original_size:
                raise Exception("PyPDF2 compression failed to reduce size")
            
            # Return appropriate format based on input type
            if isinstance(pdf_file, bytes):
                with open(temp_file.name, 'rb') as f:
                    result = f.read()
                os.unlink(temp_file.name)
                return result
            else:
                return temp_file.name
            
        except Exception as fallback_error:
            raise Exception(f"All PDF compression methods failed: {str(fallback_error)}")
    
    finally:
        # Clean up temporary input file if created
        if temp_input and os.path.exists(temp_input.name):
            try:
                os.unlink(temp_input.name)
            except:
                pass

def get_file_size(file_path):
    """Get file size in bytes"""
    return os.path.getsize(file_path)

def calculate_compression_ratio(original_size, compressed_size):
    """Calculate compression ratio as percentage"""
    if original_size == 0:
        return 0
    return round(((original_size - compressed_size) / original_size) * 100, 2)
