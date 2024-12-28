import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const firebaseConfig = {
  apiKey: "AIzaSyCp2e7CNo83HwDx_HAVgY_IDh0_KW2Y0HI",
  authDomain: "y-spot-e84ca.firebaseapp.com",
  databaseURL: "https://y-spot-e84ca-default-rtdb.firebaseio.com",
  projectId: "y-spot-e84ca",
  storageBucket: "y-spot-e84ca.appspot.com",
  messagingSenderId: "783996806068",
  appId: "1:783996806068:web:298ca1ddb4dfb7e758c8e1",
  measurementId: "G-TSH2JVYJHR"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();

function HomePage() {
  const [user, setUser] = useState(null);
  const [location, setLocation] = useState('');
  const [dates, setDates] = useState('');
  const [guests, setGuests] = useState('');
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    flatpickr("#dates", {
      mode: "range",
      dateFormat: "d, F Y",
      minDate: "today",
      defaultDate: [new Date(), new Date()],
      onChange: (selectedDates) => {
        if (selectedDates.length === 2) {
          setDates(`${selectedDates[0].toLocaleDateString()} - ${selectedDates[1].toLocaleDateString()}`);
        }
      }
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

  const updateGuests = () => {
    setGuests(`${adults} Adults, ${children} Children, ${rooms} Rooms`);
  };

  const handleGuestsClick = () => {
    setShowGuestsDropdown(!showGuestsDropdown);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', { location, dates, guests });
  };

  return (
    <div style={{ fontFamily: 'Urbanist, sans-serif' }}>
      <header>
        <nav className="navbar navbar-expand topbarstatic-top" style={{backgroundColor: "#FF1717"}}>
          <div className="container">
            <div className="row w-100">
              <div className="col-lg-4"></div>
              <div className="col-12 col-md-5 col-lg-4 d-flex justify-content-center align-items-center">
                <a className="navbar-brand" href="./index.html">
                  <img src="./assets/index-asset/Frame 223.png" alt="" className="d-inline-block align-top" />
                </a>
              </div>
              <div className="col-12 col-md-7 col-lg-4 d-flex justify-content-center align-items-center mt-2">
                <div className="d-flex justify-content-center align-items-center mx-auto ps-4 ms-2">
                  <a className="nav-link" href="./admin/Login/login.html">
                    <button type="button" className="btn btn-light text-danger"
                      style={{height: "30px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                      <b>Admin</b>
                    </button>
                  </a>
                  {!user && (
                    <>
                      <a className="nav-link" href="./login/signup.html">
                        <button type="button" className="btn btn-light text-danger"
                          style={{height: "30px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                          <b>Register</b>
                        </button>
                      </a>
                      <a className="nav-link" href="./login/index.html">
                        <button type="button" className="btn btn-light text-danger"
                          style={{height: "30px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                          <b>Login</b>
                        </button>
                      </a>
                    </>
                  )}
                </div>
                {user && (
                  <div className="nav-item dropdown no-arrow">
                    <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button"
                      data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      {user.photoURL && <img src={user.photoURL} alt="User Photo" style={{width: "30px", height: "30px", borderRadius: "50%"}} />}
                      <span className="mr-2 d-none d-lg-inline text-gray-600 text-light">{user.displayName || "User"}</span>
                    </a>
                    <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="userDropdown">
                      <a className="dropdown-item" href="#">
                        <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                        Profile
                      </a>
                      <div className="dropdown-divider"></div>
                      <a className="dropdown-item" href="#" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                        Logout
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>

      <main>
        <div className="p-5 mb-4 bg-body-tertiary" style={{
          backgroundImage: "url(./assets/img/Rectangle\\ 377.jpg)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundColor: "rgb(237, 26, 37)"
        }}>
          <div className="container py-5">
            <h1 className="display-5 fw-bold text-light">Pack the whole toybox</h1>
            <p className="col-md-8 fs-4 text-light">Unwind and stretch out in a vacation home</p>
            <button type="button" className="btn text-light btn-danger">Discover Vacation Rentals</button>
          </div>
        </div>

        <div className="container bg-dark custom-container rounded" id="move2" style={{ marginTop: "-85px" }}>
          <div className="container">
            <form id="bookingForm" onSubmit={handleSubmit}>
              <div className="row justify-content-center rounded-3">
                <div className="form-group col-lg-3 col-md-6 col-sm-12">
                  <input type="text" className="form-control" id="location" name="location" placeholder="Enter destination" required
                    value={location} onChange={(e) => setLocation(e.target.value)} style={{ height: "50px", marginTop: "20px" }} />
                </div>
                <div className="form-group col-lg-4 col-md-6 col-sm-12">
                  <input type="text" className="form-control" id="dates" name="dates" placeholder="Check-in - Check-out" required
                    value={dates} onChange={(e) => setDates(e.target.value)} style={{ height: "50px", marginTop: "20px" }} />
                </div>
                <div className="form-group col-lg-3 col-md-6 col-sm-12">
                  <input type="text" className="form-control" id="guests" name="guests" placeholder="Adults, Children & Rooms" required
                    value={guests} onClick={handleGuestsClick} readOnly style={{ height: "50px", marginTop: "20px" }} />
                  {showGuestsDropdown && (
                    <div className="dropdown-menu show p-3" id="guestsDropdown">
                      <div className="form-group">
                        <label htmlFor="adults">Adults</label>
                        <div className="input-group">
                          <button className="btn btn-outline-secondary" type="button" onClick={() => setAdults(Math.max(0, adults - 1))}>-</button>
                          <input type="number" className="form-control" id="adults" value={adults} readOnly />
                          <button className="btn btn-outline-secondary" type="button" onClick={() => setAdults(adults + 1)}>+</button>
                        </div>
                      </div>
                      <div className="form-group">
                        <label htmlFor="children">Children</label>
                        <div className="input-group">
                          <button className="btn btn-outline-secondary" type="button" onClick={() => setChildren(Math.max(0, children - 1))}>-</button>
                          <input type="number" className="form-control" id="children" value={children} readOnly />
                          <button className="btn btn-outline-secondary" type="button" onClick={() => setChildren(children + 1)}>+</button>
                        </div>
                      </div>
                      <div className="form-group">
                        <label htmlFor="rooms">Rooms</label>
                        <div className="input-group">
                          <button className="btn btn-outline-secondary" type="button" onClick={() => setRooms(Math.max(1, rooms - 1))}>-</button>
                          <input type="number" className="form-control" id="rooms" value={rooms} readOnly />
                          <button className="btn btn-outline-secondary" type="button" onClick={() => setRooms(rooms + 1)}>+</button>
                        </div>
                      </div>
                      <button className="btn btn-primary mt-3" onClick={() => { updateGuests(); setShowGuestsDropdown(false); }}>Done</button>
                    </div>
                  )}
                </div>
                <div className="form-group col-lg-2 col-md-6 col-sm-12">
                  <button type="submit" className="btn text-light" id="search" style={{backgroundColor: "#FF1717", height: "50px", width: "150px", marginTop: "20px"}}>Search</button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="container">
          <div className="recent-search pb-3">
            <h3 className="text-dark">Your recent searches</h3>
            <div className="d-flex p-3 bg-light col-md-5 rounded-3 shadow">
              <div className="flex-shrink-0">
                <img src="./assets/img/tiruvannamalai.jpg" className="rounded-3" alt="..." />
              </div>
              <div className="flex-grow-1 ms-3">
                <h6>&nbsp;</h6>
                <h5 className="card-title"><b>Tiruvannamalai</b></h5>
                <p className="card-text">May 16-May 17, 2 People</p>
              </div>
            </div>
          </div>

          <h3 className="text-dark">Offers</h3>
          <p className="text-dark">Promotions, deals, and special offers for you</p>
          <div className="row row-cols-1 row-cols-md-2 g-4 pb-3">
            <div className="col">
              <div className="card mb-3" style={{maxWidth: "540px"}}>
                <div className="row no-gutters">
                  <div className="col-md-4 justify-content-center align-items-center">
                    <img src="./assets/img/offer index/Rectangle 387 (2).png" className="card-img" height="100%" alt="..." />
                  </div>
                  <div className="col-md-8">
                    <div className="card-body">
                      <h5 className="card-title">We have Family-Special Theme Park Packages for You....</h5>
                      <p className="card-text">Book with us & enjoy limitless fun this summer.</p>
                      <button type="button" className="btn text-white" style={{backgroundColor: "rgb(237, 26, 37)"}}>Explore Now</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card bg-dark text-white">
                <img src="assets/img/offer index/Rectangle 388.png" style={{height: "200px"}} className="card-img" alt="..." />
                <div className="card-img-overlay">
                  <h5 className="card-title">Presenting Long Weekend Homestays Mania:</h5>
                  <p className="card-text">Grab up to 30% OFF* on homestays, for wow stays this long weekend</p>
                  <button style={{backgroundColor: "rgb(237, 26, 37)"}} className="btn btn-danger">Book Now</button>
                </div>
              </div>
            </div>
          </div>

          <h3 className="text-dark">Trending destinations</h3>
          <p className="text-dark">Travelers searching for India also booked these</p>
          <div className="trending-destinations">
            <div className="container mt-4">
              <div className="row">
                <div className="col-md-6">
                  <div className="image-container" style={{position: "relative", display: "inline-block"}}>
                    <img src="assets/img/tending destinations/Kodaikanal 1.jpg" className="img-fluid pb-2" alt="Kodaikanal" />
                    <div className="overlay-text" style={{position: "absolute", top: "1%", left: "1%", transform: "translate(1%, 1%)", color: "white", padding: "10px", borderRadius: "5px", textAlign: "center"}}><b>Kodaikanal</b></div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="image-container" style={{position: "relative", display: "inline-block"}}>
                    <img src="assets/img/tending destinations/ADIYOGI TEMPLE, COIMBATORE INDIA 1 (1).jpg" className="img-fluid pb-2" alt="Coimbatore" />
                    <div className="overlay-text" style={{position: "absolute", top: "1%", left: "1%", transform: "translate(1%, 1%)", color: "white", padding: "10px", borderRadius: "5px", textAlign: "center"}}><b>Coimbatore</b></div>
                  </div>
                </div>
              </div>
              <div className="row mt-4">
                <div className="col-md-4">
                  <div className="image-container" style={{position: "relative", display: "inline-block"}}>
                    <img src="assets/img/tending destinations/30 Fascinating Things To Do In Bangalore 2.png" className="img-fluid pb-2" alt="Bangalore" />
                    <div className="overlay-text" style={{position: "absolute", top: "1%", left: "1%", transform: "translate(1%, 1%)", color: "white", padding: "10px", borderRadius: "5px", textAlign: "center"}}><b>Bangalore</b></div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="image-container" style={{position: "relative", display: "inline-block"}}>
                    <img src="assets/img/tending destinations/Cochin 3.png" className="img-fluid pb-2" alt="Kerala" />
                    <div className="overlay-text" style={{position: "absolute", top: "1%", left: "1%", transform: "translate(1%, 1%)", color: "white", padding: "10px", borderRadius: "5px", textAlign: "center"}}><b>Kerala</b></div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="image-container" style={{position: "relative", display: "inline-block"}}>
                    <img src="assets/img/tending destinations/THE ROYAL ABODE - MYSORE _ best places to visit in india 2.png" className="img-fluid pb-2" alt="Mysore" />
                    <div className="overlay-text" style={{position: "absolute", top: "1%", left: "1%", transform: "translate(1%, 1%)", color: "white", padding: "10px", borderRadius: "5px", textAlign: "center"}}><b>Mysore</b></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h3 className="text-dark">Explore India</h3>
          <p className="text-dark">These popular destinations have a lot to offer</p>
          <div className="image-container-wrapper" style={{overflow: "hidden", width: "100%", position: "relative"}}>
            <div className="image-container1" style={{display: "flex", animation: "scroll 20s linear infinite"}}>
              <div className="image-card" style={{flex: "0 0 auto", width: "150px", margin: "0 10px", backgroundColor: "white", borderRadius: "8px"}}>
                <img src="assets/img/explore india/1.png" alt="Bangalore" style={{width: "100%", height: "auto", borderRadius: "8px 8px 0 0"}} />
                <p className="p-1"><b>Bangalore </b><br /> 3,458 properties</p>
              </div>
              <div className="image-card" style={{flex: "0 0 auto", width: "150px", margin: "0 10px", backgroundColor: "white", borderRadius: "8px"}}>
                <img src="assets/img/explore india/2.png" alt="New Delhi" style={{width: "100%", height: "auto", borderRadius: "8px 8px 0 0"}} />
                <p className="p-1"><b>New Delhi </b><br /> 2,657 properties</p>
              </div>
              <div className="image-card" style={{flex: "0 0 auto", width: "150px", margin: "0 10px", backgroundColor: "white", borderRadius: "8px"}}>
                <img src="assets/img/explore india/3.png" alt="Kerala" style={{width: "100%", height: "auto", borderRadius: "8px 8px 0 0"}} />
                <p className="p-1"><b>Kerala </b><br />3,821 properties</p>
              </div>
              <div className="image-card" style={{flex: "0 0 auto", width: "150px", margin: "0 10px", backgroundColor: "white", borderRadius: "8px"}}>
                <img src="assets/img/explore india/4.png" alt="Mumbai" style={{width: "100%", height: "auto", borderRadius: "8px 8px 0 0"}} />
                <p className="p-1"><b>Mumbai </b><br />1,523 properties</p>
              </div>
              <div className="image-card" style={{flex: "0 0 auto", width: "150px", margin: "0 10px", backgroundColor: "white", borderRadius: "8px"}}>
                <img src="assets/img/explore india/5.png" alt="Goa" style={{width: "100%", height: "auto", borderRadius: "8px 8px 0 0"}} />
                <p className="p-1"><b>Goa </b><br />4,231 properties</p>
              </div>
              <div className="image-card" style={{flex: "0 0 auto", width: "150px", margin: "0 10px", backgroundColor: "white", borderRadius: "8px"}}>
                <img src="assets/img/explore india/6.png" alt="Ooty" style={{width: "100%", height: "auto", borderRadius: "8px 8px 0 0"}} />
                <p className="p-1"><b>Ooty </b><br />866 properties</p>
              </div>
            </div>
          </div>

          <h3 className="text-dark pt-3">Discover Your property type </h3>
          <div className="container card-container-wrapper">
            <div className="container my-3">
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-4">
                <div className="col p-3">
                  <div className="card" style={{border: "none"}}>
                    <img src="assets/img/discover your property type/1.png" className="card-img-top" alt="Apartments" />
                    <h5 className="card-title text-center p-1">Apartments</h5>
                  </div>
                </div>
                <div className="col p-3">
                  <div className="card" style={{border: "none"}}>
                    <img src="assets/img/discover your property type/2.png" className="card-img-top" alt="Hotels" />
                    <h5 className="card-title text-center p-1">Hotels</h5>
                  </div>
                </div>
                <div className="col p-3">
                  <div className="card" style={{border: "none"}}>
                    <img src="assets/img/discover your property type/3.png" className="card-img-top" alt="Villas" />
                    <h5 className="card-title text-center p-1">Villas</h5>
                  </div>
                </div>
                <div className="col p-3">
                  <div className="card" style={{border: "none"}}>
                    <img src="assets/img/discover your property type/4.png" className="card-img-top" alt="Resorts" />
                    <h5 className="card-title text-center p-1">Resorts</h5>
                  </div>
                </div>
                <div className="col p-3">
                  <div className="card" style={{border: "none"}}>
                    <img src="assets/img/discover your property type/5.png" className="card-img-top" alt="Cabins" />
                    <h5 className="card-title text-center p-1">Cabins</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h1 className="text-center pt-3">Why Book Hotels with YSpot.app?</h1>
          <div className="container my-5">
            <div className="row justify-content-center align-items-stretch">
              <div className="col-12 col-lg-3 col-md-6 pb-4">
                <div className="card text-center border-danger align-items-stretch">
                  <img src="assets/img/index page icons footer/Frame 402.jpg" alt="Profile Image" className="card-img-circle" style={{width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", marginTop: "-40px", marginLeft: "auto", marginRight: "auto", display: "block", border: "3px solid white"}} />
                  <div className="card-body">
                    <h5 className="card-title"><b>Convenience and Accessibility</b></h5>
                    <p className="card-text">24/7 Availability Booking apps allow users to make reservations or appointments at any time, without being restricted to business hours.</p>
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-3 col-md-6 pb-4">
                <div className="card text-center border-danger align-items-stretch">
                  <img src="assets/img/index page icons footer/Frame 403.jpg" alt="Profile Image" className="card-img-circle" style={{width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", marginTop: "-40px", marginLeft: "auto", marginRight: "auto", display: "block", border: "3px solid white"}} />
                  <div className="card-body">
                    <h5 className="card-title"><b>Time-Saving</b></h5>
                    <p className="card-text">Instant Confirmation Many booking websites provide instant confirmation of bookings, reducing uncertainty and the need for follow-up communication.</p>
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-3 col-md-6 pb-4">
                <div className="card text-center border-danger align-items-stretch">
                  <img src="assets/img/index page icons footer/Frame 404.jpg" alt="Profile Image" className="card-img-circle" style={{width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", marginTop: "-40px", marginLeft: "auto", marginRight: "auto", display: "block", border: "3px solid white"}} />
                  <div className="card-body">
                    <h5 className="card-title"><b>Reviews and Ratings</b></h5>
                    <p className="card-text pb-4">User Reviews Access to reviews and ratings from other customers provides insights into the quality and service of accommodations and travel services.</p>
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-3 col-md-6 pb-4">
                <div className="card text-center border-danger align-items-stretch">
                  <img src="assets/img/index page icons footer/Frame 405.jpg" alt="Profile Image" className="card-img-circle" style={{width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", marginTop: "-40px", marginLeft: "auto", marginRight: "auto", display: "block", border: "3px solid white"}} />
                  <div className="card-body">
                    <h5 className="card-title"><b>User-Friendly Interfaces</b></h5>
                    <p className="card-text pb-5 mb-4">Intuitive platforms that simplify the booking process, often with step-by-step guidance.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="footer pt-4" style={{backgroundColor: "#001524", color: "#ffffff"}}>
        <div className="container">
          <div className="row">
            <div className="col-6 col-sm-3 col-lg-2 mb-4">
              <h6><b>Help</b></h6>
              <ul className="list-unstyled">
                <li><a href="#" className="text-white" style={{textDecoration: "none", fontSize: "0.9rem"}}>FAQ</a></li>
                <li><a href="#" className="text-white" style={{textDecoration: "none", fontSize: "0.9rem"}}>Privacy policy</a></li>
                <li><a href="#" className="text-white" style={{textDecoration: "none", fontSize: "0.9rem"}}>Cookies privacy</a></li>
                <li><a href="#" className="text-white" style={{textDecoration: "none", fontSize: "0.9rem"}}>Terms of use</a></li>
                <li><a href="#" className="text-white" style={{textDecoration: "none", fontSize: "0.9rem"}}>Help centre</a></li>
              </ul>
            </div>
            <div className="col-6 col-sm-3 col-lg-2 mb-4">
              <h6><b>Get the App</b></h6>
              <ul className="list-unstyled">
                <li><a href="#" className="text-white" style={{textDecoration: "none", fontSize: "0.9rem"}}>IOS app</a></li>
                <li><a href="#" className="text-white" style={{textDecoration: "none", fontSize: "0.9rem"}}>Android app</a></li>
              </ul>
            </div>
            <div className="col-6 col-sm-3 col-lg-2 mb-4">
              <h6><b>Company</b></h6>
              <ul className="list-unstyled">
                <li><a href="#" className="text-white" style={{textDecoration: "none", fontSize: "0.9rem"}}>About Us</a></li>
                <li><a href="#" className="text-white" style={{textDecoration: "none", fontSize: "0.9rem"}}>Blog</a></li>
                <li><a href="#" className="text-white" style={{textDecoration: "none", fontSize: "0.9rem"}}>Careers</a></li>
                <li><a href="#" className="text-white" style={{textDecoration: "none", fontSize: "0.9rem"}}>PointMAX</a></li>
              </ul>
            </div>
            <div className="col-6 col-sm-3 col-lg-2 mb-4">
              <h6><b>Destination</b></h6>
              <ul className="list-unstyled">
                <li><a href="#" className="text-white" style={{textDecoration: "none", fontSize: "0.9rem"}}>Cities</a></li>
                <li><a href="#" className="text-white" style={{textDecoration: "none", fontSize: "0.9rem"}}>Spiritual places</a></li>
                <li><a href="#" className="text-white" style={{textDecoration: "none", fontSize: "0.9rem"}}>Hill Stations</a></li>
                <li><a href="#" className="text-white" style={{textDecoration: "none", fontSize: "0.9rem"}}>Solo Travel places</a></li>
              </ul>
            </div>
            <div className="col-12 col-lg-4 mb-4">
              <h6 className="d-flex justify-content-center"><b>Social Networks</b></h6>
              <ul className="list-unstyled d-flex justify-content-center p-2">
                <li className="me-2"><a href="#"><img src="assets/img/footer social meadia icons/Frame 406.png" alt="Facebook" className="rounded-pill" /></a></li>
                <li className="me-2"><a href="#"><img src="assets/img/footer social meadia icons/Frame 407.png" alt="Twitter" className="rounded-pill" /></a></li>
                <li className="me-2"><a href="#"><img src="assets/img/footer social meadia icons/Frame 408.png" alt="Instagram" className="rounded-pill" /></a></li>
                <li className="me-2"><a href="#"><img src="assets/img/footer social meadia icons/Frame 410.png" alt="LinkedIn" className="rounded-pill" /></a></li>
                <li className="me-2"><a href="#"><img src="assets/img/footer social meadia icons/Frame 409.png" alt="YouTube" className="rounded-pill" /></a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="horizontal-line bg-white my-3" style={{height: "1px"}}></div>
        <h6 className="text-center mx-5 pt-3">&copy; 2023 Y.SPOT Rooms pvt .ltd.</h6>
      </footer>

      <button id="backToTop" className="btn" style={{backgroundColor: "#ff0000", position: "fixed", bottom: "90px", right: "40px", display: "none", zIndex: 100}}>
        <i className="fa-solid fa-arrow-up text-light"></i>
      </button>
    </div>
  );
}

export default HomePage;

