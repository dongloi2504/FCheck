import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
  return (
    <nav className="d-flex gap-3">
      <a href="#" className="text-muted">Product</a>
      <a href="#" className="text-muted">Education</a>
      <a href="#" className="text-muted">Pricing</a>
      <a href="#" className="text-muted">Resources</a>
    </nav>
  );
};

const MainHeader = () => {
  return (
    <header className="d-flex justify-content-between align-items-center mb-4">
      <div className="d-flex align-items-center gap-2">
        <img src="https://placehold.co/40x40" alt="company-logo" className="rounded-circle" />
        <span className="fs-4 fw-bold">FCheck</span>
      </div>
      <Navbar />
      <div className="d-flex gap-3">
        <a href="#" className="text-muted">Contact Sales</a>
        <a href="#" className="text-muted">Log in</a>
      </div>
    </header>
  );
};

const MainContent = () => {
  return (
    <main className="text-center mx-auto" style={{ maxWidth: '56rem' }}>
      <h1 className="fs-1 fw-bold mb-3">Responsible AI that ensures your writing and reputation shine</h1>
      <p className="fs-5 text-muted mb-4">
        Work with an AI writing partner that helps you find the words you need—to write that tricky email, to get your point across, to keep your work moving.
      </p>
      <div className="d-flex justify-content-center gap-3 mb-4">
        <button className="btn btn-primary text-white py-2 px-4 rounded">Sign up It's free</button>
        <button className="btn btn-outline-secondary py-2 px-4 rounded d-flex align-items-center gap-2">
          <img src="https://placehold.co/20x20" alt="google-logo" className="rounded-circle" />
          <span>Sign up with Google</span>
        </button>
      </div>
      <p className="fs-6 text-muted">
        By signing up, you agree to the{' '}
        <a href="#" className="text-primary">Terms and Conditions</a>{' '}
        and{' '}
        <a href="#" className="text-primary">Privacy Policy</a>. California residents, see our{' '}
        <a href="#" className="text-primary">CA Privacy Notice</a>.
      </p>
    </main>
  );
};

const Aside = () => {
  return (
    <aside className="mt-4 d-flex justify-content-center">
      <div className="card border p-3 w-100" style={{ maxWidth: '28rem' }}>
        <div className="d-flex align-items-center gap-2 mb-3">
          <img src="https://placehold.co/20x20" alt="slack-logo" className="rounded-circle" />
          <span className="text-muted">We're ready to move forward with the project plan once you take a look at the draft.</span>
        </div>
        <p className="fs-5">
          <span className="text-muted">Can you review the plan?</span>
        </p>
        <div className="d-flex align-items-center gap-2 mt-3">
          <img src="https://placehold.co/20x20?text=Aa" alt="text-icon" className="rounded-circle" />
          <img src="https://placehold.co/20x20?text=😊" alt="emoji-icon" className="rounded-circle" />
          <img src="https://placehold.co/20x20?text=📎" alt="attachment-icon" className="rounded-circle" />
          <img src="https://placehold.co/20x20?text=📷" alt="camera-icon" className="rounded-circle" />
          <img src="https://placehold.co/20x20?text=🎤" alt="microphone-icon" className="rounded-circle" />
        </div>
      </div>
    </aside>
  );
};

const ReactComponent = () => {
  return (
    <div className="min-vh-100 min-vw-100 bg-light text-dark p-4 d-flex flex-column">
      <MainHeader />
      <MainContent />
      <Aside />
    </div>
  );
};

export default ReactComponent;