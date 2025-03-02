import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IoArrowBack, IoCheckmarkCircle, IoCloseCircle } from 'react-icons/io5';
import { FaMapMarkerAlt, FaBuilding, FaCode, FaUserFriends, FaStar, FaUsers, FaCalendarAlt } from 'react-icons/fa';
import { TbGitFork } from 'react-icons/tb';
import '../styles/ResultPage.css';

function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // The analysis result passed from the recruiter page
  const analysis = location.state?.analysis;

  // Local state for candidate details from /github/user_full endpoint
  const [fullCandidateData, setFullCandidateData] = useState(null);
  const [loadingFullData, setLoadingFullData] = useState(false);
  const [error, setError] = useState(null);

  // Prompt error if no analysis data was passed
  useEffect(() => {
    if (!analysis) {
      setError('No analysis data found. Please analyze a candidate first.');
    }
  }, [analysis]);

  // Fetch full candidate data if analysis returns a single candidate
  useEffect(() => {
    const fetchFullData = async () => {
      if (analysis && !Array.isArray(analysis)) {
        const username =
          analysis.github_username ||
          (analysis.user_profile && analysis.user_profile.login);
        if (username) {
          setLoadingFullData(true);
          try {
            const res = await fetch(
              `http://0.0.0.0:8000/github/user_full?username=${encodeURIComponent(username)}`
            );
            if (!res.ok) {
              throw new Error('Failed to fetch full candidate data.');
            }
            const data = await res.json();
            // Merge the analysis decision and similarity score with the fetched data
            setFullCandidateData({
              ...data,
              decision: analysis.decision,
              similarity_score: analysis.similarity_score,
            });
          } catch (err) {
            console.error(err);
            setError(err.message);
          } finally {
            setLoadingFullData(false);
          }
        }
      }
    };
    fetchFullData();
  }, [analysis]);

  // Handler for "Back" button
  const handleBack = () => {
    navigate(-1);
  };

  // Helper: Render stat only if value exists and is not 'N/A'
  const renderStat = (icon, label, value) => {
    if (!value || value === 'N/A') return null;
    return (
      <p className="stat-item">
        {icon} <span>{label}: {value}</span>
      </p>
    );
  };

  if (error) {
    return (
      <div className="results-container">
        <button onClick={handleBack} className="back-button">
          <IoArrowBack size={20} /> Back
        </button>
        <h2 className="error-heading">Error</h2>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  if (loadingFullData) {
    return (
      <div className="results-container">
        <button onClick={handleBack} className="back-button">
          <IoArrowBack size={20} /> Back
        </button>
        <h2 className="loading-text">Loading Candidate Details...</h2>
      </div>
    );
  }

  if (fullCandidateData && fullCandidateData.user_profile) {
    const { user_profile, total_repos_found, top_3_repos, decision, similarity_score } = fullCandidateData;
    const isHired = (decision || '').toLowerCase() === 'hire';

    // Status icon for profile picture (small tick or cross)
    const statusIcon = isHired ? (
      <IoCheckmarkCircle className="status-icon-inner" color="#28a745" size={24} />
    ) : (
      <IoCloseCircle className="status-icon-inner" color="#dc3545" size={24} />
    );

    return (
      <div className="results-container">
        {/* Back button aligned to left */}
        <button onClick={handleBack} className="back-button">
          <IoArrowBack size={20} /> Back
        </button>

        <div className="candidate-details-card">
          {/* Profile Section */}
          <div className="profile-section">
            <div className="profile-pic-wrapper">
              <img
                src={user_profile.avatar_url || 'https://picsum.photos/150'}
                alt={user_profile.login}
                className="candidate-photo"
              />
              <div className="status-icon">{statusIcon}</div>
            </div>
            <div className="profile-info">
              <h2 className="profile-login">{user_profile.login || 'Unknown'}</h2>
              {user_profile.name && <p className="profile-name">{user_profile.name}</p>}
              {user_profile.bio && <p className="profile-bio">{user_profile.bio}</p>}
            </div>
          </div>

          {/* Stats Section */}
          <div className="stats-section">
            {renderStat(<FaMapMarkerAlt />, 'Location', user_profile.location)}
            {renderStat(<FaBuilding />, 'Company', user_profile.company)}
            {renderStat(<FaCode />, 'Public Repos', user_profile.public_repos)}
            {renderStat(<FaUserFriends />, 'Followers', user_profile.followers)}
            {renderStat(<FaUsers />, 'Following', user_profile.following)}
            {total_repos_found && renderStat(<FaCode />, 'Total Repos Found', total_repos_found)}
            {renderStat(<FaCalendarAlt />, 'Joined', new Date(user_profile.created_at).toLocaleDateString())}
          </div>

          {/* Analysis Section */}
          {isHired ? (
            <div className="analysis-container hire">
              <div className="analysis-icon">
                <IoCheckmarkCircle color="#28a745" size={32} />
              </div>
              <div className="analysis-title">Hire Worthy & Can Be Hired</div>
              <div className="analysis-message">
                This candidate matches your criteria perfectly!
              </div>
              <div className="analysis-score">
                Similarity Score: {(similarity_score ? (similarity_score * 100).toFixed(2) : '0.00')}/100
              </div>
            </div>
          ) : (
            <div className="analysis-container no-hire">
              <div className="analysis-icon">
                <IoCloseCircle color="#dc3545" size={32} />
              </div>
              <div className="analysis-title">Not a Good Fit</div>
              <div className="analysis-message">
                This candidate does not fully meet your criteria.
              </div>
              <div className="analysis-score">
                Similarity Score: {(similarity_score ? (similarity_score * 100).toFixed(2) : '0.00')}/100
              </div>
            </div>
          )}

          {/* Repositories Section */}
          <div className="repos-section">
            <h3>Top 3 Repositories</h3>
            {top_3_repos && top_3_repos.length > 0 ? (
              <div className="repo-list-horizontal">
                {top_3_repos.map((repo, idx) => (
                  <div key={idx} className="repo-item">
                    {/* If description is available */}
                    {repo.description && (
                      <p className="repo-description">{repo.description}</p>
                    )}
                    <h4 className="repo-title">{repo.repo_name}</h4>
                    <div className="repo-stats-row">
                      <div className="repo-stat">
                        <FaStar color="#ffc107" /> {repo.stargazers_count || 0}
                      </div>
                      <div className="repo-stat">
                        <TbGitFork color="#6c757d" /> {repo.forks_count || 0}
                      </div>
                      <div className="repo-stat">
                        <FaCode color="#28a745" /> {repo.commits ? repo.commits.length : 0}
                      </div>
                      {repo.language && (
                        <div className="repo-stat">
                          <span>{repo.language}</span>
                        </div>
                      )}
                    </div>
                    <a
                      href={repo.repo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="repo-link"
                    >
                      View Repository
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p>No top repositories data available.</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="results-container">
      <button onClick={handleBack} className="back-button">
        <IoArrowBack size={20} /> Back
      </button>
      <h2>No candidate details to display.</h2>
    </div>
  );
}

export default ResultsPage;