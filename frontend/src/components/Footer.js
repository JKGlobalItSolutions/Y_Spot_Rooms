import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

function Footer() {
  return (
    <footer className="footer pt-4" style={{ backgroundColor: '#001524', color: 'white' }}>
      <Container>
        <Row>
          <Col md={3}>
            <h6><b>Help</b></h6>
            <ul className="list-unstyled">
              <li><a href="#" className="text-white textdec small-link">FAQ</a></li>
              <li><a href="#" className="text-white textdec small-link">Privacy policy</a></li>
              <li><a href="#" className="text-white textdec small-link">Cookies privacy</a></li>
              <li><a href="#" className="text-white textdec small-link">Terms of use</a></li>
              <li><a href="#" className="text-white textdec small-link">Help centre</a></li>
            </ul>
          </Col>
          {/* Add more columns for other sections */}
        </Row>
      </Container>
      <div className="horizontal-line bg-white my-3" style={{height: '1px'}}></div>
      <Container>
        <p className="text-center">&copy; 2023 Y.SPOT Rooms pvt .ltd.</p>
      </Container>
    </footer>
  );
}

export default Footer;

