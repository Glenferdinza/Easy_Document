import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import { Download, FileImage, Type, Droplets, Move, RotateCw } from 'lucide-react';

const WatermarkTools = () => {
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [result, setResult] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [watermarkType, setWatermarkType] = useState('text');
    const [watermarkText, setWatermarkText] = useState('WATERMARK');
    const [watermarkImage, setWatermarkImage] = useState(null);
    const [watermarkImagePreview, setWatermarkImagePreview] = useState(null);
    const [position, setPosition] = useState('center');
    const [opacity, setOpacity] = useState(50);
    const [fontSize, setFontSize] = useState(48);
    const [rotation, setRotation] = useState(0);

    const onImageDrop = useCallback((acceptedFiles) => {
        const imageFiles = acceptedFiles.filter(file => file.type.startsWith('image/'));
        if (imageFiles.length !== acceptedFiles.length) {
            toast.warning('Only image files are allowed');
        }
        if (imageFiles.length > 0) {
            const uploadedFile = imageFiles[0];
            setImage(uploadedFile);
            const reader = new FileReader();
            reader.onload = (e) => setImagePreview(e.target.result);
            reader.readAsDataURL(uploadedFile);
            setResult(null);
        }
    }, []);

    const onWatermarkDrop = useCallback((acceptedFiles) => {
        const imageFiles = acceptedFiles.filter(file => file.type.startsWith('image/'));
        if (imageFiles.length !== acceptedFiles.length) {
            toast.warning('Only image files are allowed for watermark');
        }
        if (imageFiles.length > 0) {
            const uploadedFile = imageFiles[0];
            setWatermarkImage(uploadedFile);
            const reader = new FileReader();
            reader.onload = (e) => setWatermarkImagePreview(e.target.result);
            reader.readAsDataURL(uploadedFile);
        }
    }, []);

    const { getRootProps: getImageRootProps, getInputProps: getImageInputProps, isDragActive: isImageDragActive } = useDropzone({
        onDrop: onImageDrop,
        accept: {
            'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.tiff']
        },
        maxFiles: 1
    });

    const { getRootProps: getWatermarkRootProps, getInputProps: getWatermarkInputProps, isDragActive: isWatermarkDragActive } = useDropzone({
        onDrop: onWatermarkDrop,
        accept: {
            'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.tiff']
        },
        maxFiles: 1
    });

    const applyWatermark = async () => {
        if (!image) {
            toast.error('Please select an image first');
            return;
        }

        if (watermarkType === 'text' && !watermarkText.trim()) {
            toast.error('Please enter watermark text');
            return;
        }

        if (watermarkType === 'image' && !watermarkImage) {
            toast.error('Please select a watermark image');
            return;
        }

        setIsProcessing(true);
        const formData = new FormData();
        formData.append('image', image);
        formData.append('watermark_type', watermarkType);
        formData.append('position', position);
        formData.append('opacity', opacity);
        formData.append('rotation', rotation);

        if (watermarkType === 'text') {
            formData.append('text', watermarkText);
            formData.append('font_size', fontSize);
        } else {
            formData.append('watermark_image', watermarkImage);
        }

        try {
            const response = await fetch('/api/watermark/apply/', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                setResult(url);
                toast.success('Watermark applied successfully!');
            } else {
                const error = await response.json();
                toast.error(`Error: ${error.error}`);
            }
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        } finally {
            setIsProcessing(false);
        }
    };

    const downloadResult = () => {
        if (result) {
            const link = document.createElement('a');
            link.href = result;
            link.download = `${image.name.split('.')[0]}_watermarked.png`;
            link.click();
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div style={{ padding: '6rem 0', background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', minHeight: '100vh' }}>
            <div className="container">
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '4rem' }} data-aos="fade-up">
                    <h1 style={{
                        fontSize: '2.5rem',
                        fontWeight: '700',
                        color: '#333',
                        marginBottom: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '1rem'
                    }}>
                        <FileImage size={40} color="#FF6B6B" />
                        Watermark Tools
                    </h1>
                    <p style={{
                        fontSize: '1.1rem',
                        color: '#666',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        Add text or image watermarks to protect your images and brand your content
                    </p>
                </div>

                {/* Main Image Upload */}
                <div className="card" style={{ marginBottom: '2rem' }} data-aos="fade-up" data-aos-delay="100">
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#333', marginBottom: '1rem' }}>
                        Upload Image to Watermark
                    </h3>
                    <div {...getImageRootProps()} style={{
                        border: `2px dashed ${isImageDragActive ? '#FF6B6B' : '#ddd'}`,
                        borderRadius: '12px',
                        padding: '3rem 2rem',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        background: isImageDragActive ? 'rgba(255, 107, 107, 0.05)' : 'transparent'
                    }}>
                        <input {...getImageInputProps()} />
                        <FileImage size={48} color={isImageDragActive ? '#FF6B6B' : '#999'} />
                        <p style={{
                            fontSize: '1.1rem',
                            margin: '1rem 0 0.5rem',
                            color: isImageDragActive ? '#FF6B6B' : '#333'
                        }}>
                            {isImageDragActive ? 'Drop your image here...' : 'Drag & drop your image here'}
                        </p>
                        <p style={{ color: '#666', fontSize: '0.9rem' }}>
                            or click to browse (JPG, PNG, WebP, BMP, TIFF)
                        </p>
                    </div>

                    {image && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            padding: '1rem',
                            background: '#f8f9fa',
                            borderRadius: '8px',
                            border: '1px solid #eee',
                            marginTop: '1rem'
                        }}>
                            <img src={imagePreview} alt="Preview" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: '500', color: '#333' }}>{image.name}</div>
                                <div style={{ fontSize: '0.85rem', color: '#666' }}>{formatFileSize(image.size)}</div>
                            </div>
                            <button
                                onClick={() => {
                                    setImage(null);
                                    setImagePreview(null);
                                    setResult(null);
                                }}
                                style={{
                                    background: '#FF6B6B',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '30px',
                                    height: '30px',
                                    cursor: 'pointer',
                                    fontSize: '1.2rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                ×
                            </button>
                        </div>
                    )}
                </div>

                {/* Watermark Type Selection */}
                {image && (
                    <div className="card" style={{ marginBottom: '2rem' }} data-aos="fade-up" data-aos-delay="200">
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#333', marginBottom: '1rem' }}>
                            Choose Watermark Type
                        </h3>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                            <button
                                onClick={() => setWatermarkType('text')}
                                style={{
                                    flex: '1',
                                    padding: '1rem',
                                    border: watermarkType === 'text' ? '2px solid #FF6B6B' : '1px solid #ddd',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    background: watermarkType === 'text' ? 'rgba(255, 107, 107, 0.05)' : 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                <Type size={20} color={watermarkType === 'text' ? '#FF6B6B' : '#666'} />
                                <span style={{ fontWeight: '500', color: watermarkType === 'text' ? '#FF6B6B' : '#333' }}>
                                    Text Watermark
                                </span>
                            </button>
                            <button
                                onClick={() => setWatermarkType('image')}
                                style={{
                                    flex: '1',
                                    padding: '1rem',
                                    border: watermarkType === 'image' ? '2px solid #FF6B6B' : '1px solid #ddd',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    background: watermarkType === 'image' ? 'rgba(255, 107, 107, 0.05)' : 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                <FileImage size={20} color={watermarkType === 'image' ? '#FF6B6B' : '#666'} />
                                <span style={{ fontWeight: '500', color: watermarkType === 'image' ? '#FF6B6B' : '#333' }}>
                                    Image Watermark
                                </span>
                            </button>
                        </div>

                        {/* Text Watermark Settings */}
                        {watermarkType === 'text' && (
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333' }}>
                                    Watermark Text:
                                </label>
                                <input
                                    type="text"
                                    value={watermarkText}
                                    onChange={(e) => setWatermarkText(e.target.value)}
                                    placeholder="Enter your watermark text..."
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid #ddd',
                                        borderRadius: '6px',
                                        fontSize: '1rem',
                                        marginBottom: '1rem'
                                    }}
                                />
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333' }}>
                                    Font Size: {fontSize}px
                                </label>
                                <input
                                    type="range"
                                    min="20"
                                    max="100"
                                    value={fontSize}
                                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                                    style={{ width: '100%' }}
                                />
                            </div>
                        )}

                        {/* Image Watermark Settings */}
                        {watermarkType === 'image' && (
                            <div style={{ marginBottom: '1.5rem' }}>
                                <div {...getWatermarkRootProps()} style={{
                                    border: `2px dashed ${isWatermarkDragActive ? '#FF6B6B' : '#ddd'}`,
                                    borderRadius: '8px',
                                    padding: '2rem',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    background: isWatermarkDragActive ? 'rgba(255, 107, 107, 0.05)' : 'transparent'
                                }}>
                                    <input {...getWatermarkInputProps()} />
                                    <FileImage size={32} color={isWatermarkDragActive ? '#FF6B6B' : '#999'} />
                                    <p style={{ margin: '0.5rem 0', color: '#333' }}>
                                        {isWatermarkDragActive ? 'Drop watermark image...' : 'Upload watermark image'}
                                    </p>
                                </div>

                                {watermarkImage && (
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        padding: '1rem',
                                        background: '#f8f9fa',
                                        borderRadius: '8px',
                                        border: '1px solid #eee',
                                        marginTop: '1rem'
                                    }}>
                                        <img src={watermarkImagePreview} alt="Watermark Preview" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: '500', color: '#333' }}>{watermarkImage.name}</div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setWatermarkImage(null);
                                                setWatermarkImagePreview(null);
                                            }}
                                            style={{
                                                background: '#FF6B6B',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '50%',
                                                width: '24px',
                                                height: '24px',
                                                cursor: 'pointer',
                                                fontSize: '1rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            ×
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Common Settings */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333' }}>
                                    Position:
                                </label>
                                <select
                                    value={position}
                                    onChange={(e) => setPosition(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        border: '1px solid #ddd',
                                        borderRadius: '6px',
                                        fontSize: '1rem'
                                    }}
                                >
                                    <option value="top-left">Top Left</option>
                                    <option value="top-center">Top Center</option>
                                    <option value="top-right">Top Right</option>
                                    <option value="center-left">Center Left</option>
                                    <option value="center">Center</option>
                                    <option value="center-right">Center Right</option>
                                    <option value="bottom-left">Bottom Left</option>
                                    <option value="bottom-center">Bottom Center</option>
                                    <option value="bottom-right">Bottom Right</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333' }}>
                                    Opacity: {opacity}%
                                </label>
                                <input
                                    type="range"
                                    min="10"
                                    max="100"
                                    value={opacity}
                                    onChange={(e) => setOpacity(parseInt(e.target.value))}
                                    style={{ width: '100%' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333' }}>
                                    Rotation: {rotation}°
                                </label>
                                <input
                                    type="range"
                                    min="-45"
                                    max="45"
                                    value={rotation}
                                    onChange={(e) => setRotation(parseInt(e.target.value))}
                                    style={{ width: '100%' }}
                                />
                            </div>
                        </div>

                        <button
                            onClick={applyWatermark}
                            disabled={isProcessing}
                            style={{
                                width: '100%',
                                padding: '1rem 2rem',
                                background: !isProcessing ? 'linear-gradient(135deg, #FF6B6B 0%, #FF5252 100%)' : '#ccc',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '1.1rem',
                                fontWeight: '600',
                                cursor: !isProcessing ? 'pointer' : 'not-allowed',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            {isProcessing ? (
                                <>
                                    <div className="loading" style={{ marginRight: '0.5rem' }} />
                                    Applying Watermark...
                                </>
                            ) : (
                                <>
                                    <Droplets size={20} />
                                    Apply Watermark
                                </>
                            )}
                        </button>
                    </div>
                )}

                {/* Result */}
                {result && (
                    <div className="card" style={{ marginBottom: '2rem' }} data-aos="fade-up" data-aos-delay="300">
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#333', marginBottom: '1.5rem' }}>
                            Watermarked Image
                        </h3>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div>
                                <h4 style={{ fontSize: '1rem', fontWeight: '500', color: '#666', marginBottom: '0.5rem' }}>Original</h4>
                                <img src={imagePreview} alt="Original" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #eee' }} />
                            </div>
                            <div>
                                <h4 style={{ fontSize: '1rem', fontWeight: '500', color: '#666', marginBottom: '0.5rem' }}>With Watermark</h4>
                                <img src={result} alt="Result" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #eee' }} />
                            </div>
                        </div>

                        <button
                            onClick={downloadResult}
                            style={{
                                width: '100%',
                                padding: '1rem 2rem',
                                background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '1.1rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            <Download size={20} />
                            Download Watermarked Image
                        </button>
                    </div>
                )}

                {/* Tips Section */}
                <div className="card" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }} data-aos="fade-up" data-aos-delay="400">
                    <h3 style={{
                        fontSize: '1.2rem',
                        fontWeight: '600',
                        color: '#333',
                        marginBottom: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <Droplets size={20} color="#FF6B6B" />
                        Watermark Tips
                    </h3>
                    <ul style={{
                        listStyle: 'none',
                        color: '#666',
                        lineHeight: '1.6'
                    }}>
                        <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Type size={16} color="#FF6B6B" />
                            <span>Text watermarks work best with high contrast colors</span>
                        </li>
                        <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FileImage size={16} color="#FF6B6B" />
                            <span>Use PNG images with transparency for best watermark results</span>
                        </li>
                        <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Move size={16} color="#FF6B6B" />
                            <span>Corner positions are less intrusive than center placement</span>
                        </li>
                        <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <RotateCw size={16} color="#FF6B6B" />
                            <span>Slight rotation can make watermarks more distinctive</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default WatermarkTools;