import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8000';

export async function analyzeIdealCandidate(data) {
  const resp = await axios.post(`${API_BASE}/candidate/ideal-candidate`, data);
  return resp.data;
}

// Additional calls if needed