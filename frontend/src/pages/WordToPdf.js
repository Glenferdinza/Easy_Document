import React, { useState, useRef } from 'react';
import { Upload, Download, FileText, ArrowRight } from 'lucide-react';
import { WordIcon } from '../components/Icons';
import './WordToPdf.css';

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

    return (
        <div className="word-to-pdf-page">
            <div className="container">
                <h1 className="title">
                    <WordIcon size={40} />
                    Word to PDF Converter
                </h1>
                <p className="subtitle">
                    Convert your Word documents to PDF format instantly
                </p>

                <div className="conversion-workflow">
                    <div className="workflow-step">
                        <div className="step-icon">
                            <FileText size={24} />
                        </div>
                        <span>Upload Word</span>
                    </div>
                    <ArrowRight className="workflow-arrow" size={20} />
                    <div className="workflow-step">
                        <div className="step-icon">
                            <Upload size={24} />
                        </div>
                        <span>Convert</span>
                    </div>
                    <ArrowRight className="workflow-arrow" size={20} />
                    <div className="workflow-step">
                        <div className="step-icon">
                            <Download size={24} />
                        </div>
                        <span>Download PDF</span>
                    </div>
                </div>

                <div className="upload-section">
                    <div
                        className={`dropzone ${file ? 'has-file' : ''}`}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            onChange={(e) => handleFileUpload(e.target.files[0])}
                            style={{ display: 'none' }}
                        />
                        
                        {!file && (
                            <div className="upload-placeholder">
                                <WordIcon size={48} />
                                <h3>Drop your Word document here</h3>
                                <p>or click to select a file</p>
                                <span className="file-types">Supports: .doc, .docx (max 50MB)</span>
                            </div>
                        )}

                        {file && (
                            <div className="file-info">
                                <WordIcon size={32} />
                                <div className="file-details">
                                    <h4>{file.name}</h4>
                                    <p>{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                </div>
                                <button onClick={resetUpload} className="remove-btn">×</button>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    {file && !downloadUrl && (
                        <button
                            onClick={convertToPdf}
                            disabled={isProcessing}
                            className="convert-btn"
                        >
                            {isProcessing ? (
                                <>
                                    <div className="spinner"></div>
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
                        <div className="success-section">
                            <div className="success-message">
                                ✅ Conversion completed successfully!
                            </div>
                            <button onClick={downloadPdf} className="download-btn">
                                <Download size={20} />
                                Download PDF
                            </button>
                            <button onClick={resetUpload} className="convert-another-btn">
                                Convert Another File
                            </button>
                        </div>
                    )}
                </div>

                <div className="features-section">
                    <h3>Why Choose Our Word to PDF Converter?</h3>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">⚡</div>
                            <h4>Fast Conversion</h4>
                            <p>Convert your Word documents to PDF in seconds</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🔒</div>
                            <h4>Secure Processing</h4>
                            <p>Your files are processed securely and deleted after conversion</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">📄</div>
                            <h4>High Quality</h4>
                            <p>Maintains original formatting and layout</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">💯</div>
                            <h4>Free to Use</h4>
                            <p>No watermarks, no registration required</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WordToPdf;
