import React, { useState } from 'react';
import { analyzeIdealCandidate } from '../services/api';

function CandidateForm({ onResults }) {
  const [languages, setLanguages] = useState('');
  const [minCommits, setMinCommits] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const inputData = {
      languages: languages.split(',').map(l => l.trim()),
      min_commits: parseInt(minCommits) || 0
    };
    const response = await analyzeIdealCandidate(inputData);
    onResults(response);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Preferred Languages (comma-separated):
        <input
          type="text"
          value={languages}
          onChange={(e) => setLanguages(e.target.value)}
        />
      </label>
      <br />
      <label>
        Minimum Commits:
        <input
          type="number"
          value={minCommits}
          onChange={(e) => setMinCommits(e.target.value)}
        />
      </label>
      <br />
      <button type="submit">Analyze</button>
    </form>
  );
}

export default CandidateForm;