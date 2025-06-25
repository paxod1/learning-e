import React from 'react';
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-top">
        <div className="footer-logo">
          <img src="https://techwingsys.com/logo-1.png"  />
          <div className="login-version">Version 1.0.0.0</div>
        </div>
        <div className="footer-links">
          <a href="https://www.techwingsys.com/About-US%20TECHWINGSYS%20History">About Us</a>
          <a href="https://techwingsys.com/contact-best-software-training-institute-in-kochi-kerala-techwingsys">Contact</a>
          <a href="https://techwingsys.com/techwingsys-blog-list">Blog</a>
          <a href="https://techwingsys.com/Review%20-%20TECHWINGSYS">Success Stories</a>
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© TECHWINGSYS 2025 | Developed by Techglitz Global Pvt Ltd</p>
        <div className="footer-socials">
          <a href="https://www.youtube.com/techwingsys" target="_blank" rel="noopener noreferrer">Youtube</a>
          <a href="https://www.instagram.com/techwingsys" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="https://www.facebook.com/techwingsys" target="_blank" rel="noopener noreferrer">Facebook</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
