import React, { useState } from 'react';
import axios from 'axios';
import { Table, Form, Button, Spinner, Alert } from 'react-bootstrap';

const SearchAirports = () => {
  const [query, setQuery] = useState('');
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAirports = async () => {
    if (!query) return;
    setLoading(true);
    setError(null);

    const options = {
      method: 'GET',
      url: 'https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport',
      params: {
        query,
        locale: 'en-US'
      },
      headers: {
        'x-rapidapi-key': 'a98f740603msh715edb03b3e02cfp18182ejsn0b0f565bfd13',
        'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);

      const airportsData = response.data.data.filter(item => item.navigation.entityType === 'AIRPORT');

      setAirports(airportsData);
    } catch (error) {
      setError('Failed to fetch airports. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSearchClick = () => {
    fetchAirports();
  };

  return (
    <div className="container mt-4">
      <div className="banner">
        <img src="/flights_nc_4.svg" alt="Banner" className="banner-image" />
      </div>

      <h1 className="search-heading">Find Airports Near You</h1>

      <div className="search-box form-container">
        <Form.Control
          type="text"
          placeholder="Enter airport name..."
          value={query}
          onChange={handleSearchChange}
          className="search-input"
        />
        <Button
          type="button"
          variant="primary"
          onClick={handleSearchClick}
          disabled={loading || !query}
        >
          {loading ? <Spinner animation="border" size="sm" /> : 'Search'}
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover className="airports-table form-container">
        <thead>
          <tr>
            <th>Name</th>
            <th>City</th>
            <th>Country</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {airports.length > 0 ? (
            airports.map((airport) => (
              <tr key={airport.skyId}>
                <td>{airport.presentation.title}</td>
                <td>{airport.navigation.localizedName || 'N/A'}</td>
                <td>{airport.presentation.subtitle || 'N/A'}</td>
                <td>

                  {airport.media && airport.media[0] ? (
                    <img
                      src={airport.media[0].url}
                      alt={airport.presentation.title}
                      className="airport-image"
                    />
                  ) : (
                    'No image available'
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No airports found</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default SearchAirports;
