import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/auth.css';
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user profile to Firestore
      await setDoc(doc(db, 'adminProfiles', user.uid), {
        email: user.email,
        propertyType: propertyType,
        createdAt: new Date()
      });

      toast.success('Registration successful!');
      navigate('/');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <section className="container forms">
      <div className="form">
        <div className="form-content">
          <header>Signup</header>
          <form onSubmit={handleSubmit}>
            <div className="field input-field">
              <input
                type="email"
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

            <div className="field input-field">
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                required
              >
                <option value="" disabled>Select Your property type</option>
                <option value="Homestay">Homestay</option>
                <option value="Hotel">Hotel</option>
              </select>
            </div>

            <div className="field button-field">
              <button type="submit">Go to Admin Profile</button>
            </div>
          </form>

          <div className="form-link">
            <span>
              Already have an account?{" "}
              <Link to="/login">Login</Link>
            </span>
          </div>

          <div className="align-item-center">
            <h5 style={{ textAlign: 'center', marginTop: '10px' }}>
              * Call Our Admin To Verify Your Property <br /> 
              After That We Provide Your AdminId And Password*
            </h5>
          </div>

          <div className="fieldd button-fieldd">
            <a href="tel:8148911901">
              <button type="button">Contact Admin</button>
            </a>
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" />
    </section>
  );
}

export default Register;