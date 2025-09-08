import os
import tempfile
import numpy as np
from PIL import Image, ImageFilter, ImageEnhance
from io import BytesIO
import cv2


def remove_background(image_data, method='auto'):
    """
    Remove background from image using various methods
    Methods: 'auto', 'grabcut', 'threshold'
    """
    try:
        # Open image
        img = Image.open(BytesIO(image_data))
        
        # Convert to RGB if necessary
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Convert PIL to OpenCV format
        opencv_img = cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)
        
        if method == 'grabcut':
            return _remove_background_grabcut(opencv_img)
        elif method == 'threshold':
            return _remove_background_threshold(opencv_img)
        else:  # auto method
            return _remove_background_auto(opencv_img)
            
    except Exception as e:
        raise Exception(f"Background removal failed: {str(e)}")


def _remove_background_auto(opencv_img):
    """Automatic background removal using edge detection and morphology"""
    # Convert to grayscale
    gray = cv2.cvtColor(opencv_img, cv2.COLOR_BGR2GRAY)
    
    # Apply GaussianBlur to reduce noise
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    
    # Use adaptive threshold
    thresh = cv2.adaptiveThreshold(blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
                                  cv2.THRESH_BINARY, 11, 2)
    
    # Find contours
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    # Create mask
    mask = np.zeros(gray.shape, np.uint8)
    
    if contours:
        # Find largest contour (assume it's the main object)
        largest_contour = max(contours, key=cv2.contourArea)
        cv2.fillPoly(mask, [largest_contour], 255)
        
        # Apply morphological operations to clean up the mask
        kernel = np.ones((5,5), np.uint8)
        mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
        mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
    
    # Apply mask to original image
    result = opencv_img.copy()
    result = cv2.bitwise_and(result, result, mask=mask)
    
    # Convert back to PIL with transparency
    result_rgb = cv2.cvtColor(result, cv2.COLOR_BGR2RGB)
    result_pil = Image.fromarray(result_rgb)
    
    # Create alpha channel from mask
    alpha = Image.fromarray(mask)
    result_pil.putalpha(alpha)
    
    return result_pil


def _remove_background_grabcut(opencv_img):
    """Background removal using GrabCut algorithm"""
    height, width = opencv_img.shape[:2]
    
    # Create rectangle around the center (assume object is in center)
    rect = (int(width*0.1), int(height*0.1), int(width*0.8), int(height*0.8))
    
    # Initialize mask
    mask = np.zeros((height, width), np.uint8)
    
    # Initialize background and foreground models
    bgdModel = np.zeros((1, 65), np.float64)
    fgdModel = np.zeros((1, 65), np.float64)
    
    # Apply GrabCut
    cv2.grabCut(opencv_img, mask, rect, bgdModel, fgdModel, 5, cv2.GC_INIT_WITH_RECT)
    
    # Create final mask
    mask2 = np.where((mask == 2) | (mask == 0), 0, 1).astype('uint8')
    
    # Apply mask
    result = opencv_img * mask2[:, :, np.newaxis]
    
    # Convert to PIL with transparency
    result_rgb = cv2.cvtColor(result, cv2.COLOR_BGR2RGB)
    result_pil = Image.fromarray(result_rgb)
    
    # Create alpha channel
    alpha = Image.fromarray(mask2 * 255)
    result_pil.putalpha(alpha)
    
    return result_pil


def _remove_background_threshold(opencv_img):
    """Simple threshold-based background removal"""
    # Convert to HSV for better color separation
    hsv = cv2.cvtColor(opencv_img, cv2.COLOR_BGR2HSV)
    
    # Define range for background color (adjust as needed)
    lower_bg = np.array([0, 0, 200])  # Light colors
    upper_bg = np.array([180, 30, 255])
    
    # Create mask
    mask = cv2.inRange(hsv, lower_bg, upper_bg)
    mask = cv2.bitwise_not(mask)  # Invert mask
    
    # Apply morphological operations
    kernel = np.ones((3,3), np.uint8)
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
    
    # Apply mask
    result = cv2.bitwise_and(opencv_img, opencv_img, mask=mask)
    
    # Convert to PIL with transparency
    result_rgb = cv2.cvtColor(result, cv2.COLOR_BGR2RGB)
    result_pil = Image.fromarray(result_rgb)
    
    # Create alpha channel
    alpha = Image.fromarray(mask)
    result_pil.putalpha(alpha)
    
    return result_pil


def enhance_image(image_data, enhancement_type, **kwargs):
    """
    Enhance image with various methods
    Types: 'sharpen', 'denoise', 'upscale', 'color_enhance', 'brightness', 'contrast'
    """
    try:
        img = Image.open(BytesIO(image_data))
        
        if enhancement_type == 'sharpen':
            return _sharpen_image(img, **kwargs)
        elif enhancement_type == 'denoise':
            return _denoise_image(img, **kwargs)
        elif enhancement_type == 'upscale':
            return _upscale_image(img, **kwargs)
        elif enhancement_type == 'color_enhance':
            return _enhance_colors(img, **kwargs)
        elif enhancement_type == 'brightness':
            return _adjust_brightness(img, **kwargs)
        elif enhancement_type == 'contrast':
            return _adjust_contrast(img, **kwargs)
        else:
            raise ValueError(f"Unknown enhancement type: {enhancement_type}")
            
    except Exception as e:
        raise Exception(f"Image enhancement failed: {str(e)}")


def _sharpen_image(img, intensity=1.0):
    """Sharpen image using unsharp mask"""
    if intensity <= 0:
        return img
    
    # Create sharpening filter
    filter_kernel = ImageFilter.UnsharpMask(radius=2, percent=int(150 * intensity), threshold=3)
    return img.filter(filter_kernel)


def _denoise_image(img, method='bilateral'):
    """Remove noise from image"""
    # Convert to OpenCV format
    opencv_img = cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)
    
    if method == 'bilateral':
        # Bilateral filter preserves edges while reducing noise
        denoised = cv2.bilateralFilter(opencv_img, 9, 75, 75)
    else:
        # Gaussian blur for simple denoising
        denoised = cv2.GaussianBlur(opencv_img, (5, 5), 0)
    
    # Convert back to PIL
    result_rgb = cv2.cvtColor(denoised, cv2.COLOR_BGR2RGB)
    return Image.fromarray(result_rgb)


def _upscale_image(img, scale_factor=2.0, method='LANCZOS'):
    """Upscale image using various interpolation methods"""
    if scale_factor <= 1.0:
        return img
    
    original_size = img.size
    new_size = (int(original_size[0] * scale_factor), int(original_size[1] * scale_factor))
    
    # Choose resampling method
    resample_map = {
        'NEAREST': Image.NEAREST,
        'BILINEAR': Image.BILINEAR,
        'BICUBIC': Image.BICUBIC,
        'LANCZOS': Image.LANCZOS,
    }
    
    resample = resample_map.get(method.upper(), Image.LANCZOS)
    return img.resize(new_size, resample)


def _enhance_colors(img, saturation=1.2, vibrance=1.1):
    """Enhance color saturation and vibrance"""
    # Enhance color saturation
    enhancer = ImageEnhance.Color(img)
    enhanced = enhancer.enhance(saturation)
    
    # Additional vibrance enhancement (simple version)
    if vibrance != 1.0:
        enhancer2 = ImageEnhance.Color(enhanced)
        enhanced = enhancer2.enhance(vibrance)
    
    return enhanced


def _adjust_brightness(img, factor=1.2):
    """Adjust image brightness"""
    enhancer = ImageEnhance.Brightness(img)
    return enhancer.enhance(factor)


def _adjust_contrast(img, factor=1.2):
    """Adjust image contrast"""
    enhancer = ImageEnhance.Contrast(img)
    return enhancer.enhance(factor)


def get_supported_formats():
    """Get list of supported image formats"""
    return [
        'jpg', 'jpeg', 'png', 'webp', 'bmp', 'tiff', 'tif',
        'heic', 'heif', 'gif', 'ico', 'psd'
    ]


def is_image_format(filename):
    """Check if file is a supported image format"""
    if not filename:
        return False
    
    ext = filename.lower().split('.')[-1]
    return ext in get_supported_formats()


def save_image_with_quality(img, format='PNG', quality=95):
    """Save image to bytes with specified format and quality"""
    output = BytesIO()
    
    if format.upper() == 'JPEG' or format.upper() == 'JPG':
        # Convert to RGB for JPEG (no transparency)
        if img.mode in ('RGBA', 'LA', 'P'):
            # Create white background
            background = Image.new('RGB', img.size, (255, 255, 255))
            if img.mode == 'P':
                img = img.convert('RGBA')
            background.paste(img, mask=img.split()[-1] if 'A' in img.mode else None)
            img = background
        img.save(output, format='JPEG', quality=quality, optimize=True)
    else:
        # PNG supports transparency
        img.save(output, format='PNG', optimize=True)
    
    output.seek(0)
    return output.getvalue()
