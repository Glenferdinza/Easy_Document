import React, { useState, useRef } from 'react';
import { Download, FileText, Plus, X, ArrowRight, Layers, RefreshCw, Zap, FileIcon } from 'lucide-react';
import { MergeIcon, WordIcon, CheckCircleIcon } from '../components/Icons';

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
                        <MergeIcon size={40} color="#FF6B6B" />
                        Word Document Merger
                    </h1>
                    <p style={{
                        fontSize: '1.1rem',
                        color: '#666',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        Merge multiple Word documents into one file with your preferred format
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
                                <Plus size={24} />
                            </div>
                            <span style={{ fontSize: '0.9rem', color: '#666', fontWeight: '500' }}>Upload Files</span>
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
                                <MergeIcon size={24} />
                            </div>
                            <span style={{ fontSize: '0.9rem', color: '#666', fontWeight: '500' }}>Merge</span>
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
                            <span style={{ fontSize: '0.9rem', color: '#666', fontWeight: '500' }}>Download</span>
                        </div>
                    </div>
                </div>

                {/* Output Format Selection */}
                <div className="card" style={{ marginBottom: '2rem' }} data-aos="fade-up" data-aos-delay="200">
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#333', marginBottom: '1rem' }}>
                        Choose Output Format
                    </h3>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <label style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '1rem',
                            border: outputFormat === 'pdf' ? '2px solid #FF6B6B' : '1px solid #ddd',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            background: outputFormat === 'pdf' ? 'rgba(255, 107, 107, 0.05)' : 'white',
                            flex: '1',
                            minWidth: '200px'
                        }}>
                            <input
                                type="radio"
                                value="pdf"
                                checked={outputFormat === 'pdf'}
                                onChange={(e) => setOutputFormat(e.target.value)}
                                style={{ display: 'none' }}
                            />
                            <FileText size={24} color={outputFormat === 'pdf' ? '#FF6B6B' : '#666'} />
                            <span style={{ fontWeight: '500', color: outputFormat === 'pdf' ? '#FF6B6B' : '#333' }}>PDF Document</span>
                        </label>
                        <label style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '1rem',
                            border: outputFormat === 'docx' ? '2px solid #FF6B6B' : '1px solid #ddd',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            background: outputFormat === 'docx' ? 'rgba(255, 107, 107, 0.05)' : 'white',
                            flex: '1',
                            minWidth: '200px'
                        }}>
                            <input
                                type="radio"
                                value="docx"
                                checked={outputFormat === 'docx'}
                                onChange={(e) => setOutputFormat(e.target.value)}
                                style={{ display: 'none' }}
                            />
                            <WordIcon size={24} color={outputFormat === 'docx' ? '#FF6B6B' : '#666'} />
                            <span style={{ fontWeight: '500', color: outputFormat === 'docx' ? '#FF6B6B' : '#333' }}>Word Document</span>
                        </label>
                    </div>
                </div>

                {/* Upload Area */}
                <div className="card" style={{ marginBottom: '2rem' }} data-aos="fade-up" data-aos-delay="300">
                    <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                            border: `2px dashed ${files.length > 0 ? '#FF6B6B' : '#ddd'}`,
                            borderRadius: '12px',
                            padding: '3rem 2rem',
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            background: files.length > 0 ? 'rgba(255, 107, 107, 0.05)' : 'transparent'
                        }}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            onChange={(e) => handleFileUpload(e.target.files)}
                            style={{ display: 'none' }}
                            multiple
                        />
                        
                        <Plus size={48} color="#999" />
                        <p style={{
                            fontSize: '1.1rem',
                            margin: '1rem 0 0.5rem',
                            color: '#333'
                        }}>
                            Add Word Documents to Merge
                        </p>
                        <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>
                            Drop multiple Word documents here or click to browse
                        </p>
                        <span style={{
                            fontSize: '0.8rem',
                            color: '#999',
                            background: '#f8f9fa',
                            padding: '0.5rem 1rem',
                            borderRadius: '15px',
                            display: 'inline-block'
                        }}>
                            Supports: .doc, .docx (max 50MB per file)
                        </span>
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
                </div>

                {/* File List */}
                {files.length > 0 && (
                    <div className="card" style={{ marginBottom: '2rem' }} data-aos="fade-up" data-aos-delay="400">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#333' }}>
                                Documents to Merge ({files.length} files)
                            </h3>
                            <button
                                onClick={resetUpload}
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
                                Clear All
                            </button>
                        </div>

                        <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>
                            Files will be merged in the order shown. Drag to reorder.
                        </p>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {files.map((fileObj, index) => (
                                <div
                                    key={fileObj.id}
                                    draggable
                                    onDragStart={(e) => e.dataTransfer.setData('text/plain', index)}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                                        reorderFiles(fromIndex, index);
                                    }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        padding: '1rem',
                                        background: '#f8f9fa',
                                        borderRadius: '8px',
                                        border: '1px solid #eee',
                                        cursor: 'grab',
                                        position: 'relative'
                                    }}
                                >
                                    <div style={{
                                        width: '30px',
                                        height: '30px',
                                        background: '#FF6B6B',
                                        color: 'white',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.9rem',
                                        fontWeight: '600'
                                    }}>
                                        {index + 1}
                                    </div>
                                    <WordIcon size={32} color="#FF6B6B" />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '500', color: '#333' }}>{fileObj.name}</div>
                                        <div style={{ fontSize: '0.85rem', color: '#666' }}>
                                            {formatFileSize(fileObj.size)}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeFile(fileObj.id)}
                                        style={{
                                            background: '#FF6B6B',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: '30px',
                                            height: '30px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {!downloadUrl && (
                            <button
                                onClick={mergeDocuments}
                                disabled={isProcessing || files.length < 2}
                                style={{
                                    width: '100%',
                                    padding: '1rem 2rem',
                                    background: (!isProcessing && files.length >= 2) ? 'linear-gradient(135deg, #FF6B6B 0%, #FF5252 100%)' : '#ccc',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '1.1rem',
                                    fontWeight: '600',
                                    cursor: (!isProcessing && files.length >= 2) ? 'pointer' : 'not-allowed',
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
                    </div>
                )}

                {/* Success Section */}
                {downloadUrl && (
                    <div className="card" data-aos="fade-up" data-aos-delay="500">
                        <div style={{
                            textAlign: 'center',
                            background: '#f0f9ff',
                            padding: '2rem',
                            borderRadius: '8px',
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
                                Documents merged successfully!
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                                <button
                                    onClick={downloadMerged}
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
                                    Download Merged {outputFormat.toUpperCase()}
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
                                    Merge More Documents
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Features Section */}
                <div className="card" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', marginTop: '2rem' }} data-aos="fade-up" data-aos-delay="600">
                    <h3 style={{
                        fontSize: '1.5rem',
                        fontWeight: '600',
                        color: '#333',
                        marginBottom: '2rem',
                        textAlign: 'center'
                    }}>
                        Word Document Merger Features
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                        <div style={{
                            textAlign: 'center',
                            padding: '1.5rem',
                            background: 'white',
                            borderRadius: '12px',
                            border: '1px solid #eee'
                        }}>
                            <Layers size={32} color="#FF6B6B" style={{ marginBottom: '1rem' }} />
                            <h4 style={{ color: '#333', marginBottom: '1rem', fontSize: '1.2rem' }}>Multiple Formats</h4>
                            <p style={{ color: '#666', lineHeight: '1.6' }}>Output as PDF or Word document based on your needs</p>
                        </div>
                        <div style={{
                            textAlign: 'center',
                            padding: '1.5rem',
                            background: 'white',
                            borderRadius: '12px',
                            border: '1px solid #eee'
                        }}>
                            <RefreshCw size={32} color="#FF6B6B" style={{ marginBottom: '1rem' }} />
                            <h4 style={{ color: '#333', marginBottom: '1rem', fontSize: '1.2rem' }}>Custom Order</h4>
                            <p style={{ color: '#666', lineHeight: '1.6' }}>Drag and drop to reorder documents before merging</p>
                        </div>
                        <div style={{
                            textAlign: 'center',
                            padding: '1.5rem',
                            background: 'white',
                            borderRadius: '12px',
                            border: '1px solid #eee'
                        }}>
                            <Zap size={32} color="#FF6B6B" style={{ marginBottom: '1rem' }} />
                            <h4 style={{ color: '#333', marginBottom: '1rem', fontSize: '1.2rem' }}>Fast Processing</h4>
                            <p style={{ color: '#666', lineHeight: '1.6' }}>Merge multiple documents quickly and efficiently</p>
                        </div>
                        <div style={{
                            textAlign: 'center',
                            padding: '1.5rem',
                            background: 'white',
                            borderRadius: '12px',
                            border: '1px solid #eee'
                        }}>
                            <FileIcon size={32} color="#FF6B6B" style={{ marginBottom: '1rem' }} />
                            <h4 style={{ color: '#333', marginBottom: '1rem', fontSize: '1.2rem' }}>Preserved Formatting</h4>
                            <p style={{ color: '#666', lineHeight: '1.6' }}>Maintains original document formatting and styles</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WordMerge;