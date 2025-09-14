import React, { useState, useRef } from 'react';
import { Upload, Download, FileText, ArrowRight, Clock, Shield, Star, Sparkles } from 'lucide-react';
import { WordIcon, CheckCircleIcon } from '../components/Icons';

const WordToPdf = () => {
    const [file, setFile] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState(null);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileUpload = (selectedFile) => {
        const allowedTypes = [
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
            'application/msword' // .doc
        ];

        if (!allowedTypes.includes(selectedFile.type) && 
            !selectedFile.name.toLowerCase().endsWith('.doc') && 
            !selectedFile.name.toLowerCase().endsWith('.docx')) {
            setError('Please select a valid Word document (.doc or .docx)');
            return;
        }

        if (selectedFile.size > 50 * 1024 * 1024) { // 50MB limit
            setError('File size must be less than 50MB');
            return;
        }

        setFile(selectedFile);
        setError(null);
        setDownloadUrl(null);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            handleFileUpload(droppedFile);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const convertToPdf = async () => {
        if (!file) return;

        setIsProcessing(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/word-tools/convert-to-pdf/', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setDownloadUrl(data.download_url);
            } else {
                setError(data.error || 'Conversion failed');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('An error occurred during conversion');
        } finally {
            setIsProcessing(false);
        }
    };

    const downloadPdf = () => {
        if (downloadUrl) {
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = file.name.replace(/\.[^/.]+$/, '.pdf');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const resetUpload = () => {
        setFile(null);
        setDownloadUrl(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
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
                        <WordIcon size={40} color="#FF6B6B" />
                        Word to PDF Converter
                    </h1>
                    <p style={{
                        fontSize: '1.1rem',
                        color: '#666',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        Convert your Word documents to PDF format instantly with high quality
                    </p>
                </div>

                {/* Workflow Steps */}
                <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem' }} data-aos="fade-up" data-aos-delay="100">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{
                                width: '50px',
                                height: '50px',
                                background: 'linear-gradient(135deg, #FF6B6B 0%, #FF5252 100%)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white'
                            }}>
                                <FileText size={24} />
                            </div>
                            <span style={{ fontSize: '0.9rem', color: '#666', fontWeight: '500' }}>Upload Word</span>
                        </div>
                        <ArrowRight size={20} color="#FF6B6B" />
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{
                                width: '50px',
                                height: '50px',
                                background: 'linear-gradient(135deg, #FF6B6B 0%, #FF5252 100%)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white'
                            }}>
                                <Upload size={24} />
                            </div>
                            <span style={{ fontSize: '0.9rem', color: '#666', fontWeight: '500' }}>Convert</span>
                        </div>
                        <ArrowRight size={20} color="#FF6B6B" />
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{
                                width: '50px',
                                height: '50px',
                                background: 'linear-gradient(135deg, #FF6B6B 0%, #FF5252 100%)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white'
                            }}>
                                <Download size={24} />
                            </div>
                            <span style={{ fontSize: '0.9rem', color: '#666', fontWeight: '500' }}>Download PDF</span>
                        </div>
                    </div>
                </div>

                {/* Upload Area */}
                <div className="card" style={{ marginBottom: '2rem' }} data-aos="fade-up" data-aos-delay="200">
                    <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                            border: `2px dashed ${file ? '#FF6B6B' : '#ddd'}`,
                            borderRadius: '12px',
                            padding: '3rem 2rem',
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            background: file ? 'rgba(255, 107, 107, 0.05)' : 'transparent'
                        }}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            onChange={(e) => handleFileUpload(e.target.files[0])}
                            style={{ display: 'none' }}
                        />
                        
                        {!file && (
                            <>
                                <WordIcon size={48} color="#999" />
                                <p style={{
                                    fontSize: '1.1rem',
                                    margin: '1rem 0 0.5rem',
                                    color: '#333'
                                }}>
                                    Drag & drop your Word document here
                                </p>
                                <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>
                                    or click to browse
                                </p>
                                <span style={{
                                    fontSize: '0.8rem',
                                    color: '#999',
                                    background: '#f8f9fa',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '15px',
                                    display: 'inline-block'
                                }}>
                                    Supports: .doc, .docx (max 50MB)
                                </span>
                            </>
                        )}

                        {file && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '1rem',
                                background: '#f8f9fa',
                                borderRadius: '8px',
                                border: '1px solid #eee',
                                position: 'relative'
                            }}>
                                <WordIcon size={32} color="#FF6B6B" />
                                <div style={{ flex: 1, textAlign: 'left' }}>
                                    <div style={{ fontWeight: '500', color: '#333' }}>{file.name}</div>
                                    <div style={{ fontSize: '0.85rem', color: '#666' }}>
                                        {formatFileSize(file.size)}
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        resetUpload();
                                    }}
                                    style={{
                                        position: 'absolute',
                                        top: '0.5rem',
                                        right: '0.5rem',
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

                    {error && (
                        <div style={{
                            background: '#fed7d7',
                            color: '#c53030',
                            padding: '1rem',
                            borderRadius: '8px',
                            marginTop: '1rem',
                            textAlign: 'center',
                            border: '1px solid #feb2b2'
                        }}>
                            {error}
                        </div>
                    )}

                    {file && !downloadUrl && (
                        <button
                            onClick={convertToPdf}
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
                                gap: '0.5rem',
                                marginTop: '1.5rem'
                            }}
                        >
                            {isProcessing ? (
                                <>
                                    <div className="loading" style={{ marginRight: '0.5rem' }} />
                                    Converting to PDF...
                                </>
                            ) : (
                                <>
                                    <FileText size={20} />
                                    Convert to PDF
                                </>
                            )}
                        </button>
                    )}

                    {downloadUrl && (
                        <div style={{
                            textAlign: 'center',
                            background: '#f0f9ff',
                            padding: '2rem',
                            borderRadius: '8px',
                            marginTop: '1.5rem',
                            border: '1px solid #e0f2fe'
                        }}>
                            <div style={{
                                color: '#16a34a',
                                fontSize: '1.1rem',
                                fontWeight: '600',
                                marginBottom: '1.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem'
                            }}>
                                <CheckCircleIcon size={20} color="#16a34a" />
                                Conversion completed successfully!
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                                <button
                                    onClick={downloadPdf}
                                    style={{
                                        background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                                        color: 'white',
                                        border: 'none',
                                        padding: '1rem 2rem',
                                        borderRadius: '8px',
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <Download size={20} />
                                    Download PDF
                                </button>
                                <button
                                    onClick={resetUpload}
                                    style={{
                                        background: 'transparent',
                                        color: '#FF6B6B',
                                        border: '2px solid #FF6B6B',
                                        padding: '1rem 2rem',
                                        borderRadius: '8px',
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = '#FF6B6B';
                                        e.currentTarget.style.color = 'white';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.color = '#FF6B6B';
                                    }}
                                >
                                    Convert Another File
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Features Section */}
                <div className="card" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }} data-aos="fade-up" data-aos-delay="300">
                    <h3 style={{
                        fontSize: '1.5rem',
                        fontWeight: '600',
                        color: '#333',
                        marginBottom: '2rem',
                        textAlign: 'center'
                    }}>
                        Why Choose Our Word to PDF Converter?
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                        <div style={{
                            textAlign: 'center',
                            padding: '1.5rem',
                            background: 'white',
                            borderRadius: '12px',
                            border: '1px solid #eee'
                        }}>
                            <Clock size={32} color="#FF6B6B" style={{ marginBottom: '1rem' }} />
                            <h4 style={{ color: '#333', marginBottom: '1rem', fontSize: '1.2rem' }}>Fast Conversion</h4>
                            <p style={{ color: '#666', lineHeight: '1.6' }}>Convert your Word documents to PDF in seconds</p>
                        </div>
                        <div style={{
                            textAlign: 'center',
                            padding: '1.5rem',
                            background: 'white',
                            borderRadius: '12px',
                            border: '1px solid #eee'
                        }}>
                            <Shield size={32} color="#FF6B6B" style={{ marginBottom: '1rem' }} />
                            <h4 style={{ color: '#333', marginBottom: '1rem', fontSize: '1.2rem' }}>Secure Processing</h4>
                            <p style={{ color: '#666', lineHeight: '1.6' }}>Your files are processed securely and deleted after conversion</p>
                        </div>
                        <div style={{
                            textAlign: 'center',
                            padding: '1.5rem',
                            background: 'white',
                            borderRadius: '12px',
                            border: '1px solid #eee'
                        }}>
                            <Star size={32} color="#FF6B6B" style={{ marginBottom: '1rem' }} />
                            <h4 style={{ color: '#333', marginBottom: '1rem', fontSize: '1.2rem' }}>High Quality</h4>
                            <p style={{ color: '#666', lineHeight: '1.6' }}>Maintains original formatting and layout</p>
                        </div>
                        <div style={{
                            textAlign: 'center',
                            padding: '1.5rem',
                            background: 'white',
                            borderRadius: '12px',
                            border: '1px solid #eee'
                        }}>
                            <Sparkles size={32} color="#FF6B6B" style={{ marginBottom: '1rem' }} />
                            <h4 style={{ color: '#333', marginBottom: '1rem', fontSize: '1.2rem' }}>Free to Use</h4>
                            <p style={{ color: '#666', lineHeight: '1.6' }}>No watermarks, no registration required</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WordToPdf;