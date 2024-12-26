import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

function Offers() {
  return (
    <Container className="pb-3">
      <h3 className="text-dark">Offers</h3>
      <p className="text-dark">Promotions, deals, and special offers for you</p>
      <Row>
        <Col md={6}>
          <Card className="mb-3">
            <Row noGutters>
              <Col md={4}>
                <Card.Img src="/assets/img/offer index/Rectangle 387 (2).png" className="h-100" />
              </Col>
              <Col md={8}>
                <Card.Body>
                  <Card.Title>We have Family-Special Theme Park Packages for You....</Card.Title>
                  <Card.Text>Book with us & enjoy limitless fun this summer.</Card.Text>
                  <Button variant="danger">Explore Now</Button>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="bg-dark text-white">
            <Card.Img src="/assets/img/offer index/Rectangle 388.png" alt="Card image" style={{ height: '200px', objectFit: 'cover' }} />
            <Card.ImgOverlay>
              <Card.Title>Presenting Long Weekend Homestays Mania:</Card.Title>
              <Card.Text>Grab up to 30% OFF* on homestays, for wow stays this long weekend</Card.Text>
              <Button variant="danger">Book Now</Button>
            </Card.ImgOverlay>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Offers;

