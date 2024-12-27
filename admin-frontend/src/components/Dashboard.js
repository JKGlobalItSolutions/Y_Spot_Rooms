import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import AdminProfile from './AdminProfile';

function Dashboard() {
  return (
    <div id="wrapper">
      <Sidebar />
      <div id="content-wrapper" className="d-flex flex-column">
        <div id="content">
          <Navbar />
          <div className="container-fluid">
            <Routes>
              <Route path="/" element={<AdminProfile />} />
              <Route path="/hotels" element={<div>Hotels Dashboard</div>} />
              <Route path="/apartments" element={<div>Apartments Dashboard</div>} />
              <Route path="/homestays" element={<div>Homestays Dashboard</div>} />
            </Routes>
          </div>
        </div>
        <footer className="sticky-footer bg-white">
          <div className="container my-auto">
            <div className="copyright text-center my-auto">
              <span>Copyright &copy; Y.SPOT Rooms pvt ltd. 2024</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Dashboard;

