import React, { useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Tooltip } from 'react-tooltip'; // Import Tooltip from react-tooltip
import Test from './services/ProgramService'; // Import your service
import './CheckPage.css';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const MenuIcon = () => <img src={process.env.PUBLIC_URL + "/logo1.png"} alt="menu-icon" className="menu-icon"/>
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

  const uniquePercentage = overallScore !== null ? 100 - overallScore : null;

  return (
    <div className="d-flex h-100 min-vh-100">
      <div className="w-25 bg-light p-4 border-end d-flex flex-column">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div class="logo-container">
            <MenuIcon/>
            <span className="logo-text">Let Us Check</span>
          </div>
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
              <div style={{ width: '60px', height: '60px', } }>
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
      {overallScore !== null && overallScore > 0 && overallScore < 15 && (
          <div className="alert alert-warning">
            <p class="suggestion-text">Gợi ý cho bạn</p>
            <p><strong>*Cẩn thận với các trích dẫn:</strong> Dù % đạo văn thấp, bạn vẫn nên chắc chắn rằng tất cả các trích dẫn, nguồn tài liệu đều được ghi chú chính xác. Điều này sẽ giúp tránh những hiểu nhầm về đạo văn.</p>
            <p><strong>*Kiểm tra lại cấu trúc câu:</strong> Cố gắng diễn đạt lại ý tưởng của nguồn tài liệu theo cách riêng của bạn. Dù không vi phạm đạo văn, việc paraphrasing tốt sẽ giúp văn bản trở nên độc đáo hơn.</p>
          </div>
        )}
          {overallScore !== null && overallScore > 15 && overallScore < 25 && (
          <div className="alert alert-warning">
            <p class="suggestion-text">Gợi ý cho bạn</p>
            <p><strong>*Diễn giải lại rõ ràng hơn:</strong> Hãy cố gắng diễn giải lại các đoạn văn bạn đã tham khảo bằng ngôn ngữ của riêng mình, thay vì sao chép nguyên văn.</p>
            <p><strong>*Tăng cường nội dung cá nhân:</strong> Bổ sung thêm quan điểm, phân tích cá nhân hoặc các dẫn chứng thực tế của bạn để làm cho bài viết của bạn có nhiều nội dung gốc hơn.</p>
          </div>
        )}
      {overallScore !== null && overallScore > 25 && overallScore < 101 && (
          <div className="alert alert-warning">
            <p class="suggestion-text">Gợi ý cho bạn</p>
            <p><strong>*Xem lại toàn bộ bài viết:</strong> Đọc lại toàn bộ nội dung và xác định những đoạn bạn đã sao chép hoặc phụ thuộc quá nhiều vào các tài liệu tham khảo. Thay đổi hoàn toàn những đoạn này bằng cách diễn giải lại hoặc thay thế bằng ý tưởng của riêng bạn.</p>
            <p><strong>*Phát triển ý tưởng gốc: </strong>Tập trung vào việc đưa ra quan điểm, phân tích và sáng tạo nội dung của riêng bạn. Điều này sẽ giúp giảm đáng kể % đạo văn và tăng chất lượng bài viết.</p>
          </div>
        )}
      <div className="w-25 bg-light p-4 border-start d-flex flex-column">
    
       
      </div>
      </div>
    </div>
  );
};

export default CheckPage;