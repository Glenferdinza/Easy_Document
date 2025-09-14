import qrcode
from qrcode.constants import ERROR_CORRECT_L, ERROR_CORRECT_M, ERROR_CORRECT_Q, ERROR_CORRECT_H
import tempfile
import os
from PIL import Image, ImageFilter
from pyzbar import pyzbar
import logging

logger = logging.getLogger(__name__)


def generate_qr_code(content, size=200, error_correction='M', output_format='PNG', 
                    fill_color="black", back_color="white", logo_path=None):
    """Enhanced QR code generation with customization options"""
    try:
        # Validate input
        if not content or not content.strip():
            raise ValueError("Content cannot be empty")
        
        # Set error correction level
        error_levels = {
            'L': ERROR_CORRECT_L,  # ~7% error recovery
            'M': ERROR_CORRECT_M,  # ~15% error recovery  
            'Q': ERROR_CORRECT_Q,  # ~25% error recovery
            'H': ERROR_CORRECT_H,  # ~30% error recovery
        }
        
        # Validate size
        size = max(100, min(size, 2000))  # Clamp between 100-2000px
        
        # Calculate optimal box size and border
        if size <= 200:
            box_size = 8
            border = 2
        elif size <= 500:
            box_size = 10
            border = 4
        else:
            box_size = 12
            border = 6
        
        # Create QR code with optimal settings
        qr = qrcode.QRCode(
            version=1,  # Auto-determine version
            error_correction=error_levels.get(error_correction, ERROR_CORRECT_M),
            box_size=box_size,
            border=border,
        )
        
        qr.add_data(content)
        qr.make(fit=True)
        
        # Create QR code image with custom colors
        qr_img = qr.make_image(fill_color=fill_color, back_color=back_color)
        
        # Convert to PIL Image for processing
        img = qr_img.get_image() if hasattr(qr_img, 'get_image') else qr_img
        
        # Ensure it's a PIL Image and convert to RGB if needed
        if not isinstance(img, Image.Image):
            # Convert from qrcode image to PIL Image
            import io
            buffer = io.BytesIO()
            qr_img.save(buffer)
            buffer.seek(0)
            img = Image.open(buffer)
        
        # Convert to RGB if needed (for logo embedding)
        if hasattr(img, 'mode') and img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Add logo if provided
        if logo_path and os.path.exists(logo_path):
            try:
                logo = Image.open(logo_path)
                
                # Calculate logo size (10% of QR code size)
                logo_size = size // 10
                logo = logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
                
                # Create a white background for logo
                logo_bg = Image.new('RGB', (logo_size + 10, logo_size + 10), 'white')
                logo_bg.paste(logo, (5, 5))
                
                # Calculate position (center)
                pos = ((img.size[0] - logo_bg.size[0]) // 2,
                       (img.size[1] - logo_bg.size[1]) // 2)
                
                img.paste(logo_bg, pos)
            except Exception as logo_error:
                logger.warning(f"Logo embedding failed: {logo_error}")
        
        # Resize to exact size if needed
        if img.size[0] != size:
            img = img.resize((size, size), Image.Resampling.LANCZOS)
        
        # Apply image enhancements for better quality
        if size > 400:
            # Sharpen for larger images
            from PIL import ImageFilter
            img = img.filter(ImageFilter.UnsharpMask(radius=1, percent=150, threshold=3))
        
        # Optimize for different formats
        save_kwargs = {}
        if output_format.upper() == 'PNG':
            save_kwargs = {'optimize': True, 'compress_level': 6}
        elif output_format.upper() in ['JPEG', 'JPG']:
            save_kwargs = {'quality': 95, 'optimize': True}
            # Convert to RGB for JPEG
            if img.mode == 'RGBA':
                background = Image.new('RGB', img.size, back_color)
                background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                img = background
        elif output_format.upper() == 'WEBP':
            save_kwargs = {'quality': 90, 'optimize': True}
        
        # Save to temporary file
        output_dir = tempfile.mkdtemp()
        output_filename = f"qr_code.{output_format.lower()}"
        output_path = os.path.join(output_dir, output_filename)
        
        img.save(output_path, format=output_format.upper(), **save_kwargs)
        
        # Validate output
        if not os.path.exists(output_path) or os.path.getsize(output_path) == 0:
            raise Exception("Failed to create QR code file")
        
        return output_path
        
    except Exception as e:
        logger.error(f"QR generation error: {str(e)}")
        raise Exception(f"Failed to generate QR code: {str(e)}")


def read_qr_code(image_path):
    """Read QR code from image"""
    try:
        # Open image
        image = Image.open(image_path)
        
        # Decode QR codes
        qr_codes = pyzbar.decode(image)
        
        if not qr_codes:
            raise Exception("No QR code found in image")
        
        results = []
        for qr_code in qr_codes:
            data = qr_code.data.decode('utf-8')
            qr_type = qr_code.type
            results.append({
                'data': data,
                'type': qr_type,
                'rect': qr_code.rect
            })
        
        return results
        
    except Exception as e:
        logger.error(f"QR reading error: {str(e)}")
        raise Exception(f"Failed to read QR code: {str(e)}")


def generate_contact_qr(contact_data, size=200):
    """Generate QR code for contact (vCard)"""
    try:
        vcard = f"""BEGIN:VCARD
VERSION:3.0
FN:{contact_data.get('name', '')}
ORG:{contact_data.get('organization', '')}
TEL:{contact_data.get('phone', '')}
EMAIL:{contact_data.get('email', '')}
URL:{contact_data.get('website', '')}
ADR:;;{contact_data.get('address', '')};;;;
END:VCARD"""
        
        return generate_qr_code(vcard, size)
        
    except Exception as e:
        logger.error(f"Contact QR generation error: {str(e)}")
        raise Exception(f"Failed to generate contact QR: {str(e)}")


def batch_generate_qr(content_list, size=200):
    """Generate multiple QR codes with enhanced optimization"""
    try:
        output_dir = tempfile.mkdtemp()
        generated_files = []
        
        for i, content in enumerate(content_list):
            if not content or not content.strip():
                continue  # Skip empty content
                
            qr = qrcode.QRCode(
                version=1,
                error_correction=ERROR_CORRECT_M,
                box_size=10,
                border=4,
            )
            
            qr.add_data(content)
            qr.make(fit=True)
            
            qr_img = qr.make_image(fill_color="black", back_color="white")
            
            # Convert to PIL Image for processing
            img = qr_img.get_image() if hasattr(qr_img, 'get_image') else qr_img
            
            if not isinstance(img, Image.Image):
                # Convert from qrcode image to PIL Image
                import io
                buffer = io.BytesIO()
                qr_img.save(buffer)
                buffer.seek(0)
                img = Image.open(buffer)
            
            # Resize if needed
            if hasattr(img, 'size') and size != 200:
                img = img.resize((size, size), Image.Resampling.LANCZOS)
            
            filename = f"qr_code_{i+1}.png"
            filepath = os.path.join(output_dir, filename)
            
            # Save with optimization
            img.save(filepath, 'PNG', optimize=True)
            
            generated_files.append({
                'filename': filename,
                'filepath': filepath,
                'content': content
            })
        
        return generated_files
        
    except Exception as e:
        logger.error(f"Batch QR generation error: {str(e)}")
        raise Exception(f"Failed to generate batch QR codes: {str(e)}")


def create_qr_zip(qr_files):
    """Create ZIP file containing multiple QR codes"""
    import zipfile
    
    try:
        output_dir = tempfile.mkdtemp()
        zip_path = os.path.join(output_dir, "qr_codes.zip")
        
        with zipfile.ZipFile(zip_path, 'w') as zip_file:
            for qr_file in qr_files:
                zip_file.write(qr_file['filepath'], qr_file['filename'])
        
        return zip_path
        
    except Exception as e:
        logger.error(f"QR ZIP creation error: {str(e)}")
        raise Exception(f"Failed to create QR ZIP: {str(e)}")
