import requests
import tempfile
import os
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter

def test_pdf_merge_only():
    """Test only PDF merge with detailed logging"""
    BASE_URL = "http://127.0.0.1:8000"
    
    print("🧪 Testing PDF Merge specifically...")
    print("=" * 50)
    
    try:
        temp_dir = tempfile.mkdtemp()
        
        # Create sample PDF 1
        pdf1_path = os.path.join(temp_dir, 'sample1.pdf')
        c1 = canvas.Canvas(pdf1_path, pagesize=letter)
        c1.drawString(100, 750, "Sample PDF 1 for merge test")
        c1.save()
        
        # Create sample PDF 2  
        pdf2_path = os.path.join(temp_dir, 'sample2.pdf')
        c2 = canvas.Canvas(pdf2_path, pagesize=letter)
        c2.drawString(100, 750, "Sample PDF 2 for merge test")
        c2.save()
        
        print(f"Created test PDFs: {pdf1_path}, {pdf2_path}")
        
        files = [
            ('pdf_files', open(pdf1_path, 'rb')),
            ('pdf_files', open(pdf2_path, 'rb'))
        ]
        
        print("Sending request to merge endpoint...")
        response = requests.post(
            f"{BASE_URL}/api/pdf-tools/merge/",
            files=files,
            timeout=15
        )
        
        print(f"Response status: {response.status_code}")
        print(f"Response headers: {response.headers}")
        
        if response.status_code == 200:
            print("✅ PDF Merge: SUCCESS")
            print(f"Response content length: {len(response.content)}")
        else:
            print(f"❌ PDF Merge: FAILED - {response.status_code}")
            print(f"Response text: {response.text}")
        
        # Close files
        for _, file_obj in files:
            file_obj.close()
            
        # Cleanup
        os.unlink(pdf1_path)
        os.unlink(pdf2_path)
        os.rmdir(temp_dir)
        
    except Exception as e:
        print(f"❌ PDF Merge: ERROR - {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_pdf_merge_only()
