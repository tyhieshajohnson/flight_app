import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';

const Footer = () => {
  return (
    <footer className="footer bg-secondary text-light py-3 mt-5">
      <div className="container">
        <div className="row">
          <div className="col-12 text-center">
            <p>&copy; {new Date().getFullYear()} AirScraper API. All Rights Reserved.</p>
            <p>
              <Link to="/terms" className="text-light mx-2">
                Terms of Service
              </Link>
              |
              <Link to="/privacy" className="text-light mx-2">
                Privacy Policy
              </Link>
            </p>
            <p>
              Follow us on:
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="mx-2">
                Twitter
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="mx-2">
                Facebook
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
