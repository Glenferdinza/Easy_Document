import React, { useState } from 'react';
import { Download, QrCode, Link, Phone, Mail, MessageSquare, Wifi, Calendar } from 'lucide-react';

const QRGenerator = () => {
    const [qrType, setQrType] = useState('text');
    const [qrContent, setQrContent] = useState('');
    const [qrResult, setQrResult] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [qrSize, setQrSize] = useState(256);
    const [errorLevel, setErrorLevel] = useState('M');

    const qrTypes = [
        { value: 'text', label: 'Text', icon: MessageSquare, placeholder: 'Enter your text here...' },
        { value: 'url', label: 'Website URL', icon: Link, placeholder: 'https://example.com' },
        { value: 'email', label: 'Email', icon: Mail, placeholder: 'email@example.com' },
        { value: 'phone', label: 'Phone', icon: Phone, placeholder: '+1234567890' },
        { value: 'wifi', label: 'WiFi', icon: Wifi, placeholder: 'WIFI:T:WPA;S:NetworkName;P:Password;;' },
        { value: 'event', label: 'Calendar Event', icon: Calendar, placeholder: 'Event details...' }
    ];

    const generateQR = async () => {
        if (!qrContent.trim()) {
            return;
        }

        setIsGenerating(true);
        const formData = new FormData();
        formData.append('content', qrContent);
        formData.append('type', qrType);
        formData.append('size', qrSize);
        formData.append('error_level', errorLevel);

        try {
            const response = await fetch('/api/qr-tools/generate/', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                setQrResult(url);
            } else {
                console.error('Failed to generate QR code');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const downloadQR = () => {
        if (qrResult) {
            const link = document.createElement('a');
            link.href = qrResult;
            link.download = `qrcode_${qrType}.png`;
            link.click();
        }
    };

    const selectedType = qrTypes.find(type => type.value === qrType);

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
                        <QrCode size={40} color="#FF6B6B" />
                        QR Code Generator
                    </h1>
                    <p style={{
                        fontSize: '1.1rem',
                        color: '#666',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        Create custom QR codes for text, URLs, emails, phone numbers, WiFi, and more
                    </p>
                </div>

                {/* QR Type Selection */}
                <div className="card" style={{ marginBottom: '2rem' }} data-aos="fade-up" data-aos-delay="100">
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#333', marginBottom: '1rem' }}>
                        Choose QR Code Type
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                        {qrTypes.map((type) => {
                            const Icon = type.icon;
                            return (
                                <div
                                    key={type.value}
                                    onClick={() => setQrType(type.value)}
                                    style={{
                                        padding: '1rem',
                                        border: qrType === type.value ? '2px solid #FF6B6B' : '1px solid #ddd',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        background: qrType === type.value ? 'rgba(255, 107, 107, 0.05)' : 'white',
                                        textAlign: 'center'
                                    }}
                                >
                                    <Icon 
                                        size={24} 
                                        color={qrType === type.value ? '#FF6B6B' : '#666'} 
                                        style={{ marginBottom: '0.5rem' }}
                                    />
                                    <div style={{ fontWeight: '500', color: qrType === type.value ? '#FF6B6B' : '#333' }}>
                                        {type.label}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Content Input */}
                <div className="card" style={{ marginBottom: '2rem' }} data-aos="fade-up" data-aos-delay="200">
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#333', marginBottom: '1rem' }}>
                        {selectedType ? `Enter ${selectedType.label}` : 'Enter Content'}
                    </h3>
                    <textarea
                        value={qrContent}
                        onChange={(e) => setQrContent(e.target.value)}
                        placeholder={selectedType ? selectedType.placeholder : 'Enter content for QR code...'}
                        style={{
                            width: '100%',
                            minHeight: '120px',
                            padding: '1rem',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            resize: 'vertical',
                            marginBottom: '1rem'
                        }}
                    />

                    {/* Settings */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333' }}>
                                QR Code Size:
                            </label>
                            <select
                                value={qrSize}
                                onChange={(e) => setQrSize(parseInt(e.target.value))}
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    border: '1px solid #ddd',
                                    borderRadius: '6px',
                                    fontSize: '1rem'
                                }}
                            >
                                <option value={128}>128x128 (Small)</option>
                                <option value={256}>256x256 (Medium)</option>
                                <option value={512}>512x512 (Large)</option>
                                <option value={1024}>1024x1024 (Extra Large)</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333' }}>
                                Error Correction:
                            </label>
                            <select
                                value={errorLevel}
                                onChange={(e) => setErrorLevel(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    border: '1px solid #ddd',
                                    borderRadius: '6px',
                                    fontSize: '1rem'
                                }}
                            >
                                <option value="L">Low (7%)</option>
                                <option value="M">Medium (15%)</option>
                                <option value="Q">Quartile (25%)</option>
                                <option value="H">High (30%)</option>
                            </select>
                        </div>
                    </div>

                    <button
                        onClick={generateQR}
                        disabled={isGenerating || !qrContent.trim()}
                        style={{
                            width: '100%',
                            padding: '1rem 2rem',
                            background: (!isGenerating && qrContent.trim()) ? 'linear-gradient(135deg, #FF6B6B 0%, #FF5252 100%)' : '#ccc',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            cursor: (!isGenerating && qrContent.trim()) ? 'pointer' : 'not-allowed',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        {isGenerating ? (
                            <>
                                <div className="loading" style={{ marginRight: '0.5rem' }} />
                                Generating QR Code...
                            </>
                        ) : (
                            <>
                                <QrCode size={20} />
                                Generate QR Code
                            </>
                        )}
                    </button>
                </div>

                {/* Result */}
                {qrResult && (
                    <div className="card" style={{ marginBottom: '2rem' }} data-aos="fade-up" data-aos-delay="300">
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#333', marginBottom: '1.5rem' }}>
                            Generated QR Code
                        </h3>
                        
                        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                            <img 
                                src={qrResult} 
                                alt="Generated QR Code" 
                                style={{ 
                                    maxWidth: '300px', 
                                    height: 'auto', 
                                    border: '1px solid #eee', 
                                    borderRadius: '8px',
                                    background: 'white',
                                    padding: '1rem'
                                }} 
                            />
                        </div>

                        <button
                            onClick={downloadQR}
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
                            Download QR Code
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
                        <QrCode size={20} color="#FF6B6B" />
                        QR Code Tips
                    </h3>
                    <ul style={{
                        listStyle: 'none',
                        color: '#666',
                        lineHeight: '1.6'
                    }}>
                        <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <QrCode size={16} color="#FF6B6B" />
                            <span>Higher error correction allows QR codes to work even if damaged</span>
                        </li>
                        <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Link size={16} color="#FF6B6B" />
                            <span>URLs should include http:// or https:// for proper recognition</span>
                        </li>
                        <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Download size={16} color="#FF6B6B" />
                            <span>QR codes are saved as PNG images with transparent backgrounds</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default QRGenerator;