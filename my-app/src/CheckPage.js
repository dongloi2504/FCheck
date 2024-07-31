import React, { useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Tooltip } from 'react-tooltip'; // Import Tooltip from react-tooltip
import Test from './services/ProgramService'; // Import your service
import './CheckPage.css';

const MenuIcon = () => <img src="https://openui.fly.dev/openui/24x24.svg?text=☰" alt="menu-icon" />;
const LogoIcon = () => <img src="https://openui.fly.dev/openui/24x24.svg?text=🖋️" alt="logo-icon" />;

const Button = ({ children, className, onClick }) => (
  <button className={className} onClick={onClick}>{children}</button>
);

const AlertItem = ({ title, suggestion, description }) => (
  <div className="bg-white p-2 rounded-lg shadow-sm mb-4" style={{ display: 'inline-block', width: 'fit-content' }}>
    <h3 className="text-danger fw-semibold mb-1">{title}</h3>
    <p className="mb-1">
      <span className="text-danger">{suggestion}</span>
    </p>
    <p className="text-muted mb-0">{description}</p>
  </div>
);

const CheckPage = () => {
  const [fileContent, setFileContent] = useState('');
  const [highlightedContent, setHighlightedContent] = useState('');
  const [overallScore, setOverallScore] = useState(null);
  const [loading, setLoading] = useState(false); // New loading state
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target.result;
        setFileContent(content);
        setLoading(true); // Set loading state to true before API call

        try {
          // Call the API
          const result = await Test.checkPlagiarism(content);
          console.log('API result:', result);
          const roundedPercentage = Math.round(result.similarity_percentage);
          setOverallScore(roundedPercentage);
          const highlighted = highlightPlagiarizedSentences(content, result.plagiarized_sentences);
          setHighlightedContent(highlighted);
        } catch (error) {
          console.error('Error in API call:', error);
        } finally {
          setLoading(false); // Reset loading state after API call
        }
      };
      reader.readAsText(file);
    }
  };

  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  const highlightPlagiarizedSentences = (content, plagiarizedSentences) => {
    let highlighted = content;

    plagiarizedSentences.forEach(sentence => {
      // Escape special characters in the input sentence
      const regex = new RegExp(`(${escapeRegExp(sentence.input_sentence)})`, 'gi');
      highlighted = highlighted.replace(regex, `<span class="text-danger" data-tooltip-id="tooltip" data-tooltip-content="${sentence.article_sentence}">$1</span>`);
    });

    return highlighted;
  };

  return (
    <div className="d-flex h-100 min-vh-100">
      <div className="w-25 bg-light p-4 border-end d-flex flex-column">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <MenuIcon />
          <LogoIcon />
        </div>
        <h2 className="h5 fw-bold text-dark mb-3">Goals</h2>
        <div className="d-grid gap-2 flex-grow-1">
          <div className="mb-3">
            <input
              type="file"
              accept=".txt,.doc"
              className="form-control d-none"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span>Similarity percentage</span>
              <span>{overallScore !== null ? `${overallScore}%` : 'N/A'}</span>
            </div>
            <Button className="btn btn-primary w-100 py-2 rounded-lg" onClick={handleButtonClick}>
              Upload files
            </Button>
          </div>
        </div>
      </div>
      <div className="flex-fill p-8 bg-light" style={{ maxWidth: '800px', overflow: 'auto' }}>
        <h1 className="display-4 fw-bold mb-4">The Result:</h1>
        {loading ? (
          <p>Loading...</p> // Display loading message while API call is in progress
        ) : (
          <div
            style={{ whiteSpace: 'pre-wrap' }}
            dangerouslySetInnerHTML={{ __html: highlightedContent || fileContent }}
          />
        )}
        <Tooltip id="tooltip" className="custom-tooltip" /> {/* Use Tooltip with custom class */}
      </div>
      <div className="w-25 bg-light p-4 border-start d-flex flex-column">
        {/* Sidebar content */}
      </div>
    </div>
  );
};

export default CheckPage;