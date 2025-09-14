import os
import tempfile
import numpy as np
from PIL import Image, ImageFilter, ImageEnhance
from io import BytesIO
import cv2


def remove_background(image_data, method='auto'):
    """
    Remove background from image using enhanced methods
    Methods: 'auto', 'grabcut', 'threshold', 'ai_enhanced'
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
            return _remove_background_grabcut_enhanced(opencv_img)
        elif method == 'threshold':
            return _remove_background_threshold_enhanced(opencv_img)
        elif method == 'ai_enhanced':
            return _remove_background_ai_enhanced(opencv_img)
        else:  # auto method (enhanced)
            return _remove_background_auto_enhanced(opencv_img)
            
    except Exception as e:
        raise Exception(f"Background removal failed: {str(e)}")


def _remove_background_auto_enhanced(opencv_img):
    """Enhanced automatic background removal using improved GrabCut with fallbacks"""
    height, width = opencv_img.shape[:2]
    
    try:
        # Method 1: Enhanced GrabCut with better initialization
        # Create smart rectangle based on image analysis
        gray = cv2.cvtColor(opencv_img, cv2.COLOR_BGR2GRAY)
        
        # Find image center of mass for better rectangle placement
        _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        
        # Calculate center of mass
        M = cv2.moments(thresh)
        if M["m00"] != 0:
            cx = int(M["m10"] / M["m00"])
            cy = int(M["m01"] / M["m00"])
        else:
            cx, cy = width // 2, height // 2
        
        # Create adaptive rectangle
        rect_width = int(width * 0.7)
        rect_height = int(height * 0.8)
        
        rect_x = max(0, cx - rect_width // 2)
        rect_y = max(0, cy - rect_height // 2)
        rect_width = min(rect_width, width - rect_x)
        rect_height = min(rect_height, height - rect_y)
        
        rect = (rect_x, rect_y, rect_width, rect_height)
        
        # Initialize GrabCut
        mask = np.zeros((height, width), np.uint8)
        bgdModel = np.zeros((1, 65), np.float64)
        fgdModel = np.zeros((1, 65), np.float64)
        
        # Apply GrabCut with more iterations for better results
        cv2.grabCut(opencv_img, mask, rect, bgdModel, fgdModel, 8, cv2.GC_INIT_WITH_RECT)
        
        # Refine the result
        mask2 = np.where((mask == 2) | (mask == 0), 0, 1).astype('uint8')
        
        # Enhanced post-processing
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
        
        # Close holes
        mask2 = cv2.morphologyEx(mask2, cv2.MORPH_CLOSE, kernel, iterations=2)
        
        # Remove small noise
        mask2 = cv2.morphologyEx(mask2, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3)), iterations=1)
        
        # Apply bilateral filter for better edge preservation
        mask_float = mask2.astype(np.float32)
        mask_float = cv2.bilateralFilter(mask_float, 9, 75, 75)
        
        # Final Gaussian blur for smooth edges
        mask_float = cv2.GaussianBlur(mask_float, (5, 5), 1)
        mask2 = np.clip(mask_float, 0, 1)
        
    except Exception:
        # Fallback to enhanced edge-based method
        try:
            mask2 = _create_mask_from_edges(opencv_img)
        except Exception:
            # Final fallback - simple threshold
            mask2 = _create_simple_mask(opencv_img)
    
    # Apply mask to create result
    result = _apply_mask_to_image(opencv_img, mask2)
    return result


def _create_mask_from_edges(opencv_img):
    """Create mask using advanced edge detection"""
    height, width = opencv_img.shape[:2]
    gray = cv2.cvtColor(opencv_img, cv2.COLOR_BGR2GRAY)
    
    # Enhanced edge detection
    # Apply bilateral filter first to reduce noise
    filtered = cv2.bilateralFilter(gray, 9, 75, 75)
    
    # Multiple edge detection methods
    edges1 = cv2.Canny(filtered, 50, 150, apertureSize=3)
    
    # Sobel edge detection
    grad_x = cv2.Sobel(filtered, cv2.CV_64F, 1, 0, ksize=3)
    grad_y = cv2.Sobel(filtered, cv2.CV_64F, 0, 1, ksize=3)
    sobel = np.sqrt(grad_x**2 + grad_y**2)
    sobel = np.uint8(sobel / np.max(sobel) * 255)
    
    # Combine edge detection methods
    combined_edges = np.maximum(edges1, sobel)
    
    # Morphological operations to connect edges
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
    combined_edges = cv2.morphologyEx(combined_edges, cv2.MORPH_CLOSE, kernel)
    combined_edges = cv2.dilate(combined_edges, kernel, iterations=1)
    
    # Find contours
    contours, _ = cv2.findContours(combined_edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    # Create mask from best contours
    mask = np.zeros(gray.shape, np.uint8)
    
    if contours:
        # Score contours based on area and position
        center_x, center_y = width // 2, height // 2
        scored_contours = []
        
        for contour in contours:
            area = cv2.contourArea(contour)
            if area > 1000:  # Minimum area
                # Get contour center
                M = cv2.moments(contour)
                if M["m00"] != 0:
                    cx = int(M["m10"] / M["m00"])
                    cy = int(M["m01"] / M["m00"])
                    
                    # Distance from center
                    distance = np.sqrt((cx - center_x)**2 + (cy - center_y)**2)
                    score = area / (1 + distance / 100)
                    scored_contours.append((contour, score))
        
        if scored_contours:
            # Sort by score and take top contours
            scored_contours.sort(key=lambda x: x[1], reverse=True)
            top_contours = [c[0] for c in scored_contours[:3]]
            
            # Fill contours
            cv2.fillPoly(mask, top_contours, 255)
    
    # Convert to float and smooth
    mask_float = mask.astype(np.float32) / 255.0
    mask_float = cv2.GaussianBlur(mask_float, (5, 5), 0)
    
    return mask_float


def _create_simple_mask(opencv_img):
    """Simple fallback mask creation"""
    height, width = opencv_img.shape[:2]
    
    # Create a simple center-focused mask
    mask = np.zeros((height, width), np.float32)
    
    # Create elliptical mask in center
    center_x, center_y = width // 2, height // 2
    axes_x, axes_y = int(width * 0.3), int(height * 0.4)
    
    cv2.ellipse(mask, (center_x, center_y), (axes_x, axes_y), 0, 0, 360, 1.0, -1)
    
    # Apply Gaussian blur for smooth transitions
    mask = cv2.GaussianBlur(mask, (21, 21), 0)
    
    return mask


def _apply_mask_to_image(opencv_img, mask):
    """Apply mask to image with transparency"""
    # Ensure mask is in correct format
    if mask.dtype != np.float32:
        mask = mask.astype(np.float32)
    
    if len(mask.shape) == 2:
        # Create 3-channel mask
        mask_3channel = np.stack([mask, mask, mask], axis=-1)
    else:
        mask_3channel = mask
    
    # Apply mask
    result = opencv_img.astype(np.float32) * mask_3channel
    result = result.astype(np.uint8)
    
    # Convert to PIL with transparency
    result_rgb = cv2.cvtColor(result, cv2.COLOR_BGR2RGB)
    result_pil = Image.fromarray(result_rgb)
    
    # Create alpha channel
    alpha_channel = (mask * 255).astype(np.uint8)
    if len(alpha_channel.shape) == 3:
        alpha_channel = alpha_channel[:, :, 0]
    
    alpha = Image.fromarray(alpha_channel)
    result_pil.putalpha(alpha)
    
    return result_pil


def _remove_background_grabcut_enhanced(opencv_img):
    """Enhanced GrabCut algorithm with better initialization and post-processing"""
    height, width = opencv_img.shape[:2]
    
    # Enhanced rectangle calculation based on image content
    gray = cv2.cvtColor(opencv_img, cv2.COLOR_BGR2GRAY)
    
    # Use Otsu thresholding to find foreground regions
    _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    
    # Find contours to determine better bounding rectangle
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    if contours:
        # Find the largest contour (likely the main subject)
        largest_contour = max(contours, key=cv2.contourArea)
        x, y, w, h = cv2.boundingRect(largest_contour)
        
        # Expand the rectangle slightly
        padding = 20
        x = max(0, x - padding)
        y = max(0, y - padding)
        w = min(width - x, w + 2 * padding)
        h = min(height - y, h + 2 * padding)
        
        rect = (x, y, w, h)
    else:
        # Fallback to center rectangle
        rect = (int(width*0.15), int(height*0.1), int(width*0.7), int(height*0.8))
    
    # Initialize GrabCut
    mask = np.zeros((height, width), np.uint8)
    bgdModel = np.zeros((1, 65), np.float64)
    fgdModel = np.zeros((1, 65), np.float64)
    
    try:
        # Apply GrabCut with more iterations
        cv2.grabCut(opencv_img, mask, rect, bgdModel, fgdModel, 8, cv2.GC_INIT_WITH_RECT)
        
        # Create final mask
        mask2 = np.where((mask == 2) | (mask == 0), 0, 1).astype('uint8')
        
        # Enhanced post-processing
        # Remove small noise
        kernel_small = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
        mask2 = cv2.morphologyEx(mask2, cv2.MORPH_OPEN, kernel_small)
        
        # Fill holes
        kernel_large = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7))
        mask2 = cv2.morphologyEx(mask2, cv2.MORPH_CLOSE, kernel_large)
        
        # Smooth edges with bilateral filter
        mask_float = mask2.astype(np.float32)
        mask_float = cv2.bilateralFilter(mask_float, 9, 75, 75)
        
        # Final Gaussian blur for natural edges
        mask_float = cv2.GaussianBlur(mask_float, (3, 3), 1)
        mask2 = np.clip(mask_float, 0, 1)
        
    except Exception:
        # Fallback if GrabCut fails
        mask2 = _create_simple_mask(opencv_img)
    
    # Apply mask to image
    result = _apply_mask_to_image(opencv_img, mask2)
    return result


def _remove_background_threshold_enhanced(opencv_img):
    """Enhanced threshold-based background removal with multiple color spaces"""
    height, width = opencv_img.shape[:2]
    
    # Convert to multiple color spaces for better analysis
    hsv = cv2.cvtColor(opencv_img, cv2.COLOR_BGR2HSV)
    lab = cv2.cvtColor(opencv_img, cv2.COLOR_BGR2LAB)
    gray = cv2.cvtColor(opencv_img, cv2.COLOR_BGR2GRAY)
    
    # Method 1: HSV-based thresholding (good for uniform backgrounds)
    # Detect light/white backgrounds
    lower_light = np.array([0, 0, 180])
    upper_light = np.array([180, 50, 255])
    mask_light = cv2.inRange(hsv, lower_light, upper_light)
    
    # Detect dark backgrounds
    lower_dark = np.array([0, 0, 0])
    upper_dark = np.array([180, 255, 70])
    mask_dark = cv2.inRange(hsv, lower_dark, upper_dark)
    
    # Combine background masks
    background_mask = cv2.bitwise_or(mask_light, mask_dark)
    
    # Method 2: LAB color space thresholding
    # L channel for lightness
    l_channel = lab[:, :, 0]
    _, l_thresh = cv2.threshold(l_channel, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    
    # A and B channels for color information
    a_channel = lab[:, :, 1]
    b_channel = lab[:, :, 2]
    
    # Detect low saturation (grayish backgrounds)
    low_sat_mask = cv2.inRange(hsv, np.array([0, 0, 0]), np.array([180, 50, 255]))
    
    # Method 3: Edge-based refinement
    edges = cv2.Canny(gray, 50, 150)
    
    # Dilate edges to create boundaries
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
    edges_dilated = cv2.dilate(edges, kernel, iterations=2)
    
    # Combine all methods
    # Start with HSV-based background detection
    final_background = background_mask.copy()
    
    # Add low saturation areas (likely background)
    final_background = cv2.bitwise_or(final_background, low_sat_mask)
    
    # Use edges to refine boundaries
    # Areas far from edges are more likely to be background
    dist_transform = cv2.distanceTransform(cv2.bitwise_not(edges_dilated), cv2.DIST_L2, 5)
    _, far_from_edges = cv2.threshold(dist_transform, 30, 255, cv2.THRESH_BINARY)
    far_from_edges = far_from_edges.astype(np.uint8)
    
    # Combine with existing background mask
    final_background = cv2.bitwise_or(final_background, far_from_edges)
    
    # Invert to get foreground mask
    foreground_mask = cv2.bitwise_not(final_background)
    
    # Post-processing for better results
    # Remove small noise
    kernel_small = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    foreground_mask = cv2.morphologyEx(foreground_mask, cv2.MORPH_OPEN, kernel_small)
    
    # Fill holes
    kernel_large = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9))
    foreground_mask = cv2.morphologyEx(foreground_mask, cv2.MORPH_CLOSE, kernel_large)
    
    # Smooth the mask
    mask_float = foreground_mask.astype(np.float32) / 255.0
    mask_float = cv2.GaussianBlur(mask_float, (5, 5), 1)
    
    # Apply bilateral filter for edge preservation
    mask_float = cv2.bilateralFilter(mask_float, 9, 75, 75)
    
    # Apply mask to image
    result = _apply_mask_to_image(opencv_img, mask_float)
    return result


def _remove_background_ai_enhanced(opencv_img):
    """AI-enhanced background removal using advanced computer vision techniques"""
    height, width = opencv_img.shape[:2]
    
    try:
        # Method 1: Watershed segmentation
        gray = cv2.cvtColor(opencv_img, cv2.COLOR_BGR2GRAY)
        
        # Noise removal
        kernel = np.ones((3, 3), np.uint8)
        opening = cv2.morphologyEx(gray, cv2.MORPH_OPEN, kernel, iterations=2)
        
        # Sure background area
        sure_bg = cv2.dilate(opening, kernel, iterations=3)
        
        # Distance transform
        dist_transform = cv2.distanceTransform(opening, cv2.DIST_L2, 5)
        
        # Sure foreground area
        _, sure_fg = cv2.threshold(dist_transform, 0.7 * dist_transform.max(), 255, 0)
        sure_fg = sure_fg.astype(np.uint8)
        
        # Find unknown region using numpy operations
        unknown = sure_bg.astype(np.uint8) - sure_fg
        
        # Marker labelling
        _, markers = cv2.connectedComponents(sure_fg)
        
        # Add one to all labels so that sure background is not 0, but 1
        markers = markers + 1
        
        # Mark the region of unknown with zero
        markers[unknown == 255] = 0
        
        # Apply watershed
        markers = cv2.watershed(opencv_img, markers)
        
        # Create mask from watershed result
        mask = np.zeros(gray.shape, np.uint8)
        mask[markers > 1] = 255
        
        # Refine mask using GrabCut if we have a reasonable region
        if np.sum(mask) > height * width * 0.01:  # At least 1% coverage
            # Use watershed result to initialize GrabCut
            rect = cv2.boundingRect(mask)
            
            if rect[2] > 20 and rect[3] > 20:  # Valid rectangle
                grabcut_mask = np.zeros((height, width), np.uint8)
                grabcut_mask[mask == 255] = cv2.GC_PR_FGD  # Probable foreground
                grabcut_mask[mask == 0] = cv2.GC_PR_BGD    # Probable background
                
                bgdModel = np.zeros((1, 65), np.float64)
                fgdModel = np.zeros((1, 65), np.float64)
                
                try:
                    cv2.grabCut(opencv_img, grabcut_mask, rect, bgdModel, fgdModel, 5, cv2.GC_INIT_WITH_MASK)
                    
                    # Create final mask
                    final_mask = np.where((grabcut_mask == 2) | (grabcut_mask == 0), 0, 1).astype('uint8')
                    mask = final_mask * 255
                except:
                    pass  # Use watershed mask if GrabCut fails
        
        # Convert to float for processing
        mask_float = mask.astype(np.float32) / 255.0
        
        # Advanced post-processing
        # Edge-preserving filter
        mask_float = cv2.bilateralFilter(mask_float, 9, 75, 75)
        
        # Morphological refinement
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
        mask_uint8 = (mask_float * 255).astype(np.uint8)
        mask_uint8 = cv2.morphologyEx(mask_uint8, cv2.MORPH_CLOSE, kernel)
        mask_uint8 = cv2.morphologyEx(mask_uint8, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3)))
        
        mask_float = mask_uint8.astype(np.float32) / 255.0
        
        # Final smoothing
        mask_float = cv2.GaussianBlur(mask_float, (3, 3), 1)
        
    except Exception:
        # Fallback to enhanced GrabCut
        return _remove_background_grabcut_enhanced(opencv_img)
    
    # Apply mask to image
    result = _apply_mask_to_image(opencv_img, mask_float)
    return result


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
        'NEAREST': Image.Resampling.NEAREST,
        'BILINEAR': Image.Resampling.BILINEAR,
        'BICUBIC': Image.Resampling.BICUBIC,
        'LANCZOS': Image.Resampling.LANCZOS,
    }
    
    resample = resample_map.get(method.upper(), Image.Resampling.LANCZOS)
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


def apply_manual_edits(image_data, coordinates, brush_size=10, operation='erase'):
    """Apply manual brush edits to background removal with enhanced error handling"""
    try:
        # Validate input data
        if not image_data:
            raise ValueError("No image data provided")
        
        if not coordinates:
            raise ValueError("No coordinates provided")
        
        # Open image
        img = Image.open(BytesIO(image_data))
        
        # Ensure image has alpha channel
        if img.mode != 'RGBA':
            if img.mode == 'RGB':
                # Add alpha channel (fully opaque)
                img.putalpha(255)
            else:
                img = img.convert('RGBA')
        
        # Convert to numpy array for editing
        img_array = np.array(img, dtype=np.uint8)
        
        # Validate array dimensions
        if len(img_array.shape) != 3 or img_array.shape[2] != 4:
            raise ValueError("Invalid image format - expected RGBA")
        
        height, width = img_array.shape[:2]
        
        # Validate brush size
        brush_size = max(1, min(brush_size, min(width, height) // 4))
        brush_radius = max(1, brush_size // 2)
        
        # Create circular brush mask
        brush_diameter = brush_radius * 2 + 1
        y_indices, x_indices = np.ogrid[:brush_diameter, :brush_diameter]
        center = brush_radius
        brush_mask = (x_indices - center) ** 2 + (y_indices - center) ** 2 <= brush_radius ** 2
        
        # Apply edits at each coordinate
        edits_applied = 0
        for coord in coordinates:
            try:
                if not coord or len(coord) < 2:
                    continue
                
                # Handle different coordinate formats
                if isinstance(coord, (list, tuple)):
                    cx, cy = float(coord[0]), float(coord[1])
                elif hasattr(coord, 'x') and hasattr(coord, 'y'):
                    cx, cy = float(coord.x), float(coord.y)
                else:
                    continue
                
                cx, cy = int(cx), int(cy)
                
                # Ensure coordinates are within image bounds
                if not (0 <= cx < width and 0 <= cy < height):
                    continue
                
                # Calculate brush area bounds
                y_start = max(0, cy - brush_radius)
                y_end = min(height, cy + brush_radius + 1)
                x_start = max(0, cx - brush_radius)
                x_end = min(width, cx + brush_radius + 1)
                
                # Calculate corresponding mask bounds
                mask_y_start = max(0, brush_radius - cy)
                mask_y_end = mask_y_start + (y_end - y_start)
                mask_x_start = max(0, brush_radius - cx)
                mask_x_end = mask_x_start + (x_end - x_start)
                
                # Ensure mask bounds are valid
                if (mask_y_end <= mask_y_start or mask_x_end <= mask_x_start or
                    mask_y_end > brush_diameter or mask_x_end > brush_diameter):
                    continue
                
                # Get the brush area mask
                current_brush_mask = brush_mask[mask_y_start:mask_y_end, mask_x_start:mask_x_end]
                
                if current_brush_mask.size == 0:
                    continue
                
                # Apply the operation
                if operation == 'erase':
                    # Set alpha to 0 (transparent) where brush is applied
                    alpha_slice = img_array[y_start:y_end, x_start:x_end, 3]
                    alpha_slice[current_brush_mask] = 0
                elif operation == 'restore':
                    # Set alpha to 255 (opaque) where brush is applied
                    alpha_slice = img_array[y_start:y_end, x_start:x_end, 3]
                    alpha_slice[current_brush_mask] = 255
                elif operation == 'soften':
                    # Reduce alpha by 50% where brush is applied
                    alpha_slice = img_array[y_start:y_end, x_start:x_end, 3]
                    alpha_slice[current_brush_mask] = (alpha_slice[current_brush_mask] * 0.5).astype(np.uint8)
                
                edits_applied += 1
                
            except Exception as coord_error:
                # Log coordinate-specific error but continue with other coordinates
                print(f"Error processing coordinate {coord}: {coord_error}")
                continue
        
        if edits_applied == 0:
            raise ValueError("No valid edits could be applied")
        
        # Apply slight smoothing to alpha channel for better edges
        if edits_applied > 0:
            alpha_channel = img_array[:, :, 3].astype(np.float32)
            alpha_channel = cv2.GaussianBlur(alpha_channel, (3, 3), 0.5)
            img_array[:, :, 3] = np.clip(alpha_channel, 0, 255).astype(np.uint8)
        
        # Convert back to PIL Image
        result_img = Image.fromarray(img_array, 'RGBA')
        
        # Validate result
        if result_img.size != img.size:
            raise ValueError("Image size changed during processing")
        
        return result_img
        
    except Exception as e:
        # Provide more specific error messages
        error_msg = f"Manual editing failed: {str(e)}"
        if "coordinates" in str(e).lower():
            error_msg = "Invalid coordinate data provided for manual editing"
        elif "image" in str(e).lower():
            error_msg = "Invalid or corrupted image data for manual editing"
        elif "brush" in str(e).lower():
            error_msg = "Invalid brush size or operation type"
        
        raise Exception(error_msg)
