import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Simple test version to identify the problematic component
function AppTest() {
  return (
    <Router>
      <div className="App">
        <h1>Test App Working</h1>
        <p>If you see this, the basic React structure is working</p>
      </div>
    </Router>
  );
}

export default AppTest;
