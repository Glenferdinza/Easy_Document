import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ImageIcon, PDFIcon, YouTubeIcon, MenuIcon, CloseIcon } from './Icons';
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
                      background: 'white',
                      minWidth: '250px',
                      borderRadius: '12px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                      marginTop: '0.5rem',
                      zIndex: 1001,
                      overflow: 'hidden',
                      border: '1px solid rgba(255, 107, 107, 0.1)'
                    }}>
                      <div style={{ padding: '0.5rem 0' }}>
                        {additionalFeatures.map((category) => (
                          <div key={category.category}>
                            <h4 style={{
                              padding: '0.75rem 1rem',
                              margin: '0',
                              fontSize: '0.9rem',
                              fontWeight: '600',
                              color: '#666',
                              borderBottom: '1px solid #eee'
                            }}>
                              {category.category}
                            </h4>
                            {category.items.map((item) => {
                              const Icon = item.icon;
                              return (
                                <Link
                                  key={item.name}
                                  to={item.path}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.75rem 1rem',
                                    color: '#333',
                                    textDecoration: 'none',
                                    transition: 'background 0.2s ease',
                                    position: 'relative'
                                  }}
                                  onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
                                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                  onClick={closeMenus}
                                >
                                  <Icon size={16} color="#ff6b6b" />
                                  <span style={{ flex: 1 }}>{item.name}</span>
                                </Link>
                              );
                            })}
                          </div>
                        ))}
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
