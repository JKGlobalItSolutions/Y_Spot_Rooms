import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from '../firebase/config';

function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth).then(() => {
      alert('Logged out successfully');
    }).catch((error) => {
      console.error('Error logging out: ', error);
      alert('Error logging out. Please try again.');
    });
  };

  return (
    <Navbar bg="danger" variant="dark" expand="lg">
      <Navbar.Brand as={Link} to="/">
        <img src="/assets/index-asset/Frame 223.png" alt="Y-spot Logo" />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <Nav.Link as={Link} to="/admin/login">
            <Button variant="light" className="text-danger">
              <b>Admin</b>
            </Button>
          </Nav.Link>
          {user ? (
            <>
              <Navbar.Text className="text-light mr-2">
                Welcome, {user.displayName || 'User'}
              </Navbar.Text>
              <Button variant="light" className="text-danger" onClick={handleLogout}>
                <b>Logout</b>
              </Button>
            </>
          ) : (
            <>
              <Nav.Link as={Link} to="/signup">
                <Button variant="light" className="text-danger">
                  <b>Register</b>
                </Button>
              </Nav.Link>
              <Nav.Link as={Link} to="/login">
                <Button variant="light" className="text-danger">
                  <b>Login</b>
                </Button>
              </Nav.Link>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;

