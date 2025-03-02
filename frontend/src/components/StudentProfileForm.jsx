import React, { useState } from 'react';
import '../styles/StudentProfileForm.css';

function StudentProfileForm() {
  const [username, setUsername] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleAnalyze = (e) => {
    e.preventDefault();
    // In real usage, you'd call your backend API here.
    setAnalysisResult({
      username,
      overview: 'Your GitHub profile shows consistent contributions and engagement!',
      recommendedImprovements: [
        'Add more tests',
        'Write descriptive commit messages',
        'Improve project documentation',
      ],
    });
  };

  return (
    <div className="student-form-container">
      <form onSubmit={handleAnalyze} className="student-form">
        <label htmlFor="github-username" className="form-label">
          GitHub Username:
        </label>
        <input
          id="github-username"
          type="text"
          placeholder="e.g. octocat"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="form-input"
          required
        />
        <button type="submit" className="analyze-btn">
          Analyze
        </button>
      </form>

      {analysisResult && (
        <div className="analysis-result">
          <h2 className="analysis-title">
            Analysis for {analysisResult.username}
          </h2>
          <p className="analysis-overview">{analysisResult.overview}</p>
          <strong className="analysis-recommendation-title">
            Recommendations:
          </strong>
          <ul className="recommendations-list">
            {analysisResult.recommendedImprovements.map((rec, idx) => (
              <li key={idx} className="recommendation-item">
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default StudentProfileForm;