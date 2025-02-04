import React, { useState } from 'react';
import axios from 'axios';
import { Table, Form, Button, Spinner, Alert } from 'react-bootstrap';

const SearchAirports = () => {
  const [query, setQuery] = useState(''); // Search query
  const [airports, setAirports] = useState([]); // List of fetched airports
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  // Function to fetch airports based on the query
  const fetchAirports = async () => {
    if (!query) return; // Don't fetch if the query is empty
    setLoading(true);
    setError(null); // Reset error before new search

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

      // Filter only airports (not cities or countries)
      const airportsData = response.data.data.filter(item => item.navigation.entityType === 'AIRPORT');

      setAirports(airportsData); // Set the airports in state
    } catch (error) {
      setError('Failed to fetch airports. Please try again.');
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  const handleSearchChange = (event) => {
    setQuery(event.target.value); // Update query when user types
  };

  const handleSearchClick = () => {
    fetchAirports(); // Trigger the API request when user clicks Search
  };

  return (
    <div className="container mt-4">
      <h1>Search Airports</h1>

      <div className="mb-3">
        <Form.Control
          type="text"
          placeholder="Enter airport name..."
          value={query}
          onChange={handleSearchChange} // Update query on change
        />
        <Button
          className="mt-2"
          onClick={handleSearchClick} // Trigger search on click
          variant="primary"
          disabled={loading || !query}
        >
          {loading ? <Spinner animation="border" size="sm" /> : 'Search'}
        </Button>
      </div>

      {/* Show error message if any */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Display airports data in a table */}
      <Table striped bordered hover>
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
                  {/* Check if there's an image available */}
                  {airport.media && airport.media[0] ? (
                    <img
                      src={airport.media[0].url}
                      alt={airport.presentation.title}
                      style={{ width: '100px', height: '100px', objectFit: 'cover' }}
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
