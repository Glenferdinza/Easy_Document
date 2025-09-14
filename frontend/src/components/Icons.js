import React from 'react';

// Custom icons with consistent styling and colors from website theme

export const ImageIcon = ({ size = 24, color = '#FF6B6B' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="3" y="3" width="18" height="14" rx="2" stroke={color} strokeWidth="2" fill="none"/>
    <circle cx="8.5" cy="8.5" r="1.5" fill={color}/>
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" stroke={color} strokeWidth="2"/>
  </svg>
);

export const PDFIcon = ({ size = 24, color = '#FF6B6B' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" 
      fill={color}
    />
    <text x="12" y="16" textAnchor="middle" fontSize="6" fill="white" fontWeight="bold">PDF</text>
  </svg>
);

export const YouTubeIcon = ({ size = 24, color = '#FF6B6B' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="2" y="6" width="20" height="12" rx="2" stroke={color} strokeWidth="2" fill="none"/>
    <polygon points="10,9 15,12 10,15" fill={color}/>
  </svg>
);

export const CompressIcon = ({ size = 24, color = '#FF6B6B' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M8 12L12 8L16 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 16L12 12L16 16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="2" y="4" width="20" height="2" rx="1" fill={color}/>
    <rect x="2" y="18" width="20" height="2" rx="1" fill={color}/>
  </svg>
);

export const UploadIcon = ({ size = 24, color = '#FF6B6B' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M21 15V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V15" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="7,10 12,5 17,10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="12" y1="5" x2="12" y2="15" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const DownloadIcon = ({ size = 24, color = '#FF6B6B' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M21 15V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V15" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="7,10 12,15 17,10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="12" y1="15" x2="12" y2="3" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const SettingsIcon = ({ size = 24, color = '#FF6B6B' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" fill="none"/>
    <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const SecurityIcon = ({ size = 24, color = '#FF6B6B' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2L3 7L12 22L21 7L12 2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 8V16M8 12H16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const SpeedIcon = ({ size = 24, color = '#FF6B6B' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none"/>
    <polyline points="12,6 12,12 16,14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const MenuIcon = ({ size = 24, color = '#FF6B6B' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <line x1="3" y1="6" x2="21" y2="6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <line x1="3" y1="12" x2="21" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <line x1="3" y1="18" x2="21" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const CloseIcon = ({ size = 24, color = '#FF6B6B' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const CheckIcon = ({ size = 24, color = '#4ECDC4' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <polyline points="20,6 9,17 4,12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ErrorIcon = ({ size = 24, color = '#FF4444' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none"/>
    <line x1="15" y1="9" x2="9" y2="15" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <line x1="9" y1="9" x2="15" y2="15" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const LoadingIcon = ({ size = 24, color = '#FF6B6B' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    style={{ animation: 'spin 1s linear infinite' }}
  >
    <path 
      d="M21,12A9,9 0 1,1 12,3" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round"
    />
    <style>{`
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `}</style>
  </svg>
);

export const GitHubIcon = ({ size = 24, color = 'white' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 0.296997C5.37 0.296997 0 5.67 0 12.297C0 17.6 3.438 22.097 8.205 23.682C8.805 23.795 9.025 23.424 9.025 23.105C9.025 22.82 9.015 22.065 9.01 21.065C5.672 21.789 4.968 19.455 4.968 19.455C4.422 18.07 3.633 17.7 3.633 17.7C2.546 16.956 3.717 16.971 3.717 16.971C4.922 17.055 5.555 18.207 5.555 18.207C6.625 20.042 8.364 19.512 9.05 19.205C9.158 18.429 9.467 17.9 9.81 17.6C7.145 17.3 4.344 16.268 4.344 11.67C4.344 10.36 4.809 9.29 5.579 8.45C5.444 8.147 5.039 6.927 5.684 5.274C5.684 5.274 6.689 4.952 8.984 6.504C9.944 6.237 10.964 6.105 11.984 6.099C13.004 6.105 14.024 6.237 14.984 6.504C17.264 4.952 18.269 5.274 18.269 5.274C18.914 6.927 18.509 8.147 18.389 8.45C19.154 9.29 19.619 10.36 19.619 11.67C19.619 16.28 16.814 17.295 14.144 17.59C14.564 17.950 14.954 18.686 14.954 19.81C14.954 21.416 14.939 22.706 14.939 23.096C14.939 23.411 15.149 23.786 15.764 23.666C20.565 22.092 24 17.592 24 12.297C24 5.67 18.627 0.296997 12 0.296997Z"
      fill={color}
    />
  </svg>
);

export const InstagramIcon = ({ size = 24, color = 'white' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2.163C15.204 2.163 15.584 2.175 16.85 2.233C20.102 2.381 21.621 3.924 21.769 7.152C21.827 8.417 21.838 8.797 21.838 12.001C21.838 15.206 21.826 15.585 21.769 16.85C21.62 20.075 20.105 21.621 16.85 21.769C15.584 21.827 15.206 21.839 12 21.839C8.796 21.839 8.416 21.827 7.151 21.769C3.891 21.62 2.38 20.07 2.232 16.849C2.174 15.584 2.162 15.205 2.162 12C2.162 8.796 2.175 8.417 2.232 7.151C2.381 3.924 3.896 2.38 7.151 2.232C8.417 2.175 8.796 2.163 12 2.163ZM12 0C8.741 0 8.333 0.014 7.053 0.072C2.695 0.272 0.273 2.69 0.073 7.052C0.014 8.333 0 8.741 0 12C0 15.259 0.014 15.668 0.072 16.948C0.272 21.306 2.69 23.728 7.052 23.928C8.333 23.986 8.741 24 12 24C15.259 24 15.668 23.986 16.948 23.928C21.302 23.728 23.73 21.31 23.927 16.948C23.986 15.668 24 15.259 24 12C24 8.741 23.986 8.333 23.928 7.053C23.732 2.699 21.311 0.273 16.949 0.073C15.668 0.014 15.259 0 12 0ZM12 5.838C8.597 5.838 5.838 8.597 5.838 12C5.838 15.403 8.597 18.163 12 18.163C15.403 18.163 18.162 15.404 18.162 12C18.162 8.597 15.403 5.838 12 5.838ZM12 16C9.791 16 8 14.21 8 12C8 9.791 9.791 8 12 8C14.209 8 16 9.791 16 12C16 14.21 14.209 16 12 16ZM18.406 4.155C18.406 4.955 17.761 5.6 16.961 5.6C16.161 5.6 15.515 4.955 15.515 4.155C15.515 3.355 16.16 2.709 16.961 2.709C17.761 2.709 18.406 3.355 18.406 4.155Z"
      fill={color}
    />
  </svg>
);

export const HeartIcon = ({ size = 24, color = 'white', filled = false }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20.84 4.61C20.32 4.09 19.69 3.67 18.99 3.39C18.29 3.11 17.54 2.97 16.78 2.97C16.02 2.97 15.27 3.11 14.57 3.39C13.87 3.67 13.24 4.09 12.72 4.61L12 5.33L11.28 4.61C10.23 3.56 8.81 2.97 7.22 2.97C5.63 2.97 4.21 3.56 3.16 4.61C2.11 5.66 1.52 7.08 1.52 8.67C1.52 10.26 2.11 11.68 3.16 12.73L11.29 20.86C11.68 21.25 12.31 21.25 12.7 20.86L20.83 12.73C21.88 11.68 22.47 10.26 22.47 8.67C22.47 7.08 21.88 5.66 20.84 4.61Z"
      fill={filled ? color : 'none'}
      stroke={color}
      strokeWidth={filled ? "0" : "2"}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const MobileIcon = ({ size = 24, color = '#FF6B6B' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" stroke={color} strokeWidth="2" fill="none"/>
    <line x1="12" y1="18" x2="12.01" y2="18" stroke={color} strokeWidth="2"/>
  </svg>
);

export const BoltIcon = ({ size = 24, color = '#FF6B6B' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" fill={color}/>
  </svg>
);

export const LightBulbIcon = ({ size = 24, color = '#FF6B6B' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M9 21h6m-4-4h2a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" 
      stroke={color} 
      strokeWidth="2" 
      fill="none"
    />
    <line x1="12" y1="3" x2="12" y2="1" stroke={color} strokeWidth="2"/>
    <line x1="18.36" y1="6.64" x2="19.78" y2="5.22" stroke={color} strokeWidth="2"/>
    <line x1="18.36" y1="17.36" x2="19.78" y2="18.78" stroke={color} strokeWidth="2"/>
    <line x1="5.64" y1="17.36" x2="4.22" y2="18.78" stroke={color} strokeWidth="2"/>
    <line x1="5.64" y1="6.64" x2="4.22" y2="5.22" stroke={color} strokeWidth="2"/>
  </svg>
);

export const DocumentIcon = ({ size = 24, color = '#FF6B6B' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" fill={color}/>
  </svg>
);

export const VideoIcon = ({ size = 24, color = '#FF6B6B' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <polygon points="23 7 16 12 23 17" fill={color}/>
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" stroke={color} strokeWidth="2" fill="none"/>
  </svg>
);

// Custom icon untuk Background Remover
export const BackgroundRemoverIcon = ({ size = 24, color = '#ff6b9d' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="3" y="3" width="18" height="14" rx="2" stroke={color} strokeWidth="2" fill="none"/>
    <circle cx="8.5" cy="8.5" r="1.5" fill={color}/>
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" stroke={color} strokeWidth="2"/>
    <path d="M12 2L22 12L12 22L2 12Z" fill="white" stroke={color} strokeWidth="1.5" opacity="0.8"/>
    <path d="M10 10L14 14M14 10L10 14" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Custom icon untuk Image Enhancer
export const ImageEnhancerIcon = ({ size = 24, color = '#ff8fa3' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="3" y="3" width="18" height="14" rx="2" stroke={color} strokeWidth="2" fill="none"/>
    <circle cx="8.5" cy="8.5" r="1.5" fill={color}/>
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" stroke={color} strokeWidth="2"/>
    <circle cx="17" cy="7" r="3" fill="none" stroke={color} strokeWidth="1.5"/>
    <path d="M15.5 5.5L18.5 8.5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="15.5" cy="5.5" r="0.5" fill={color}/>
    <circle cx="18.5" cy="8.5" r="0.5" fill={color}/>
  </svg>
);

// Icon untuk Sharpen Enhancement
export const SharpenIcon = ({ size = 24, color = '#ff8fa3' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2L22 12L12 22L2 12Z" stroke={color} strokeWidth="2" fill="none"/>
    <path d="M8 12L12 8L16 12L12 16Z" fill={color} opacity="0.3"/>
    <circle cx="12" cy="12" r="2" fill={color}/>
  </svg>
);

// Icon untuk Noise Reduction
export const NoiseReductionIcon = ({ size = 24, color = '#ff8fa3' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" stroke={color} strokeWidth="2" fill="none"/>
    <path d="M8 8L16 16M16 8L8 16" stroke={color} strokeWidth="1.5" opacity="0.5"/>
    <circle cx="8" cy="8" r="1" fill={color}/>
    <circle cx="16" cy="8" r="1" fill={color}/>
    <circle cx="8" cy="16" r="1" fill={color}/>
    <circle cx="16" cy="16" r="1" fill={color}/>
    <path d="M7 12H17" stroke={color} strokeWidth="2"/>
  </svg>
);

// Icon untuk Upscale
export const UpscaleIcon = ({ size = 24, color = '#ff8fa3' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="6" y="6" width="8" height="8" stroke={color} strokeWidth="1.5" fill="none" opacity="0.5"/>
    <rect x="4" y="4" width="16" height="16" stroke={color} strokeWidth="2" fill="none"/>
    <path d="M9 15L15 9M15 15L9 9" stroke={color} strokeWidth="1" opacity="0.7"/>
    <path d="M4 4L8 8M20 4L16 8M4 20L8 16M20 20L16 16" stroke={color} strokeWidth="1.5"/>
  </svg>
);

// Icon untuk Color Enhancement
export const ColorEnhanceIcon = ({ size = 24, color = '#ff8fa3' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none"/>
    <circle cx="8" cy="8" r="2" fill="#ff6b9d"/>
    <circle cx="16" cy="8" r="2" fill="#ff8fa3"/>
    <circle cx="8" cy="16" r="2" fill="#ffb3c6"/>
    <circle cx="16" cy="16" r="2" fill="#ffc2d4"/>
    <circle cx="12" cy="12" r="1.5" fill={color}/>
  </svg>
);

// Icon untuk Brightness
export const BrightnessIcon = ({ size = 24, color = '#ff8fa3' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="4" fill={color}/>
    <path d="M12 2V4M12 20V22M4.93 4.93L6.34 6.34M17.66 17.66L19.07 19.07M2 12H4M20 12H22M4.93 19.07L6.34 17.66M17.66 6.34L19.07 4.93" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Icon untuk Contrast
export const ContrastIcon = ({ size = 24, color = '#ff8fa3' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none"/>
    <path d="M12 2A10 10 0 0 1 12 22Z" fill={color}/>
    <path d="M6 8L12 12L18 8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M6 16L12 12L18 16" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Icon untuk Word Document
export const WordIcon = ({ size = 24, color = '#2B579A' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" fill={color}/>
    <text x="12" y="16" textAnchor="middle" fontSize="5" fill="white" fontWeight="bold">W</text>
  </svg>
);

// Icon untuk Merge Documents
export const MergeIcon = ({ size = 24, color = '#ff8fa3' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="2" y="3" width="8" height="10" rx="1" stroke={color} strokeWidth="1.5" fill="none"/>
    <rect x="14" y="3" width="8" height="10" rx="1" stroke={color} strokeWidth="1.5" fill="none"/>
    <rect x="7" y="16" width="10" height="6" rx="1" stroke={color} strokeWidth="2" fill={color} opacity="0.2"/>
    <path d="M6 13L12 16L18 13" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 8V16" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// New Feature Icons

export const WatermarkIcon = ({ size = 24, color = '#ff6b9d' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="3" y="3" width="18" height="14" rx="2" stroke={color} strokeWidth="2" fill="none"/>
    <path d="M8 12l2 2 4-4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <text x="12" y="16" textAnchor="middle" fontSize="4" fill={color} fontWeight="bold">SAMPLE</text>
  </svg>
);

export const UniversalConverterIcon = ({ size = 24, color = '#ff8fa3' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="2" y="4" width="8" height="6" rx="1" stroke={color} strokeWidth="2" fill="none"/>
    <rect x="14" y="4" width="8" height="6" rx="1" stroke={color} strokeWidth="2" fill="none"/>
    <path d="M10 7h4" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 5v4" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <text x="6" y="8" textAnchor="middle" fontSize="3" fill={color}>DOC</text>
    <text x="18" y="8" textAnchor="middle" fontSize="3" fill={color}>PDF</text>
    <rect x="8" y="14" width="8" height="6" rx="1" stroke={color} strokeWidth="2" fill="none"/>
    <text x="12" y="18" textAnchor="middle" fontSize="3" fill={color}>XLS</text>
  </svg>
);

export const MetadataIcon = ({ size = 24, color = '#ff6b9d' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" stroke={color} strokeWidth="2" fill="none"/>
    <path d="M7 7h4" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M7 11h6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M7 15h3" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <circle cx="17" cy="7" r="2" fill={color}/>
    <path d="M15 13l2 2 4-4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const QRCodeIcon = ({ size = 24, color = '#ff8fa3' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="3" y="3" width="7" height="7" rx="1" stroke={color} strokeWidth="2" fill="none"/>
    <rect x="14" y="3" width="7" height="7" rx="1" stroke={color} strokeWidth="2" fill="none"/>
    <rect x="3" y="14" width="7" height="7" rx="1" stroke={color} strokeWidth="2" fill="none"/>
    <rect x="5" y="5" width="3" height="3" fill={color}/>
    <rect x="16" y="5" width="3" height="3" fill={color}/>
    <rect x="5" y="16" width="3" height="3" fill={color}/>
    <rect x="14" y="14" width="3" height="3" fill={color}/>
    <rect x="18" y="14" width="3" height="3" fill={color}/>
    <rect x="14" y="18" width="7" height="3" fill={color}/>
  </svg>
);

export const AudioToolsIcon = ({ size = 24, color = '#ff6b9d' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" stroke={color} strokeWidth="2" fill="none"/>
    <path d="M19 10v1a7 7 0 0 1-14 0v-1" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 18v4" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M8 22h8" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M16 8l2-2" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M8 8L6 6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const SignatureIcon = ({ size = 24, color = '#ff8fa3' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M3 17h18" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M5 12c2-3 4-1 6 1s4 4 6 1" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none"/>
    <circle cx="19" cy="9" r="2" stroke={color} strokeWidth="2" fill="none"/>
  </svg>
);

// New 6 Feature Icons



export const FolderIcon = ({ size = 24, color = '#FF6B6B' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" stroke={color} strokeWidth="2" fill="none"/>
  </svg>
);

export const ChartIcon = ({ size = 24, color = '#FF6B6B' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M3 3v18h18" stroke={color} strokeWidth="2"/>
    <path d="M18.7 8l-4.2 4.2-3-3-3.5 3.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15 8h3.7v3.7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const FileDocumentIcon = ({ size = 24, color = '#FF6B6B' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke={color} strokeWidth="2" fill="none"/>
    <polyline points="14,2 14,8 20,8" stroke={color} strokeWidth="2"/>
    <line x1="16" y1="13" x2="8" y2="13" stroke={color} strokeWidth="2"/>
    <line x1="16" y1="17" x2="8" y2="17" stroke={color} strokeWidth="2"/>
    <polyline points="10,9 9,9 8,9" stroke={color} strokeWidth="2"/>
  </svg>
);

// Additional icons to replace emojis
export const TargetIcon = ({ size = 24, color = '#FF6B6B' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none"/>
    <circle cx="12" cy="12" r="6" stroke={color} strokeWidth="2" fill="none"/>
    <circle cx="12" cy="12" r="2" stroke={color} strokeWidth="2" fill="none"/>
  </svg>
);

export const SparklesIcon = ({ size = 24, color = '#FF6B6B' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" fill={color}/>
    <path d="M19 3l.5 1.5L21 5l-1.5.5L19 7l-.5-1.5L17 5l1.5-.5L19 3z" fill={color}/>
    <path d="M19 17l.5 1.5L21 19l-1.5.5L19 21l-.5-1.5L17 19l1.5-.5L19 17z" fill={color}/>
  </svg>
);

export const LightningIcon = ({ size = 24, color = '#FF6B6B' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10" fill={color}/>
  </svg>
);

export const WindIcon = ({ size = 24, color = '#FF6B6B' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M9 6a3 3 0 1 1 6 0c0 1-3 1-3 1s-3 0-3-1z" stroke={color} strokeWidth="2" fill="none"/>
    <path d="M3 12h16" stroke={color} strokeWidth="2"/>
    <path d="M12 18a3 3 0 1 0-6 0c0-1 3-1 3-1s3 0 3 1z" stroke={color} strokeWidth="2" fill="none"/>
  </svg>
);

export const NumberIcon = ({ size = 24, color = '#FF6B6B' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M3 6l3 1 4-1-4 6 4 1-3 4-4-1" stroke={color} strokeWidth="2" fill="none"/>
    <path d="M19 8v8" stroke={color} strokeWidth="2"/>
    <path d="M21 6l-2 2 2 2" stroke={color} strokeWidth="2"/>
    <path d="M15 14l2 2-2 2" stroke={color} strokeWidth="2"/>
  </svg>
);

export const CheckCircleIcon = ({ size = 24, color = '#FF6B6B' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none"/>
    <polyline points="9,12 12,15 16,10" stroke={color} strokeWidth="2"/>
  </svg>
);

export const DeviceIcon = ({ size = 24, color = '#FF6B6B' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke={color} strokeWidth="2" fill="none"/>
    <line x1="8" y1="21" x2="16" y2="21" stroke={color} strokeWidth="2"/>
    <line x1="12" y1="17" x2="12" y2="21" stroke={color} strokeWidth="2"/>
  </svg>
);

export const StackIcon = ({ size = 24, color = '#FF6B6B' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z" stroke={color} strokeWidth="2" fill="none"/>
    <path d="M8 3l4 4 4-4" stroke={color} strokeWidth="2"/>
    <line x1="9" y1="12" x2="15" y2="12" stroke={color} strokeWidth="2"/>
    <line x1="9" y1="16" x2="15" y2="16" stroke={color} strokeWidth="2"/>
  </svg>
);

export const EditIcon = ({ size = 24, color = '#FF6B6B' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" stroke={color} strokeWidth="2" fill="none"/>
  </svg>
);
