import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import { Download, FileText, Scissors, Trash2 } from 'lucide-react';
import { PDFIcon, LightBulbIcon } from '../components/Icons';
import { splitPDF, downloadFile } from '../utils/api';

const SplitPDF = () => {
  const [file, setFile] = useState(null);
  const [splitType, setSplitType] = useState('pages');
  const [pageRanges, setPageRanges] = useState('');
  const [pagesPerFile, setPagesPerFile] = useState(1);
  const [splitting, setSplitting] = useState(false);

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

  const handleSplit = async () => {
    if (!file) {
      toast.error('Please upload a PDF file first');
      return;
    }

    if (splitType === 'ranges' && !pageRanges.trim()) {
      toast.error('Please specify page ranges');
      return;
    }

    if (splitType === 'batch' && pagesPerFile < 1) {
      toast.error('Pages per file must be at least 1');
      return;
    }

    setSplitting(true);
    try {
      const options = {};
      if (splitType === 'ranges') {
        options.pageRanges = pageRanges;
      } else if (splitType === 'batch') {
        options.pagesPerFile = pagesPerFile;
      }

      // Fixed: Pass onProgress callback to handle upload progress
      const response = await splitPDF(
        file, 
        splitType === 'batch' ? pagesPerFile : 1, 
        (progress) => {
          // Handle progress if needed
          console.log(`Split progress: ${progress}%`);
        }
      );
      downloadFile(response.data, `${file.name.replace('.pdf', '')}_split.zip`);
      toast.success('PDF split successfully!');
    } catch (error) {
      toast.error(`Split failed: ${error.message}`);
    } finally {
      setSplitting(false);
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
            Split PDF
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#666',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Split your PDF into multiple files. Extract specific pages or divide into smaller documents.
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

            {/* Split Options */}
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
                <Scissors size={20} color="#FF6B6B" />
                Split Options
              </h3>

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  {/* Split by Pages */}
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '1rem',
                    border: `2px solid ${splitType === 'pages' ? '#FF6B6B' : '#ddd'}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: splitType === 'pages' ? 'rgba(255, 107, 107, 0.05)' : 'transparent'
                  }}>
                    <input
                      type="radio"
                      name="splitType"
                      value="pages"
                      checked={splitType === 'pages'}
                      onChange={(e) => setSplitType(e.target.value)}
                      style={{ margin: 0 }}
                    />
                    <div>
                      <div style={{ fontWeight: '600', color: '#333', marginBottom: '0.25rem' }}>
                        Split by Pages
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#666' }}>
                        Each page becomes a separate PDF
                      </div>
                    </div>
                  </label>

                  {/* Split by Ranges */}
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '1rem',
                    border: `2px solid ${splitType === 'ranges' ? '#FF6B6B' : '#ddd'}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: splitType === 'ranges' ? 'rgba(255, 107, 107, 0.05)' : 'transparent'
                  }}>
                    <input
                      type="radio"
                      name="splitType"
                      value="ranges"
                      checked={splitType === 'ranges'}
                      onChange={(e) => setSplitType(e.target.value)}
                      style={{ margin: 0 }}
                    />
                    <div>
                      <div style={{ fontWeight: '600', color: '#333', marginBottom: '0.25rem' }}>
                        Custom Ranges
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#666' }}>
                        Specify page ranges to extract
                      </div>
                    </div>
                  </label>

                  {/* Split by Batch */}
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '1rem',
                    border: `2px solid ${splitType === 'batch' ? '#FF6B6B' : '#ddd'}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: splitType === 'batch' ? 'rgba(255, 107, 107, 0.05)' : 'transparent'
                  }}>
                    <input
                      type="radio"
                      name="splitType"
                      value="batch"
                      checked={splitType === 'batch'}
                      onChange={(e) => setSplitType(e.target.value)}
                      style={{ margin: 0 }}
                    />
                    <div>
                      <div style={{ fontWeight: '600', color: '#333', marginBottom: '0.25rem' }}>
                        Batch Split
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#666' }}>
                        Group pages into files
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Custom Ranges Input */}
              {splitType === 'ranges' && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#333', marginBottom: '0.5rem' }}>
                    Page Ranges (comma separated)
                  </label>
                  <input
                    type="text"
                    value={pageRanges}
                    onChange={(e) => setPageRanges(e.target.value)}
                    placeholder="e.g., 1-3, 5, 7-10, 12"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '1rem'
                    }}
                  />
                  <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
                    Examples: "1-3" (pages 1 to 3), "5" (page 5 only), "1-3, 5, 7-10" (multiple ranges)
                  </div>
                </div>
              )}

              {/* Pages Per File Input */}
              {splitType === 'batch' && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#333', marginBottom: '0.5rem' }}>
                    Pages Per File
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={pagesPerFile}
                    onChange={(e) => setPagesPerFile(parseInt(e.target.value) || 1)}
                    style={{
                      width: '200px',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '1rem'
                    }}
                  />
                  <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
                    Number of pages to include in each output file
                  </div>
                </div>
              )}
            </div>

            {/* Split Button */}
            <button
              onClick={handleSplit}
              disabled={!file || splitting || (splitType === 'ranges' && !pageRanges.trim())}
              style={{
                width: '100%',
                padding: '1rem 2rem',
                background: file && !splitting && (splitType !== 'ranges' || pageRanges.trim()) ? 
                  'linear-gradient(135deg, #FF6B6B 0%, #FF5252 100%)' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: file && !splitting && (splitType !== 'ranges' || pageRanges.trim()) ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              {splitting ? (
                <>
                  <div className="loading" style={{ marginRight: '0.5rem' }} />
                  Splitting PDF...
                </>
              ) : (
                <>
                  <Scissors size={20} />
                  Split PDF
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
            PDF Split Tips
          </h3>
          <ul style={{
            listStyle: 'none',
            color: '#666',
            lineHeight: '1.6'
          }}>
            <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={16} color="#FF6B6B" />
              <span><strong>Split by Pages:</strong> Creates one PDF file for each page</span>
            </li>
            <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Scissors size={16} color="#FF6B6B" />
              <span><strong>Custom Ranges:</strong> Extract specific pages (e.g., 1-3, 5, 7-10)</span>
            </li>
            <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Download size={16} color="#FF6B6B" />
              <span><strong>Batch Split:</strong> Group multiple pages into each output file</span>
            </li>
            <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={16} color="#FF6B6B" />
              <span>All split files will be packaged in a ZIP for easy download</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SplitPDF;
