import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import { Download, Shield, Lock, Key, FileText } from 'lucide-react';
import { LightBulbIcon } from '../components/Icons';

const SecurityCenter = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [result, setResult] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [securityMethod, setSecurityMethod] = useState('password');
    const [password, setPassword] = useState('');
    const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');

    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            const uploadedFile = acceptedFiles[0];
            setFile(uploadedFile);
            if (uploadedFile.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => setPreview(e.target.result);
                reader.readAsDataURL(uploadedFile);
            }
            setResult(null);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'text/plain': ['.txt'],
            'image/*': ['.jpg', '.jpeg', '.png']
        },
        maxFiles: 1
    });

    const applySecurityMethod = async () => {
        if (!file) {
            toast.error('Please select a document first');
            return;
        }

        if (securityMethod === 'password' && !password) {
            toast.error('Please enter a password');
            return;
        }

        if (securityMethod === 'watermark' && !watermarkText) {
            toast.error('Please enter watermark text');
            return;
        }

        setIsProcessing(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('method', securityMethod);
        if (password) formData.append('password', password);
        if (watermarkText) formData.append('watermark_text', watermarkText);

        try {
            let endpoint = '';
            switch (securityMethod) {
                case 'password':
                    endpoint = '/api/security/password-protect/';
                    break;
                case 'encrypt':
                    endpoint = '/api/security/encrypt/';
                    break;
                case 'watermark':
                    endpoint = '/api/security/watermark/';
                    break;
                default:
                    endpoint = '/api/security/password-protect/';
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setResult(data);
                    toast.success('Security applied successfully!');
                } else {
                    toast.error(`Error: ${data.error}`);
                }
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
        if (result && result.download_url) {
            window.open(result.download_url, '_blank');
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
                        Security Center
                    </h1>
                    <p style={{
                        fontSize: '1.1rem',
                        color: '#666',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        Protect your documents with advanced security features including password protection, encryption, and watermarking
                    </p>
                </div>

                {/* Security Method Selection */}
                <div className="card" style={{ marginBottom: '2rem' }} data-aos="fade-up" data-aos-delay="100">
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#333', marginBottom: '1rem' }}>
                        Choose Security Method
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        {[
                            { value: 'password', label: 'Password Protection', icon: Lock, desc: 'Secure your documents with password protection' },
                            { value: 'encrypt', label: 'File Encryption', icon: Key, desc: 'Encrypt files with military-grade security' },
                            { value: 'watermark', label: 'Digital Watermark', icon: FileText, desc: 'Add custom watermarks to your documents' }
                        ].map((method) => (
                            <div
                                key={method.value}
                                onClick={() => setSecurityMethod(method.value)}
                                style={{
                                    padding: '1rem',
                                    border: securityMethod === method.value ? '2px solid #FF6B6B' : '1px solid #ddd',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    background: securityMethod === method.value ? 'rgba(255, 107, 107, 0.05)' : 'white',
                                    textAlign: 'center'
                                }}
                            >
                                <method.icon size={32} color={securityMethod === method.value ? '#FF6B6B' : '#666'} style={{ marginBottom: '0.5rem' }} />
                                <div style={{ fontWeight: '600', color: '#333', marginBottom: '0.5rem' }}>{method.label}</div>
                                <div style={{ fontSize: '0.85rem', color: '#666' }}>{method.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Upload Area */}
                <div className="card" style={{ marginBottom: '2rem' }} data-aos="fade-up" data-aos-delay="200">
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
                        <Shield size={48} color={isDragActive ? '#FF6B6B' : '#999'} />
                        <p style={{
                            fontSize: '1.1rem',
                            margin: '1rem 0 0.5rem',
                            color: isDragActive ? '#FF6B6B' : '#333'
                        }}>
                            {isDragActive ? 'Drop your document here...' : 'Drag & drop your document here'}
                        </p>
                        <p style={{ color: '#666', fontSize: '0.9rem' }}>
                            or click to browse (PDF, Word, Text, and Image files)
                        </p>
                    </div>
                </div>

                {/* Selected File & Settings */}
                {file && (
                    <div className="card" style={{ marginBottom: '2rem' }} data-aos="fade-up" data-aos-delay="300">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#333' }}>
                                Selected Document
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
                            {preview ? (
                                <img src={preview} alt="Preview" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                            ) : (
                                <FileText size={60} color="#666" />
                            )}
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: '500', color: '#333' }}>{file.name}</div>
                                <div style={{ fontSize: '0.85rem', color: '#666' }}>{formatFileSize(file.size)}</div>
                            </div>
                        </div>

                        {/* Security Settings */}
                        {securityMethod === 'password' && (
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                                    Password:
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter password (min 8 characters)"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid #ddd',
                                        borderRadius: '6px',
                                        fontSize: '1rem'
                                    }}
                                />
                            </div>
                        )}

                        {securityMethod === 'watermark' && (
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                                    Watermark Text:
                                </label>
                                <input
                                    type="text"
                                    value={watermarkText}
                                    onChange={(e) => setWatermarkText(e.target.value)}
                                    placeholder="Enter watermark text"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid #ddd',
                                        borderRadius: '6px',
                                        fontSize: '1rem'
                                    }}
                                />
                            </div>
                        )}

                        <button
                            onClick={applySecurityMethod}
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
                                    Applying Security...
                                </>
                            ) : (
                                <>
                                    <Shield size={20} />
                                    Apply Security
                                </>
                            )}
                        </button>
                    </div>
                )}

                {/* Result */}
                {result && (
                    <div className="card" style={{ marginBottom: '2rem' }} data-aos="fade-up" data-aos-delay="400">
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#333', marginBottom: '1.5rem' }}>
                            Security Applied Successfully!
                        </h3>
                        
                        <div style={{ 
                            padding: '1rem', 
                            background: '#d4edda', 
                            border: '1px solid #c3e6cb', 
                            borderRadius: '8px', 
                            marginBottom: '1.5rem',
                            color: '#155724'
                        }}>
                            <p style={{ margin: '0', fontWeight: '500' }}>{result.message}</p>
                            {result.encryption_key && (
                                <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem' }}>
                                    <strong>Encryption Key:</strong> {result.encryption_key}
                                    <br />
                                    <small>Please save this key - you'll need it to decrypt the file!</small>
                                </p>
                            )}
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
                            Download Secured Document
                        </button>
                    </div>
                )}

                {/* Security Features */}
                <div className="card" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }} data-aos="fade-up" data-aos-delay={result ? "500" : "400"}>
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
                        Security Features
                    </h3>
                    <ul style={{
                        listStyle: 'none',
                        color: '#666',
                        lineHeight: '1.6'
                    }}>
                        <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Lock size={16} color="#FF6B6B" />
                            <span>Military-grade encryption for maximum security</span>
                        </li>
                        <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Key size={16} color="#FF6B6B" />
                            <span>Zero server storage - files processed and deleted immediately</span>
                        </li>
                        <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Shield size={16} color="#FF6B6B" />
                            <span>Privacy guaranteed - your documents never leave your control</span>
                        </li>
                        <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FileText size={16} color="#FF6B6B" />
                            <span>Secure processing with automatic cleanup</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SecurityCenter;