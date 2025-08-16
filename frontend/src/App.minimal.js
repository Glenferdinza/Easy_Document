import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Simple test component
const TestHome = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1>App Berjalan dengan Baik! ✅</h1>
    <p>Jika kamu melihat ini, artinya React app sudah tidak error lagi.</p>
  </div>
);

const App = () => {
  return (
    <Router>
      <div className="App">
        <main style={{ minHeight: '100vh' }}>
          <Routes>
            <Route path="/" element={<TestHome />} />
            <Route path="*" element={<div>Page not found - tapi app sudah jalan!</div>} />
          </Routes>
        </main>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={true}
          theme="light"
        />
      </div>
    </Router>
  );
};

export default App;
