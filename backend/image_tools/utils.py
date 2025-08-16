import os
import tempfile
from PIL import Image, ImageFilter
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter, A4


def images_to_pdf(image_files, output_path, page_size='A4', orientation='portrait', quality='high'):
    """Convert multiple images to a single PDF"""
    temp_dir = tempfile.mkdtemp()
    try:
        # Set page size based on parameters
        if page_size == 'A4':
            if orientation == 'landscape':
                page_width, page_height = A4[1], A4[0]  # Swap for landscape
            else:
                page_width, page_height = A4
        else:  # letter
            if orientation == 'landscape':
                page_width, page_height = letter[1], letter[0]  # Swap for landscape
            else:
                page_width, page_height = letter
        
        c = canvas.Canvas(output_path, pagesize=(page_width, page_height))
        
        for image_file in image_files:
            # Open image
            img = Image.open(image_file)
            img_width, img_height = img.size
            
            # Always fit to page while maintaining aspect ratio
            scale_x = page_width / img_width
            scale_y = page_height / img_height
            scale = min(scale_x, scale_y)
            
            new_width = img_width * scale
            new_height = img_height * scale
            
            # Center the image
            x = (page_width - new_width) / 2
            y = (page_height - new_height) / 2
            
            # Save image temporarily
            temp_img_path = os.path.join(temp_dir, f'temp_{image_file.name}')
            
            # Adjust quality if needed
            if quality == 'low':
                img = img.resize((int(img_width * 0.7), int(img_height * 0.7)), Image.Resampling.LANCZOS)
            elif quality == 'medium':
                img = img.resize((int(img_width * 0.85), int(img_height * 0.85)), Image.Resampling.LANCZOS)
            # High quality uses original size
            
            img.save(temp_img_path)
            c.drawImage(temp_img_path, x, y, width=new_width, height=new_height)
            c.showPage()  # New page for next image
        
        c.save()
        
        return {
            'file_path': output_path,
            'filename': 'images_to_pdf.pdf',
            'page_count': len(image_files)
        }
    except Exception as e:
        raise Exception(f"Image to PDF conversion failed: {str(e)}")
    finally:
        # Clean up temp directory
        try:
            for file in os.listdir(temp_dir):
                os.remove(os.path.join(temp_dir, file))
            os.rmdir(temp_dir)
        except:
            pass
