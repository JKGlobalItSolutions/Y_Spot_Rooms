import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'show' : ''}`} onClick={toggleSidebar}></div>
      <div className={`sidebar ${isOpen ? 'open' : ''} vh-100`}>
        <a className="sidebar-brand d-flex align-items-center justify-content-center" href="/">
          <div className="mx-3 d-none d-sm-block">
            <img src="/img/logo.png" alt="Logo" />
          </div>
        </a>

        <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
          <li className={`nav-item ${isActive('/')}`}>
            <Link className="nav-link bg-dark m-1" style={{ borderRadius: '10px', width: '90%' }} to="/">
              <i><img src="/img/sidbar icons/person.png" alt="" /></i>
              <span>User Profile</span>
            </Link>
          </li>
          <li className={`nav-item ${isActive('/hotels')}`}>
            <Link className="nav-link" to="/hotels">
              <i><img src="/img/sidbar icons/food_bank.png" alt="" /></i>
              <span>Hotels</span>
            </Link>
          </li>
          <li className={`nav-item ${isActive('/rooms')}`}>
            <Link className="nav-link" to="/rooms">
              <i><img src="/img/sidbar icons/meeting_room.png" alt="" /></i>
              <span>Rooms</span>
            </Link>
          </li>
          <li className={`nav-item ${isActive('/guest-details')}`}>
            <Link className="nav-link" to="/guest-details">
              <i><img src="/img/sidbar icons/location_home.png" alt="" /></i>
              <span>Guest Details</span>
            </Link>
          </li>
          <li className={`nav-item ${isActive('/payments')}`}>
            <Link className="nav-link" to="/payments">
              <i><img src="/img/sidbar icons/currency_rupee.png" alt="" /></i>
              <span>Payments</span>
            </Link>
          </li>
          <li className={`nav-item ${isActive('/orders')}`}>
            <Link className="nav-link" to="/orders">
              <i><img src="/img/sidbar icons/format_list_bulleted.png" alt="" /></i>
              <span>Orders</span>
            </Link>
          </li>
          <li className={`nav-item ${isActive('/reviews')}`}>
            <Link className="nav-link" to="/reviews">
              <i><img src="/img/sidbar icons/stars.png" alt="" /></i>
              <span>Reviews</span>
            </Link>
          </li>
          <li className={`nav-item ${isActive('/room-status')}`}>
            <Link className="nav-link" to="/room-status">
              <i><img src="/img/sidbar icons/concierge.png" alt="" /></i>
              <span>Room Status</span>
            </Link>
          </li>
        </ul>

        <hr className="sidebar-divider d-none d-md-block" />

        <div className="text-center d-none d-md-inline">
          <button className="rounded-circle border-0" id="sidebarToggle"></button>
        </div>
      </div>

      <style jsx>{`
        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: 250px;
          z-index: 996;
          transition: all 0.3s;
          padding: 20px;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: #aab7cf transparent;
          box-shadow: 0px 0px 20px rgba(1, 41, 112, 0.1);
          background-color: #fff;
        }

        .sidebar-nav {
          padding: 0;
          margin: 0;
          list-style: none;
        }

        .sidebar-nav li {
          padding: 0;
          margin: 0;
          list-style: none;
        }

        .sidebar-nav .nav-item {
          margin-bottom: 5px;
        }

        .sidebar-nav .nav-heading {
          font-size: 11px;
          text-transform: uppercase;
          color: #899bbd;
          font-weight: 600;
          margin: 10px 0 5px 15px;
        }

        .sidebar-nav .nav-link {
          display: flex;
          align-items: center;
          font-size: 15px;
          font-weight: 600;
          color: #4154f1;
          transition: 0.3;
          background: #f6f9ff;
          padding: 10px 15px;
          border-radius: 4px;
        }

        .sidebar-nav .nav-link i {
          font-size: 16px;
          margin-right: 10px;
          color: #4154f1;
        }

        .sidebar-nav .nav-link.collapsed {
          color: #012970;
          background: #fff;
        }

        .sidebar-nav .nav-link.collapsed i {
          color: #899bbd;
        }

        .sidebar-nav .nav-link:hover {
          color: #4154f1;
          background: #f6f9ff;
        }

        .sidebar-nav .nav-link:hover i {
          color: #4154f1;
        }

        .sidebar-nav .nav-link .bi-chevron-down {
          margin-right: 0;
          transition: transform 0.2s ease-in-out;
        }

        .sidebar-nav .nav-link:not(.collapsed) .bi-chevron-down {
          transform: rotate(180deg);
        }

        .sidebar-nav .nav-content {
          padding: 5px 0 0 0;
          margin: 0;
          list-style: none;
        }

        .sidebar-nav .nav-content a {
          display: flex;
          align-items: center;
          font-size: 14px;
          font-weight: 600;
          color: #012970;
          transition: 0.3;
          padding: 10px 0 10px 40px;
          transition: 0.3s;
        }

        .sidebar-nav .nav-content a i {
          font-size: 6px;
          margin-right: 8px;
          line-height: 0;
          border-radius: 50%;
        }

        .sidebar-nav .nav-content a:hover,
        .sidebar-nav .nav-content a.active {
          color: #4154f1;
        }

        .sidebar-nav .nav-content a.active i {
          background-color: #4154f1;
        }

        @media (min-width: 1200px) {
          #main,
          #footer {
            margin-left: 300px;
          }
        }

        @media (max-width: 1199px) {
          .toggle-sidebar .sidebar {
            left: 0;
          }
        }

        @media (min-width: 1200px) {
          .toggle-sidebar #main,
          .toggle-sidebar #footer {
            margin-left: 0;
          }

          .toggle-sidebar .sidebar {
            left: -300px;
          }
        }
      `}</style>
    </>
  );
};

export default Sidebar;

