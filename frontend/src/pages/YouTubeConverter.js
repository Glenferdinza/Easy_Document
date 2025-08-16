import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Youtube, Download, Music, Video, Link, Play, Clock, Eye } from 'lucide-react';
import { getVideoInfo, convertYouTube, formatFileSize } from '../utils/api';
import { LightBulbIcon, VideoIcon, BoltIcon } from '../components/Icons';

const YouTubeConverter = () => {
  const [url, setUrl] = useState('');
  const [videoInfo, setVideoInfo] = useState(null);
  const [format, setFormat] = useState('mp4');
  const [quality, setQuality] = useState('720p');
  const [loading, setLoading] = useState(false);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadHistory, setDownloadHistory] = useState([]);

  const validateUrl = (url) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)/;
    return youtubeRegex.test(url);
  };

  const fetchVideoInfo = async () => {
    if (!url.trim()) {
      toast.error('Please enter a YouTube URL');
      return;
    }

    if (!validateUrl(url)) {
      toast.error('Please enter a valid YouTube URL');
      return;
    }

    setLoading(true);
    try {
      const response = await getVideoInfo(url);
      setVideoInfo(response.data);
      toast.success('Video information loaded successfully!');
    } catch (error) {
      toast.error(`Failed to fetch video info: ${error.message}`);
      setVideoInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const handleConvert = async () => {
    if (!videoInfo) {
      toast.error('Please fetch video information first');
      return;
    }

    setConverting(true);
    setProgress(0);

    try {
      const response = await convertYouTube(
        url, 
        format,
        format === 'mp4' ? quality : undefined,
        (progressValue) => {
          setProgress(progressValue);
        }
      );

      // Download the file
      const blob = response.data;
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      
      const filename = `${videoInfo.title.replace(/[^a-zA-Z0-9]/g, '_')}.${format}`;
      link.download = filename;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      // Add to download history
      const newDownload = {
        id: Date.now(),
        title: videoInfo.title,
        format: format.toUpperCase(),
        size: formatFileSize(blob.size),
        timestamp: new Date().toLocaleString()
      };
      setDownloadHistory(prev => [newDownload, ...prev.slice(0, 4)]);

      toast.success(`${format.toUpperCase()} downloaded successfully!`);
    } catch (error) {
      toast.error(`Conversion failed: ${error.message}`);
    } finally {
      setConverting(false);
      setProgress(0);
    }
  };

  const clearForm = () => {
    setUrl('');
    setVideoInfo(null);
    setProgress(0);
  };

  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatViews = (views) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views?.toString() || '0';
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
            YouTube Converter
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#666',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Convert YouTube videos to MP3 audio or MP4 video format. High quality downloads available.
          </p>
        </div>

        {/* URL Input Section */}
        <div className="card" style={{ marginBottom: '2rem' }} data-aos="fade-up" data-aos-delay="100">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <Link size={20} style={{ color: '#45b7d1' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#333' }}>
              YouTube URL
            </h3>
          </div>
          
          <div style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '1rem',
            flexWrap: 'wrap'
          }}>
            <input
              type="text"
              placeholder="Paste YouTube URL here (e.g., https://www.youtube.com/watch?v=...)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                border: '2px solid #eee',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.3s ease',
                minWidth: '300px'
              }}
              onFocus={(e) => e.target.style.borderColor = '#45b7d1'}
              onBlur={(e) => e.target.style.borderColor = '#eee'}
            />
            <button
              onClick={fetchVideoInfo}
              disabled={loading}
              className="btn"
              style={{
                background: 'linear-gradient(135deg, #45b7d1 0%, #3498db 100%)',
                color: 'white',
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {loading ? (
                <>
                  <div className="loading" style={{ marginRight: '0.5rem' }} />
                  Loading...
                </>
              ) : (
                <>
                  <Play size={18} style={{ marginRight: '0.5rem' }} />
                  Get Info
                </>
              )}
            </button>
          </div>
          
          <p style={{
            fontSize: '0.9rem',
            color: '#666',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <LightBulbIcon size={16} color="#FF6B6B" />
            Supports YouTube.com and Youtu.be links
          </p>
        </div>

        {/* Video Info Section */}
        {videoInfo && (
          <div className="card" style={{ marginBottom: '2rem' }} data-aos="fade-up" data-aos-delay="200">
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              gap: '1.5rem',
              alignItems: 'start'
            }}>
              {/* Thumbnail */}
              <div style={{
                width: '200px',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
              }}>
                <img
                  src={videoInfo.thumbnail}
                  alt={videoInfo.title}
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block'
                  }}
                />
              </div>
              
              {/* Video Details */}
              <div>
                <h3 style={{
                  fontSize: '1.3rem',
                  fontWeight: '600',
                  color: '#333',
                  marginBottom: '1rem',
                  lineHeight: '1.4'
                }}>
                  {videoInfo.title}
                </h3>
                
                <div style={{
                  display: 'flex',
                  gap: '2rem',
                  marginBottom: '1rem',
                  flexWrap: 'wrap',
                  fontSize: '0.9rem',
                  color: '#666'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Youtube size={16} style={{ color: '#ff6b6b' }} />
                    {videoInfo.uploader}
                  </div>
                  
                  {videoInfo.duration > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Clock size={16} />
                      {formatDuration(videoInfo.duration)}
                    </div>
                  )}
                  
                  {videoInfo.view_count > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Eye size={16} />
                      {formatViews(videoInfo.view_count)} views
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Format Selection */}
        {videoInfo && (
          <div className="card" style={{ marginBottom: '2rem' }} data-aos="fade-up" data-aos-delay="300">
            <h3 style={{
              fontSize: '1.2rem',
              fontWeight: '600',
              color: '#333',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Download size={20} style={{ color: '#45b7d1' }} />
              Download Options
            </h3>
            
            {/* Format Selection */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                border: `2px solid ${format === 'mp3' ? '#45b7d1' : '#eee'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                background: format === 'mp3' ? 'rgba(69, 183, 209, 0.05)' : 'white',
                transition: 'all 0.3s ease'
              }}>
                <input
                  type="radio"
                  name="format"
                  value="mp3"
                  checked={format === 'mp3'}
                  onChange={(e) => setFormat(e.target.value)}
                  style={{ accentColor: '#45b7d1' }}
                />
                <Music size={20} style={{ color: '#45b7d1' }} />
                <div>
                  <div style={{ fontWeight: '600', color: '#333' }}>MP3 Audio</div>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>Audio only, smaller size</div>
                </div>
              </label>
              
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                border: `2px solid ${format === 'mp4' ? '#45b7d1' : '#eee'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                background: format === 'mp4' ? 'rgba(69, 183, 209, 0.05)' : 'white',
                transition: 'all 0.3s ease'
              }}>
                <input
                  type="radio"
                  name="format"
                  value="mp4"
                  checked={format === 'mp4'}
                  onChange={(e) => setFormat(e.target.value)}
                  style={{ accentColor: '#45b7d1' }}
                />
                <Video size={20} style={{ color: '#45b7d1' }} />
                <div>
                  <div style={{ fontWeight: '600', color: '#333' }}>MP4 Video</div>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>Video with audio</div>
                </div>
              </label>
            </div>

            {/* Quality Selection (only for MP4) */}
            {format === 'mp4' && (
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#333',
                  marginBottom: '1rem'
                }}>
                  Video Quality
                </h4>
                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  flexWrap: 'wrap'
                }}>
                  {[
                    { value: '480p', label: '480p', desc: 'Standard quality' },
                    { value: '720p', label: '720p', desc: 'HD quality' },
                    { value: '1080p', label: '1080p', desc: 'Full HD' }
                  ].map(q => (
                    <button
                      key={q.value}
                      onClick={() => setQuality(q.value)}
                      style={{
                        padding: '0.75rem 1rem',
                        background: quality === q.value ? '#45b7d1' : 'white',
                        color: quality === q.value ? 'white' : '#45b7d1',
                        border: `2px solid #45b7d1`,
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '500',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <div>{q.label}</div>
                      <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                        {q.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Convert Button */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={handleConvert}
                disabled={converting}
                className="btn"
                style={{
                  background: 'linear-gradient(135deg, #45b7d1 0%, #3498db 100%)',
                  color: 'white',
                  opacity: converting ? 0.7 : 1,
                  cursor: converting ? 'not-allowed' : 'pointer',
                  fontSize: '1.1rem',
                  padding: '1rem 2rem'
                }}
              >
                {converting ? (
                  <>
                    <div className="loading" style={{ marginRight: '0.5rem' }} />
                    Converting... ({progress}%)
                  </>
                ) : (
                  <>
                    <Download size={18} style={{ marginRight: '0.5rem' }} />
                    Download {format.toUpperCase()}
                  </>
                )}
              </button>
              
              <button
                onClick={clearForm}
                className="btn btn-secondary"
                style={{
                  borderColor: '#45b7d1',
                  color: '#45b7d1'
                }}
              >
                Clear
              </button>
            </div>

            {/* Progress Bar */}
            {converting && (
              <div style={{
                width: '100%',
                height: '6px',
                background: '#eee',
                borderRadius: '3px',
                marginTop: '1rem',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${progress}%`,
                  height: '100%',
                  background: 'linear-gradient(135deg, #45b7d1, #3498db)',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            )}
          </div>
        )}

        {/* Download History */}
        {downloadHistory.length > 0 && (
          <div className="card" data-aos="fade-up">
            <h3 style={{
              fontSize: '1.2rem',
              fontWeight: '600',
              color: '#333',
              marginBottom: '1.5rem'
            }}>
              Recent Downloads
            </h3>
            
            <div style={{ display: 'grid', gap: '1rem' }}>
              {downloadHistory.map((download) => (
                <div
                  key={download.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem',
                    background: '#f9f9f9',
                    borderRadius: '8px',
                    border: '1px solid #eee'
                  }}
                >
                  <div>
                    <div style={{
                      fontWeight: '500',
                      color: '#333',
                      marginBottom: '0.25rem'
                    }}>
                      {download.title}
                    </div>
                    <div style={{
                      display: 'flex',
                      gap: '1rem',
                      fontSize: '0.9rem',
                      color: '#666'
                    }}>
                      <span>{download.format}</span>
                      <span>{download.size}</span>
                      <span>{download.timestamp}</span>
                    </div>
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
            YouTube Converter Tips
          </h3>
          <ul style={{
            listStyle: 'none',
            color: '#666',
            lineHeight: '1.6'
          }}>
            <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Music size={16} color="#FF6B6B" />
              <span><strong>MP3 format</strong> is perfect for music and audio content</span>
            </li>
            <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <VideoIcon size={16} color="#FF6B6B" />
              <span><strong>MP4 format</strong> preserves video quality for movies and tutorials</span>
            </li>
            <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Video size={16} color="#FF6B6B" />
              <span><strong>Higher quality</strong> means larger file sizes</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BoltIcon size={16} color="#FF6B6B" />
              <span><strong>Processing time</strong> depends on video length and quality</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default YouTubeConverter;
