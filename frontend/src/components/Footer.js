import React from 'react';
import { GitHubIcon, InstagramIcon, HeartIcon, ImageIcon, DocumentIcon, VideoIcon, MobileIcon, BoltIcon } from './Icons';
import { Shield } from 'lucide-react';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer style={{
      background: 'linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%)',
      color: 'white',
      padding: '3rem 0 2rem',
      marginTop: '4rem'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          {/* Brand Section */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem'
            }}>
              <Logo size={32} />
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                margin: 0
              }}>
                Compresso
              </h3>
            </div>
            <p style={{
              opacity: 0.9,
              lineHeight: '1.6',
              marginBottom: '1.5rem'
            }}>
              Professional file compression and conversion tools. 
              Compress images, PDFs, and convert YouTube videos with ease.
            </p>
            <div style={{
              display: 'flex',
              gap: '1rem'
            }}>
              <a
                href="https://github.com/Glenferdinza"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: 'white',
                  textDecoration: 'none',
                  padding: '0.75rem 1rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <GitHubIcon size={20} />
                GitHub
              </a>
              <a
                href="https://instagram.com/g.syaaaa"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: 'white',
                  textDecoration: 'none',
                  padding: '0.75rem 1rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <InstagramIcon size={20} />
                Instagram
              </a>
            </div>
          </div>

          {/* Features Section */}
          <div>
            <h4 style={{
              fontSize: '1.2rem',
              fontWeight: '600',
              marginBottom: '1rem'
            }}>
              Features
            </h4>
            <ul style={{
              listStyle: 'none',
              opacity: 0.9,
              lineHeight: '1.8'
            }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <ImageIcon size={16} color="white" />
                Image Compression (JPG, PNG, WebP)
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <DocumentIcon size={16} color="white" />
                PDF Size Reduction
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <VideoIcon size={16} color="white" />
                YouTube to MP3/MP4 Conversion
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Shield size={16} color="white" />
                Secure & Private Processing
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <MobileIcon size={16} color="white" />
                Mobile-Friendly Interface
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <BoltIcon size={16} color="white" />
                Fast Processing
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.2)',
          paddingTop: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            opacity: 0.9
          }}>
            <span>Made with</span>
            <HeartIcon size={16} fill="white" />
            <span>by Asya's</span>
          </div>
          <div style={{
            opacity: 0.9,
            fontSize: '0.9rem'
          }}>
            © {new Date().getFullYear()} Compresso. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
