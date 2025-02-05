import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Table, Spinner, Alert, Row, Col } from 'react-bootstrap';

const BookFlight = () => {
  const [originSkyId, setOriginSkyId] = useState('');
  const [destinationSkyId, setDestinationSkyId] = useState('');
  const [originEntityId, setOriginEntityId] = useState('');
  const [destinationEntityId, setDestinationEntityId] = useState('');

  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [cabinClass, setCabinClass] = useState('economy');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [limit, setLimit] = useState(10);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [flights, setFlights] = useState([]);

  const [originAirports, setOriginAirports] = useState([]);
  const [destinationAirports, setDestinationAirports] = useState([]);
  const [originSearchQuery, setOriginSearchQuery] = useState('');
  const [destinationSearchQuery, setDestinationSearchQuery] = useState('');

  useEffect(() => {
    const fetchAirports = async (query, type) => {
      if (!query) {
        if (type === 'origin') setOriginAirports([]);
        if (type === 'destination') setDestinationAirports([]);
        return;
      }

      const options = {
        method: 'GET',
        url: 'https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport',
        params: { query, locale: 'en-US' },
        headers: {
          'x-rapidapi-key': 'a98f740603msh715edb03b3e02cfp18182ejsn0b0f565bfd13',
          'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com',
        },
      };

      try {
        const response = await axios.request(options);
        const filteredAirports = response.data.data.filter(item => item.navigation.entityType === 'AIRPORT');

        if (type === 'origin') {
          setOriginAirports(filteredAirports);
        } else {
          setDestinationAirports(filteredAirports);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch airports.');
      }
    };

    if (originSearchQuery) {
      fetchAirports(originSearchQuery, 'origin');
    }
    if (destinationSearchQuery) {
      fetchAirports(destinationSearchQuery, 'destination');
    }
  }, [originSearchQuery, destinationSearchQuery]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError(null);
    setFlights([]);

    const options = {
      method: 'GET',
      url: 'https://sky-scrapper.p.rapidapi.com/api/v2/flights/searchFlightsComplete',
      params: {
        originSkyId,
        destinationSkyId,
        originEntityId,
        destinationEntityId,
        date: departureDate,
        returnDate,
        cabinClass,
        adults,
        childrens: children,
        infants,
        sortBy: 'best',
        limit,
        currency: 'USD',
        market: 'en-US',
        countryCode: 'US',
      },
      headers: {
        'x-rapidapi-key': 'a98f740603msh715edb03b3e02cfp18182ejsn0b0f565bfd13',
        'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com',
      },
    };

    try {
      const response = await axios.request(options);

      console.log('API Response:', response.data);

      setFlights(response.data.data.itineraries);
    } catch (err) {
      setError('Failed to fetch flights. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAirportSelect = (airport, type) => {
    if (type === 'origin') {
      setOriginSkyId(airport.skyId);
      setOriginEntityId(airport.entityId);
    } else {
      setDestinationSkyId(airport.skyId);
      setDestinationEntityId(airport.entityId);
    }
  };

  return (
    <div className="container mt-4">
      <div className="banner">
        <img src="/flights_nc_4.svg" alt="Flight Banner" style={{ width: '100%', height: 'auto' }} />
      </div>

      <h1>Search Available Flights</h1>

      <Form onSubmit={handleSubmit} style={{ borderRadius: '15px', border: '1px solid #ddd', padding: '20px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <Row>
          <Col sm={12} md={6}>
            <Form.Group controlId="originAirport">
              <Form.Label>Origin Airport</Form.Label>
              <Form.Control
                type="text"
                value={originSearchQuery}
                onChange={(e) => setOriginSearchQuery(e.target.value)}
                placeholder="Search for Origin Airport"
              />
              <ul className="list-group mt-2">
                {originAirports.map((airport) => (
                  <li
                    key={airport.skyId}
                    className="list-group-item"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleAirportSelect(airport, 'origin')}
                  >
                    {airport.presentation.title} ({airport.skyId})
                  </li>
                ))}
              </ul>
              {originSkyId && (
                <Form.Text className="text-muted mt-2">
                  Selected Origin: {originSkyId}
                </Form.Text>
              )}
            </Form.Group>
          </Col>

          <Col sm={12} md={6}>
            <Form.Group controlId="destinationAirport">
              <Form.Label>Destination Airport</Form.Label>
              <Form.Control
                type="text"
                value={destinationSearchQuery}
                onChange={(e) => setDestinationSearchQuery(e.target.value)}
                placeholder="Search for Destination Airport"
              />
              <ul className="list-group mt-2">
                {destinationAirports.map((airport) => (
                  <li
                    key={airport.skyId}
                    className="list-group-item"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleAirportSelect(airport, 'destination')}
                  >
                    {airport.presentation.title} ({airport.skyId})
                  </li>
                ))}
              </ul>
              {destinationSkyId && (
                <Form.Text className="text-muted mt-2">
                  Selected Destination: {destinationSkyId}
                </Form.Text>
              )}
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col sm={12} md={6}>
            <Form.Group controlId="departureDate">
              <Form.Label>Departure Date</Form.Label>
              <Form.Control
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                required
              />
            </Form.Group>
          </Col>

          <Col sm={12} md={6}>
            <Form.Group controlId="returnDate">
              <Form.Label>Return Date (optional)</Form.Label>
              <Form.Control
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col sm={12} md={6}>
            <Form.Group controlId="adults">
              <Form.Label>Adults</Form.Label>
              <Form.Control
                type="number"
                min="1"
                value={adults}
                onChange={(e) => setAdults(Number(e.target.value))}
              />
            </Form.Group>
          </Col>

          <Col sm={12} md={6}>
            <Form.Group controlId="children">
              <Form.Label>Children</Form.Label>
              <Form.Control
                type="number"
                min="0"
                value={children}
                onChange={(e) => setChildren(Number(e.target.value))}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col sm={12} md={6}>
            <Form.Group controlId="infants">
              <Form.Label>Infants</Form.Label>
              <Form.Control
                type="number"
                min="0"
                value={infants}
                onChange={(e) => setInfants(Number(e.target.value))}
              />
            </Form.Group>
          </Col>

          <Col sm={12} md={6}>
            <Form.Group controlId="cabinClass">
              <Form.Label>Cabin Class</Form.Label>
              <Form.Control
                as="select"
                value={cabinClass}
                onChange={(e) => setCabinClass(e.target.value)}
              >
                <option value="economy">Economy</option>
                <option value="premium_economy">Premium Economy</option>
                <option value="business">Business</option>
                <option value="first">First</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>

        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : 'Search Flights'}
        </Button>
      </Form>

      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

      {flights.length > 0 && (
        <div className="mt-4 form-container">
          <h2>Flight Results</h2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Flight</th>
                <th>Departure</th>
                <th>Arrival</th>
                <th>Price</th>
                <th>Airline</th>
              </tr>
            </thead>
            <tbody>
              {flights.map((flight, index) => (
                <tr key={index}>
                  <td>{flight.legs[0].segments[0].flightNumber}</td>
                  <td>{flight.legs[0].departure}</td>
                  <td>{flight.legs[0].arrival}</td>
                  <td>{flight.price.formatted}</td>
                  <td>
                    {flight.legs[0].carriers.marketing[0].name}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default BookFlight;
