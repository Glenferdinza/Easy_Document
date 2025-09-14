import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import { Download, Image, Trash2, Settings } from 'lucide-react';
import { PDFIcon, LightBulbIcon } from '../components/Icons';
import { pdfToImages, downloadFile } from '../utils/api';

const PDFToImage = () => {
  const [file, setFile] = useState(null);
  const [format, setFormat] = useState('PNG');
  const [quality, setQuality] = useState('high');
  const [converting, setConverting] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const pdfFile = acceptedFiles[0];
      if (pdfFile.type === 'application/pdf') {
        setFile(pdfFile);
        toast.success('PDF file loaded successfully');
      } else {
        toast.error('Please upload a PDF file');
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  const removeFile = () => {
    setFile(null);
  };

  const handleConvert = async () => {
    if (!file) {
      toast.error('Please upload a PDF file first');
      return;
    }

    setConverting(true);
    try {
      const response = await pdfToImages(file, format, quality);
      downloadFile(response.data, `${file.name.replace('.pdf', '')}_images.zip`);
      toast.success('PDF converted to images successfully!');
    } catch (error) {
      toast.error(`Conversion failed: ${error.message}`);
    } finally {
      setConverting(false);
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
            PDF to Images
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#666',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Convert your PDF pages into high-quality images. Each page will be converted to a separate image file.
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
            <PDFIcon size={48} color={isDragActive ? '#FF6B6B' : '#999'} />
            <p style={{
              fontSize: '1.1rem',
              margin: '1rem 0 0.5rem',
              color: isDragActive ? '#FF6B6B' : '#333'
            }}>
              {isDragActive ? 'Drop PDF file here...' : 'Drag & drop PDF file here'}
            </p>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>
              or click to browse (single file only)
            </p>
          </div>
        </div>

        {/* File Info & Settings */}
        {file && (
          <div className="card" style={{ marginBottom: '2rem' }} data-aos="fade-up" data-aos-delay="200">
            {/* File Info */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#333', marginBottom: '1rem' }}>
                Selected File
              </h3>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  background: '#f8f9fa',
                  borderRadius: '8px',
                  border: '1px solid #eee'
                }}
              >
                <PDFIcon size={24} color="#FF6B6B" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '500', color: '#333' }}>{file.name}</div>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>{formatFileSize(file.size)}</div>
                </div>
                <button
                  onClick={removeFile}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#FF6B6B',
                    cursor: 'pointer',
                    padding: '0.5rem',
                    borderRadius: '4px',
                    transition: 'background 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 107, 107, 0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {/* Conversion Settings */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ 
                fontSize: '1.2rem', 
                fontWeight: '600', 
                color: '#333', 
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Settings size={20} color="#FF6B6B" />
                Conversion Settings
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {/* Format Selection */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#333', marginBottom: '0.5rem' }}>
                    Output Format
                  </label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '1rem',
                      background: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="PNG">PNG - Best quality, larger file</option>
                    <option value="JPEG">JPEG - Smaller file, good quality</option>
                    <option value="WEBP">WebP - Modern format, balanced</option>
                  </select>
                </div>

                {/* Quality Selection */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#333', marginBottom: '0.5rem' }}>
                    Image Quality
                  </label>
                  <select
                    value={quality}
                    onChange={(e) => setQuality(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '1rem',
                      background: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="high">High Quality (300 DPI)</option>
                    <option value="medium">Medium Quality (150 DPI)</option>
                    <option value="low">Low Quality (72 DPI)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Convert Button */}
            <button
              onClick={handleConvert}
              disabled={!file || converting}
              style={{
                width: '100%',
                padding: '1rem 2rem',
                background: file && !converting ? 'linear-gradient(135deg, #FF6B6B 0%, #FF5252 100%)' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: file && !converting ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              {converting ? (
                <>
                  <div className="loading" style={{ marginRight: '0.5rem' }} />
                  Converting PDF...
                </>
              ) : (
                <>
                  <Image size={20} />
                  Convert to Images
                </>
              )}
            </button>
          </div>
        )}

        {/* Tips Section */}
        <div className="card" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }} data-aos="fade-up" data-aos-delay="300">
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
            PDF to Image Tips
          </h3>
          <ul style={{
            listStyle: 'none',
            color: '#666',
            lineHeight: '1.6'
          }}>
            <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Image size={16} color="#FF6B6B" />
              <span>Each page will be converted to a separate image file</span>
            </li>
            <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Download size={16} color="#FF6B6B" />
              <span>All images will be packaged in a ZIP file for easy download</span>
            </li>
            <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Settings size={16} color="#FF6B6B" />
              <span>Choose PNG for best quality or JPEG for smaller file sizes</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PDFToImage;
