import React, { useState, useEffect } from 'react';
import {
  FaBriefcase,
  FaCode,
  FaLaptopCode,
  FaClipboardList,
  FaEnvelope,
  FaFileUpload,
  FaPlus
} from 'react-icons/fa';
import { IoClose, IoCheckmarkCircle, IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import '../styles/RecruiterPage.css';

// Validate email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate GitHub username
function isValidGithubUsername(username) {
  const githubRegex = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
  return githubRegex.test(username);
}

// Accept either a valid email or GitHub username
function isValidGithubOrEmail(value) {
  return isValidEmail(value) || isValidGithubUsername(value);
}

function RecruiterPage() {
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);
  const [creationMode, setCreationMode] = useState('manual');
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [idealGithub, setIdealGithub] = useState('');
  const navigate = useNavigate();

  const [commitTags, setCommitTags] = useState([]);
  const [tagInput, setTagInput] = useState('');

  const [manualMetrics, setManualMetrics] = useState({
    commitFrequency: '',
    codeReadability: '',
    matchToJobRequirements: '',
  });
  
  const [aiMetrics, setAiMetrics] = useState({
    ideal_commit_tags: []
  });

  const [selectedJob, setSelectedJob] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState(null);
  const [isCreatingJob, setIsCreatingJob] = useState(false);

  // AI states
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiError, setAiError] = useState('');

  // Candidate analysis states
  const [inputValue, setInputValue] = useState('');
  const [fileData, setFileData] = useState(null);
  const [fileRows, setFileRows] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysisResult, setAnalysisResult] = useState('');
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  // Additional states for file processing progress
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState("");
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  // Search, sort & pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoadingJobs(true);
      const res = await fetch('http://0.0.0.0:8000/job/');
      const data = await res.json();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setFeedbackMsg({ type: 'error', text: 'Error fetching jobs.' });
    } finally {
      setLoadingJobs(false);
    }
  };

  useEffect(() => {
    if (feedbackMsg) {
      const timer = setTimeout(() => setFeedbackMsg(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [feedbackMsg]);

  useEffect(() => {
    if (aiError && jobTitle.trim().length >= 3 && jobDescription.trim().length >= 10) {
      setAiError('');
    }
  }, [aiError, jobTitle, jobDescription]);

  const validateJobForm = () => {
    const errors = [];
    if (!jobTitle || jobTitle.trim().length < 3) {
      errors.push('Job Title must be at least 3 characters long.');
    }
    if (!jobDescription || jobDescription.trim().length < 10) {
      errors.push('Job Description must be at least 10 characters long.');
    }
    if (!idealGithub || !isValidGithubOrEmail(idealGithub.trim())) {
      errors.push('Please provide a valid GitHub username or email.');
    }
    if (creationMode === 'manual') {
      if (commitTags.length === 0) {
        errors.push('Please add at least one commit tag in manual mode.');
      }
      if (!manualMetrics.commitFrequency.trim()) {
        errors.push('Commit Frequency is required.');
      }
      if (!manualMetrics.codeReadability.trim()) {
        errors.push('Code Readability is required.');
      }
      if (!manualMetrics.matchToJobRequirements.trim()) {
        errors.push('Match to Job Requirements is required.');
      }
    } else {
      if (commitTags.length === 0) {
        errors.push('Please generate or add at least one commit tag in AI mode.');
      }
    }
    return errors;
  };

  const handleAiGeneration = async () => {
    setIsAiGenerating(true);
    try {
      const response = await fetch("http://0.0.0.0:8000/job/generate-commit-messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: jobTitle,
          description: jobDescription,
        }),
      });
      const data = await response.json();
      if (data.commit_messages) {
        const cleanMessages = data.commit_messages.map(msg =>
          msg.replace(/^"+|"+$/g, "")
        );
        setAiMetrics({ ideal_commit_tags: cleanMessages });
        setCommitTags(cleanMessages);
      }
    } catch (error) {
      console.error("Error generating commit messages:", error);
      setFeedbackMsg({ type: 'error', text: 'Failed to generate AI commit tags.' });
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleAiGenerateClick = () => {
    if (jobTitle.trim().length < 3 || jobDescription.trim().length < 10) {
      setAiError(
        'Please enter a valid Job Title (≥3 chars) and Description (≥10 chars) before generating AI tags.'
      );
      return;
    }
    setAiError('');
    handleAiGeneration();
  };

  const handleJobCreate = async (e) => {
    e.preventDefault();
    const errors = validateJobForm();
    if (errors.length > 0) {
      const errorText = 'Please fix the following errors:\n- ' + errors.join('\n- ');
      setFeedbackMsg({ type: 'error', text: errorText });
      return;
    }
    setIsCreatingJob(true);
    try {
      const finalMetrics =
        creationMode === 'manual'
          ? { ...manualMetrics, ideal_commit_tags: commitTags }
          : { ideal_commit_tags: commitTags };

      const newJob = {
        title: jobTitle.trim(),
        description: jobDescription.trim(),
        idealGithub: idealGithub.trim(),
        idealMetrics: finalMetrics
      };

      const res = await fetch('http://0.0.0.0:8000/job/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newJob)
      });
      await res.json();

      setFeedbackMsg({ type: 'success', text: 'Job created successfully!' });
      fetchJobs();

      setJobTitle('');
      setJobDescription('');
      setIdealGithub('');
      setCommitTags([]);
      setTagInput('');
      setManualMetrics({
        commitFrequency: '',
        codeReadability: '',
        matchToJobRequirements: '',
      });
      setAiMetrics({ ideal_commit_tags: [] });
      setCreationMode('manual');
      setShowJobModal(false);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error creating job:', error);
      setFeedbackMsg({ type: 'error', text: 'Error creating job.' });
    } finally {
      setIsCreatingJob(false);
    }
  };

  const handleTagInputKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && commitTags.length < 10) {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !commitTags.includes(newTag)) {
        setCommitTags([...commitTags, newTag]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setCommitTags(commitTags.filter(tag => tag !== tagToRemove));
  };

  const parseCSV = (csvString) => {
    const lines = csvString.split('\n').filter(Boolean);
    return lines.map((line) => line.split(','));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileData(file);
      const fileExtension = file.name.split('.').pop().toLowerCase();
      if (fileExtension === 'csv') {
        const reader = new FileReader();
        reader.onload = (event) => {
          const rows = parseCSV(event.target.result);
          setFileRows(rows);
          setIsFileModalOpen(true);
        };
        reader.readAsText(file);
      } else if (fileExtension === 'xls' || fileExtension === 'xlsx') {
        const reader = new FileReader();
        reader.onload = (event) => {
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          setFileRows(jsonData);
          setIsFileModalOpen(true);
        };
        reader.readAsArrayBuffer(file);
      } else {
        setFeedbackMsg({ type: 'error', text: 'Unsupported file type. Please upload a CSV or Excel file.' });
      }
    }
  };

  const handleFileConfirm = async () => {
    if (!fileRows || fileRows.length < 2) {
      setFeedbackMsg({ type: 'error', text: 'The file does not contain sufficient data.' });
      return;
    }
    // Normalize headers: convert to lower-case, replace spaces with underscores,
    // and if a header contains "github" and ("username" or "id"), convert to "github_username"
    const headers = fileRows[0].map(header => {
      let normalized = header.toLowerCase().replace(/\s+/g, '_');
      if (normalized.includes("github") && (normalized.includes("username") || normalized.includes("id"))) {
        normalized = "github_username";
      }
      return normalized;
    });
    
    const candidates = fileRows.slice(1).map(row => {
      const candidate = {};
      headers.forEach((header, index) => {
        candidate[header] = row[index];
      });
      return candidate;
    });
    console.log(candidates);
  
    // Start processing UI
    setIsProcessingFile(true);
    setProgress(0);
    setProgressMessage("Initializing batch analysis...");
  
    // Start the fetch call
    const fetchPromise = fetch(`http://0.0.0.0:8000/job/${selectedJob._id}/match-multiple-candidates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ candidates })
    }).then(res => res.json());
  
    // Start periodic progress updates
    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      if (currentProgress < 90) { // Don't reach 100% until done
        currentProgress += 10;
        setProgress(currentProgress);
        // Update progress message based on progress value
        if (currentProgress === 10) {
          setProgressMessage("Fetching GitHub repositories...");
        } else if (currentProgress === 20) {
          setProgressMessage("Checking commit histories...");
        } else if (currentProgress === 30) {
          setProgressMessage("Creating candidate vectors...");
        } else if (currentProgress === 40) {
          setProgressMessage("Matching with ideal candidate...");
        } else {
          setProgressMessage(`Processing... ${currentProgress}%`);
        }
      }
    }, 500);
  
    try {
      const data = await fetchPromise;
      clearInterval(progressInterval);
      setProgress(100);
      setProgressMessage("Finalizing results...");
      setFeedbackMsg({ type: 'success', text: 'Batch analysis completed successfully.' });
      console.log('Batch analysis results:', data);
      setIsFileModalOpen(false);
    } catch (error) {
      clearInterval(progressInterval);
      console.error('Error in batch analysis:', error);
      setFeedbackMsg({ type: 'error', text: 'Batch analysis failed. Please try again.' });
    } finally {
      setIsProcessingFile(false);
      // Optionally, after a short delay, reset the progress UI.
      setTimeout(() => {
        setProgress(0);
        setProgressMessage("");
      }, 500);
    }
  };
  const handleAnalyze = async () => {
    if (!inputValue.trim() || !selectedJob) return;
    setIsAnalyzing(true);
    setAnalysisComplete(false);
    setAnalysisResult('');
  
    try {
      const apiUrl = `http://0.0.0.0:8000/job/${selectedJob._id}/match-single-candidate?github_username=${encodeURIComponent(inputValue.trim())}`;
      const response = await fetch(apiUrl);
  
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
  
      setIsAnalyzing(false);
      setAnalysisComplete(true);
      const resultText = `Decision: ${data.decision}, Similarity Score: ${data.similarity_score.toFixed(4)}`;
      setAnalysisResult(resultText);
      setFeedbackMsg({ type: 'info', text: 'Analysis Complete! Displaying results...' });
  
      navigate('/results', { state: { analysis: data } });
    } catch (error) {
      console.error('Error during analysis:', error);
      setIsAnalyzing(false);
      setFeedbackMsg({ type: 'error', text: 'Error analyzing candidate.' });
    }
  };

  const updateNormalMetric = (field, value) => {
    setManualMetrics(prev => ({ ...prev, [field]: value }));
  };

  const filteredJobs = jobs
    .filter(job =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === 'asc'
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title)
    );
  const totalPages = Math.ceil(filteredJobs.length / pageSize);
  const displayedJobs = filteredJobs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const jobIcons = [<FaBriefcase />, <FaCode />, <FaLaptopCode />, <FaClipboardList />];

  let githubColumnIndex = null;
  let validGithubCount = 0;
  if (fileRows && fileRows.length > 0) {
    const headerRow = fileRows[0];
    headerRow.forEach((header, index) => {
      const lowerHeader = header.toLowerCase();
      if (lowerHeader.includes("github") && (lowerHeader.includes("user") || lowerHeader.includes("id"))) {
        githubColumnIndex = index;
      }
    });
    if (githubColumnIndex !== null) {
      for (let i = 1; i < fileRows.length; i++) {
        const cell = fileRows[i][githubColumnIndex];
        if (cell && isValidGithubUsername(cell.trim())) {
          validGithubCount++;
        }
      }
    }
  }
  const validGithub = githubColumnIndex !== null && validGithubCount >= 2;

  return (
    <div className="recruiter-container">
      <h2 className="recruiter-title">Recruiter Dashboard</h2>
      
      {feedbackMsg && (
        <div className={`feedback-message ${feedbackMsg.type}`}>
          {feedbackMsg.text}
        </div>
      )}

      {loadingJobs ? (
        <div className="loader-wrapper">
          <span className="loader"></span>
          <p>Loading jobs...</p>
        </div>
      ) : (
        !selectedJob && (
          <>
            <div className="job-controls">
              <input
                type="text"
                className="filter-input search-input"
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <select
                className="sort-select"
                value={sortOrder}
                onChange={e => setSortOrder(e.target.value)}
              >
                <option value="asc">Sort: A - Z</option>
                <option value="desc">Sort: Z - A</option>
              </select>
              <button
                className="create-job-btn-fixed"
                onClick={() => setShowJobModal(true)}
                title="New Job/Position"
              >
                <FaPlus size={20} /> Create New Job
              </button>
            </div>

            <section className="job-listing">
              {displayedJobs.length > 0 ? (
                <div className="job-cards">
                  {displayedJobs.map((job, index) => (
                    <div
                      key={job._id || job.id}
                      className="job-card"
                      onClick={() => {
                        setSelectedJob(job);
                        setAnalysisComplete(false);
                        setAnalysisResult('');
                      }}
                    >
                      <div className="job-icon">
                        {jobIcons[index % jobIcons.length]}
                      </div>
                      <h4>{job.title}</h4>
                      <p>{job.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-jobs">No jobs found.</p>
              )}
              {totalPages > 1 && (
                <div className="pagination">
                  <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
                    Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => goToPage(index + 1)}
                      className={currentPage === index + 1 ? 'active' : ''}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
                    Next
                  </button>
                </div>
              )}
            </section>
          </>
        )
      )}

      {/* CREATE JOB MODAL */}
      {showJobModal && (
        <div className="modal-overlay">
          <div className="modal-content job-modal large-modal">
            <div className="modal-header">
              <h3>Create New Job/Position</h3>
              <IoClose className="close-icon" onClick={() => setShowJobModal(false)} />
            </div>
            <div className="modal-body">
              <div className="creation-mode-toggle">
                <label>
                  <input
                    type="radio"
                    name="creationMode"
                    value="manual"
                    checked={creationMode === 'manual'}
                    onChange={(e) => setCreationMode(e.target.value)}
                  />
                  Manual
                </label>
                <label>
                  <input
                    type="radio"
                    name="creationMode"
                    value="ai"
                    checked={creationMode === 'ai'}
                    onChange={(e) => {
                      setCreationMode(e.target.value);
                      setCommitTags([]);
                    }}
                  />
                  AI
                </label>
              </div>

              <form onSubmit={handleJobCreate} className="job-form">
                <input
                  type="text"
                  placeholder="Job Title"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  required
                />
                <textarea
                  placeholder="Job Description"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Ideal Candidate's GitHub (username or email)"
                  value={idealGithub}
                  onChange={(e) => setIdealGithub(e.target.value)}
                  required
                />

                {/* MANUAL MODE */}
                {creationMode === 'manual' && (
                  <>
                    <div className="tag-input-container">
                      <label>Ideal Commit Tags:</label>
                      <div className="tag-input">
                        {commitTags.map((tag, idx) => (
                          <div key={idx} className="tag">
                            {tag}
                            <span className="tag-remove" onClick={() => removeTag(tag)}>
                              &times;
                            </span>
                          </div>
                        ))}
                        <input
                          type="text"
                          placeholder="Type and press Enter..."
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={handleTagInputKeyDown}
                        />
                      </div>
                    </div>

                    <fieldset>
                      <legend>Basic Ideal Metrics</legend>
                      <input
                        type="text"
                        placeholder="Commit Frequency"
                        value={manualMetrics.commitFrequency}
                        onChange={(e) => updateNormalMetric('commitFrequency', e.target.value)}
                        required
                      />
                      <input
                        type="text"
                        placeholder="Code Readability"
                        value={manualMetrics.codeReadability}
                        onChange={(e) => updateNormalMetric('codeReadability', e.target.value)}
                        required
                      />
                      <input
                        type="text"
                        placeholder="Match to Job Requirements"
                        value={manualMetrics.matchToJobRequirements}
                        onChange={(e) => updateNormalMetric('matchToJobRequirements', e.target.value)}
                        required
                      />
                    </fieldset>
                  </>
                )}

                {/* AI MODE */}
                {creationMode === 'ai' && (
                  <div className="ai-generate-section">
                    {commitTags.length === 0 ? (
                      <>
                        <p>
                          Click "Generate via AI" to auto-fill ideal commit tags
                          based on the job title and description.
                        </p>
                        <button
                          type="button"
                          className="ai-generate-btn"
                          onClick={handleAiGenerateClick}
                          disabled={isAiGenerating}
                        >
                          {isAiGenerating ? (
                            <span className="loader loader-button"></span>
                          ) : (
                            'Generate via AI'
                          )}
                        </button>
                        {aiError && (
                          <p style={{ color: 'red', fontWeight: '500', marginTop: '0.5rem' }}>
                            {aiError}
                          </p>
                        )}
                      </>
                    ) : (
                      <div className="generated-tags">
                        <p>Generated Commit Tags (editable):</p>
                        <div className="tags-container">
                          {commitTags.map((tag, idx) => (
                            <div key={idx} className="tag">
                              {tag}
                              <span className="tag-remove" onClick={() => removeTag(tag)}>
                                &times;
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  className="create-job-btn"
                  disabled={isCreatingJob}
                >
                  {isCreatingJob ? (
                    <span className="loader loader-button"></span>
                  ) : (
                    'Create Job'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* FILE UPLOAD MODAL */}
      {isFileModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content file-modal">
            <div className="modal-header">
              <h3>File Preview</h3>
              <IoClose
                className="close-icon"
                onClick={() => setIsFileModalOpen(false)}
              />
            </div>
            <div className="csv-table-container">
              <table>
                <thead>
                  {fileRows.length > 0 && (
                    <tr>
                      {fileRows[0].map((header, idx) => (
                        <th key={idx}>{header}</th>
                      ))}
                    </tr>
                  )}
                </thead>
                <tbody>
                  {fileRows.slice(1).map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!validGithub && (
              <p style={{ color: 'red', fontWeight: 'bold', margin: '1rem 0' }}>
                The uploaded file must have a "Github_Username" column (or similar)
                containing at least 2 valid GitHub usernames.
              </p>
            )}
            {/* CONFIRM BUTTON: calls the endpoint with the file data as JSON */}
            <button
              className="confirm-btn"
              onClick={handleFileConfirm}
              disabled={!validGithub}
            >
              <IoCheckmarkCircle className="confirm-icon" /> Confirm
            </button>
          </div>
        </div>
      )}

      {/* SINGLE CANDIDATE ANALYSIS */}
      {selectedJob && (
        <div className="candidate-analysis-container">
          <button
            className="back-button-analyze"
            onClick={() => {
              setSelectedJob(null);
              setAnalysisComplete(false);
            }}
          >
            <IoArrowBack /> Back
          </button>

          <section className="candidate-analysis">
            <h3>Analyze Candidate for: {selectedJob.title}</h3>
            <p>Enter a GitHub email, profile name, or upload a CSV/Excel file for analysis.</p>

            <div className="input-button-wrapper">
              <div className="input-container">
                <FaEnvelope className="input-icon" />
                <input
                  type="text"
                  placeholder="Enter GitHub email or profile name..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="custom-input"
                />
              </div>
              <button
                className="analyze-btn"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <span className="loader loader-button"></span>
                ) : (
                  'Analyze'
                )}
              </button>
            </div>

            <div className="file-upload">
              <label htmlFor="fileUpload" className="upload-btn">
                <FaFileUpload className="upload-icon" /> Upload Data File
              </label>
              <input
                type="file"
                id="fileUpload"
                accept=".csv, .xls, .xlsx"
                onChange={handleFileChange}
              />
            </div>

            {isFileModalOpen && (
              <div className="modal-overlay">
                <div className="modal-content file-modal">
                  <div className="modal-header">
                    <h3>File Preview</h3>
                    <IoClose
                      className="close-icon"
                      onClick={() => setIsFileModalOpen(false)}
                    />
                  </div>
                  <div className="csv-table-container">
                    <table>
                      <thead>
                        {fileRows.length > 0 && (
                          <tr>
                            {fileRows[0].map((header, idx) => (
                              <th key={idx}>{header}</th>
                            ))}
                          </tr>
                        )}
                      </thead>
                      <tbody>
                        {fileRows.slice(1).map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                              <td key={cellIndex}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {!validGithub && (
                    <p style={{ color: 'red', fontWeight: 'bold', margin: '1rem 0' }}>
                      The uploaded file must have a "Github_Username" column (or similar)
                      containing at least 2 valid GitHub usernames.
                    </p>
                  )}
                  <button
                    className="confirm-btn"
                    onClick={handleFileConfirm}
                    disabled={!validGithub}
                  >
                    <IoCheckmarkCircle className="confirm-icon" /> Confirm
                  </button>
                </div>
              </div>
            )}

            {analysisComplete && (
              <div className="analysis-result">
                <h4>Analysis Result</h4>
                <p>{analysisResult}</p>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

export default RecruiterPage;