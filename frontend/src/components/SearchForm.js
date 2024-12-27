import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './SearchForm.css';

function SearchForm() {
  const [location, setLocation] = useState('');
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [guests, setGuests] = useState({ adults: 1, children: 0, rooms: 1 });
  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false);

  useEffect(() => {
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
    <Container className="search-form-container rounded" id="move2">
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
                  <div className="guest-type">
                    <span>Adults</span>
                    <div className="guest-controls">
                      <button type="button" onClick={() => updateGuests('adults', Math.max(1, guests.adults - 1))}>-</button>
                      <span>{guests.adults}</span>
                      <button type="button" onClick={() => updateGuests('adults', guests.adults + 1)}>+</button>
                    </div>
                  </div>
                  <div className="guest-type">
                    <span>Children</span>
                    <div className="guest-controls">
                      <button type="button" onClick={() => updateGuests('children', Math.max(0, guests.children - 1))}>-</button>
                      <span>{guests.children}</span>
                      <button type="button" onClick={() => updateGuests('children', guests.children + 1)}>+</button>
                    </div>
                  </div>
                  <div className="guest-type">
                    <span>Rooms</span>
                    <div className="guest-controls">
                      <button type="button" onClick={() => updateGuests('rooms', Math.max(1, guests.rooms - 1))}>-</button>
                      <span>{guests.rooms}</span>
                      <button type="button" onClick={() => updateGuests('rooms', guests.rooms + 1)}>+</button>
                    </div>
                  </div>
                  <Button onClick={() => setShowGuestsDropdown(false)} className="w-100 mt-2">Done</Button>
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

