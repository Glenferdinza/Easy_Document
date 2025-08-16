import os
import tempfile
from PyPDF2 import PdfReader, PdfWriter
from PIL import Image
import zipfile


def merge_pdfs(pdf_files, output_path):
    """Merge multiple PDF files into one"""
    try:
        merger = PdfWriter()
        
        for pdf_file in pdf_files:
            reader = PdfReader(pdf_file)
            for page in reader.pages:
                merger.add_page(page)
        
        with open(output_path, 'wb') as output_file:
            merger.write(output_file)
        
        return {
            'file_path': output_path,
            'filename': 'merged.pdf',
            'page_count': len(merger.pages)
        }
    except Exception as e:
        raise Exception(f"PDF merge failed: {str(e)}")


def pdf_to_images(pdf_file, output_path, output_format='PNG', dpi=150):
    """Convert PDF pages to images"""
    temp_dir = tempfile.mkdtemp()
    try:
        from pdf2image import convert_from_bytes
        import platform
        
        # Read PDF file
        pdf_bytes = pdf_file.read()
        
        # Convert to images with platform-specific poppler path
        try:
            if platform.system() == 'Windows':
                # Try local poppler first, then common Windows poppler paths
                current_dir = os.path.dirname(os.path.abspath(__file__))
                local_poppler = os.path.join(current_dir, '..', 'poppler', 'poppler-24.08.0', 'Library', 'bin')
                
                possible_paths = [
                    local_poppler,
                    r'C:\Program Files\poppler\bin',
                    r'C:\poppler\bin',
                    r'C:\Program Files (x86)\poppler\bin'
                ]
                
                poppler_path = None
                for path in possible_paths:
                    if os.path.exists(path):
                        poppler_path = path
                        break
                
                if poppler_path:
                    images = convert_from_bytes(pdf_bytes, dpi=dpi, poppler_path=poppler_path)
                else:
                    # Try without poppler_path (might be in PATH)
                    images = convert_from_bytes(pdf_bytes, dpi=dpi)
            else:
                images = convert_from_bytes(pdf_bytes, dpi=dpi)
        except Exception as e:
            # Fallback: try with different settings
            try:
                images = convert_from_bytes(pdf_bytes, dpi=100)
            except:
                raise Exception(f"PDF to image conversion requires poppler. Please install poppler for Windows or ensure it's in your PATH. Error: {str(e)}")
        
        image_paths = []
        for i, image in enumerate(images):
            image_path = os.path.join(temp_dir, f'page_{i+1}.{output_format.lower()}')
            image.save(image_path, output_format)
            image_paths.append(image_path)
        
        # Create ZIP file with all images
        with zipfile.ZipFile(output_path, 'w') as zip_file:
            for image_path in image_paths:
                zip_file.write(image_path, os.path.basename(image_path))
        
        return {
            'file_path': output_path,
            'filename': 'pdf_images.zip',
            'image_count': len(images)
        }
    except Exception as e:
        raise Exception(f"PDF to image conversion failed: {str(e)}")
    finally:
        # Clean up temp directory
        try:
            for file in os.listdir(temp_dir):
                os.remove(os.path.join(temp_dir, file))
            os.rmdir(temp_dir)
        except:
            pass


def split_pdf(pdf_file, output_path, pages_per_split=1):
    """Split PDF into separate files"""
    temp_dir = tempfile.mkdtemp()
    try:
        reader = PdfReader(pdf_file)
        total_pages = len(reader.pages)
        
        pdf_paths = []
        for i in range(0, total_pages, pages_per_split):
            writer = PdfWriter()
            
            # Add pages to this split
            end_page = min(i + pages_per_split, total_pages)
            for page_num in range(i, end_page):
                writer.add_page(reader.pages[page_num])
            
            # Save split PDF
            split_filename = f'split_{i//pages_per_split + 1}.pdf'
            split_path = os.path.join(temp_dir, split_filename)
            
            with open(split_path, 'wb') as output_file:
                writer.write(output_file)
            
            pdf_paths.append(split_path)
        
        # Create ZIP file with all splits
        with zipfile.ZipFile(output_path, 'w') as zip_file:
            for pdf_path in pdf_paths:
                zip_file.write(pdf_path, os.path.basename(pdf_path))
        
        return {
            'file_path': output_path,
            'filename': 'split_pdfs.zip',
            'split_count': len(pdf_paths)
        }
    except Exception as e:
        raise Exception(f"PDF split failed: {str(e)}")
    finally:
        # Clean up temp directory
        try:
            for file in os.listdir(temp_dir):
                os.remove(os.path.join(temp_dir, file))
            os.rmdir(temp_dir)
        except:
            pass
