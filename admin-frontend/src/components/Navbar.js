import React from 'react';

const Navbar = ({ toggleSidebar }) => {
  const navbarStyle = `
    .navbar {
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      height: 60px;
      background-color: white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      z-index: 999;
    }

    .navbar-left {
      display: flex;
      align-items: center;
    }

    .menu-toggle {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 40px;
      height: 40px;
      font-size: 24px;
      cursor: pointer;
      background-color: #ff0000;
      color: white;
      border: none;
      border-radius: 4px;
    }

    .navbar-right {
      display: flex;
      align-items: center;
    }

    .navbar-item {
      margin-left: 20px;
      cursor: pointer;
    }

    .navbar-item i {
      font-size: 20px;
      color: #333;
    }

    .profile-info {
      display: flex;
      align-items: center;
    }

    .profile-name {
      margin-right: 10px;
      font-weight: bold;
      color: #333;
    }

    .profile-image {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
    }

    @media (max-width: 768px) {
      .navbar {
        left: 0;
      }
    }
  `;

  return (
    <>
      <style>{navbarStyle}</style>
      <div className="navbar">
        <div className="navbar-left">
          <button className="menu-toggle" onClick={toggleSidebar}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12H21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 6H21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 18H21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div className="navbar-right">
          <div className="navbar-item">
            <i className="bi bi-bell"></i>
          </div>
          <div className="navbar-item">
            <i className="bi bi-gear"></i>
          </div>
          <div className="navbar-item profile-info">
            <img style={{height:"45px"}} src='https://png.pngtree.com/png-clipart/20210129/ourmid/pngtree-default-male-avatar-png-image_2811083.jpg' alt="Profile" className="profile-image" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;

