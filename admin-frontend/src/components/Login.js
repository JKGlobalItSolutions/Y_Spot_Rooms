import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/auth.css';
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        navigate('/');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const docRef = doc(db, 'adminProfiles', user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        toast.error('No profile found. Please register a property.');
        await auth.signOut();
        return;
      }

      const data = docSnap.data();
      const propertyType = data.propertyType;

      toast.success('Login successful!');

      // Redirect based on propertyType
      switch (propertyType) {
        case 'Hotel':
          navigate('/hotels');
          break;
        case 'Apartment':
          navigate('/apartments');
          break;
        case 'Homestay':
          navigate('/homestays');
          break;
        default:
          console.error('Unknown propertyType:', propertyType);
      }
    } catch (error) {
      if (error.code === 'auth/wrong-password') {
        toast.error('Invalid password. Please try again.');
      } else {
        toast.error('Login failed. Please check your credentials.');
      }
    }
  };

  return (
    <section className="container forms">
      <div className="form login">
        <div className="form-content">
          <header>Login</header>
          <form id="login-form" onSubmit={handleSubmit}>
            <div className="field input-field">
              <input
                type="email"
                id="email"
                placeholder="Email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="field input-field">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Password"
                className="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <i className='bx bx-hide eye-icon' onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <BsEyeSlashFill /> : <BsEyeFill />}
              </i>
            </div>

            <div className="form-link">
              <a href="#" className="forgot-pass">Forgot password?</a>
            </div>

            <div className="field button-field">
              <button type="submit">Login</button>
            </div>
          </form>

          <div className="form-link">
            <span>List Your Property <Link to="/register">Register Now</Link></span>
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" />
    </section>
  );
}

export default Login;

