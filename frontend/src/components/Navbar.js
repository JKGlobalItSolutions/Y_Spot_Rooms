import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '@fontsource/urbanist';
import './Navbar.css';

function NavbarComponent() {
  return (
    <>
      <Navbar expand="lg" className="custom-navbar py-3">
        <Container>
          <Navbar.Brand as={Link} to="/" className="mx-auto">
            <img src="/assets/index-asset/Frame 223.png" alt="Y-spot Logo" height="30" />
          </Navbar.Brand>
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/login" className="btn btn-border-light text-light">
              <b>Login</b>
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <div className="scrollmenu text-center">
        <Link to="/"><button type="button" className="btn text-light border rounded-pill active">
          <i className="fa-solid fa-bed p-2"></i>Stays
        </button></Link>
        <Link to="/"><button type="button" className="btn text-light rounded-pill">
          <i className="fa-solid fa-bus p-2"></i> Tours & Travels
        </button></Link>
        <Link to="/"><button type="button" className="btn text-light rounded-pill">
          <i className="fa-solid fa-utensils"></i> Hotel
        </button></Link>
        <Link to="/"><button type="button" className="btn text-light rounded-pill">
          <i className="fa-solid fa-tag"></i> View Cart
        </button></Link>
        <Link to="/about"><button type="button" className="btn text-light rounded-pill">
          <i className="fa-solid fa-question"></i> About Us
        </button></Link>
      </div>
    </>
  );
}

export default NavbarComponent;

