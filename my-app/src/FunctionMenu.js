import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const NavbarLink = ({ iconSrc, altText, text }) => (
  <a href="#" className="d-flex align-items-center gap-2 text-muted">
    <img src={iconSrc} alt={altText} className="me-2" />
    <span>{text}</span>
  </a>
);

const DocumentCard = ({ iconSrc, altText, title, description, count }) => (
  <div className="bg-light p-3 rounded-lg shadow-sm w-100 mb-4">
    <h4 className="h6 fw-semibold mb-2">{title}</h4>
    <p className="small text-secondary">{description}</p>
    <span className="text-danger fw-semibold mt-2 d-block">{count}</span>
  </div>
);

const FunctionMenu = () => {
  return (
    <div className="d-flex min-vh-100 min-vw-100">
      <div className="w-25 bg-dark text-white p-3 d-flex flex-column">
        <div className="d-flex align-items-center mb-5">
          <img src="https://placehold.co/32x32" alt="logo" className="me-2" />
          <span className="h5 fw-bold">FCheck</span>
        </div>
        {/* <nav className="mb-5">
          <NavbarLink iconSrc="https://placehold.co/24x24" altText="home-icon" text="My Grammarly" />
          <NavbarLink iconSrc="https://placehold.co/24x24" altText="trash-icon" text="Trash" />
          <NavbarLink iconSrc="https://placehold.co/24x24" altText="account-icon" text="Account" />
          <NavbarLink iconSrc="https://placehold.co/24x24" altText="apps-icon" text="Apps" />
          <NavbarLink iconSrc="https://placehold.co/24x24" altText="premium-icon" text="Premium" />
        </nav> */}
        <div className="mt-auto">
          <div className="bg-secondary p-3 rounded-lg mb-4">
            <div className="d-flex align-items-center justify-content-between">
              <img src="https://placehold.co/32x32" alt="style-guide-icon" className="me-2" />
              <button className="btn-close btn-close-white"></button>
            </div>
            <p className="small mt-2">Try Style Guides in FCheck Bussiness</p>
            <button className="btn btn-primary mt-3 w-100">Learn More</button>
          </div>
          <button className="btn btn-secondary w-100">Log Out</button>
        </div>
      </div>
      <div className="flex-fill p-4 bg-light">
        <div className="d-flex justify-content-between align-items-center mb-5">
          <input
            type="text"
            placeholder="Search..."
            className="form-control w-50"
          />
        </div>
        <div className="d-flex gap-4">
          <div className="flex-fill">
            <h2 className="h5 fw-semibold mb-4">All documents</h2>
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <h3 className="h6 fw-semibold mb-3">Today</h3>
              <div className="d-flex align-items-center gap-4">
                <div className="bg-light p-3 rounded-lg shadow-sm text-center">
                  <img src="https://placehold.co/48x48" alt="new-document-icon" className="mb-2" />
                  <p className="small fw-semibold">New</p>
                  <button className="btn btn-outline-secondary mt-2 w-100">Upload</button>
                </div>
                <DocumentCard
                  iconSrc="https://placehold.co/48x48"
                  altText="demo-document-icon"
                  title="Demo document"
                  description="The basics Misspellings and grammatical errors can affect your credibility. The same goes for misused commas, and other..."
                  count="23"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FunctionMenu;