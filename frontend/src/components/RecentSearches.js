import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

function RecentSearches() {
  return (
    <Container className="recent-search pb-3">
      <h3 className="text-dark">Your recent searches</h3>
      <Row>
        <Col md={5}>
          <Card className="d-flex flex-row p-3 bg-light rounded-3 shadow">
            <Card.Img src="/assets/img/tiruvannamalai.jpg" className="rounded-3" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
            <Card.Body>
              <Card.Title><b>Tiruvannamalai</b></Card.Title>
              <Card.Text>May 16-May 17, 2 People</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default RecentSearches;

