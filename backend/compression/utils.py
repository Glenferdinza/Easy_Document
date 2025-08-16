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
    """Compress PDF file"""
    try:
        reader = PdfReader(pdf_file)
        writer = PdfWriter()
        
        # Set compression level
        if compression_level == 'high':
            compress_level = 9
        elif compression_level == 'medium':
            compress_level = 6
        else:  # low
            compress_level = 3
        
        # Compress pages
        for page in reader.pages:
            # Remove images if high compression
            if compression_level == 'high':
                page.compress_content_streams()
            writer.add_page(page)
        
        # Create temporary file for compressed PDF
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
        
        with open(temp_file.name, 'wb') as output:
            writer.write(output)
        
        return temp_file.name
        
    except Exception as e:
        raise Exception(f"PDF compression failed: {str(e)}")

def get_file_size(file_path):
    """Get file size in bytes"""
    return os.path.getsize(file_path)

def calculate_compression_ratio(original_size, compressed_size):
    """Calculate compression ratio as percentage"""
    if original_size == 0:
        return 0
    return round(((original_size - compressed_size) / original_size) * 100, 2)
