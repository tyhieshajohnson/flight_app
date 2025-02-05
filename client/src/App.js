import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import axios from 'axios';
import SearchAirports from './SearchAirports';
import SearchFlights from './SearchFlights';
import Footer from './Footer';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">AirScraper.api</Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNavAltMarkup"
              aria-controls="navbarNavAltMarkup"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
              <div className="navbar-nav">
                <Link className="nav-link" to="/airports">
                  <button type="button" className="btn btn-outline-secondary">Airports</button>
                </Link>
                <Link className="nav-link" to="/flights">
                  <button type="button" className="btn btn-outline-secondary">Flights</button>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <Routes>
        <Route
            path="/"
            element={<div style={{ color: 'black', padding: '20px' }}>
            <div className="banner">
                <img src="/flights_nc_4.svg" alt="Banner" className="banner-image" />
            </div>
            <h1 className="search-heading">Welcome to AirScraper API</h1>
            <p className="home-description">A responsive Google Flights replica built with React, Node.js and the
            Sky Scrapper API from RapidAPI.</p>
            </div>}
          />
          <Route path="/airports" element={<SearchAirports />} />
          <Route path="/flights" element={<SearchFlights />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
