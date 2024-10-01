import React, { useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Tooltip } from 'react-tooltip';
import Test from './services/ProgramService';
import './CheckPage.css';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import mammoth from 'mammoth';

const MenuIcon = () => <img src={process.env.PUBLIC_URL + "/logo1.png"} alt="menu-icon" className="menu-icon" />;
const LogoIcon = () => <img src="https://openui.fly.dev/openui/24x24.svg?text=🖋️" alt="logo-icon" />;
const Button = ({ children, className, onClick }) => (
  <button className={className} onClick={onClick}>{children}</button>
);

const CheckPage = () => {
  const [fileContent, setFileContent] = useState('');
  const [highlightedContent, setHighlightedContent] = useState('');
  const [overallScore, setOverallScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [typedContent, setTypedContent] = useState('');  // State for typing area
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      setLoading(true);

      if (fileExtension === 'txt') {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const content = e.target.result;
          setFileContent(content);
          await processPlagiarism(content);
        };
        reader.readAsText(file);
      } else if (fileExtension === 'docx') {
        try {
          const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
          const content = result.value;
          setFileContent(content);
          await processPlagiarism(content);
        } catch (error) {
          console.error('Error reading .docx file:', error);
        }
      } else {
        console.error('Unsupported file type');
      }
    }
  };

  const processPlagiarism = async (content) => {
    try {
      const result = await Test.checkPlagiarism(content);
      console.log('API result:', result);
      const roundedPercentage = Math.round(result.similarity_percentage);
      setOverallScore(roundedPercentage);
      const highlighted = highlightPlagiarizedSentences(content, result.plagiarized_sentences);
      setHighlightedContent(highlighted);
    } catch (error) {
      console.error('Error in API call:', error);
    } finally {
      setLoading(false);
    }
  };

  const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const highlightPlagiarizedSentences = (content, plagiarizedSentences) => {
    let highlighted = content;

    plagiarizedSentences.forEach(sentence => {
      const regex = new RegExp(`(${escapeRegExp(sentence.input_sentence)})`, 'gi');
      highlighted = highlighted.replace(regex, `<span class="text-danger" data-tooltip-id="tooltip" data-tooltip-content="${sentence.article_sentence}">$1</span>`);
    });

    return highlighted;
  };

  const uniquePercentage = overallScore !== null ? 100 - overallScore : null;

  // Handle typing input
  const handleTypingChange = (e) => {
    setTypedContent(e.target.value);
  };

  // Handle plagiarism check for typed content
  const handleTypingSubmit = async () => {
    if (typedContent.trim() === '') {
      console.error('Typed content is empty');
      return;
    }

    setLoading(true);
    await processPlagiarism(typedContent);
  };

  // Handle clear typing area
  const handleClearText = () => {
    setTypedContent('');  // Clear the text area by setting typedContent to an empty string
  };

  return (
    <div className="d-flex flex-column flex-lg-row h-100 min-vh-100">
      {/* Left Sidebar */}
      <div className="w-25 bg-light p-4 border-end d-flex flex-column sidebar">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div className="logo-container">
            <MenuIcon />
            <div class="w-100 w-lg-25">
              Nội dung
            </div>
            <span className="logo-text">Let Us Check</span>
          </div>
          <LogoIcon />
        </div>
        <h2 className="h5 fw-bold text-dark mb-3">Goals</h2>
        <div className="d-grid gap-2 flex-grow-1">
          <div className="mb-3">
            <input
              type="file"
              accept=".txt,.doc,.docx"
              className="form-control d-none"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span>Similarity percentage</span>
              <div style={{ width: '60px', height: '60px' }}>
                <CircularProgressbar
                  value={overallScore || 0}
                  text={`${overallScore !== null ? `${overallScore}%` : 'N/A'}`}
                  styles={buildStyles({
                    pathColor: `rgba(255, 0, 0, 1)`,
                    textColor: '#ff0000',
                    trailColor: '#d6d6d6',
                    backgroundColor: '#ffcccc',
                  })}
                />
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span>Unique percentage</span>
              <div style={{ width: '60px', height: '60px' }}>
                <CircularProgressbar
                  value={uniquePercentage || 0}
                  text={`${uniquePercentage !== null ? `${uniquePercentage}%` : 'N/A'}`}
                  styles={buildStyles({
                    pathColor: `rgba(34,139,34, 1)`,
                    textColor: '#228B22',
                    trailColor: '#d6d6d6',
                    backgroundColor: '#ccffcc',
                  })}
                />
              </div>
            </div>
            <Button className="btn btn-primary w-100 py-2 rounded-lg" onClick={handleButtonClick}>
              Upload files
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-fill w-75 p-8 bg-light main-container" style={{ overflow: 'auto' }}>
        <h1 className="display-4 fw-bold mb-4">The Result:</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <div
              style={{ whiteSpace: 'pre-wrap' }}
              dangerouslySetInnerHTML={{ __html: highlightedContent || fileContent }}
            />
            <Tooltip id="tooltip" className="custom-tooltip" />
            {/* Add the textarea for typing below the result */}
            <div className="mt-4">
              <h3 className="h5">Type Your Text Here:</h3>
              <textarea
                className="form-control"
                rows="5"
                value={typedContent}
                onChange={handleTypingChange}
                placeholder="Type your text..."
              />
              <div className="d-flex justify-content-start mt-3">
                <Button className="btn btn-success me-2" onClick={handleTypingSubmit}>
                  Enter your text
                </Button>
                <Button className="btn btn-danger" onClick={handleClearText}>
                  Delete all your text
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar */}
      <div className="w-25 bg-light p-4 border-start d-flex flex-column rightbar">
        {overallScore !== null && overallScore > 0 && overallScore < 15 && (
          <div className="alert alert-warning">
            <p className="suggestion-text">Gợi ý cho bạn</p>
            <p><strong>*Cẩn thận với các trích dẫn:</strong> Dù % đạo văn thấp, bạn vẫn nên chắc chắn rằng tất cả các trích dẫn, nguồn tài liệu đều được ghi chú chính xác. Điều này sẽ giúp tránh những hiểu nhầm về đạo văn.</p>
            <p><strong>*Kiểm tra lại cấu trúc câu:</strong> Cố gắng diễn đạt lại ý tưởng của nguồn tài liệu theo cách riêng của bạn. Dù không vi phạm đạo văn, việc paraphrase sẽ giúp làm nổi bật sự đóng góp của bạn trong bài viết.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckPage;