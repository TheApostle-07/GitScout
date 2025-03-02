// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Results from './components/ResultDashboard';
// Import your page components
import HomePage from './pages/HomePage';
import RecruiterPage from './pages/RecruiterPage';
import StudentPage from './pages/StudentPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

function App() {
  // Outer container => black background, full-height, flex layout
  const containerStyle = {
    backgroundColor: '#fff',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  };

  // A wrapper that flex-grows and positions content near the top
  const contentWrapperStyle = {
    flex: '1 0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '4rem 1rem 2rem',
  };

  return (
    <Router>
      <div style={containerStyle}>
        <Header />
        <div style={contentWrapperStyle}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/recruiter" element={<RecruiterPage />} />
            <Route path="/student" element={<StudentPage />} />
            <Route path="/results" element={<Results />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;