import qrcode
import tempfile
import os
from PIL import Image
from pyzbar import pyzbar
import logging

logger = logging.getLogger(__name__)


def generate_qr_code(content, size=200, error_correction='M', output_format='PNG'):
    """Generate QR code from content"""
    try:
        # Set error correction level
        error_levels = {
            'L': qrcode.constants.ERROR_CORRECT_L,
            'M': qrcode.constants.ERROR_CORRECT_M,
            'Q': qrcode.constants.ERROR_CORRECT_Q,
            'H': qrcode.constants.ERROR_CORRECT_H,
        }
        
        qr = qrcode.QRCode(
            version=1,
            error_correction=error_levels.get(error_correction, qrcode.constants.ERROR_CORRECT_M),
            box_size=10,
            border=4,
        )
        
        qr.add_data(content)
        qr.make(fit=True)
        
        # Create QR code image
        img = qr.make_image(fill_color="black", back_color="white")
        
        # Resize if needed
        if size != 200:
            img = img.resize((size, size), Image.Resampling.LANCZOS)
        
        # Save to temporary file
        output_dir = tempfile.mkdtemp()
        output_filename = f"qr_code.{output_format.lower()}"
        output_path = os.path.join(output_dir, output_filename)
        
        img.save(output_path, format=output_format)
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
    """Generate multiple QR codes"""
    try:
        output_dir = tempfile.mkdtemp()
        generated_files = []
        
        for i, content in enumerate(content_list):
            qr = qrcode.QRCode(
                version=1,
                error_correction=qrcode.constants.ERROR_CORRECT_M,
                box_size=10,
                border=4,
            )
            
            qr.add_data(content)
            qr.make(fit=True)
            
            img = qr.make_image(fill_color="black", back_color="white")
            if size != 200:
                img = img.resize((size, size), Image.Resampling.LANCZOS)
            
            filename = f"qr_code_{i+1}.png"
            filepath = os.path.join(output_dir, filename)
            img.save(filepath)
            
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
