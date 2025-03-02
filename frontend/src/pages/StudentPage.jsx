import React from 'react';
import StudentProfileForm from '../components/StudentProfileForm';
import '../styles/StudentPage.css';

function StudentPage() {
  return (
    <div className="student-page-container">
      <h2 className="student-page-title">Analyze Your GitHub Profile</h2>
      <StudentProfileForm />
    </div>
  );
}

export default StudentPage;