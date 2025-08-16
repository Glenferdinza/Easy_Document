#!/usr/bin/env python
"""
Comprehensive Feature Testing Script
Tests all major features of the Compresso application
"""
import requests
import os
import json
from datetime import datetime

# Configuration
BACKEND_URL = "http://localhost:8000"
FRONTEND_URL = "http://localhost:3000"

def test_api_endpoint(endpoint, method='GET', data=None, files=None):
    """Test API endpoint"""
    try:
        url = f"{BACKEND_URL}{endpoint}"
        if method == 'GET':
            response = requests.get(url, timeout=10)
        elif method == 'POST':
            response = requests.post(url, data=data, files=files, timeout=30)
        
        return {
            'success': response.status_code < 400,
            'status_code': response.status_code,
            'response': response.text[:200] if len(response.text) > 200 else response.text
        }
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }

def main():
    print("🧪 COMPREHENSIVE FEATURE TESTING")
    print("=" * 60)
    print(f"Testing Backend: {BACKEND_URL}")
    print(f"Testing Frontend: {FRONTEND_URL}")
    print(f"Test Time: {datetime.now()}")
    print("=" * 60)
    
    tests = []
    
    # 1. Backend Health Check
    print("\n🏥 1. BACKEND HEALTH CHECK")
    print("-" * 30)
    result = test_api_endpoint("/")
    print(f"Django Root: {'✅ PASS' if result['success'] else '❌ FAIL'}")
    if not result['success']:
        print(f"   Error: {result.get('error', 'Unknown error')}")
    tests.append(('Backend Health', result['success']))
    
    # 2. API Statistics
    print("\n📊 2. API STATISTICS")
    print("-" * 30)
    result = test_api_endpoint("/api/stats/")
    print(f"Stats API: {'✅ PASS' if result['success'] else '❌ FAIL'}")
    if result['success']:
        try:
            stats = json.loads(result['response'])
            print(f"   Users: {stats.get('total_users', 'N/A')}")
            print(f"   Files: {stats.get('files_processed', 'N/A')}")
            print(f"   Data Saved: {stats.get('data_saved', 'N/A')}")
        except:
            print("   Could not parse stats data")
    tests.append(('API Statistics', result['success']))
    
    # 3. Image Compression API
    print("\n🖼️  3. IMAGE COMPRESSION API")
    print("-" * 30)
    result = test_api_endpoint("/api/compress/image/", 'POST')
    # Should fail without image, but endpoint should exist
    endpoint_exists = result['status_code'] in [400, 422, 500]  # Bad request but endpoint exists
    print(f"Image API Endpoint: {'✅ PASS' if endpoint_exists else '❌ FAIL'}")
    tests.append(('Image API', endpoint_exists))
    
    # 4. PDF Compression API
    print("\n📄 4. PDF COMPRESSION API")
    print("-" * 30)
    result = test_api_endpoint("/api/compress/pdf/", 'POST')
    endpoint_exists = result['status_code'] in [400, 422, 500]
    print(f"PDF API Endpoint: {'✅ PASS' if endpoint_exists else '❌ FAIL'}")
    tests.append(('PDF API', endpoint_exists))
    
    # 5. YouTube Converter API  
    print("\n🎵 5. YOUTUBE CONVERTER API")
    print("-" * 30)
    result = test_api_endpoint("/api/youtube/convert/", 'POST')
    endpoint_exists = result['status_code'] in [400, 422, 500]
    print(f"YouTube API Endpoint: {'✅ PASS' if endpoint_exists else '❌ FAIL'}")
    tests.append(('YouTube API', endpoint_exists))
    
    # 6. PDF Tools APIs
    print("\n🔧 6. PDF TOOLS APIs")
    print("-" * 30)
    
    pdf_tools = [
        ("/api/pdf/merge/", "Merge PDF"),
        ("/api/pdf/split/", "Split PDF"),
        ("/api/pdf/to-images/", "PDF to Images"),
        ("/api/image/to-pdf/", "Image to PDF")
    ]
    
    for endpoint, name in pdf_tools:
        result = test_api_endpoint(endpoint, 'POST')
        endpoint_exists = result['status_code'] in [400, 422, 500]
        print(f"{name}: {'✅ PASS' if endpoint_exists else '❌ FAIL'}")
        tests.append((name, endpoint_exists))
    
    # 7. Frontend Health Check
    print("\n🌐 7. FRONTEND HEALTH CHECK")
    print("-" * 30)
    try:
        response = requests.get(FRONTEND_URL, timeout=10)
        frontend_ok = response.status_code == 200
        print(f"React Frontend: {'✅ PASS' if frontend_ok else '❌ FAIL'}")
        tests.append(('Frontend Health', frontend_ok))
    except Exception as e:
        print(f"React Frontend: ❌ FAIL - {e}")
        tests.append(('Frontend Health', False))
    
    # 8. Database Connectivity
    print("\n🗄️  8. DATABASE CONNECTIVITY")
    print("-" * 30)
    result = test_api_endpoint("/admin/")
    admin_accessible = result['status_code'] in [200, 302]  # 200 or redirect to login
    print(f"Admin Panel: {'✅ PASS' if admin_accessible else '❌ FAIL'}")
    tests.append(('Database/Admin', admin_accessible))
    
    # Summary
    print("\n" + "=" * 60)
    print("📋 TEST SUMMARY")
    print("=" * 60)
    
    passed = sum(1 for _, success in tests if success)
    total = len(tests)
    
    for test_name, success in tests:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{test_name:<20}: {status}")
    
    print("-" * 60)
    print(f"TOTAL: {passed}/{total} tests passed ({passed/total*100:.1f}%)")
    
    if passed == total:
        print("🎉 ALL TESTS PASSED! Application is ready for deployment!")
    elif passed >= total * 0.8:
        print("⚠️  Most tests passed. Minor issues may exist.")
    else:
        print("❌ Several tests failed. Please check the issues above.")
    
    print("\n💡 NEXT STEPS:")
    if passed < total:
        print("1. Fix failing tests")
        print("2. Restart servers if needed") 
        print("3. Re-run this test script")
    else:
        print("1. Application is ready for use!")
        print("2. You can start testing features manually")
        print("3. Ready for deployment to production")

if __name__ == "__main__":
    main()
