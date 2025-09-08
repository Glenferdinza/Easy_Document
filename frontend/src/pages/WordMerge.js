import React, { useState, useRef } from 'react';
import { Upload, Download, FileText, Plus, X, ArrowRight } from 'lucide-react';
import { MergeIcon, WordIcon } from '../components/Icons';
import './WordMerge.css';

const WordMerge = () => {
    const [files, setFiles] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState(null);
    const [outputFormat, setOutputFormat] = useState('pdf');
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileUpload = (selectedFiles) => {
        const fileList = Array.from(selectedFiles);
        const validFiles = [];
        
        for (const file of fileList) {
            const allowedTypes = [
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
                'application/msword' // .doc
            ];

            if (!allowedTypes.includes(file.type) && 
                !file.name.toLowerCase().endsWith('.doc') && 
                !file.name.toLowerCase().endsWith('.docx')) {
                setError(`${file.name} is not a valid Word document`);
                continue;
            }

            if (file.size > 50 * 1024 * 1024) { // 50MB limit per file
                setError(`${file.name} is too large (max 50MB per file)`);
                continue;
            }

            validFiles.push({
                id: Date.now() + Math.random(),
                file: file,
                name: file.name,
                size: file.size
            });
        }

        if (validFiles.length > 0) {
            setFiles(prev => [...prev, ...validFiles]);
            setError(null);
            setDownloadUrl(null);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFiles = e.dataTransfer.files;
        if (droppedFiles.length > 0) {
            handleFileUpload(droppedFiles);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const removeFile = (fileId) => {
        setFiles(files.filter(f => f.id !== fileId));
    };

    const reorderFiles = (fromIndex, toIndex) => {
        const newFiles = [...files];
        const [movedFile] = newFiles.splice(fromIndex, 1);
        newFiles.splice(toIndex, 0, movedFile);
        setFiles(newFiles);
    };

    const mergeDocuments = async () => {
        if (files.length < 2) {
            setError('Please select at least 2 files to merge');
            return;
        }

        setIsProcessing(true);
        setError(null);

        const formData = new FormData();
        files.forEach(fileObj => {
            formData.append('files', fileObj.file);
        });
        formData.append('output_format', outputFormat);

        try {
            const response = await fetch('/api/word-tools/merge-documents/', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setDownloadUrl(data.download_url);
            } else {
                setError(data.error || 'Merge failed');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('An error occurred during merging');
        } finally {
            setIsProcessing(false);
        }
    };

    const downloadMerged = () => {
        if (downloadUrl) {
            const link = document.createElement('a');
            link.href = downloadUrl;
            const extension = outputFormat === 'pdf' ? 'pdf' : 'docx';
            link.download = `merged_document.${extension}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const resetUpload = () => {
        setFiles([]);
        setDownloadUrl(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="word-merge-page">
            <div className="container">
                <h1 className="title">
                    <MergeIcon size={40} />
                    Word Document Merger
                </h1>
                <p className="subtitle">
                    Merge multiple Word documents into one file with your preferred format
                </p>

                <div className="conversion-workflow">
                    <div className="workflow-step">
                        <div className="step-icon">
                            <Plus size={24} />
                        </div>
                        <span>Upload Multiple Words</span>
                    </div>
                    <ArrowRight className="workflow-arrow" size={20} />
                    <div className="workflow-step">
                        <div className="step-icon">
                            <MergeIcon size={24} />
                        </div>
                        <span>Merge Documents</span>
                    </div>
                    <ArrowRight className="workflow-arrow" size={20} />
                    <div className="workflow-step">
                        <div className="step-icon">
                            <Download size={24} />
                        </div>
                        <span>Download Result</span>
                    </div>
                </div>

                {/* Output Format Selection */}
                <div className="format-selection">
                    <h3>Choose Output Format:</h3>
                    <div className="format-options">
                        <label className={`format-option ${outputFormat === 'pdf' ? 'selected' : ''}`}>
                            <input
                                type="radio"
                                value="pdf"
                                checked={outputFormat === 'pdf'}
                                onChange={(e) => setOutputFormat(e.target.value)}
                            />
                            <FileText size={24} />
                            <span>PDF Document</span>
                        </label>
                        <label className={`format-option ${outputFormat === 'docx' ? 'selected' : ''}`}>
                            <input
                                type="radio"
                                value="docx"
                                checked={outputFormat === 'docx'}
                                onChange={(e) => setOutputFormat(e.target.value)}
                            />
                            <WordIcon size={24} />
                            <span>Word Document</span>
                        </label>
                    </div>
                </div>

                {/* File Upload Section */}
                <div className="upload-section">
                    <div
                        className="dropzone"
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            onChange={(e) => handleFileUpload(e.target.files)}
                            style={{ display: 'none' }}
                            multiple
                        />
                        
                        <div className="upload-placeholder">
                            <Plus size={48} />
                            <h3>Add Word Documents</h3>
                            <p>Drop multiple Word documents here or click to select</p>
                            <span className="file-types">Supports: .doc, .docx (max 50MB per file)</span>
                        </div>
                    </div>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    {/* File List */}
                    {files.length > 0 && (
                        <div className="file-list">
                            <h3>Documents to Merge ({files.length} files)</h3>
                            <p className="merge-order-note">
                                Files will be merged in the order shown below. Drag to reorder.
                            </p>
                            
                            <div className="files-container">
                                {files.map((fileObj, index) => (
                                    <div
                                        key={fileObj.id}
                                        className="file-item"
                                        draggable
                                        onDragStart={(e) => e.dataTransfer.setData('text/plain', index)}
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                                            reorderFiles(fromIndex, index);
                                        }}
                                    >
                                        <div className="file-number">{index + 1}</div>
                                        <WordIcon size={32} />
                                        <div className="file-details">
                                            <h4>{fileObj.name}</h4>
                                            <p>{(fileObj.size / (1024 * 1024)).toFixed(2)} MB</p>
                                        </div>
                                        <button
                                            onClick={() => removeFile(fileObj.id)}
                                            className="remove-btn"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {files.length > 0 && !downloadUrl && (
                        <button
                            onClick={mergeDocuments}
                            disabled={isProcessing || files.length < 2}
                            className="merge-btn"
                        >
                            {isProcessing ? (
                                <>
                                    <div className="spinner"></div>
                                    Merging Documents...
                                </>
                            ) : (
                                <>
                                    <MergeIcon size={20} />
                                    Merge {files.length} Documents to {outputFormat.toUpperCase()}
                                </>
                            )}
                        </button>
                    )}

                    {downloadUrl && (
                        <div className="success-section">
                            <div className="success-message">
                                ✅ Documents merged successfully!
                            </div>
                            <button onClick={downloadMerged} className="download-btn">
                                <Download size={20} />
                                Download Merged {outputFormat.toUpperCase()}
                            </button>
                            <button onClick={resetUpload} className="merge-another-btn">
                                Merge More Documents
                            </button>
                        </div>
                    )}
                </div>

                <div className="features-section">
                    <h3>Word Document Merger Features</h3>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">📑</div>
                            <h4>Multiple Formats</h4>
                            <p>Output as PDF or Word document based on your needs</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🔢</div>
                            <h4>Custom Order</h4>
                            <p>Drag and drop to reorder documents before merging</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">⚡</div>
                            <h4>Fast Processing</h4>
                            <p>Merge multiple documents quickly and efficiently</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🎯</div>
                            <h4>Preserved Formatting</h4>
                            <p>Maintains original document formatting and styles</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WordMerge;
