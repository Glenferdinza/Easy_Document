import React, { useState, useCallback } from 'react';  
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import { Download, Settings, Sparkles } from 'lucide-react';
import { BackgroundRemoverIcon, LightBulbIcon } from '../components/Icons';

const BackgroundRemover = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [result, setResult] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [method, setMethod] = useState('auto');

    const onDrop = useCallback((acceptedFiles) => {
        const imageFiles = acceptedFiles.filter(file => file.type.startsWith('image/'));
        if (imageFiles.length !== acceptedFiles.length) {
            toast.warning('Only image files are allowed');
        }
        if (imageFiles.length > 0) {
            const uploadedFile = imageFiles[0];
            setFile(uploadedFile);
            const reader = new FileReader();
            reader.onload = (e) => setPreview(e.target.result);
            reader.readAsDataURL(uploadedFile);
            setResult(null);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.heic', '.bmp', '.tiff']
        },
        maxFiles: 1
    });

    const removeBackground = async () => {
        if (!file) {
            toast.error('Please select an image first');
            return;
        }

        setIsProcessing(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('method', method);

        try {
            const response = await fetch('/api/image-processing/remove-background/', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                setResult(url);
                toast.success('Background removed successfully!');
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
            link.download = `${file.name.split('.')[0]}_no_bg.png`;
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
        <div style={{ padding: '6rem 0' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '4rem' }} data-aos="fade-up">
                    <h1 style={{
                        fontSize: '2.5rem',
                        fontWeight: '700',
                        color: '#333',
                        marginBottom: '1rem'
                    }}>
                        Background Remover
                    </h1>
                    <p style={{
                        fontSize: '1.1rem',
                        color: '#666',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        Remove backgrounds from your images automatically using AI-powered technology
                    </p>
                </div>

                {/* Upload Area */}
                <div className="card" style={{ marginBottom: '2rem' }} data-aos="fade-up" data-aos-delay="100">
                    <div {...getRootProps()} style={{
                        border: `2px dashed ${isDragActive ? '#FF6B6B' : '#ddd'}`,
                        borderRadius: '12px',
                        padding: '3rem 2rem',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        background: isDragActive ? 'rgba(255, 107, 107, 0.05)' : 'transparent'
                    }}>
                        <input {...getInputProps()} />
                        <BackgroundRemoverIcon size={48} color={isDragActive ? '#FF6B6B' : '#999'} />
                        <p style={{
                            fontSize: '1.1rem',
                            margin: '1rem 0 0.5rem',
                            color: isDragActive ? '#FF6B6B' : '#333'
                        }}>
                            {isDragActive ? 'Drop your image here...' : 'Drag & drop your image here'}
                        </p>
                        <p style={{ color: '#666', fontSize: '0.9rem' }}>
                            or click to browse (JPG, PNG, WebP, HEIC, BMP, TIFF)
                        </p>
                    </div>
                </div>

                {/* Selected File & Settings */}
                {file && (
                    <div className="card" style={{ marginBottom: '2rem' }} data-aos="fade-up" data-aos-delay="200">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#333' }}>
                                Selected Image
                            </h3>
                            <button
                                onClick={() => {
                                    setFile(null);
                                    setPreview(null);
                                    setResult(null);
                                }}
                                style={{
                                    background: 'none',
                                    border: '1px solid #FF6B6B',
                                    color: '#FF6B6B',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#FF6B6B';
                                    e.currentTarget.style.color = 'white';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'none';
                                    e.currentTarget.style.color = '#FF6B6B';
                                }}
                            >
                                Clear
                            </button>
                        </div>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            padding: '1rem',
                            background: '#f8f9fa',
                            borderRadius: '8px',
                            border: '1px solid #eee',
                            marginBottom: '1.5rem'
                        }}>
                            <img src={preview} alt="Preview" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: '500', color: '#333' }}>{file.name}</div>
                                <div style={{ fontSize: '0.85rem', color: '#666' }}>{formatFileSize(file.size)}</div>
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                                <Settings size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                                Removal Method:
                            </label>
                            <select
                                value={method}
                                onChange={(e) => setMethod(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '1px solid #ddd',
                                    borderRadius: '6px',
                                    fontSize: '1rem'
                                }}
                            >
                                <option value="auto">Automatic (Recommended)</option>
                                <option value="grabcut">GrabCut Algorithm</option>
                                <option value="threshold">Threshold-based</option>
                            </select>
                        </div>

                        <button
                            onClick={removeBackground}
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
                                    Removing Background...
                                </>
                            ) : (
                                <>
                                    <Sparkles size={20} />
                                    Remove Background
                                </>
                            )}
                        </button>
                    </div>
                )}

                {/* Result */}
                {result && (
                    <div className="card" style={{ marginBottom: '2rem' }} data-aos="fade-up" data-aos-delay="300">
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#333', marginBottom: '1.5rem' }}>
                            Result
                        </h3>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div>
                                <h4 style={{ fontSize: '1rem', fontWeight: '500', color: '#666', marginBottom: '0.5rem' }}>Original</h4>
                                <img src={preview} alt="Original" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #eee' }} />
                            </div>
                            <div>
                                <h4 style={{ fontSize: '1rem', fontWeight: '500', color: '#666', marginBottom: '0.5rem' }}>Background Removed</h4>
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
                            Download Result
                        </button>
                    </div>
                )}

                {/* Tips Section */}
                <div className="card" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }} data-aos="fade-up" data-aos-delay={result ? "400" : "300"}>
                    <h3 style={{
                        fontSize: '1.2rem',
                        fontWeight: '600',
                        color: '#333',
                        marginBottom: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <LightBulbIcon size={20} color="#FF6B6B" />
                        Background Removal Tips
                    </h3>
                    <ul style={{
                        listStyle: 'none',
                        color: '#666',
                        lineHeight: '1.6'
                    }}>
                        <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <BackgroundRemoverIcon size={16} color="#FF6B6B" />
                            <span>Works best with clear contrast between subject and background</span>
                        </li>
                        <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Settings size={16} color="#FF6B6B" />
                            <span>Try different methods if automatic doesn't work well</span>
                        </li>
                        <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Download size={16} color="#FF6B6B" />
                            <span>Result will be saved as PNG with transparent background</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default BackgroundRemover;