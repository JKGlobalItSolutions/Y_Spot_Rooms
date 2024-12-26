import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

function WhyBookWithUs() {
  const reasons = [
    {
      title: 'Convenience and Accessibility',
      description: '24/7 Availability Booking apps allow users to make reservations or appointments at any time, without being restricted to business hours.',
      icon: '/assets/img/index page icons footer/Frame 402.jpg'
    },
    {
      title: 'Time-Saving',
      description: 'Instant Confirmation Many booking websites provide instant confirmation of bookings, reducing uncertainty and the need for follow-up communication.',
      icon: '/assets/img/index page icons footer/Frame 403.jpg'
    },
    {
      title: 'Reviews and Ratings',
      description: 'User Reviews Access to reviews and ratings from other customers provides insights into the quality and service of accommodations and travel services.',
      icon: '/assets/img/index page icons footer/Frame 404.jpg'
    },
    {
      title: 'User-Friendly Interfaces',
      description: 'Intuitive platforms that simplify the booking process, often with step-by-step guidance.',
      icon: '/assets/img/index page icons footer/Frame 405.jpg'
    }
  ];

  return (
    <Container className="my-5">
      <h1 className="text-center pt-3">Why Book Hotels with YSpot.app?</h1>
      <Row className="justify-content-center align-items-stretch">
        {reasons.map((reason, index) => (
          <Col key={index} xs={12} lg={3} md={6} className="pb-4">
            <Card className="text-center border-danger h-100">
              <img src={reason.icon} alt={reason.title} className="card-img-circle" />
              <Card.Body>
                <Card.Title><b>{reason.title}</b></Card.Title>
                <Card.Text>{reason.description}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default WhyBookWithUs;

