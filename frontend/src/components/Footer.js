import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer pt-4" style={{ backgroundColor: '#001524', color: 'white' }}>
      <Container>
        <Row>
          <Col xs={6} sm={3} lg={2} className="mb-4">
            <h6><b>Help</b></h6>
            <ul className="list-unstyled">
              <li><a href="#" className="text-white textdec small-link">FAQ</a></li>
              <li><a href="#" className="text-white textdec small-link">Privacy policy</a></li>
              <li><a href="#" className="text-white textdec small-link">Cookies privacy</a></li>
              <li><a href="#" className="text-white textdec small-link">Terms of use</a></li>
              <li><a href="#" className="text-white textdec small-link">Help centre</a></li>
            </ul>
          </Col>
          <Col xs={6} sm={3} lg={2} className="mb-4">
            <h6><b>Get the App</b></h6>
            <ul className="list-unstyled">
              <li><a href="#" className="text-white textdec small-link">IOS app</a></li>
              <li><a href="#" className="text-white textdec small-link">Android app</a></li>
            </ul>
          </Col>
          <Col xs={6} sm={3} lg={2} className="mb-4">
            <h6><b>Company</b></h6>
            <ul className="list-unstyled">
              <li><a href="#" className="text-white textdec small-link">About Us</a></li>
              <li><a href="#" className="text-white textdec small-link">Blog</a></li>
              <li><a href="#" className="text-white textdec small-link">Careers</a></li>
              <li><a href="#" className="text-white textdec small-link">PointMAX</a></li>
            </ul>
          </Col>
          <Col xs={6} sm={3} lg={2} className="mb-4">
            <h6><b>Destination</b></h6>
            <ul className="list-unstyled">
              <li><a href="#" className="text-white textdec small-link">Cities</a></li>
              <li><a href="#" className="text-white textdec small-link">Spiritual places</a></li>
              <li><a href="#" className="text-white textdec small-link">Hill Stations</a></li>
              <li><a href="#" className="text-white textdec small-link">Solo Travel places</a></li>
            </ul>
          </Col>
          <Col xs={12} lg={4} className="mb-4">
            <h6 className="d-flex justify-content-center"><b>Social Networks</b></h6>
            <ul className="list-unstyled d-flex justify-content-center p-2">
              <li className="me-2"><a href="#"><img src="/assets/img/footer social meadia icons/Frame 406.png" alt="Facebook" className="rounded-pill" /></a></li>
              <li className="me-2"><a href="#"><img src="/assets/img/footer social meadia icons/Frame 407.png" alt="Twitter" className="rounded-pill" /></a></li>
              <li className="me-2"><a href="#"><img src="/assets/img/footer social meadia icons/Frame 408.png" alt="Instagram" className="rounded-pill" /></a></li>
              <li className="me-2"><a href="#"><img src="/assets/img/footer social meadia icons/Frame 410.png" alt="LinkedIn" className="rounded-pill" /></a></li>
              <li className="me-2"><a href="#"><img src="/assets/img/footer social meadia icons/Frame 409.png" alt="YouTube" className="rounded-pill" /></a></li>
            </ul>
          </Col>
        </Row>
      </Container>
      <div className="horizontal-line bg-white my-3"></div>
      <h6 className="text-center mx-5 pt-3">&copy; 2023 Y.SPOT Rooms pvt .ltd.</h6>
    </footer>
  );
}

export default Footer;

