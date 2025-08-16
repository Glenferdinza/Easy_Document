import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import { Upload, Download, Settings, Image as ImageIcon, Trash2 } from 'lucide-react';
import { compressImage, formatFileSize, downloadFile } from '../utils/api';

const ImageCompress = () => {
  const [files, setFiles] = useState([]);
  const [quality, setQuality] = useState(75);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState({});

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      originalSize: file.size,
      compressedSize: null,
      compressedFile: null,
      status: 'pending' // pending, processing, completed, error
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
    toast.success(`${acceptedFiles.length} file(s) added successfully!`);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
    },
    multiple: true,
    maxSize: 50 * 1024 * 1024 // 50MB
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
      const response = await compressImage(
        fileData.file, 
        quality,
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
            Image Compression
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#666',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Compress your images while maintaining quality. Supports JPG, PNG, WebP, and GIF formats.
          </p>
        </div>

        {/* Quality Settings */}
        <div className="card" style={{ marginBottom: '2rem' }} data-aos="fade-up" data-aos-delay="100">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <Settings size={20} style={{ color: '#ff6b6b' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#333' }}>
              Compression Settings
            </h3>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            alignItems: 'center'
          }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#333'
              }}>
                Quality: {quality}%
              </label>
              <input
                type="range"
                min="10"
                max="95"
                value={quality}
                onChange={(e) => setQuality(parseInt(e.target.value))}
                style={{
                  width: '100%',
                  height: '8px',
                  background: 'linear-gradient(to right, #ff6b6b, #ff5252)',
                  outline: 'none',
                  borderRadius: '4px'
                }}
              />
            </div>
            
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              flexWrap: 'wrap'
            }}>
              {[
                { label: 'High Quality', value: 85 },
                { label: 'Medium', value: 75 },
                { label: 'Small Size', value: 50 }
              ].map(preset => (
                <button
                  key={preset.value}
                  onClick={() => setQuality(preset.value)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: quality === preset.value ? '#ff6b6b' : 'white',
                    color: quality === preset.value ? 'white' : '#ff6b6b',
                    border: `2px solid #ff6b6b`,
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Upload Area */}
        <div
          {...getRootProps()}
          className="card"
          style={{
            border: isDragActive ? '2px dashed #ff6b6b' : '2px dashed #ddd',
            background: isDragActive ? 'rgba(255, 107, 107, 0.05)' : 'white',
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
            color: isDragActive ? '#ff6b6b' : '#999',
            marginBottom: '1rem'
          }} />
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: isDragActive ? '#ff6b6b' : '#333',
            marginBottom: '1rem'
          }}>
            {isDragActive ? 'Drop your images here' : 'Upload Images'}
          </h3>
          <p style={{
            color: '#666',
            marginBottom: '1rem'
          }}>
            Drag & drop your images here, or click to select files
          </p>
          <p style={{
            fontSize: '0.9rem',
            color: '#999'
          }}>
            Supports JPG, PNG, WebP, GIF • Max 50MB per file
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
                Files ({files.length})
              </h3>
              
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  onClick={compressAll}
                  disabled={processing || files.filter(f => f.status === 'pending').length === 0}
                  className="btn btn-primary"
                  style={{
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
                      <ImageIcon size={18} style={{ marginRight: '0.5rem' }} />
                      Compress All
                    </>
                  )}
                </button>
                
                {files.some(f => f.status === 'completed') && (
                  <button
                    onClick={downloadAll}
                    className="btn btn-secondary"
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
                           fileData.status === 'completed' ? '1px solid #4caf50' : '1px solid #eee'
                  }}
                >
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.5rem'
                    }}>
                      <ImageIcon size={16} style={{ color: '#ff6b6b' }} />
                      <span style={{
                        fontWeight: '500',
                        color: '#333'
                      }}>
                        {fileData.file.name}
                      </span>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        background: fileData.status === 'completed' ? '#4caf50' :
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
                          <span style={{ color: '#4caf50', fontWeight: '500' }}>
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
                          background: '#ff6b6b',
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
                          background: '#4caf50',
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
      </div>
    </div>
  );
};

export default ImageCompress;
