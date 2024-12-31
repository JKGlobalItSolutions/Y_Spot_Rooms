import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

function HomePage() {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [dates, setDates] = useState('');
  const [guests, setGuests] = useState('');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false);
  const datePickerRef = useRef(null);
  const guestsDropdownRef = useRef(null);

  useEffect(() => {
    // Initialize Flatpickr
    const fp = flatpickr(datePickerRef.current, {
      mode: "range",
      dateFormat: "Y-m-d",
      minDate: "today",
      defaultDate: [new Date(), new Date(new Date().setDate(new Date().getDate() + 1))],
      onChange: (selectedDates) => {
        if (selectedDates.length === 2) {
          const [checkin, checkout] = selectedDates.map(date => date.toISOString().split('T')[0]);
          setDates(`${checkin} - ${checkout}`);
          sessionStorage.setItem('checkin', checkin);
          sessionStorage.setItem('checkout', checkout);
        }
      }
    });

    // Retrieve data from sessionStorage
    const storedLocation = sessionStorage.getItem('location') || 'Tiruvannamalai';
    const storedCheckin = sessionStorage.getItem('checkin');
    const storedCheckout = sessionStorage.getItem('checkout');
    const storedAdults = parseInt(sessionStorage.getItem('adults') || '1');
    const storedChildren = parseInt(sessionStorage.getItem('children') || '0');
    const storedRooms = parseInt(sessionStorage.getItem('rooms') || '1');

    setLocation(storedLocation);
    if (storedCheckin && storedCheckout) {
      fp.setDate([new Date(storedCheckin), new Date(storedCheckout)]);
    }
    setAdults(storedAdults);
    setChildren(storedChildren);
    setRooms(storedRooms);

    // Update guests display
    updateGuests(storedAdults, storedChildren, storedRooms);

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (guestsDropdownRef.current && !guestsDropdownRef.current.contains(event.target)) {
        setShowGuestsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const updateGuests = (a, c, r) => {
    setGuests(`${a} Adults, ${c} Children, ${r} Rooms`);
  };

  const handleGuestsClick = () => {
    setShowGuestsDropdown(!showGuestsDropdown);
  };

  const incrementValue = (setter, value, maxValue) => {
    if (value < maxValue) {
      setter(value + 1);
    }
  };

  const decrementValue = (setter, value, minValue) => {
    if (value > minValue) {
      setter(value - 1);
    }
  };

  const handleDone = () => {
    setShowGuestsDropdown(false);
    updateGuests(adults, children, rooms);
    sessionStorage.setItem('adults', adults.toString());
    sessionStorage.setItem('children', children.toString());
    sessionStorage.setItem('rooms', rooms.toString());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sessionStorage.setItem('location', location);
    
    const [checkIn, checkOut] = dates.split(' - ');
    
    // Create URL parameters
    const params = new URLSearchParams();
    params.append('location', location);
    params.append('checkIn', checkIn);
    params.append('checkOut', checkOut);
    params.append('guests', `${adults + children}`);
    params.append('rooms', rooms.toString());
    
    // Navigate to the hotel list page with search parameters
    navigate(`/hotels?${params.toString()}`);
  };

  return (
    <div style={{ fontFamily: 'Urbanist, sans-serif' }}>
      <main>
        <div className="p-5 mb-4 bg-body-tertiary" style={{
          backgroundImage: "url(/assets/img/Rectangle\\ 377.jpg)",
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
          <div className="container py-3">
            <form id="bookingForm" onSubmit={handleSubmit}>
              <div className="row g-2 align-items-center">
                <div className="col-lg">
                  <input 
                    type="text" 
                    className="form-control" 
                    id="location" 
                    name="location" 
                    placeholder="Enter destination" 
                    required
                    value={location} 
                    onChange={(e) => setLocation(e.target.value)} 
                    style={{ height: "50px" }} 
                  />
                </div>
                <div className="col-lg">
                  <input 
                    type="text" 
                    className="form-control" 
                    id="dates" 
                    name="dates" 
                    placeholder="Check-in - Check-out" 
                    required
                    value={dates} 
                    ref={datePickerRef}
                    style={{ height: "50px" }} 
                  />
                </div>
                <div className="col-lg">
                  <div ref={guestsDropdownRef}>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="guests" 
                      name="guests" 
                      placeholder="Adults, Children & Rooms" 
                      required
                      value={guests} 
                      onClick={handleGuestsClick} 
                      readOnly 
                      style={{ height: "50px" }} 
                    />
                    {showGuestsDropdown && (
                      <div className="dropdown-menu show p-3" id="guestsDropdown">
                        <div className="form-group">
                          <label htmlFor="adults">Adults</label>
                          <div className="input-group">
                            <button className="btn btn-outline-secondary" type="button" onClick={() => decrementValue(setAdults, adults, 1)} style={{backgroundColor: adults > 1 ? 'red' : 'gray', color: 'white'}}>-</button>
                            <input type="number" className="form-control" id="adults" value={adults} readOnly />
                            <button className="btn btn-outline-secondary" type="button" onClick={() => incrementValue(setAdults, adults, 30)} style={{backgroundColor: adults >= 30 ? 'gray' : 'red', color: 'white'}}>+</button>
                          </div>
                        </div>
                        <div className="form-group">
                          <label htmlFor="children">Children</label>
                          <div className="input-group">
                            <button className="btn btn-outline-secondary" type="button" onClick={() => decrementValue(setChildren, children, 0)} style={{backgroundColor: children > 0 ? 'red' : 'gray', color: 'white'}}>-</button>
                            <input type="number" className="form-control" id="children" value={children} readOnly />
                            <button className="btn btn-outline-secondary" type="button" onClick={() => incrementValue(setChildren, children, 10)} style={{backgroundColor: children >= 10 ? 'gray' : 'red', color: 'white'}}>+</button>
                          </div>
                        </div>
                        <div className="form-group">
                          <label htmlFor="rooms">Rooms</label>
                          <div className="input-group">
                            <button className="btn btn-outline-secondary" type="button" onClick={() => decrementValue(setRooms, rooms, 1)} style={{backgroundColor: rooms > 1 ? 'red' : 'gray', color: 'white'}}>-</button>
                            <input type="number" className="form-control" id="rooms" value={rooms} readOnly />
                            <button className="btn btn-outline-secondary" type="button" onClick={() => incrementValue(setRooms, rooms, 30)} style={{backgroundColor: rooms >= 30 ? 'gray' : 'red', color: 'white'}}>+</button>
                          </div>
                        </div>
                        <button className="btn btn-primary mt-3" onClick={handleDone}>Done</button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-lg-auto">
                  <button type="submit" className="btn text-light w-100" id="search" style={{backgroundColor: "#FF1717", height: "50px"}}>Search</button>
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
                <img src="/assets/img/tiruvannamalai.jpg" className="rounded-3" alt="..." />
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
                    <img src="/assets/img/offer index/Rectangle 387 (2).png" className="card-img" height="100%" alt="..." />
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
                <img src="/assets/img/offer index/Rectangle 388.png" style={{height: "200px"}} className="card-img" alt="..." />
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
                    <img src="/assets/img/tending destinations/Kodaikanal 1.jpg" className="img-fluid pb-2" alt="Kodaikanal" />
                    <div className="overlay-text" style={{position: "absolute", top: "1%", left: "1%", transform: "translate(1%, 1%)", color: "white", padding: "10px", borderRadius: "5px", textAlign: "center"}}><b>Kodaikanal</b></div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="image-container" style={{position: "relative", display: "inline-block"}}>
                    <img src="/assets/img/tending destinations/ADIYOGI TEMPLE, COIMBATORE INDIA 1 (1).jpg" className="img-fluid pb-2" alt="Coimbatore" />
                    <div className="overlay-text" style={{position: "absolute", top: "1%", left: "1%", transform: "translate(1%, 1%)", color: "white", padding: "10px", borderRadius: "5px", textAlign: "center"}}><b>Coimbatore</b></div>
                  </div>
                </div>
              </div>
              <div className="row mt-4">
                <div className="col-md-4">
                  <div className="image-container" style={{position: "relative", display: "inline-block"}}>
                    <img src="/assets/img/tending destinations/30 Fascinating Things To Do In Bangalore 2.png" className="img-fluid pb-2" alt="Bangalore" />
                    <div className="overlay-text" style={{position: "absolute", top: "1%", left: "1%", transform: "translate(1%, 1%)", color: "white", padding: "10px", borderRadius: "5px", textAlign: "center"}}><b>Bangalore</b></div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="image-container" style={{position: "relative", display:"inline-block"}}>
                    <img src="/assets/img/tending destinations/Cochin 3.png" className="img-fluid pb-2" alt="Kerala" />
                    <div className="overlay-text" style={{position: "absolute", top: "1%", left: "1%", transform: "translate(1%, 1%)", color: "white", padding: "10px", borderRadius: "5px", textAlign: "center"}}><b>Kerala</b></div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="image-container" style={{position: "relative", display: "inline-block"}}>
                    <img src="/assets/img/tending destinations/THE ROYAL ABODE - MYSORE _ best places to visit in india 2.png" className="img-fluid pb-2" alt="Mysore" />
                    <div className="overlay-text" style={{position: "absolute", top: "1%", left: "1%", transform: "translate(1%, 1%)", color: "white", padding: "10px", borderRadius: "5px", textAlign: "center"}}><b>Mysore</b></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h3 className="text-dark">Explore India</h3>
          <p className="text-dark">These popular destinations have a lot to offer</p>
          <div className="image-container-wrapper" style={{overflow: "hidden", width: "100%", position: "relative"}}>
            <div className="image-container1" style={{
              display: "flex",
              animation: "scroll 40s linear infinite",
              width: "calc(150px * 12)", // 6 original cards * 2 for duplication
            }}>
              {[...Array(2)].map((_, index) => (
                <React.Fragment key={index}>
                  <div className="image-card" style={{flex: "0 0 auto", width: "150px", margin: "0 10px", backgroundColor: "white", borderRadius: "8px"}}>
                    <img src="/assets/img/explore india/1.png" alt="Bangalore" style={{width: "100%", height: "auto", borderRadius: "8px 8px 0 0"}} />
                    <p className="p-1"><b>Bangalore </b><br /> 3,458 properties</p>
                  </div>
                  <div className="image-card" style={{flex: "0 0 auto", width: "150px", margin: "0 10px", backgroundColor: "white", borderRadius: "8px"}}>
                    <img src="/assets/img/explore india/2.png" alt="New Delhi" style={{width: "100%", height: "auto", borderRadius: "8px 8px 0 0"}} />
                    <p className="p-1"><b>New Delhi </b><br /> 2,657 properties</p>
                  </div>
                  <div className="image-card" style={{flex: "0 0 auto", width: "150px", margin: "0 10px", backgroundColor: "white", borderRadius: "8px"}}>
                    <img src="/assets/img/explore india/3.png" alt="Kerala" style={{width: "100%", height: "auto", borderRadius: "8px 8px 0 0"}} />
                    <p className="p-1"><b>Kerala </b><br />3,821 properties</p>
                  </div>
                  <div className="image-card" style={{flex: "0 0 auto", width: "150px", margin: "0 10px", backgroundColor: "white", borderRadius: "8px"}}>
                    <img src="/assets/img/explore india/4.png" alt="Mumbai" style={{width: "100%", height: "auto", borderRadius: "8px 8px 0 0"}} />
                    <p className="p-1"><b>Mumbai </b><br />1,523 properties</p>
                  </div>
                  <div className="image-card" style={{flex: "0 0 auto", width: "150px", margin: "0 10px", backgroundColor: "white", borderRadius: "8px"}}>
                    <img src="/assets/img/explore india/5.png" alt="Goa" style={{width: "100%", height: "auto", borderRadius: "8px 8px 0 0"}} />
                    <p className="p-1"><b>Goa </b><br />4,231 properties</p>
                  </div>
                  <div className="image-card" style={{flex: "0 0 auto", width: "150px", margin: "0 10px", backgroundColor: "white", borderRadius: "8px"}}>
                    <img src="/assets/img/explore india/6.png" alt="Ooty" style={{width: "100%", height: "auto", borderRadius: "8px 8px 0 0"}} />
                    <p className="p-1"><b>Ooty </b><br />866 properties</p>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
          <style jsx>{`
            @keyframes scroll {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(calc(-150px * 6));
              }
            }
          `}</style>

          <h3 className="text-dark pt-3">Discover Your property type </h3>
          <div className="container card-container-wrapper">
            <div className="container my-3">
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-4">
                <div className="col p-3">
                  <div className="card" style={{border: "none"}}>
                    <img src="/assets/img/discover your property type/1.png" className="card-img-top" alt="Apartments" />
                    <h5 className="card-title text-center p-1">Apartments</h5>
                  </div>
                </div>
                <div className="col p-3">
                  <div className="card" style={{border: "none"}}>
                    <img src="/assets/img/discover your property type/2.png" className="card-img-top" alt="Hotels" />
                    <h5 className="card-title text-center p-1">Hotels</h5>
                  </div>
                </div>
                <div className="col p-3">
                  <div className="card" style={{border: "none"}}>
                    <img src="/assets/img/discover your property type/3.png" className="card-img-top" alt="Villas" />
                    <h5 className="card-title text-center p-1">Villas</h5>
                  </div>
                </div>
                <div className="col p-3">
                  <div className="card" style={{border: "none"}}>
                    <img src="/assets/img/discover your property type/4.png" className="card-img-top" alt="Resorts" />
                    <h5 className="card-title text-center p-1">Resorts</h5>
                  </div>
                </div>
                <div className="col p-3">
                  <div className="card" style={{border: "none"}}>
                    <img src="/assets/img/discover your property type/5.png" className="card-img-top" alt="Cabins" />
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
                  <img src="/assets/img/index page icons footer/Frame 402.jpg" alt="Profile Image" className="card-img-circle" style={{width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", marginTop: "-40px", marginLeft: "auto", marginRight: "auto", display: "block", border: "3px solid white"}} />
                  <div className="card-body">
                    <h5 className="card-title"><b>Convenience and Accessibility</b></h5>
                    <p className="card-text">24/7 Availability Booking apps allow users to make reservations or appointments at any time, without being restricted to business hours.</p>
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-3 col-md-6 pb-4">
                <div className="card text-center border-danger align-items-stretch">
                  <img src="/assets/img/index page icons footer/Frame 403.jpg" alt="Profile Image" className="card-img-circle" style={{width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", marginTop: "-40px", marginLeft: "auto", marginRight: "auto", display: "block", border: "3px solid white"}} />
                  <div className="card-body">
                    <h5 className="card-title"><b>Time-Saving</b></h5>
                    <p className="card-text">Instant Confirmation Many booking websites provide instant confirmation of bookings, reducing uncertainty and the need for follow-up communication.</p>
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-3 col-md-6 pb-4">
                <div className="card text-center border-danger align-items-stretch">
                  <img src="/assets/img/index page icons footer/Frame 404.jpg" alt="Profile Image" className="card-img-circle" style={{width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", marginTop: "-40px", marginLeft: "auto", marginRight: "auto", display: "block", border: "3px solid white"}} />
                  <div className="card-body">
                    <h5 className="card-title"><b>Reviews and Ratings</b></h5>
                    <p className="card-text pb-4">User Reviews Access to reviews and ratings from other customers provides insights into the quality and service of accommodations and travel services.</p>
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-3 col-md-6 pb-4">
                <div className="card text-center border-danger align-items-stretch">
                  <img src="/assets/img/index page icons footer/Frame 405.jpg" alt="Profile Image" className="card-img-circle" style={{width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", marginTop: "-40px", marginLeft: "auto", marginRight: "auto", display: "block", border: "3px solid white"}} />
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

      <button id="backToTop" className="btn" style={{backgroundColor: "#ff0000", position: "fixed", bottom: "90px", right: "40px", display: "none", zIndex: 100}}>
        <i className="fa-solid fa-arrow-up text-light"></i>
      </button>
    </div>
  );
}

export default HomePage;