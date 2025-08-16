import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ImageIcon, 
  PDFIcon, 
  YouTubeIcon, 
  CompressIcon, 
  DownloadIcon,
  SettingsIcon
} from '../components/Icons';
import { FileImage, Scissors, Download, Upload, Shield, Zap } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    filesProcessed: 0,
    dataSaved: '0 MB'
  });

  useEffect(() => {
    // Fetch real stats from backend once on load
    fetchRealStats();
  }, []);

  const fetchRealStats = async () => {
    try {
      // Replace with your actual backend endpoint
      const response = await fetch('http://localhost:8000/api/stats/');
      if (response.ok) {
        const data = await response.json();
        setStats({
          totalUsers: data.total_users || 0,
          filesProcessed: data.files_processed || 0,
          dataSaved: data.data_saved || '0 MB'
        });
      } else {
        // Fallback to demo data if backend not available
        setStats({
          totalUsers: 1247,
          filesProcessed: 8564,
          dataSaved: '1.2 GB'
        });
      }
    } catch (error) {
      console.log('Using demo data - backend not connected');
      // Use static demo data
      setStats({
        totalUsers: 1247,
        filesProcessed: 8564,
        dataSaved: '1.2 GB'
      });
    }
  };

  const features = [
    {
      icon: ImageIcon,
      title: 'Image Compression',
      description: 'Compress your images up to 80% without losing quality. Supports JPEG, PNG, WebP formats.',
      path: '/image-compress',
      color: '#FF6B6B',
      steps: ['Upload Image', 'Choose Quality', 'Download Compressed']
    },
    {
      icon: PDFIcon,
      title: 'PDF Tools',
      description: 'Complete PDF toolkit: compress, merge, split, convert to images and more.',
      path: '/pdf-compress',
      color: '#FF8A8A',
      steps: ['Select PDF', 'Choose Tool', 'Process & Download']
    },
    {
      icon: YouTubeIcon,
      title: 'YouTube Converter',
      description: 'Convert YouTube videos to MP3 audio or MP4 video with high quality.',
      path: '/youtube-converter',
      color: '#FFA8A8',
      steps: ['Paste URL', 'Select Format', 'Download File']
    }
  ];

  const additionalTools = [
    {
      icon: Scissors,
      title: 'Split PDF',
      description: 'Split large PDF files into smaller chunks',
      path: '/split-pdf',
      color: '#FFB5B5'
    },
    {
      icon: FileImage,
      title: 'PDF to Image',
      description: 'Convert PDF pages to high-quality images',
      path: '/pdf-to-image',
      color: '#FFC2C2'
    },
    {
      icon: FileImage,
      title: 'Image to PDF',
      description: 'Combine multiple images into one PDF',
      path: '/image-to-pdf',
      color: '#FFCFCF'
    },
    {
      icon: Download,
      title: 'Merge PDF',
      description: 'Combine multiple PDF files into one',
      path: '/merge-pdf',
      color: '#FFDCDC'
    }
  ];

  const FeatureCard = ({ feature }) => (
    <div className="feature-card" data-aos="fade-up">
      <div className="feature-icon" style={{ backgroundColor: `${feature.color}20` }}>
        <feature.icon size={40} color={feature.color} />
      </div>
      <div className="feature-content">
        <h3>{feature.title}</h3>
        <p>{feature.description}</p>
        <div className="feature-steps">
          {feature.steps.map((step, index) => (
            <div key={index} className="step">
              <span className="step-number">{index + 1}</span>
              <span className="step-text">{step}</span>
            </div>
          ))}
        </div>
        <Link to={feature.path} className="feature-btn" style={{ backgroundColor: feature.color }}>
          Try Now
          <DownloadIcon size={16} color="white" />
        </Link>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      {/* Hero Section */}
      <section className="hero-section" data-aos="fade-down">
        <div className="hero-content">
          <h1>Welcome to Compresso</h1>
          <p>Your all-in-one file compression and conversion solution</p>
          <div className="hero-stats">
            <div className="stats-row-top">
              <div className="stat">
                <span className="stat-number">{stats.totalUsers.toLocaleString()}</span>
                <span className="stat-label">Happy Users</span>
              </div>
              <div className="stat">
                <span className="stat-number">{stats.filesProcessed.toLocaleString()}</span>
                <span className="stat-label">Files Processed</span>
              </div>
            </div>
            <div className="stats-row-bottom">
              <div className="stat">
                <span className="stat-number">{stats.dataSaved}</span>
                <span className="stat-label">Data Saved</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="main-features">
        <h2 data-aos="fade-up">Our Main Features</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>
      </section>

      {/* Additional Tools */}
      <section className="additional-tools" data-aos="fade-up">
        <h2>Additional Tools</h2>
        <div className="tools-grid">
          {additionalTools.map((tool, index) => (
            <Link key={index} to={tool.path} className="tool-card">
              <div className="tool-icon" style={{ backgroundColor: `${tool.color}20` }}>
                <tool.icon size={24} color={tool.color} />
              </div>
              <div className="tool-info">
                <h4>{tool.title}</h4>
                <p>{tool.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works" data-aos="fade-up">
        <h2>How It Works</h2>
        <div className="steps-container">
          <div className="step-item">
            <div className="step-icon">
              <Upload size={32} color="#FF6B6B" />
            </div>
            <h3>1. Upload</h3>
            <p>Select and upload your files securely</p>
          </div>
          <div className="step-item">
            <div className="step-icon">
              <SettingsIcon size={32} color="#4ECDC4" />
            </div>
            <h3>2. Process</h3>
            <p>Choose your settings and let us optimize</p>
          </div>
          <div className="step-item">
            <div className="step-icon">
              <Download size={32} color="#45B7D1" />
            </div>
            <h3>3. Download</h3>
            <p>Get your optimized files instantly</p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-choose-us" data-aos="fade-up">
        <h2>Why Choose Compresso?</h2>
        <div className="benefits-grid">
          <div className="benefit-card">
            <Shield size={40} color="#4ECDC4" />
            <h3>Secure & Private</h3>
            <p>Your files are processed securely and deleted after download</p>
          </div>
          <div className="benefit-card">
            <Zap size={40} color="#FF6B6B" />
            <h3>Lightning Fast</h3>
            <p>Optimized algorithms ensure quick processing times</p>
          </div>
          <div className="benefit-card">
            <CompressIcon size={40} color="#45B7D1" />
            <h3>High Quality</h3>
            <p>Maintain excellent quality while reducing file sizes</p>
          </div>
        </div>
      </section>

      <style jsx>{`
        .dashboard-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #fef7f7 0%, #ffffff 100%);
        }

        .hero-section {
          padding: 4rem 2rem;
          text-align: center;
          background: linear-gradient(135deg, #FF6B6B 0%, #FF8A8A 100%);
          color: white;
        }

        .hero-content h1 {
          font-size: 3.5rem;
          margin-bottom: 1rem;
          font-weight: 700;
        }

        .hero-content p {
          font-size: 1.3rem;
          margin-bottom: 3rem;
          opacity: 0.95;
        }

        .hero-stats {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          margin-top: 3rem;
        }

        .stats-row-top {
          display: flex;
          gap: 2rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .stats-row-bottom {
          display: flex;
          justify-content: center;
        }

        .stat {
          text-align: center;
          background: rgba(255, 255, 255, 0.15);
          padding: 1.5rem;
          border-radius: 16px;
          backdrop-filter: blur(10px);
          min-width: 150px;
        }

        .stat-number {
          display: block;
          font-size: 2.5rem;
          font-weight: 700;
          color: #ffffff;
        }

        .stat-label {
          font-size: 1rem;
          opacity: 0.9;
          color: #ffeaea;
        }

        .main-features {
          padding: 4rem 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .main-features h2 {
          text-align: center;
          font-size: 2.5rem;
          margin-bottom: 3rem;
          color: #2c3e50;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 2rem;
        }

        .feature-card {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }

        .feature-icon {
          width: 80px;
          height: 80px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .feature-content h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: #2c3e50;
        }

        .feature-content p {
          color: #7f8c8d;
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }

        .feature-steps {
          margin-bottom: 2rem;
        }

        .step {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 0.8rem;
        }

        .step-number {
          width: 24px;
          height: 24px;
          background: #FF6B6B;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: bold;
        }

        .step-text {
          color: #666;
          font-size: 0.9rem;
        }

        .feature-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 2rem;
          color: white;
          text-decoration: none;
          border-radius: 12px;
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
        }

        .feature-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
        }

        .additional-tools {
          padding: 4rem 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .additional-tools h2 {
          text-align: center;
          font-size: 2.5rem;
          margin-bottom: 3rem;
          color: #2c3e50;
        }

        .tools-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .tool-card {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 1rem;
          text-decoration: none;
          color: inherit;
          box-shadow: 0 5px 15px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
        }

        .tool-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        }

        .tool-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .tool-info h4 {
          margin: 0 0 0.5rem 0;
          color: #2c3e50;
        }

        .tool-info p {
          margin: 0;
          color: #7f8c8d;
          font-size: 0.9rem;
        }

        .how-it-works {
          padding: 4rem 2rem;
          background: white;
        }

        .how-it-works h2 {
          text-align: center;
          font-size: 2.5rem;
          margin-bottom: 3rem;
          color: #2c3e50;
        }

        .steps-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          max-width: 1000px;
          margin: 0 auto;
        }

        .step-item {
          text-align: center;
          padding: 2rem;
        }

        .step-icon {
          width: 80px;
          height: 80px;
          background: white;
          border: 2px solid #f0f0f0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        .step-item h3 {
          color: #2c3e50;
          margin-bottom: 1rem;
        }

        .step-item p {
          color: #666;
          line-height: 1.6;
        }

        .why-choose-us {
          padding: 4rem 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .why-choose-us h2 {
          text-align: center;
          font-size: 2.5rem;
          margin-bottom: 3rem;
          color: #2c3e50;
        }

        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .benefit-card {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(255, 107, 107, 0.08);
          transition: all 0.3s ease;
          border: 1px solid #ffe0e0;
        }

        .benefit-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(255, 107, 107, 0.15);
          border-color: #FF6B6B;
        }

        .benefit-card h3 {
          color: #2c3e50;
          margin: 1rem 0;
        }

        .benefit-card p {
          color: #7f8c8d;
          line-height: 1.6;
        }

        @media (max-width: 1200px) {
          .hero-content h1 {
            font-size: 3rem;
          }
          
          .features-grid {
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .hero-section {
            padding: 3rem 1rem;
          }

          .hero-content h1 {
            font-size: 2.2rem;
            line-height: 1.2;
          }

          .hero-content p {
            font-size: 1.1rem;
            margin-bottom: 2rem;
          }

          .hero-stats {
            gap: 1rem;
          }

          .stats-row-top {
            gap: 1rem;
            flex-direction: row;
          }

          .stats-row-bottom {
            margin-top: 0.5rem;
          }

          .stat {
            min-width: 120px;
            padding: 1rem;
          }

          .stat-number {
            font-size: 1.8rem;
          }

          .main-features,
          .additional-tools,
          .how-it-works,
          .why-choose-us {
            padding: 2rem 1rem;
          }

          .main-features h2,
          .additional-tools h2,
          .how-it-works h2,
          .why-choose-us h2 {
            font-size: 1.8rem;
            margin-bottom: 2rem;
          }

          .features-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .feature-card {
            padding: 1.5rem;
          }

          .feature-icon {
            width: 60px;
            height: 60px;
          }

          .tools-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .tool-card {
            padding: 1rem;
          }

          .tool-icon {
            width: 40px;
            height: 40px;
          }

          .steps-container {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .step-item {
            padding: 1.5rem 1rem;
          }

          .step-icon {
            width: 60px;
            height: 60px;
          }

          .benefits-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .benefit-card {
            padding: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .hero-content h1 {
            font-size: 1.8rem;
          }

          .hero-content p {
            font-size: 1rem;
          }

          .hero-stats {
            gap: 0.8rem;
          }

          .stats-row-top {
            gap: 0.8rem;
            flex-direction: column;
            align-items: center;
          }

          .stats-row-bottom {
            margin-top: 0.5rem;
          }

          .stat {
            min-width: 100px;
            padding: 0.8rem;
          }

          .stat-number {
            font-size: 1.5rem;
          }

          .stat-label {
            font-size: 0.9rem;
          }

          .main-features h2,
          .additional-tools h2,
          .how-it-works h2,
          .why-choose-us h2 {
            font-size: 1.5rem;
          }

          .feature-card {
            padding: 1rem;
          }

          .feature-icon {
            width: 50px;
            height: 50px;
          }

          .feature-content h3 {
            font-size: 1.2rem;
          }

          .step {
            margin-bottom: 0.6rem;
          }

          .feature-btn {
            padding: 0.8rem 1.5rem;
            font-size: 0.9rem;
          }

          .tool-card {
            flex-direction: column;
            text-align: center;
            gap: 0.8rem;
          }

          .tool-info h4 {
            font-size: 1rem;
          }

          .tool-info p {
            font-size: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
