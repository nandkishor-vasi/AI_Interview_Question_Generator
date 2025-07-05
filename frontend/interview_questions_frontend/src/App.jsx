import { useState } from 'react';
import axios from 'axios';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(selectedFile.type)) {
      setFile(selectedFile);
      setQuestions([]);
      setShowQuestions(false);
      setError(null);
    } else {
      setError('Please upload a valid .pdf or .docx file');
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return setError('Please select a resume file');

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      setError(null);
      const response = await axios.post('http://127.0.0.1:8000/upload-resume/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setQuestions(response.data.questions);
      setTimeout(() => setShowQuestions(true), 100); // Allow React to render questions before transition
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Failed to generate questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="content-box">
        {/* Header */}
        <div className="header">
          <h1>
            <span role="img" aria-label="rocket">🚀</span> AI Interview Question Generator
          </h1>
          <p>Upload your resume to generate tailored interview questions</p>
        </div>

        <div className="upload-section">
          <div className="upload-box" onClick={() => document.getElementById('resume-upload').click()}>
            <label htmlFor="resume-upload">
              <CloudArrowUpIcon style={{ width: '24px', height: '24px', color: '#14b8a6', marginBottom: '10px' }} />
              <p style={{ color: '#134e4a', fontWeight: '600' }}>
                {file ? file.name : 'Click to upload your resume (.pdf, .docx)'}
              </p>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>
                {file ? 'File selected' : 'Supports PDF and Word documents'}
              </p>
              <input
                type="file"
                id="resume-upload"
                accept=".pdf,.docx"
                className="file-input"
                onChange={handleFileChange}
              />
            </label>
          </div>
          {error && <p className="error-message">{error}</p>}
        </div>

        <div className="button-container">
          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className={(!file || loading) ? 'upload-button disabled' : 'upload-button'}
          >
            {loading ? (
              <>
                <svg
                  className="spinner"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Generating...
              </>
            ) : (
              <span>
                {questions.length > 0 ? '🔁 Regenerate Questions' : '🎯 Generate Questions'}
              </span>
            )}
          </button>
        </div>

        {questions.length > 0 && (
          <div className={showQuestions ? 'questions-section active' : 'questions-section'}>
            <div className="questions-box">
              <h2>
                <span role="img" aria-label="brain" style={{ color: '#9333ea' }}>🧠</span> Generated Interview Questions
              </h2>
              <ul>
                {questions.map((q, i) => (
                  <li key={i} className="question-item">
                    <span> {q}</span>
                  </li>
                ))}
              </ul>
              <p style={{ color: '#6b7280', fontStyle: 'italic' }}>
                These questions are tailored to your resume, focusing on technical skills and project experience.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;