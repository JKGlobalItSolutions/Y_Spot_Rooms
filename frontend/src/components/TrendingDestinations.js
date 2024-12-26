import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

function TrendingDestinations() {
  const destinations = [
    { name: 'Kodaikanal', image: '/assets/img/tending destinations/Kodaikanal 1.jpg' },
    { name: 'Coimbatore', image: '/assets/img/tending destinations/ADIYOGI TEMPLE, COIMBATORE INDIA 1 (1).jpg' },
    { name: 'Bangalore', image: '/assets/img/tending destinations/30 Fascinating Things To Do In Bangalore 2.png' },
    { name: 'Kerala', image: '/assets/img/tending destinations/Cochin 3.png' },
    { name: 'Mysore', image: '/assets/img/tending destinations/THE ROYAL ABODE - MYSORE _ best places to visit in india 2.png' }
  ];

  return (
    <Container className="trending-destinations pb-3">
      <h3 className="text-dark">Trending destinations</h3>
      <p className="text-dark">Travelers searching for India also booked these</p>
      <Row>
        {destinations.map((dest, index) => (
          <Col key={index} md={index < 2 ? 6 : 4} className="mb-4">
            <div className="image-container">
              <img src={dest.image} alt={dest.name} className="img-fluid rounded" />
              <div className="overlay-text"><b>{dest.name}</b></div>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default TrendingDestinations;

