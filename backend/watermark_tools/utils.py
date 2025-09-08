import os
import tempfile
from PIL import Image, ImageDraw, ImageFont
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.utils import ImageReader
from PyPDF2 import PdfReader, PdfWriter
import logging

logger = logging.getLogger(__name__)


def add_text_watermark_to_image(input_path, watermark_text, position='bottom-right', 
                               opacity=0.3, font_size=12, color='#000000'):
    """Add text watermark to image"""
    try:
        # Open image
        image = Image.open(input_path)
        if image.mode != 'RGBA':
            image = image.convert('RGBA')
        
        # Create transparent overlay
        overlay = Image.new('RGBA', image.size, (255, 255, 255, 0))
        draw = ImageDraw.Draw(overlay)
        
        # Try to load font
        try:
            font = ImageFont.truetype("arial.ttf", font_size)
        except:
            font = ImageFont.load_default()
        
        # Calculate text position
        text_bbox = draw.textbbox((0, 0), watermark_text, font=font)
        text_width = text_bbox[2] - text_bbox[0]
        text_height = text_bbox[3] - text_bbox[1]
        
        margin = 20
        if position == 'bottom-right':
            x = image.width - text_width - margin
            y = image.height - text_height - margin
        elif position == 'bottom-left':
            x = margin
            y = image.height - text_height - margin
        elif position == 'top-right':
            x = image.width - text_width - margin
            y = margin
        elif position == 'top-left':
            x = margin
            y = margin
        elif position == 'center':
            x = (image.width - text_width) // 2
            y = (image.height - text_height) // 2
        else:
            x = image.width - text_width - margin
            y = image.height - text_height - margin
        
        # Convert hex color to RGB
        color_rgb = tuple(int(color[i:i+2], 16) for i in (1, 3, 5))
        alpha = int(opacity * 255)
        color_rgba = color_rgb + (alpha,)
        
        # Draw text
        draw.text((x, y), watermark_text, font=font, fill=color_rgba)
        
        # Combine image with overlay
        watermarked = Image.alpha_composite(image, overlay)
        
        # Save result
        output_dir = tempfile.mkdtemp()
        output_filename = f"watermarked_{os.path.basename(input_path)}"
        output_path = os.path.join(output_dir, output_filename)
        
        # Convert back to RGB if needed for JPEG
        if output_path.lower().endswith('.jpg') or output_path.lower().endswith('.jpeg'):
            watermarked = watermarked.convert('RGB')
        
        watermarked.save(output_path)
        return output_path
        
    except Exception as e:
        logger.error(f"Image watermark error: {str(e)}")
        raise Exception(f"Failed to add watermark: {str(e)}")


def add_text_watermark_to_pdf(input_path, watermark_text, position='bottom-right',
                             opacity=0.3, font_size=12, color='#000000'):
    """Add text watermark to PDF"""
    try:
        # Read PDF
        reader = PdfReader(input_path)
        writer = PdfWriter()
        
        # Create watermark
        watermark_buffer = create_watermark_pdf(watermark_text, position, opacity, font_size, color)
        watermark_reader = PdfReader(watermark_buffer)
        watermark_page = watermark_reader.pages[0]
        
        # Apply watermark to each page
        for page in reader.pages:
            page.merge_page(watermark_page)
            writer.add_page(page)
        
        # Save result
        output_dir = tempfile.mkdtemp()
        output_filename = f"watermarked_{os.path.basename(input_path)}"
        output_path = os.path.join(output_dir, output_filename)
        
        with open(output_path, 'wb') as output_file:
            writer.write(output_file)
        
        return output_path
        
    except Exception as e:
        logger.error(f"PDF watermark error: {str(e)}")
        raise Exception(f"Failed to add watermark: {str(e)}")


def create_watermark_pdf(text, position, opacity, font_size, color):
    """Create watermark PDF"""
    import io
    
    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter
    
    # Calculate position
    margin = 50
    if position == 'bottom-right':
        x = width - len(text) * font_size * 0.6 - margin
        y = margin
    elif position == 'bottom-left':
        x = margin
        y = margin
    elif position == 'top-right':
        x = width - len(text) * font_size * 0.6 - margin
        y = height - margin - font_size
    elif position == 'top-left':
        x = margin
        y = height - margin - font_size
    elif position == 'center':
        x = width // 2 - len(text) * font_size * 0.3
        y = height // 2
    else:
        x = width - len(text) * font_size * 0.6 - margin
        y = margin
    
    # Set opacity and color
    p.setFillAlpha(opacity)
    color_rgb = [int(color[i:i+2], 16)/255.0 for i in (1, 3, 5)]
    p.setFillColorRGB(*color_rgb)
    
    # Add text
    p.setFont("Helvetica", font_size)
    p.drawString(x, y, text)
    p.save()
    
    buffer.seek(0)
    return buffer


def get_file_size_mb(file_path):
    """Get file size in MB"""
    try:
        size_bytes = os.path.getsize(file_path)
        return round(size_bytes / (1024 * 1024), 2)
    except:
        return 0


def cleanup_file(file_path):
    """Safely remove a file"""
    try:
        if file_path and os.path.exists(file_path):
            os.unlink(file_path)
    except Exception as e:
        logger.warning(f"Failed to cleanup file {file_path}: {str(e)}")
