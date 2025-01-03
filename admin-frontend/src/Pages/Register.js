import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
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
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const checkAdminExistsInOtherProperties = async (adminId) => {
    const propertyTypes = ['Hotels', 'Homestays'];
    for (const property of propertyTypes) {
      if (property !== propertyType) {
        const q = query(collection(db, property), where('adminId', '==', adminId));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          return true;
        }
      }
    }
    return false;
  };

  const saveSelection = async (user) => {
    try {
      await setDoc(doc(db, propertyType, user.uid), {
        adminId: email,
        propertyType: propertyType,
      });
      console.log('Property saved:', propertyType);
    } catch (error) {
      console.error('Error saving to Firestore:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check if adminId already exists in the selected property type collection
      const q = query(collection(db, propertyType), where('adminId', '==', email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        throw new Error("You already signed in with this property.");
      }

      // Proceed with sign-in if adminId doesn't exist
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const adminExists = await checkAdminExistsInOtherProperties(email);
      if (adminExists) {
        throw new Error("Admin already registered with a different property type.");
      }

      await saveSelection(user);

      toast.success('Registration successful!');
      navigate(propertyType === 'Homestays' ? '/homestay-admin' : '/hotel-admin');
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        // If user doesn't exist, create a new account
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          await saveSelection(user);
          toast.success('Registration successful!');
          navigate(propertyType === 'Homestays' ? '/homestay-admin' : '/hotel-admin');
        } catch (createError) {
          toast.error(createError.message);
        }
      } else {
        toast.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="container forms">
      <div className="form">
        <div className="form-content">
          <header>Signup</header>
          <form onSubmit={handleSubmit}>
            <div className="field input-field">
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                required
              >
                <option value="" disabled>Select Your property type</option>
                <option value="Homestays">Homestay</option>
                <option value="Hotels">Hotel</option>
              </select>
            </div>

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

            <div className="field button-field">
              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Processing...' : 'Go to Admin Profile'}
              </button>
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
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
      <ToastContainer position="top-center" />
    </section>
  );
}

export default Register;

