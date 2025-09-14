import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300000, // 5 minutes for large file processing
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any auth headers if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.error || 'An error occurred';
      return Promise.reject(new Error(message));
    } else if (error.request) {
      // Request was made but no response received
      return Promise.reject(new Error('Network error. Please check your connection.'));
    } else {
      // Something happened in setting up the request
      return Promise.reject(error);
    }
  }
);

// API functions
export const compressImage = async (file, quality = 75, onProgress) => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('quality', quality);

  return api.post('/compress/image/', formData, {
    responseType: 'blob',
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      }
    },
  });
};

export const compressPDF = async (file, compressionLevel = 'medium', onProgress) => {
  const formData = new FormData();
  formData.append('pdf', file);
  formData.append('compression_level', compressionLevel);

  return api.post('/compress/pdf/', formData, {
    responseType: 'blob',
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      }
    },
  });
};

export const getVideoInfo = async (url) => {
  return api.post('/youtube/info/', { url });
};

export const convertYouTube = async (url, format, quality = '720p', onProgress) => {
  return api.post('/youtube/convert/', 
    { url, format, quality },
    {
      responseType: 'blob',
      headers: {
        'Content-Type': 'application/json',
      },
      onDownloadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    }
  );
};

export const getCompressionHistory = async () => {
  return api.get('/compress/history/');
};

export const getConversionHistory = async () => {
  return api.get('/youtube/history/');
};

// PDF Tools API functions
export const mergePDFs = async (files, onProgress) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('pdf_files', file);  // Fixed parameter name
  });

  return api.post('/pdf-tools/merge/', formData, {
    responseType: 'blob',
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      }
    },
  });
};

export const splitPDF = async (file, pagesPerSplit = 1, onProgress) => {
  const formData = new FormData();
  formData.append('pdf_file', file);  // Fixed parameter name
  formData.append('pages_per_split', pagesPerSplit.toString());

  return api.post('/pdf-tools/split/', formData, {
    responseType: 'blob',
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      }
    },
  });
};

export const pdfToImages = async (file, format = 'png', quality = 'high', onProgress) => {
  const formData = new FormData();
  formData.append('pdf_file', file);  // Changed to match backend parameter name
  formData.append('output_format', format.toLowerCase());
  formData.append('dpi', quality === 'high' ? '300' : quality === 'medium' ? '150' : '75');

  return api.post('/pdf-tools/pdf-to-image/', formData, {
    responseType: 'blob',
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      }
    },
  });
};

// Image Tools API functions
export const imagesToPDF = async (images, options = {}, onProgress) => {
  const formData = new FormData();
  images.forEach((image) => {
    formData.append('images', image);
  });
  
  formData.append('page_size', options.pageSize || 'A4');
  formData.append('orientation', options.orientation || 'portrait');
  formData.append('quality', options.quality || 'high');

  return api.post('/image-tools/to-pdf/', formData, {
    responseType: 'blob',
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      }
    },
  });
};

// Utility functions
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.style.display = 'none';
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(link);
};

export default api;
