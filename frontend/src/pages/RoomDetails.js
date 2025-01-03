import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaHeart, FaWifi, FaDumbbell, FaUtensils, FaBed, FaArrowLeft, FaCar, FaPlane, FaHotel, FaMapMarkerAlt, FaRegCalendarAlt, FaUser, FaSearch, FaCheck, FaShareAlt } from 'react-icons/fa';
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [location, setLocation] = useState('Bangalore');
  const [dates, setDates] = useState('');
  const [guests, setGuests] = useState('');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false);
  const datePickerRef = useRef(null);
  const guestsDropdownRef = useRef(null);

  // Mock hotel data
  const hotel = {
    id: id,
    name: 'FabHotel Memories Inn',
    location: '9, Kudlu Road, Union Bank of India ATM, Kudlu, 560068 Bangalore, India',
    rating: 10,
    reviews: 5,
    price: 2470,
    image: '/placeholder.svg?height=400&width=600',
    facilities: ['Breakfast', 'Private Bathroom', 'Air conditioning', 'Family rooms', 'Shower', 'Free WiFi', 'Room service', 'Non-smoking rooms', 'Flat-screen TV', 'Cable channels'],
    description: 'Located within 4.5 miles of The Forum, Koramangala and 7.2 miles of Brigade Road, FabHotel Memories Inn provides rooms in Bangalore. This 3-star hotel offers room service, a 24-hour front desk and free WiFi. The hotel features family rooms.',
    highlights: [
      'Perfect for a 1-night stay!',
      'Top Location: Highly rated by recent guests (10.0)',
      'Breakfast Info: Continental'
    ]
  };

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
        }
      }
    });

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

  const handleGuestsClick = () => {
    setShowGuestsDropdown(!showGuestsDropdown);
  };

  const updateGuests = (a, c, r) => {
    setGuests(`${a} Adults, ${c} Children, ${r} Rooms`);
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
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle search submission
    console.log('Search submitted:', { location, dates, guests });
  };

  const handleBack = () => {
    navigate(-1);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="bg-light min-vh-100">
      {/* Search Bar */}
      <div className="container bg-dark custom-container rounded" style={{ marginTop: "20px" }}>
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

      {/* Breadcrumb */}
      <div className="container mt-3">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="#" className="text-decoration-none">Home</a></li>
            <li className="breadcrumb-item"><a href="#" className="text-decoration-none">Hotels</a></li>
            <li className="breadcrumb-item"><a href="#" className="text-decoration-none">India</a></li>
            <li className="breadcrumb-item"><a href="#" className="text-decoration-none">Karnataka</a></li>
            <li className="breadcrumb-item"><a href="#" className="text-decoration-none">Bangalore</a></li>
            <li className="breadcrumb-item active" aria-current="page">{hotel.name}</li>
          </ol>
        </nav>
      </div>

      {/* Main Content */}
      <div className="container mt-4">
        <div className="row g-4">
          {/* Left Column */}
          <div className="col-12 col-lg-8">
            {/* Hotel Title */}
            <div className="d-flex justify-content-between align-items-start mb-4">
              <div>
                <div className="mb-2">
                  <span className="badge bg-warning text-dark">New to YSPOT.com</span>
                </div>
                <h1 className="h3 mb-1">{hotel.name}</h1>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <div className="text-warning">
                    {'★'.repeat(5)}
                  </div>
                  <span className="badge bg-secondary">Hotel</span>
                </div>
                <p className="text-muted">
                  <FaMapMarkerAlt className="me-1" />
                  {hotel.location} – <a href="#" className="text-danger">Excellent location - show map</a>
                </p>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-outline-danger" onClick={toggleFavorite}>
                  <FaHeart className={isFavorite ? 'text-danger' : ''} />
                </button>
                <button className="btn btn-outline-danger">
                  <FaShareAlt />
                </button>
              </div>
            </div>

            {/* Image Gallery */}
            <div className="row g-2 mb-4">
              <div className="col-12 col-md-6">
                <img src={hotel.image} alt="" className="img-fluid rounded w-100 h-100 object-fit-cover" style={{height: '300px'}} />
              </div>
              <div className="col-12 col-md-6">
                <div className="row g-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="col-6">
                      <img src={hotel.image} alt="" className="img-fluid rounded w-100 object-fit-cover" style={{height: '145px'}} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Hotel Description */}
            <div className="card mb-4">
              <div className="card-body">
                <h2 className="h4 mb-4">Stay in the heart of Bangalore</h2>
                <p className="mb-4">{hotel.description}</p>
                <hr className="my-4" />
                <h3 className="h5 mb-3">Most Popular Facilities</h3>
                <div className="d-flex flex-wrap gap-3">
                  {hotel.facilities.map((facility, index) => (
                    <div key={index} className="d-flex align-items-center gap-2">
                      <FaWifi className="text-danger" />
                      <span>{facility}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="col-12 col-lg-4">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h3 className="h6 mb-1">Exceptional</h3>
                    <small className="text-muted">{hotel.reviews} reviews</small>
                  </div>
                  <span className="badge bg-danger fs-5">{hotel.rating}</span>
                </div>

                <h3 className="h5 mb-3">Property Highlights</h3>
                <ul className="list-unstyled mb-4">
                  {hotel.highlights.map((highlight, index) => (
                    <li key={index} className="d-flex mb-2">
                      <FaCheck className="text-success mt-1 me-2 flex-shrink-0" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>

                <hr className="my-4" />

                <div className="text-end mb-4">
                  <div className="h3 text-danger mb-0">₹{hotel.price}</div>
                  <small className="text-muted">includes taxes and charges</small>
                </div>

                <button className="btn btn-danger w-100">Select Your Room</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;

