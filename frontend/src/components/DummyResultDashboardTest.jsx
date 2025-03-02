import React from 'react';
import ResultDashboard from './ResultDashboard';

const dummyResultsSingle = [
  {
    username: "johnDoe",
    profilePhoto: "https://via.placeholder.com/150",
    similarity_score: 0.87,
    hire_decision: "Hire",
    details: "Expert in React and Node.js with a strong project portfolio."
  }
];

const dummyResultsMultiple = [
  {
    username: "johnDoe",
    profilePhoto: "https://via.placeholder.com/50",
    similarity_score: 0.87,
    hire_decision: "Hire"
  },
  {
    username: "janeSmith",
    profilePhoto: "https://via.placeholder.com/50",
    similarity_score: 0.65,
    hire_decision: "No Hire"
  },
  {
    username: "bobBrown",
    profilePhoto: "https://via.placeholder.com/50",
    similarity_score: 0.95,
    hire_decision: "Hire"
  }
];

function DummyResultDashboardTest() {
  return (
    <div style={{ padding: "20px", backgroundColor: "#000" }}>
      <h1 style={{ color: "#fff", textAlign: "center" }}>Single Candidate View</h1>
      <ResultDashboard results={dummyResultsSingle} />
      <h1 style={{ color: "#fff", textAlign: "center", marginTop: "40px" }}>
        Multiple Candidates View
      </h1>
      <ResultDashboard results={dummyResultsMultiple} />
    </div>
  );
}

export default DummyResultDashboardTest;