import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ImageIcon, 
  PDFIcon, 
  YouTubeIcon, 
  MenuIcon, 
  CloseIcon, 
  BackgroundRemoverIcon, 
  ImageEnhancerIcon, 
  WordIcon, 
  MergeIcon
} from './Icons';
import { Shield, QrCode, FileImage } from 'lucide-react';
import { Home } from 'lucide-react';
import Logo from './Logo';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  const mainNavigation = [
    { name: 'Home', path: '/dashboard', icon: Home },
    { name: 'Image Compress', path: '/image-compress', icon: ImageIcon },
    { name: 'PDF Compress', path: '/pdf-compress', icon: PDFIcon },
    { name: 'YouTube Converter', path: '/youtube-converter', icon: YouTubeIcon },
  ];

  const additionalFeatures = [
    {
      category: 'PDF Tools',
      items: [
        { name: 'Merge PDF', path: '/merge-pdf', icon: PDFIcon },
        { name: 'Split PDF', path: '/split-pdf', icon: PDFIcon },
        { name: 'PDF to Image', path: '/pdf-to-image', icon: ImageIcon },
      ]
    },
    {
      category: 'Image Tools', 
      items: [
        { name: 'Image to PDF', path: '/image-to-pdf', icon: PDFIcon },
        { name: 'Background Remover', path: '/background-remover', icon: BackgroundRemoverIcon },
        { name: 'Image Enhancer', path: '/image-enhancer', icon: ImageEnhancerIcon },
      ]
    },
    {
      category: 'Word Tools',
      items: [
        { name: 'Word to PDF', path: '/word-to-pdf', icon: WordIcon },
        { name: 'Word Merge', path: '/word-merge', icon: MergeIcon },
      ]
    },
    {
      category: 'Security Tools',
      items: [
        { name: 'Security Center', path: '/security-center', icon: Shield },
      ]
    },
    {
      category: 'Utility Tools',
      items: [
        { name: 'QR Code Generator', path: '/qr-generator', icon: QrCode },
        { name: 'Watermark Tools', path: '/watermark-tools', icon: FileImage },
      ]
    }
  ];

  const allFeatures = [
    ...mainNavigation,
    ...additionalFeatures.flatMap(cat => cat.items)
  ];

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const toggleMobileMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleDesktopMenu = () => {
    setIsDesktopMenuOpen(!isDesktopMenuOpen);
  };

  const closeMenus = () => {
    setIsOpen(false);
    setIsDesktopMenuOpen(false);
  };

  return (
    <>
      <nav style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 2px 20px rgba(0, 0, 0, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        borderBottom: '1px solid rgba(255, 107, 107, 0.1)'
      }}>
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 0'
          }}>
            {/* Logo */}
            <Link to="/" style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              textDecoration: 'none',
              color: '#333',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }} onClick={() => setIsOpen(false)}>
              <Logo size={32} />
              <span style={{
                background: 'linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Compresso
              </span>
            </Link>

            {/* Desktop Menu - Show 3 main items + hamburger for additional features */}
            {!isMobile && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2rem'
              }}>
                {mainNavigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: isActive ? '#ff6b6b' : '#333',
                        textDecoration: 'none',
                        fontWeight: isActive ? '600' : '500',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        transition: 'all 0.3s ease',
                        background: isActive ? 'rgba(255, 107, 107, 0.1)' : 'transparent',
                        position: 'relative'
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.color = '#ff6b6b';
                          e.currentTarget.style.background = 'rgba(255, 107, 107, 0.05)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.color = '#333';
                          e.currentTarget.style.background = 'transparent';
                        }
                      }}
                      onClick={closeMenus}
                    >
                      <Icon size={18} color={isActive ? '#ff6b6b' : '#333'} />
                      {item.name}
                    </Link>
                  );
                })}

                {/* Desktop Hamburger Menu for Additional Features */}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={toggleDesktopMenu}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.5rem',
                      color: '#ff6b6b',
                      background: isDesktopMenuOpen ? 'rgba(255, 107, 107, 0.1)' : 'none',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: '8px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 107, 107, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isDesktopMenuOpen) {
                        e.currentTarget.style.background = 'none';
                      }
                    }}
                  >
                    {isDesktopMenuOpen ? <CloseIcon size={24} color="#ff6b6b" /> : <MenuIcon size={24} color="#ff6b6b" />}
                  </button>

                  {/* Desktop Dropdown Menu */}
                  {isDesktopMenuOpen && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      right: '0',
                      width: '680px',
                      maxWidth: '90vw',
                      borderRadius: '16px',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                      marginTop: '0.5rem',
                      zIndex: 1001,
                      overflow: 'hidden',
                      border: '1px solid rgba(255, 107, 157, 0.2)',
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,242,248,0.95) 100%)'
                    }}>
                      <div style={{ padding: '2rem' }}>
                        <div style={{
                          textAlign: 'center',
                          marginBottom: '2rem',
                          background: 'linear-gradient(135deg, #ff6b9d 0%, #ff8fab 100%)',
                          padding: '1rem',
                          borderRadius: '12px',
                          color: 'white'
                        }}>
                          <h3 style={{
                            margin: '0 0 0.5rem 0',
                            fontSize: '1.3rem',
                            fontWeight: '700'
                          }}>
                            Additional Tools
                          </h3>
                          <p style={{
                            margin: '0',
                            fontSize: '0.9rem',
                            opacity: '0.9'
                          }}>
                            Extended functionality for document processing
                          </p>
                        </div>
                        
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                          gap: '1.5rem',
                          maxHeight: '450px',
                          overflowY: 'auto',
                          paddingRight: '0.5rem'
                        }}>
                          {additionalFeatures.map((category) => (
                            <div key={category.category} style={{
                              background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,251,253,0.95) 100%)',
                              borderRadius: '16px',
                              padding: '1.5rem',
                              border: '2px solid rgba(255, 107, 157, 0.1)',
                              boxShadow: '0 8px 25px rgba(255, 107, 157, 0.1)',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'translateY(-2px)';
                              e.currentTarget.style.boxShadow = '0 12px 35px rgba(255, 107, 157, 0.2)';
                              e.currentTarget.style.borderColor = 'rgba(255, 107, 157, 0.3)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 107, 157, 0.1)';
                              e.currentTarget.style.borderColor = 'rgba(255, 107, 157, 0.1)';
                            }}
                            >
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                marginBottom: '1rem',
                                paddingBottom: '0.75rem',
                                borderBottom: '2px solid rgba(255, 107, 157, 0.1)'
                              }}>
                                <div style={{
                                  width: '40px',
                                  height: '40px',
                                  background: 'linear-gradient(135deg, #ff6b9d 0%, #ff8fab 100%)',
                                  borderRadius: '10px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  marginRight: '0.75rem',
                                  boxShadow: '0 4px 12px rgba(255, 107, 157, 0.3)'
                                }}>
                                  <span style={{ color: 'white', fontSize: '0.75rem', fontWeight: '700' }}>
                                    {category.category.split(' ')[0].slice(0, 2).toUpperCase()}
                                  </span>
                                </div>
                                <h4 style={{
                                  margin: '0',
                                  fontSize: '1rem',
                                  fontWeight: '700',
                                  color: '#333',
                                  background: 'linear-gradient(135deg, #ff6b9d 0%, #ff8fab 100%)',
                                  WebkitBackgroundClip: 'text',
                                  WebkitTextFillColor: 'transparent',
                                  backgroundClip: 'text'
                                }}>
                                  {category.category}
                                </h4>
                              </div>
                              
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {category.items.map((item) => {
                                  const Icon = item.icon;
                                  return (
                                    <Link
                                      key={item.name}
                                      to={item.path}
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        padding: '1rem',
                                        color: '#333',
                                        textDecoration: 'none',
                                        borderRadius: '12px',
                                        transition: 'all 0.3s ease',
                                        fontSize: '0.95rem',
                                        fontWeight: '600',
                                        background: 'rgba(255, 255, 255, 0.6)',
                                        border: '1px solid rgba(255, 107, 157, 0.1)'
                                      }}
                                      onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 107, 157, 0.1) 0%, rgba(255, 139, 171, 0.1) 100%)';
                                        e.currentTarget.style.transform = 'translateX(4px)';
                                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 107, 157, 0.2)';
                                        e.currentTarget.style.borderColor = 'rgba(255, 107, 157, 0.3)';
                                      }}
                                      onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.6)';
                                        e.currentTarget.style.transform = 'translateX(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                        e.currentTarget.style.borderColor = 'rgba(255, 107, 157, 0.1)';
                                      }}
                                      onClick={closeMenus}
                                    >
                                      <div style={{
                                        width: '32px',
                                        height: '32px',
                                        background: 'linear-gradient(135deg, #ff6b9d 0%, #ff8fab 100%)',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                        boxShadow: '0 3px 8px rgba(255, 107, 157, 0.3)'
                                      }}>
                                        <Icon size={16} color="white" />
                                      </div>
                                      <div style={{ flex: 1 }}>
                                        <div style={{ 
                                          fontSize: '0.95rem', 
                                          fontWeight: '600',
                                          marginBottom: '2px'
                                        }}>
                                          {item.name}
                                        </div>
                                        <div style={{ 
                                          fontSize: '0.75rem', 
                                          color: '#666',
                                          fontWeight: '400'
                                        }}>
                                          {item.name === 'Background Remover' && 'AI-powered background removal'}
                                          {item.name === 'Image Enhancer' && 'Professional image editing'}
                                          {item.name === 'Word to PDF' && 'Convert Word documents to PDF'}
                                          {item.name === 'Word Merge' && 'Combine multiple Word files'}
                                          {item.name === 'Security Center' && 'Secure your documents'}
                                          {item.name === 'QR Code Generator' && 'Create custom QR codes'}
                                          {item.name === 'Watermark Tools' && 'Add watermarks to images'}
                                        </div>
                                      </div>
                                    </Link>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Mobile Menu Button - Only show features menu */}
            {isMobile && (
              <button
                onClick={toggleMobileMenu}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.5rem',
                  color: '#ff6b6b',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 107, 107, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'none';
                }}
              >
                {isOpen ? <CloseIcon size={24} color="#ff6b6b" /> : <MenuIcon size={24} color="#ff6b6b" />}
              </button>
            )}
          </div>

          {/* Mobile Menu - Show all features */}
          {isMobile && isOpen && (
            <div style={{
              display: 'block',
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(10px)',
              borderTop: '1px solid rgba(255, 107, 107, 0.1)',
              padding: '1rem 0',
              animation: 'slideDown 0.3s ease-out'
            }}>
              {allFeatures.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={closeMenus}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      color: isActive ? '#ff6b6b' : '#333',
                      textDecoration: 'none',
                      fontWeight: isActive ? '600' : '500',
                      padding: '1rem',
                      borderRadius: '12px',
                      margin: '0.5rem 0',
                      background: isActive ? 'rgba(255, 107, 107, 0.1)' : 'transparent',
                      border: '1px solid ' + (isActive ? '#ff6b6b' : 'rgba(0,0,0,0.1)'),
                      transition: 'all 0.3s ease',
                      fontSize: '1.1rem',
                      position: 'relative'
                    }}
                  >
                    <Icon size={20} color={isActive ? '#ff6b6b' : '#333'} />
                    <span style={{ flex: 1 }}>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .container {
            padding: 0 1rem;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;
