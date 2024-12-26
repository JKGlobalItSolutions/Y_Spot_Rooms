import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

function SearchForm() {
  const [location, setLocation] = useState('');
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [guests, setGuests] = useState({ adults: 1, children: 0, rooms: 1 });
  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false);

  useEffect(() => {
    // Load saved data from sessionStorage
    const savedLocation = sessionStorage.getItem('location') || 'Tiruvannamalai';
    const savedCheckin = sessionStorage.getItem('checkin');
    const savedCheckout = sessionStorage.getItem('checkout');
    const savedAdults = sessionStorage.getItem('adults') || 1;
    const savedChildren = sessionStorage.getItem('children') || 0;
    const savedRooms = sessionStorage.getItem('rooms') || 1;

    setLocation(savedLocation);
    if (savedCheckin && savedCheckout) {
      setDateRange([new Date(savedCheckin), new Date(savedCheckout)]);
    }
    setGuests({
      adults: parseInt(savedAdults),
      children: parseInt(savedChildren),
      rooms: parseInt(savedRooms)
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save form data to sessionStorage
    sessionStorage.setItem('location', location);
    sessionStorage.setItem('checkin', startDate?.toLocaleDateString());
    sessionStorage.setItem('checkout', endDate?.toLocaleDateString());
    sessionStorage.setItem('adults', guests.adults);
    sessionStorage.setItem('children', guests.children);
    sessionStorage.setItem('rooms', guests.rooms);
    // Redirect to details page
    // history.push('/details');
  };

  const updateGuests = (type, value) => {
    setGuests(prev => ({ ...prev, [type]: value }));
  };

  return (
    <Container className="custom-container rounded" style={{ backgroundColor: '#1C1B1F', marginTop: '-85px' }}>
      <Form onSubmit={handleSubmit}>
        <Row className="justify-content-center rounded-3">
          <Col lg={3} md={6} sm={12}>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Enter destination"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col lg={4} md={6} sm={12}>
            <Form.Group>
              <DatePicker
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => {
                  setDateRange(update);
                }}
                isClearable={true}
                placeholderText="Check-in - Check-out"
                className="form-control"
              />
            </Form.Group>
          </Col>
          <Col lg={3} md={6} sm={12}>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Adults, Children & Rooms"
                value={`${guests.adults} Adults, ${guests.children} Children, ${guests.rooms} Rooms`}
                onClick={() => setShowGuestsDropdown(!showGuestsDropdown)}
                readOnly
              />
              {showGuestsDropdown && (
                <div className="guests-dropdown">
                  {/* Guests selection UI */}
                  <Button onClick={() => setShowGuestsDropdown(false)}>Done</Button>
                </div>
              )}
            </Form.Group>
          </Col>
          <Col lg={2} md={6} sm={12}>
            <Button type="submit" variant="danger" className="w-100">Search</Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}

export default SearchForm;

