import requests
import tempfile
import os

def test_all_endpoints():
    """Test all endpoints"""
    BASE_URL = "http://127.0.0.1:8000"
    
    print("🧪 Testing Compresso API Endpoints...")
    print("=" * 50)
    
    # Test 1: YouTube MP4 Download
    print("\n1. Testing YouTube MP4 Download...")
    try:
        response = requests.post(
            f"{BASE_URL}/api/youtube/convert/",
            data={
                'url': 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',  # Never Gonna Give You Up (short)
                'format': 'mp4',
                'quality': '480p'
            },
            timeout=30
        )
        if response.status_code == 200:
            print("✅ YouTube MP4 Download: SUCCESS")
        else:
            print(f"❌ YouTube MP4 Download: FAILED - {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ YouTube MP4 Download: ERROR - {str(e)}")
    
    # Test 2: YouTube MP3 Download  
    print("\n2. Testing YouTube MP3 Download...")
    try:
        response = requests.post(
            f"{BASE_URL}/api/youtube/convert/",
            data={
                'url': 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'format': 'mp3'
            },
            timeout=30
        )
        if response.status_code == 200:
            print("✅ YouTube MP3 Download: SUCCESS")
        else:
            print(f"❌ YouTube MP3 Download: FAILED - {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ YouTube MP3 Download: ERROR - {str(e)}")
    
    # Test 3: PDF Merge (need sample PDFs)
    print("\n3. Testing PDF Merge...")
    try:
        # Create sample PDF files for testing
        from reportlab.pdfgen import canvas
        from reportlab.lib.pagesizes import letter
        
        temp_dir = tempfile.mkdtemp()
        
        # Create sample PDF 1
        pdf1_path = os.path.join(temp_dir, 'sample1.pdf')
        c1 = canvas.Canvas(pdf1_path, pagesize=letter)
        c1.drawString(100, 750, "Sample PDF 1")
        c1.save()
        
        # Create sample PDF 2  
        pdf2_path = os.path.join(temp_dir, 'sample2.pdf')
        c2 = canvas.Canvas(pdf2_path, pagesize=letter)
        c2.drawString(100, 750, "Sample PDF 2")
        c2.save()
        
        files = [
            ('pdf_files', open(pdf1_path, 'rb')),
            ('pdf_files', open(pdf2_path, 'rb'))
        ]
        
        response = requests.post(
            f"{BASE_URL}/api/pdf-tools/merge/",
            files=files,
            timeout=15
        )
        
        # Close files
        for _, file_obj in files:
            file_obj.close()
            
        if response.status_code == 200:
            print("✅ PDF Merge: SUCCESS")
        else:
            print(f"❌ PDF Merge: FAILED - {response.status_code} - {response.text}")
            
        # Cleanup
        os.unlink(pdf1_path)
        os.unlink(pdf2_path)
        os.rmdir(temp_dir)
        
    except Exception as e:
        print(f"❌ PDF Merge: ERROR - {str(e)}")
    
    # Test 4: PDF to Image
    print("\n4. Testing PDF to Image...")
    try:
        # Create sample PDF for testing
        temp_dir = tempfile.mkdtemp()
        pdf_path = os.path.join(temp_dir, 'sample.pdf')
        
        c = canvas.Canvas(pdf_path, pagesize=letter)
        c.drawString(100, 750, "Sample PDF for Image Conversion")
        c.save()
        
        with open(pdf_path, 'rb') as pdf_file:
            files = {'pdf_file': pdf_file}
            data = {
                'output_format': 'jpeg',
                'dpi': '150'
            }
            
            response = requests.post(
                f"{BASE_URL}/api/pdf-tools/pdf-to-image/",
                files=files,
                data=data,
                timeout=15
            )
            
        if response.status_code == 200:
            print("✅ PDF to Image: SUCCESS")
        else:
            print(f"❌ PDF to Image: FAILED - {response.status_code} - {response.text}")
            
        # Cleanup
        os.unlink(pdf_path)
        os.rmdir(temp_dir)
        
    except Exception as e:
        print(f"❌ PDF to Image: ERROR - {str(e)}")
    
    # Test 5: Image to PDF
    print("\n5. Testing Image to PDF...")
    try:
        from PIL import Image
        
        # Create sample images for testing
        temp_dir = tempfile.mkdtemp()
        
        img1_path = os.path.join(temp_dir, 'sample1.jpg')
        img2_path = os.path.join(temp_dir, 'sample2.jpg')
        
        # Create sample images
        img1 = Image.new('RGB', (400, 300), color='red')
        img1.save(img1_path)
        
        img2 = Image.new('RGB', (400, 300), color='blue')  
        img2.save(img2_path)
        
        files = [
            ('images', open(img1_path, 'rb')),
            ('images', open(img2_path, 'rb'))
        ]
        
        data = {
            'page_size': 'A4',
            'orientation': 'portrait',
            'quality': 'high'
        }
        
        response = requests.post(
            f"{BASE_URL}/api/image-tools/to-pdf/",
            files=files,
            data=data,
            timeout=15
        )
        
        # Close files
        for _, file_obj in files:
            file_obj.close()
            
        if response.status_code == 200:
            print("✅ Image to PDF: SUCCESS")
        else:
            print(f"❌ Image to PDF: FAILED - {response.status_code} - {response.text}")
            
        # Cleanup
        os.unlink(img1_path)
        os.unlink(img2_path)
        os.rmdir(temp_dir)
        
    except Exception as e:
        print(f"❌ Image to PDF: ERROR - {str(e)}")
    
    print("\n" + "=" * 50)
    print("🏁 All tests completed!")
    print("\nIf any tests failed, check the Django server logs for details.")

if __name__ == "__main__":
    test_all_endpoints()
