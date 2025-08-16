import os
import shutil
import threading
import time
from django.utils.deprecation import MiddlewareMixin

class FileCleanupMiddleware(MiddlewareMixin):
    def process_response(self, request, response):
        # Check if response has temp directory to cleanup
        temp_dir = response.get('X-Temp-Dir')
        if temp_dir:
            # Remove the header so it doesn't leak to client
            del response['X-Temp-Dir']
            
            # Schedule cleanup after a delay to ensure file is downloaded
            def delayed_cleanup():
                time.sleep(10)  # Wait 10 seconds
                try:
                    if os.path.exists(temp_dir):
                        shutil.rmtree(temp_dir)
                except Exception as e:
                    print(f"Cleanup error: {e}")
            
            # Run cleanup in background thread
            cleanup_thread = threading.Thread(target=delayed_cleanup)
            cleanup_thread.daemon = True
            cleanup_thread.start()
        
        return response
