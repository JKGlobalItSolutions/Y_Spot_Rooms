import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Button, Card, Container, Row, Col, Form, Modal } from 'react-bootstrap';
import { FaSort, FaFilter, FaMapMarkerAlt, FaStar } from 'react-icons/fa';

const HotelList = () => {
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [sortOption, setSortOption] = useState('Price - Low to High');
  const [filters, setFilters] = useState([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const locationParam = searchParams.get('location');
    const checkInParam = searchParams.get('checkIn');
    const checkOutParam = searchParams.get('checkOut');
    const guestsParam = searchParams.get('guests');
    const roomsParam = searchParams.get('rooms');

    fetchHotels(locationParam, checkInParam, checkOutParam, guestsParam, roomsParam);
  }, [location]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [hotels, filters, sortOption]);

  const fetchHotels = async (locationParam, checkInParam, checkOutParam, guestsParam, roomsParam) => {
    try {
      const hotelsRef = collection(db, 'hotels');
      let q = query(hotelsRef);

      if (locationParam) {
        q = query(q, where('city', '==', locationParam));
      }

      // Add more query constraints based on check-in, check-out, guests, and rooms if needed

      const querySnapshot = await getDocs(q);
      const hotelList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setHotels(hotelList);
    } catch (error) {
      console.error('Error fetching hotels:', error);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...hotels];

    // Apply filters
    if (filters.length > 0) {
      filtered = filtered.filter(hotel => {
        return filters.every(filter => {
          if (filter.includes('₹')) {
            const [min, max] = filter.match(/\d+/g).map(Number);
            return hotel.price >= min && (max ? hotel.price <= max : true);
          }
          return hotel.facilities.includes(filter) || hotel.propertyType === filter;
        });
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortOption === 'Price - Low to High') {
        return a.price - b.price;
      } else if (sortOption === 'Price - High to Low') {
        return b.price - a.price;
      } else if (sortOption === 'Rating - High to Low') {
        return b.rating - a.rating;
      } else {
        return a.rating - b.rating;
      }
    });

    setFilteredHotels(filtered);
  };

  const handleSortChange = (option) => {
    setSortOption(option);
  };

  const handleFilterChange = (filter) => {
    if (filters.includes(filter)) {
      setFilters(filters.filter(f => f !== filter));
    } else {
      setFilters([...filters, filter]);
    }
  };

  const resetFilters = () => {
    setFilters([]);
  };

  return (
    <Container>
      <h1 className="my-4">Hotel List</h1>
      <Row className="mb-3">
        <Col>
          <Button variant="outline-primary" onClick={() => setShowFilterModal(true)}>
            <FaSort /> Sort
          </Button>
        </Col>
        <Col>
          <Button variant="outline-primary" onClick={() => setShowFilterModal(true)}>
            <FaFilter /> Filter
          </Button>
        </Col>
        <Col>
          <Button variant="outline-primary" onClick={() => navigate('/map')}>
            <FaMapMarkerAlt /> Map
          </Button>
        </Col>
      </Row>
      <Row>
        {filteredHotels.map(hotel => (
          <Col key={hotel.id} xs={12} md={6} lg={4} className="mb-4">
            <Card>
              <Card.Img variant="top" src={hotel.image || '/assets/img/placeholder.jpg'} />
              <Card.Body>
                <Card.Title>{hotel.name}</Card.Title>
                <Card.Text>
                  <FaMapMarkerAlt /> {hotel.address}
                  <br />
                  <strong>₹{hotel.price}</strong> per night
                  <br />
                  <FaStar className="text-warning" /> {hotel.rating}
                </Card.Text>
                <Button variant="primary" onClick={() => navigate(`/hotel/${hotel.id}`)}>View Details</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      
      <Modal show={showFilterModal} onHide={() => setShowFilterModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Filters and Sort</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Sort By</Form.Label>
              <Form.Select onChange={(e) => handleSortChange(e.target.value)} value={sortOption}>
                <option>Price - Low to High</option>
                <option>Price - High to Low</option>
                <option>Rating - High to Low</option>
                <option>Rating - Low to High</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price Range</Form.Label>
              <Form.Check type="checkbox" label="₹500 - ₹2000" onChange={() => handleFilterChange('₹500 - ₹2000')} checked={filters.includes('₹500 - ₹2000')} />
              <Form.Check type="checkbox" label="₹2000 - ₹4000" onChange={() => handleFilterChange('₹2000 - ₹4000')} checked={filters.includes('₹2000 - ₹4000')} />
              <Form.Check type="checkbox" label="₹4000 Above" onChange={() => handleFilterChange('₹4000 Above')} checked={filters.includes('₹4000 Above')} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Facilities</Form.Label>
              <Form.Check type="checkbox" label="Wi-Fi" onChange={() => handleFilterChange('Wi-Fi')} checked={filters.includes('Wi-Fi')} />
              <Form.Check type="checkbox" label="Air Conditioning" onChange={() => handleFilterChange('Air Conditioning')} checked={filters.includes('Air Conditioning')} />
              <Form.Check type="checkbox" label="Parking" onChange={() => handleFilterChange('Parking')} checked={filters.includes('Parking')} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Property Type</Form.Label>
              <Form.Check type="checkbox" label="Homestays" onChange={() => handleFilterChange('Homestays')} checked={filters.includes('Homestays')} />
              <Form.Check type="checkbox" label="Hotels" onChange={() => handleFilterChange('Hotels')} checked={filters.includes('Hotels')} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={resetFilters}>Reset Filters</Button>
          <Button variant="primary" onClick={() => setShowFilterModal(false)}>Apply</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default HotelList;

