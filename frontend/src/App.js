import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'react-toastify/dist/ReactToastify.css';
import './styles/responsive.css';

// Import komponen
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Import pages - Dashboard adalah landing page utama
import Dashboard from './pages/Dashboard';
import ImageCompress from './pages/ImageCompress';
import PDFCompress from './pages/PDFCompress';
import YouTubeConverter from './pages/YouTubeConverter';
import MergePDF from './pages/MergePDF';
import PDFToImage from './pages/PDFToImage';
import SplitPDF from './pages/SplitPDF';
import ImageToPDF from './pages/ImageToPDF';

function App() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      offset: 100,
      easing: 'ease-out',
      once: true
    });
  }, []);

  return (
    <Router>
      <div className="App">
        <Navbar />
        <main style={{ minHeight: 'calc(100vh - 140px)' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/image-compress" element={<ImageCompress />} />
            <Route path="/pdf-compress" element={<PDFCompress />} />
            <Route path="/youtube-converter" element={<YouTubeConverter />} />
            <Route path="/merge-pdf" element={<MergePDF />} />
            <Route path="/pdf-to-image" element={<PDFToImage />} />
            <Route path="/split-pdf" element={<SplitPDF />} />
            <Route path="/image-to-pdf" element={<ImageToPDF />} />
            <Route path="*" element={<div style={{padding: '2rem', textAlign: 'center'}}>Page not found</div>} />
          </Routes>
        </main>
        <Footer />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </Router>
  );
}

export default App;
