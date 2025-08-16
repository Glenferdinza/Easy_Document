import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import { Upload, Download, Settings, FileText, Trash2 } from 'lucide-react';
import { compressPDF, formatFileSize } from '../utils/api';
import { LightBulbIcon, DocumentIcon, ImageIcon, SecurityIcon } from '../components/Icons';

const PDFCompress = () => {
  const [files, setFiles] = useState([]);
  const [compressionLevel, setCompressionLevel] = useState('medium');
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState({});

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      originalSize: file.size,
      compressedSize: null,
      compressedFile: null,
      status: 'pending'
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
    toast.success(`${acceptedFiles.length} PDF file(s) added successfully!`);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: true,
    maxSize: 100 * 1024 * 1024 // 100MB
  });

  const removeFile = (id) => {
    setFiles(prev => prev.filter(file => file.id !== id));
    toast.info('File removed');
  };

  const compressFile = async (fileData) => {
    setFiles(prev => prev.map(f => 
      f.id === fileData.id ? { ...f, status: 'processing' } : f
    ));

    try {
      const response = await compressPDF(
        fileData.file, 
        compressionLevel,
        (progressValue) => {
          setProgress(prev => ({ ...prev, [fileData.id]: progressValue }));
        }
      );

      const compressedBlob = response.data;
      const compressedSize = compressedBlob.size;

      setFiles(prev => prev.map(f => 
        f.id === fileData.id ? {
          ...f,
          status: 'completed',
          compressedFile: compressedBlob,
          compressedSize
        } : f
      ));

      toast.success(`${fileData.file.name} compressed successfully!`);
    } catch (error) {
      setFiles(prev => prev.map(f => 
        f.id === fileData.id ? { ...f, status: 'error' } : f
      ));
      toast.error(`Failed to compress ${fileData.file.name}: ${error.message}`);
    } finally {
      setProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[fileData.id];
        return newProgress;
      });
    }
  };

  const compressAll = async () => {
    const pendingFiles = files.filter(f => f.status === 'pending');
    if (pendingFiles.length === 0) {
      toast.warning('No files to compress');
      return;
    }

    setProcessing(true);
    
    for (const fileData of pendingFiles) {
      await compressFile(fileData);
    }
    
    setProcessing(false);
    toast.success('All files processed!');
  };

  const downloadFile = (fileData) => {
    if (!fileData.compressedFile) return;
    
    const url = window.URL.createObjectURL(fileData.compressedFile);
    const link = document.createElement('a');
    link.href = url;
    link.download = `compressed_${fileData.file.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const downloadAll = () => {
    const completedFiles = files.filter(f => f.status === 'completed');
    completedFiles.forEach(fileData => {
      setTimeout(() => downloadFile(fileData), 100);
    });
  };

  const getCompressionRatio = (originalSize, compressedSize) => {
    if (!compressedSize) return 0;
    return Math.round(((originalSize - compressedSize) / originalSize) * 100);
  };

  const compressionLevels = [
    {
      value: 'low',
      label: 'Low Compression',
      description: 'Minimal compression, best quality'
    },
    {
      value: 'medium',
      label: 'Medium Compression',
      description: 'Balanced compression and quality'
    },
    {
      value: 'high',
      label: 'High Compression',
      description: 'Maximum compression, smaller files'
    }
  ];

  return (
    <div style={{ padding: '6rem 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }} data-aos="fade-up">
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#333',
            marginBottom: '1rem'
          }}>
            PDF Compression
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#666',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Reduce PDF file sizes while preserving document quality and readability.
          </p>
        </div>

        {/* Compression Settings */}
        <div className="card" style={{ marginBottom: '2rem' }} data-aos="fade-up" data-aos-delay="100">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <Settings size={20} style={{ color: '#4ecdc4' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#333' }}>
              Compression Level
            </h3>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem'
          }}>
            {compressionLevels.map(level => (
              <label
                key={level.value}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  border: `2px solid ${compressionLevel === level.value ? '#4ecdc4' : '#eee'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  background: compressionLevel === level.value ? 'rgba(78, 205, 196, 0.05)' : 'white',
                  transition: 'all 0.3s ease'
                }}
              >
                <input
                  type="radio"
                  name="compressionLevel"
                  value={level.value}
                  checked={compressionLevel === level.value}
                  onChange={(e) => setCompressionLevel(e.target.value)}
                  style={{ accentColor: '#4ecdc4' }}
                />
                <div>
                  <div style={{
                    fontWeight: '600',
                    color: '#333',
                    marginBottom: '0.25rem'
                  }}>
                    {level.label}
                  </div>
                  <div style={{
                    fontSize: '0.9rem',
                    color: '#666'
                  }}>
                    {level.description}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Upload Area */}
        <div
          {...getRootProps()}
          className="card"
          style={{
            border: isDragActive ? '2px dashed #4ecdc4' : '2px dashed #ddd',
            background: isDragActive ? 'rgba(78, 205, 196, 0.05)' : 'white',
            cursor: 'pointer',
            textAlign: 'center',
            padding: '4rem 2rem',
            marginBottom: '2rem',
            transition: 'all 0.3s ease'
          }}
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <input {...getInputProps()} />
          <Upload size={48} style={{
            color: isDragActive ? '#4ecdc4' : '#999',
            marginBottom: '1rem'
          }} />
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: isDragActive ? '#4ecdc4' : '#333',
            marginBottom: '1rem'
          }}>
            {isDragActive ? 'Drop your PDFs here' : 'Upload PDF Files'}
          </h3>
          <p style={{
            color: '#666',
            marginBottom: '1rem'
          }}>
            Drag & drop your PDF files here, or click to select files
          </p>
          <p style={{
            fontSize: '0.9rem',
            color: '#999'
          }}>
            Supports PDF files • Max 100MB per file
          </p>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="card" data-aos="fade-up" data-aos-delay="300">
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: '600',
                color: '#333'
              }}>
                PDF Files ({files.length})
              </h3>
              
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  onClick={compressAll}
                  disabled={processing || files.filter(f => f.status === 'pending').length === 0}
                  className="btn"
                  style={{
                    background: 'linear-gradient(135deg, #4ecdc4 0%, #44b3a6 100%)',
                    color: 'white',
                    opacity: processing ? 0.7 : 1,
                    cursor: processing ? 'not-allowed' : 'pointer'
                  }}
                >
                  {processing ? (
                    <>
                      <div className="loading" style={{ marginRight: '0.5rem' }} />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FileText size={18} style={{ marginRight: '0.5rem' }} />
                      Compress All
                    </>
                  )}
                </button>
                
                {files.some(f => f.status === 'completed') && (
                  <button
                    onClick={downloadAll}
                    className="btn btn-secondary"
                    style={{
                      borderColor: '#4ecdc4',
                      color: '#4ecdc4'
                    }}
                  >
                    <Download size={18} style={{ marginRight: '0.5rem' }} />
                    Download All
                  </button>
                )}
              </div>
            </div>

            <div style={{
              display: 'grid',
              gap: '1rem'
            }}>
              {files.map((fileData) => (
                <div
                  key={fileData.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem',
                    background: '#f9f9f9',
                    borderRadius: '8px',
                    border: fileData.status === 'error' ? '1px solid #ff4444' : 
                           fileData.status === 'completed' ? '1px solid #4ecdc4' : '1px solid #eee'
                  }}
                >
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.5rem'
                    }}>
                      <FileText size={16} style={{ color: '#4ecdc4' }} />
                      <span style={{
                        fontWeight: '500',
                        color: '#333'
                      }}>
                        {fileData.file.name}
                      </span>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        background: fileData.status === 'completed' ? '#4ecdc4' :
                                   fileData.status === 'processing' ? '#ff9800' :
                                   fileData.status === 'error' ? '#ff4444' : '#999',
                        color: 'white',
                        fontSize: '0.7rem',
                        borderRadius: '4px',
                        textTransform: 'uppercase',
                        fontWeight: '500'
                      }}>
                        {fileData.status}
                      </span>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      gap: '2rem',
                      fontSize: '0.9rem',
                      color: '#666',
                      flexWrap: 'wrap'
                    }}>
                      <span>Original: {formatFileSize(fileData.originalSize)}</span>
                      {fileData.compressedSize && (
                        <>
                          <span>Compressed: {formatFileSize(fileData.compressedSize)}</span>
                          <span style={{ color: '#4ecdc4', fontWeight: '500' }}>
                            Saved: {getCompressionRatio(fileData.originalSize, fileData.compressedSize)}%
                          </span>
                        </>
                      )}
                    </div>
                    
                    {progress[fileData.id] && (
                      <div style={{
                        width: '100%',
                        height: '4px',
                        background: '#eee',
                        borderRadius: '2px',
                        marginTop: '0.5rem',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${progress[fileData.id]}%`,
                          height: '100%',
                          background: '#4ecdc4',
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                    )}
                  </div>

                  <div style={{
                    display: 'flex',
                    gap: '0.5rem'
                  }}>
                    {fileData.status === 'completed' && (
                      <button
                        onClick={() => downloadFile(fileData)}
                        style={{
                          padding: '0.5rem',
                          background: '#4ecdc4',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                        title="Download"
                      >
                        <Download size={16} />
                      </button>
                    )}
                    
                    <button
                      onClick={() => removeFile(fileData.id)}
                      style={{
                        padding: '0.5rem',
                        background: '#ff4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                      title="Remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tips Section */}
        <div className="card" style={{ marginTop: '2rem', background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }} data-aos="fade-up">
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
            PDF Compression Tips
          </h3>
          <ul style={{
            listStyle: 'none',
            color: '#666',
            lineHeight: '1.6'
          }}>
            <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <DocumentIcon size={16} color="#FF6B6B" />
              <span><strong>Text-heavy PDFs</strong> compress better than image-heavy ones</span>
            </li>
            <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ImageIcon size={16} color="#FF6B6B" />
              <span><strong>High compression</strong> may reduce image quality in documents</span>
            </li>
            <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Settings size={16} color="#FF6B6B" />
              <span><strong>Medium compression</strong> offers the best balance for most documents</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <SecurityIcon size={16} color="#FF6B6B" />
              <span>Your files are processed securely and deleted after compression</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PDFCompress;
