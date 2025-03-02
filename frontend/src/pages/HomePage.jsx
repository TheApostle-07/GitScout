import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HomePage.css';

function RateLimitDisplay() {
  const [rateData, setRateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    fetch('http://0.0.0.0:8000/github/rate_limit')
      .then(response => response.json())
      .then(data => {
        // Extract the relevant info from rate_headers
        setRateData(data.rate_headers);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching rate limit:", err);
        setError("Failed to load rate limit");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // If we already have rate_reset, set up a countdown timer
    if (rateData && rateData.rate_reset) {
      const resetTime = Number(rateData.rate_reset) * 1000;

      const updateTimer = () => {
        const now = Date.now();
        const distance = resetTime - now;

        if (distance <= 0) {
          setTimeLeft('Rate limit has reset');
          return;
        }
        
        const hours = Math.floor(distance / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Format as Hh Mm Ss or hide hours if 0, etc.
        const hoursDisplay = hours > 0 ? `${hours}h ` : '';
        const minutesDisplay = `${minutes}m `;
        const secondsDisplay = `${seconds}s`;

        setTimeLeft(`${hoursDisplay}${minutesDisplay}${secondsDisplay}`);
      };

      // Initial call
      updateTimer();

      // Update every second
      const timerId = setInterval(updateTimer, 1000);

      return () => clearInterval(timerId);
    }
  }, [rateData]);

  if (loading) {
    return <div className="rate-limit-card">Loading rate limit...</div>;
  }

  if (error) {
    return <div className="rate-limit-card">Error: {error}</div>;
  }

  // If rateData is fetched successfully
  const { rate_remaining } = rateData;

  return (
    <div className="rate-limit-card">
      <div className="rate-limit-remaining">
        {rate_remaining}
      </div>
      <div className="rate-limit-label">
        Analyzer Tokens Remaining
      </div>
      <div className="rate-limit-timer">
        {timeLeft !== 'Rate limit has reset'
          ? `Resets in ${timeLeft}`
          : timeLeft}
      </div>
    </div>
  );
}

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="homepage-container">
      <h1 className="homepage-title">GitScout</h1>
      <p className="homepage-description">
        Analyze GitHub profiles with advanced AI-based insights. Whether you're a recruiter 
        or a student looking to improve your GitHub presence, GitScout offers intuitive tools 
        for data-driven decision making.
      </p>
      
      {/* Rate Limit display centered on the page */}
      <RateLimitDisplay />

      <div className="homepage-buttons">
        <button 
          className="homepage-btn"
          onClick={() => navigate('/recruiter')}
        >
          Recruiter
        </button>
        <button 
          className="homepage-btn"
          onClick={() => navigate('/student')}
        >
          Students / Employees
        </button>
      </div>
    </div>
  );
}

export default HomePage;