import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, onSnapshot } from 'firebase/firestore';

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const defaultImage = "https://tse1.mm.bing.net/th?id=OIP.bJpr9jpclIkXQT-hkkb1KQHaHa&pid=Api&rs=1&c=1&qlt=95&w=114&h=114";
  const [profileImage, setProfileImage] = useState(defaultImage);
  const [userName, setUserName] = useState('Manager');

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserName(user.displayName || 'Manager');
      const userDoc = doc(db, 'users', user.uid);
      
      const unsubscribe = onSnapshot(userDoc, (doc) => {
        if (doc.exists() && doc.data().profileImage) {
          setProfileImage(doc.data().profileImage);
        }
      });

      return () => unsubscribe();
    }
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="navbar navbar-expand navbar-light">
      <button className="navbar-toggler" type="button" onClick={toggleSidebar}>
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="navbar-nav ml-auto">
        <div className="nav-item dropdown no-arrow">
          <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button"
            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <span className="mr-2 d-none d-lg-inline text-white">{userName}</span>
            <img className="img-profile rounded-circle" src={profileImage} alt="Profile" 
                 style={{ width: '40px', height: '40px' }} />
          </a>
          <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in"
            aria-labelledby="userDropdown">
            <Link className="dropdown-item" to="/profile">
              <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
              Profile
            </Link>
            <Link className="dropdown-item" to="/settings">
              <i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
              Settings
            </Link>
            <div className="dropdown-divider"></div>
            <button className="dropdown-item" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

