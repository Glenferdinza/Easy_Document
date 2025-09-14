import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import { Download, FileText, Trash2, Plus } from 'lucide-react';
import { PDFIcon, LightBulbIcon } from '../components/Icons';
import { mergePDFs, downloadFile } from '../utils/api';

const MergePDF = () => {
  const [files, setFiles] = useState([]);
  const [merging, setMerging] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const pdfFiles = acceptedFiles.filter(file => file.type === 'application/pdf');
    if (pdfFiles.length !== acceptedFiles.length) {
      toast.warning('Only PDF files are allowed');
    }
    setFiles(prev => [...prev, ...pdfFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 10
  });

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setFiles([]);
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      toast.error('Please add at least 2 PDF files to merge');
      return;
    }

    setMerging(true);
    try {
      const response = await mergePDFs(files);
      downloadFile(response.data, 'merged.pdf');
      toast.success('PDF files merged successfully!');
      setFiles([]);
    } catch (error) {
      toast.error(`Merge failed: ${error.message}`);
    } finally {
      setMerging(false);
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
            Merge PDF Files
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#666',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Combine multiple PDF files into a single document. Drag and drop your files or click to browse.
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
              {isDragActive ? 'Drop PDF files here...' : 'Drag & drop PDF files here'}
            </p>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>
              or click to browse (max 10 files)
            </p>
          </div>
        </div>

        {/* Files List */}
        {files.length > 0 && (
          <div className="card" style={{ marginBottom: '2rem' }} data-aos="fade-up" data-aos-delay="200">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#333' }}>
                Selected Files ({files.length})
              </h3>
              <button
                onClick={clearAll}
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {files.map((file, index) => (
                <div
                  key={index}
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
                  <div style={{ fontSize: '0.9rem', color: '#666', minWidth: '60px' }}>
                    #{index + 1}
                  </div>
                  <button
                    onClick={() => removeFile(index)}
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
              ))}
            </div>

            <button
              onClick={handleMerge}
              disabled={files.length < 2 || merging}
              style={{
                width: '100%',
                padding: '1rem 2rem',
                background: files.length >= 2 && !merging ? 'linear-gradient(135deg, #FF6B6B 0%, #FF5252 100%)' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: files.length >= 2 && !merging ? 'pointer' : 'not-allowed',
                marginTop: '1.5rem',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              {merging ? (
                <>
                  <div className="loading" style={{ marginRight: '0.5rem' }} />
                  Merging PDFs...
                </>
              ) : (
                <>
                  <Download size={20} />
                  Merge PDFs
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
            PDF Merge Tips
          </h3>
          <ul style={{
            listStyle: 'none',
            color: '#666',
            lineHeight: '1.6'
          }}>
            <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PDFIcon size={16} color="#FF6B6B" />
              <span>Files will be merged in the order they appear in the list</span>
            </li>
            <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={16} color="#FF6B6B" />
              <span>You can add up to 10 PDF files at once</span>
            </li>
            <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={16} color="#FF6B6B" />
              <span>Original formatting and quality will be preserved</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MergePDF;
