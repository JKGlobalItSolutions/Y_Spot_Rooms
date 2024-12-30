import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signOut } from "firebase/auth";
import { auth } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js')
      .then(() => {
        // Bootstrap JavaScript has been loaded
      })
      .catch(err => console.error('Failed to load Bootstrap JavaScript', err));
  }, []);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    signOut(auth).then(() => {
      setShowLogoutModal(false);
      navigate('/login');
    }).catch((error) => {
      console.error('Error logging out: ', error);
      alert('Error logging out. Please try again.');
    });
  };

  const isLoginPage = location.pathname === '/login';

  return (
    <>
      <nav className="navbar navbar-expand-lg" style={{backgroundColor: "#FF1717"}}>
        <div className="container">
          <div className="navbar-brand">
            <Link to="/">
              <img src="/assets/img/Frame 223.png" alt="YSpot Logo" className="d-inline-block align-top" style={{ height: "45px"}} />
            </Link>
          </div>
          <div className="ms-auto">
            {!currentUser ? (
              <Link className="nav-link" to="/login">
                <button type="button" className="btn btn-light text-danger"
                  style={{height: "50px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                  <b>Login</b>
                </button>
              </Link>
            ) : (
              <div className="nav-item dropdown">
                <a className="nav-link" href="#" id="userDropdown" role="button"
                  data-bs-toggle="dropdown" aria-expanded="false">
                  {currentUser.photoURL ? (
                    <img src={currentUser.photoURL} alt="User Photo" style={{width: "50px", height: "50px", borderRadius: "50%"}} />
                  ) : (
                    <div style={{width: "50px", height: "50px", borderRadius: "50%", backgroundColor: "#fff", display: "flex", alignItems: "center", justifyContent: "center", color: "#FF1717"}}>
                      {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'U'}
                    </div>
                  )}
                </a>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                  <li>
                    <Link to="/profile" className="dropdown-item">
                      <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                      My Profile
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <a className="dropdown-item" href="#" onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                      Logout
                    </a>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Second navigation bar: horizontally scrollable content */}
      {!isLoginPage && (
        <div style={{backgroundColor: "#FF1717"}}>
          <div className="container d-none d-lg-block">
            <div style={{display: "flex", justifyContent: "flex-start", padding: "10px 0", gap: "10px"}}>
              <Link to="/">
                <button type="button" className={`btn text-light rounded-pill ${location.pathname === '/' ? 'active border border-white' : ''}`}>
                  <i className="fa-solid fa-bed p-2"></i>Stays
                </button>
              </Link>
              <Link to="/hotel">
                <button type="button" className={`btn text-light rounded-pill ${location.pathname === '/hotel' ? 'active border border-white' : ''}`}>
                  <i className="fa-solid fa-utensils"></i> Hotel
                </button>
              </Link>
              <Link to="/cart">
                <button type="button" className={`btn text-light rounded-pill ${location.pathname === '/cart' ? 'active border border-white' : ''}`}>
                  <i className="fa-solid fa-tag"></i> View Cart
                </button>
              </Link>
              <Link to="/about">
                <button type="button" className={`btn text-light rounded-pill ${location.pathname === '/about' ? 'active border border-white' : ''}`}>
                  <i className="fa-solid fa-question"></i> About Us
                </button>
              </Link>
            </div>
          </div>
          <div className="d-lg-none" style={{overflowX: "auto", whiteSpace: "nowrap", WebkitOverflowScrolling: "touch", scrollbarWidth: "none", msOverflowStyle: "none"}}>
            <div style={{display: "inline-block", padding: "10px 0"}}>
              <Link to="/">
                <button type="button" className={`btn text-light rounded-pill ${location.pathname === '/' ? 'active border border-white' : ''} me-2`}>
                  <i className="fa-solid fa-bed p-2"></i>Stays
                </button>
              </Link>
              <Link to="/hotel">
                <button type="button" className={`btn text-light rounded-pill ${location.pathname === '/hotel' ? 'active border border-white' : ''} me-2`}>
                  <i className="fa-solid fa-utensils"></i> Hotel
                </button>
              </Link>
              <Link to="/cart">
                <button type="button" className={`btn text-light rounded-pill ${location.pathname === '/cart' ? 'active border border-white' : ''} me-2`}>
                  <i className="fa-solid fa-tag"></i> View Cart
                </button>
              </Link>
              <Link to="/about">
                <button type="button" className={`btn text-light rounded-pill ${location.pathname === '/about' ? 'active border border-white' : ''} me-2`}>
                  <i className="fa-solid fa-question"></i> About Us
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {showLogoutModal && (
        <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Logout</h5>
                <button type="button" className="btn-close" onClick={() => setShowLogoutModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to log out?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowLogoutModal(false)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={confirmLogout}>Logout</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;