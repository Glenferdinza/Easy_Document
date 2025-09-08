import React, { useState, useRef } from 'react';
import { Upload, Download, Settings, Trash2 } from 'lucide-react';
import './BackgroundRemover.css';

const BackgroundRemover = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [result, setResult] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [method, setMethod] = useState('auto');
    const [downloadUrl, setDownloadUrl] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileUpload = (uploadedFile) => {
        if (uploadedFile) {
            setFile(uploadedFile);
            const reader = new FileReader();
            reader.onload = (e) => setPreview(e.target.result);
            reader.readAsDataURL(uploadedFile);
            setResult(null);
            setDownloadUrl(null);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && droppedFile.type.startsWith('image/')) {
            handleFileUpload(droppedFile);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const removeBackground = async () => {
        if (!file) return;

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
                setDownloadUrl(url);
            } else {
                const error = await response.json();
                alert(`Error: ${error.error}`);
            }
        } catch (error) {
            alert(`Error: ${error.message}`);
        } finally {
            setIsProcessing(false);
        }
    };

    const clearFiles = () => {
        setFile(null);
        setPreview(null);
        setResult(null);
        setDownloadUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const downloadResult = () => {
        if (downloadUrl) {
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `${file.name.split('.')[0]}_no_bg.png`;
            link.click();
        }
    };

    return (
        <div className="background-remover">
            <div className="container">
                <h1 className="title">Background Remover</h1>
                <p className="subtitle">
                    Remove backgrounds from your images automatically or with advanced methods
                </p>

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
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e.target.files[0])}
                            style={{ display: 'none' }}
                        />
                        
                        {!file && (
                            <div className="upload-placeholder">
                                <Upload size={48} />
                                <h3>Drop your image here or click to browse</h3>
                                <p>Supports: JPG, PNG, WebP, HEIC, BMP, TIFF</p>
                                <p>Max file size: 50MB</p>
                            </div>
                        )}

                        {file && (
                            <div className="file-info">
                                <img src={preview} alt="Preview" className="preview-image" />
                                <div className="file-details">
                                    <h4>{file.name}</h4>
                                    <p>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {file && (
                        <div className="controls">
                            <div className="method-selector">
                                <label htmlFor="method">
                                    <Settings size={16} />
                                    Removal Method:
                                </label>
                                <select
                                    id="method"
                                    value={method}
                                    onChange={(e) => setMethod(e.target.value)}
                                >
                                    <option value="auto">Automatic (Recommended)</option>
                                    <option value="grabcut">GrabCut Algorithm</option>
                                    <option value="threshold">Threshold Based</option>
                                </select>
                            </div>

                            <div className="action-buttons">
                                <button
                                    className="btn btn-primary"
                                    onClick={removeBackground}
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? 'Processing...' : 'Remove Background'}
                                </button>
                                <button
                                    className="btn btn-secondary"
                                    onClick={clearFiles}
                                >
                                    <Trash2 size={16} />
                                    Clear
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {result && (
                    <div className="result-section">
                        <h3>Result</h3>
                        <div className="result-preview">
                            <div className="before-after">
                                <div className="image-container">
                                    <h4>Original</h4>
                                    <img src={preview} alt="Original" />
                                </div>
                                <div className="image-container">
                                    <h4>Background Removed</h4>
                                    <img src={result} alt="Result" className="result-image" />
                                </div>
                            </div>
                            
                            <div className="download-section">
                                <button
                                    className="btn btn-success"
                                    onClick={downloadResult}
                                >
                                    <Download size={16} />
                                    Download PNG
                                </button>
                                <p>Result will be saved as PNG with transparency</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="features">
                    <h3>Features</h3>
                    <div className="feature-grid">
                        <div className="feature-card">
                            <h4>🤖 AI-Powered</h4>
                            <p>Automatic background detection and removal using advanced algorithms</p>
                        </div>
                        <div className="feature-card">
                            <h4>🎨 Multiple Methods</h4>
                            <p>Choose from automatic, GrabCut, or threshold-based removal methods</p>
                        </div>
                        <div className="feature-card">
                            <h4>📱 Multiple Formats</h4>
                            <p>Support for JPG, PNG, WebP, HEIC, BMP, and TIFF formats</p>
                        </div>
                        <div className="feature-card">
                            <h4>💨 Fast Processing</h4>
                            <p>Quick background removal with high-quality results</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BackgroundRemover;
