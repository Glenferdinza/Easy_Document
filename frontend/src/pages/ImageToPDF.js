import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import { Upload, Download, FileText, Settings, Trash2, Image as ImageIcon, Move } from 'lucide-react';
import { PDFIcon, LightBulbIcon } from '../components/Icons';
import { imagesToPDF, downloadFile } from '../utils/api';

const ImageToPDF = () => {
  const [images, setImages] = useState([]);
  const [pageSize, setPageSize] = useState('A4');
  const [orientation, setOrientation] = useState('portrait');
  const [quality, setQuality] = useState('high');
  const [converting, setConverting] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const imageFiles = acceptedFiles.filter(file => file.type.startsWith('image/'));
    if (imageFiles.length !== acceptedFiles.length) {
      toast.warning('Only image files are allowed');
    }
    if (imageFiles.length > 0) {
      setImages(prev => [...prev, ...imageFiles]);
      toast.success(`${imageFiles.length} image(s) added`);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp', '.tiff']
    },
    maxFiles: 50
  });

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setImages([]);
  };

  const moveImage = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= images.length) return;
    
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    setImages(newImages);
  };

  const handleConvert = async () => {
    if (images.length === 0) {
      toast.error('Please add at least one image');
      return;
    }

    setConverting(true);
    try {
      const options = {
        pageSize,
        orientation,
        quality
      };
      
      const response = await imagesToPDF(images, options);
      downloadFile(response.data, 'images_to_pdf.pdf');
      toast.success('Images converted to PDF successfully!');
      setImages([]);
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
            Images to PDF
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#666',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Convert multiple images into a single PDF document. Drag and drop your images or click to browse.
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
            <ImageIcon size={48} color={isDragActive ? '#FF6B6B' : '#999'} />
            <p style={{
              fontSize: '1.1rem',
              margin: '1rem 0 0.5rem',
              color: isDragActive ? '#FF6B6B' : '#333'
            }}>
              {isDragActive ? 'Drop images here...' : 'Drag & drop images here'}
            </p>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>
              Supports PNG, JPG, JPEG, GIF, BMP, WebP, TIFF (max 50 files)
            </p>
          </div>
        </div>

        {/* Settings */}
        {images.length > 0 && (
          <>
            <div className="card" style={{ marginBottom: '2rem' }} data-aos="fade-up" data-aos-delay="200">
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
                PDF Settings
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                {/* Page Size */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#333', marginBottom: '0.5rem' }}>
                    Page Size
                  </label>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(e.target.value)}
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
                    <option value="A4">A4 (210 × 297 mm)</option>
                    <option value="A3">A3 (297 × 420 mm)</option>
                    <option value="A5">A5 (148 × 210 mm)</option>
                    <option value="Letter">Letter (8.5 × 11 in)</option>
                    <option value="Legal">Legal (8.5 × 14 in)</option>
                  </select>
                </div>

                {/* Orientation */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#333', marginBottom: '0.5rem' }}>
                    Orientation
                  </label>
                  <select
                    value={orientation}
                    onChange={(e) => setOrientation(e.target.value)}
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
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                  </select>
                </div>

                {/* Quality */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#333', marginBottom: '0.5rem' }}>
                    Quality
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
                    <option value="high">High Quality</option>
                    <option value="medium">Medium Quality</option>
                    <option value="low">Low Quality (smaller file)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Images List */}
            <div className="card" style={{ marginBottom: '2rem' }} data-aos="fade-up" data-aos-delay="300">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#333' }}>
                  Images ({images.length})
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

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                {images.map((image, index) => (
                  <div
                    key={index}
                    style={{
                      border: '1px solid #eee',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      background: 'white'
                    }}
                  >
                    <div style={{ 
                      height: '120px', 
                      background: '#f8f9fa',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative'
                    }}>
                      <img
                        src={URL.createObjectURL(image)}
                        alt={image.name}
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain'
                        }}
                      />
                      <div style={{
                        position: 'absolute',
                        top: '0.5rem',
                        left: '0.5rem',
                        background: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.8rem'
                      }}>
                        #{index + 1}
                      </div>
                    </div>
                    <div style={{ padding: '1rem' }}>
                      <div style={{ 
                        fontSize: '0.9rem', 
                        fontWeight: '500', 
                        color: '#333',
                        marginBottom: '0.25rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {image.name}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '1rem' }}>
                        {formatFileSize(image.size)}
                      </div>
                      
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => moveImage(index, index - 1)}
                          disabled={index === 0}
                          style={{
                            flex: 1,
                            padding: '0.5rem',
                            background: index === 0 ? '#f8f9fa' : '#FF6B6B',
                            color: index === 0 ? '#ccc' : 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: index === 0 ? 'not-allowed' : 'pointer',
                            fontSize: '0.8rem'
                          }}
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => moveImage(index, index + 1)}
                          disabled={index === images.length - 1}
                          style={{
                            flex: 1,
                            padding: '0.5rem',
                            background: index === images.length - 1 ? '#f8f9fa' : '#FF6B6B',
                            color: index === images.length - 1 ? '#ccc' : 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: index === images.length - 1 ? 'not-allowed' : 'pointer',
                            fontSize: '0.8rem'
                          }}
                        >
                          ↓
                        </button>
                        <button
                          onClick={() => removeImage(index)}
                          style={{
                            flex: 1,
                            padding: '0.5rem',
                            background: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleConvert}
                disabled={images.length === 0 || converting}
                style={{
                  width: '100%',
                  padding: '1rem 2rem',
                  background: images.length > 0 && !converting ? 'linear-gradient(135deg, #FF6B6B 0%, #FF5252 100%)' : '#ccc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: images.length > 0 && !converting ? 'pointer' : 'not-allowed',
                  marginTop: '1.5rem',
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
                    Creating PDF...
                  </>
                ) : (
                  <>
                    <PDFIcon size={20} />
                    Create PDF
                  </>
                )}
              </button>
            </div>
          </>
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
            <LightBulbIcon size={20} color="#FF6B6B" />
            Image to PDF Tips
          </h3>
          <ul style={{
            listStyle: 'none',
            color: '#666',
            lineHeight: '1.6'
          }}>
            <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Move size={16} color="#FF6B6B" />
              <span>Use the arrow buttons to reorder images in the PDF</span>
            </li>
            <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={16} color="#FF6B6B" />
              <span>Images will automatically fit to the selected page size</span>
            </li>
            <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Settings size={16} color="#FF6B6B" />
              <span>Choose low quality setting for smaller PDF file sizes</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ImageToPDF;
