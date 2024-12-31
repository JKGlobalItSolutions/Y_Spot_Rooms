import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Sidebar from './components/Sidebar';
import UserProfile from './Pages/UserProfile';
import './styles/global.css';
import Hotels from './Pages/Hotels';
import Rooms from './Pages/Rooms';
import GuestDetails from './Pages/GuestDetails';
import PaymentPage from './Pages/PaymentaPage';
import Reviews from './Pages/Reviews';
import RoomStatus from './Pages/RoomStatus';

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="App">
      <Sidebar isOpen={sidebarOpen} toggle={toggleSidebar} />
      <div className="main-content">
        {children}
      </div>
    </div>
  );
}

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? <Layout>{children}</Layout> : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? <Navigate to="/profile" replace /> : children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />
          <Route path="/*" element={
            <PrivateRoute>
              <Routes>
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/hotels" element={<Hotels />} />
                <Route path="/rooms" element={<Rooms />} />
                <Route path="/guest-details" element={<GuestDetails />} />
                <Route path="/payments" element={<PaymentPage />} />
                <Route path="/reviews" element={<Reviews />} />
                <Route path="/room-status" element={<RoomStatus />} />
                <Route path="/" element={<Navigate to="/profile" replace />} />
              </Routes>
            </PrivateRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

