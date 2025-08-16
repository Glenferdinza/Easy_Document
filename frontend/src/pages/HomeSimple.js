import React from 'react';
import { Link } from 'react-router-dom';

const HomeSimple = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <section style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#2c3e50' }}>
          Welcome to Compresso
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#7f8c8d', marginBottom: '2rem' }}>
          Your ultimate file compression solution
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
            <h3>Image Compression</h3>
            <p>Compress your images without losing quality</p>
            <Link to="/image-compress" style={{ color: '#FF6B6B', textDecoration: 'none', fontWeight: 'bold' }}>
              Try Now →
            </Link>
          </div>
          
          <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
            <h3>PDF Tools</h3>
            <p>Compress, merge, split, and convert PDF files</p>
            <Link to="/pdf-compress" style={{ color: '#FF6B6B', textDecoration: 'none', fontWeight: 'bold' }}>
              Try Now →
            </Link>
          </div>
          
          <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
            <h3>YouTube Converter</h3>
            <p>Convert YouTube videos to MP3 or MP4</p>
            <Link to="/youtube-converter" style={{ color: '#FF6B6B', textDecoration: 'none', fontWeight: 'bold' }}>
              Try Now →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeSimple;
